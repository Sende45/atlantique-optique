import Link from "next/link";
import { Prisma } from "@prisma/client";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { siteConfig } from "@/config/site";
import { APPOINTMENT_TYPES } from "@/lib/appointments";
import { labelOf } from "@/lib/catalog";
import {
  APPOINTMENT_STATUS,
  dayLabel,
  formatLongDate,
  formatTime,
  startOfTodayUTC,
  toWhatsAppNumber,
} from "@/lib/admin-labels";
import AdminShell from "@/components/admin/AdminShell";
import AppointmentActions from "@/components/admin/AppointmentActions";

const FILTERS = [
  { key: "a-venir", label: "À venir" },
  { key: "en-attente", label: "En attente" },
  { key: "passes", label: "Passés" },
  { key: "annules", label: "Annulés" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

function whereFor(key: FilterKey): Prisma.AppointmentWhereInput {
  const now = new Date();
  switch (key) {
    case "en-attente":
      return { status: "EN_ATTENTE", date: { gte: now } };
    case "passes":
      return { status: { not: "ANNULE" }, OR: [{ date: { lt: now } }, { status: "TERMINE" }] };
    case "annules":
      return { status: "ANNULE" };
    default:
      return { status: { in: ["EN_ATTENTE", "CONFIRME"] }, date: { gte: startOfTodayUTC() } };
  }
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AppointmentsPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await requireAdmin();
  const sp = await searchParams;
  const raw = typeof sp.filtre === "string" ? sp.filtre : "";
  const filter: FilterKey = FILTERS.some((f) => f.key === raw) ? (raw as FilterKey) : "a-venir";
  const descending = filter === "passes" || filter === "annules";

  const [appointments, ...counts] = await Promise.all([
    prisma.appointment.findMany({
      where: whereFor(filter),
      orderBy: { date: descending ? "desc" : "asc" },
      take: 200,
    }),
    ...FILTERS.map((f) => prisma.appointment.count({ where: whereFor(f.key) })),
  ]);

  // Regroupement par jour
  const groups = new Map<string, typeof appointments>();
  for (const a of appointments) {
    const key = a.date.toISOString().slice(0, 10);
    groups.set(key, [...(groups.get(key) ?? []), a]);
  }

  return (
    <AdminShell userName={session.name}>
      <h1 className="text-xl font-bold text-brand-900 sm:text-2xl">Rendez-vous</h1>
      <p className="mt-1 text-sm text-gray-500">Confirmez les demandes et prévenez vos clients.</p>

      <div className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {FILTERS.map((f, i) => (
          <Link
            key={f.key}
            href={`/admin/rendez-vous?filtre=${f.key}`}
            className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
              filter === f.key ? "bg-brand-600 text-white" : "bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-brand-500"
            }`}
          >
            {f.label}
            <span
              className={`rounded-full px-1.5 text-xs ${filter === f.key ? "bg-white/20" : "bg-gray-100 text-gray-600"}`}
            >
              {counts[i]}
            </span>
          </Link>
        ))}
      </div>

      {appointments.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-white p-10 text-center text-sm text-gray-500 shadow-sm ring-1 ring-gray-100">
          Aucun rendez-vous dans cette catégorie.
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          {[...groups.entries()].map(([day, items]) => (
            <section key={day}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">{dayLabel(day)}</h2>
              <ul className="space-y-3">
                {items.map((a) => {
                  const status = APPOINTMENT_STATUS[a.status];
                  const typeLabel = labelOf(APPOINTMENT_TYPES, a.type);
                  const time = formatTime(a.date);
                  const waMessage =
                    a.status === "ANNULE"
                      ? `Bonjour ${a.fullName}, nous sommes désolés : votre rendez-vous du ${formatLongDate(a.date)} à ${time} chez ${siteConfig.name} ne peut pas être maintenu. Souhaitez-vous choisir un autre créneau ?`
                      : `Bonjour ${a.fullName}, ${siteConfig.name} vous confirme votre rendez-vous (${typeLabel.toLowerCase()}) le ${formatLongDate(a.date)} à ${time}. Adresse : ${siteConfig.address.line}, ${siteConfig.address.district}. À bientôt !`;
                  const waHref = `https://wa.me/${toWhatsAppNumber(a.phone)}?text=${encodeURIComponent(waMessage)}`;

                  return (
                    <li
                      key={a.id}
                      className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:flex sm:items-start sm:gap-5"
                    >
                      <div className="mb-3 flex items-center gap-3 sm:mb-0 sm:w-20 sm:shrink-0 sm:flex-col sm:items-start sm:gap-1">
                        <p className="text-xl font-bold text-brand-900">{time}</p>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}>
                          {status.label}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900">{a.fullName}</p>
                        <p className="text-sm text-brand-700">{typeLabel}</p>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                          <a href={`tel:${a.phone}`} className="flex items-center gap-1.5 hover:text-brand-600">
                            <Phone className="h-3.5 w-3.5" /> {a.phone}
                          </a>
                          {a.email && (
                            <a href={`mailto:${a.email}`} className="flex items-center gap-1.5 break-all hover:text-brand-600">
                              <Mail className="h-3.5 w-3.5 shrink-0" /> {a.email}
                            </a>
                          )}
                        </div>

                        {a.message && (
                          <p className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-sm italic text-gray-600">« {a.message} »</p>
                        )}

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <AppointmentActions id={a.id} status={a.status} name={a.fullName} />
                          <a
                            href={waHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366]/10 px-3 py-2 text-xs font-semibold text-[#128C7E] hover:bg-[#25D366]/20"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            {a.status === "ANNULE" ? "Prévenir sur WhatsApp" : "Confirmer sur WhatsApp"}
                          </a>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </AdminShell>
  );
}