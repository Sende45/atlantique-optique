import Link from "next/link";
import { ArrowRight, CalendarCheck, CalendarClock, Glasses, Mail } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { APPOINTMENT_TYPES } from "@/lib/appointments";
import { labelOf } from "@/lib/catalog";
import { APPOINTMENT_STATUS, dayLabel, formatShortDateTime, formatTime, startOfTodayUTC } from "@/lib/admin-labels";
import AdminShell from "@/components/admin/AdminShell";

export default async function DashboardPage() {
  const session = await requireAdmin();
  const now = new Date();
  const todayStart = startOfTodayUTC();
  const todayEnd = new Date(todayStart.getTime() + 86_400_000);

  const [todayCount, pendingCount, unreadCount, productCount, upcoming, unreadMessages] = await Promise.all([
    prisma.appointment.count({
      where: { date: { gte: todayStart, lt: todayEnd }, status: { in: ["EN_ATTENTE", "CONFIRME"] } },
    }),
    prisma.appointment.count({ where: { status: "EN_ATTENTE", date: { gte: now } } }),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.product.count(),
    prisma.appointment.findMany({
      where: { date: { gte: now }, status: { in: ["EN_ATTENTE", "CONFIRME"] } },
      orderBy: { date: "asc" },
      take: 5,
    }),
    prisma.contactMessage.findMany({
      where: { read: false },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  const stats = [
    { label: "Rendez-vous aujourd'hui", value: todayCount, icon: CalendarCheck, href: "/admin/rendez-vous" },
    { label: "À confirmer", value: pendingCount, icon: CalendarClock, href: "/admin/rendez-vous?filtre=en-attente", highlight: pendingCount > 0 },
    { label: "Messages non lus", value: unreadCount, icon: Mail, href: "/admin/messages?filtre=non-lus", highlight: unreadCount > 0 },
    { label: "Produits en ligne", value: productCount, icon: Glasses, href: "/admin/produits" },
  ];

  return (
    <AdminShell userName={session.name}>
      <h1 className="text-xl font-bold text-brand-900 sm:text-2xl">Bonjour {session.name.split(" ")[0]} 👋</h1>
      <p className="mt-1 text-sm text-gray-500">Voici l&apos;activité d&apos;Atlantique Optique.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href, highlight }) => (
          <Link
            key={label}
            href={href}
            className={`rounded-2xl p-4 shadow-sm ring-1 transition hover:shadow-md sm:p-5 ${
              highlight ? "bg-amber-50 ring-amber-200" : "bg-white ring-gray-100"
            }`}
          >
            <Icon className={`h-5 w-5 ${highlight ? "text-amber-600" : "text-brand-600"}`} />
            <p className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">{value}</p>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">{label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Prochains rendez-vous */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-brand-900">Prochains rendez-vous</h2>
            <Link href="/admin/rendez-vous" className="flex items-center gap-1 text-sm text-brand-600 hover:underline">
              Tout voir <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="mt-6 text-sm text-gray-500">Aucun rendez-vous à venir.</p>
          ) : (
            <ul className="mt-4 divide-y divide-gray-100">
              {upcoming.map((a) => {
                const status = APPOINTMENT_STATUS[a.status];
                return (
                  <li key={a.id} className="flex items-center gap-4 py-3">
                    <div className="w-20 shrink-0">
                      <p className="text-xs text-gray-500">{dayLabel(a.date.toISOString().slice(0, 10))}</p>
                      <p className="font-semibold text-gray-900">{formatTime(a.date)}</p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{a.fullName}</p>
                      <p className="truncate text-xs text-gray-500">{labelOf(APPOINTMENT_TYPES, a.type)}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}>
                      {status.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Messages non lus */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-brand-900">Messages non lus</h2>
            <Link href="/admin/messages" className="flex items-center gap-1 text-sm text-brand-600 hover:underline">
              Tout voir <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {unreadMessages.length === 0 ? (
            <p className="mt-6 text-sm text-gray-500">Aucun nouveau message.</p>
          ) : (
            <ul className="mt-4 divide-y divide-gray-100">
              {unreadMessages.map((m) => (
                <li key={m.id} className="py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-medium">{m.name}</p>
                    <p className="shrink-0 text-xs text-gray-400">{formatShortDateTime(m.createdAt)}</p>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600">{m.message}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AdminShell>
  );
}