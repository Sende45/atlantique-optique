import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { siteConfig } from "@/config/site";
import { formatShortDateTime, toWhatsAppNumber } from "@/lib/admin-labels";
import AdminShell from "@/components/admin/AdminShell";
import MessageItem from "@/components/admin/MessageItem";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function MessagesPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await requireAdmin();
  const sp = await searchParams;
  const onlyUnread = sp.filtre === "non-lus";

  const [messages, totalCount, unreadCount] = await Promise.all([
    prisma.contactMessage.findMany({
      where: onlyUnread ? { read: false } : {},
      orderBy: [{ read: "asc" }, { createdAt: "desc" }],
      take: 200,
    }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { read: false } }),
  ]);

  const tabs = [
    { href: "/admin/messages", label: "Tous", count: totalCount, active: !onlyUnread },
    { href: "/admin/messages?filtre=non-lus", label: "Non lus", count: unreadCount, active: onlyUnread },
  ];

  return (
    <AdminShell userName={session.name}>
      <h1 className="text-xl font-bold text-brand-900 sm:text-2xl">Messages</h1>
      <p className="mt-1 text-sm text-gray-500">Demandes reçues via le formulaire de contact.</p>

      <div className="mt-6 flex gap-2">
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
              t.active ? "bg-brand-600 text-white" : "bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-brand-500"
            }`}
          >
            {t.label}
            <span className={`rounded-full px-1.5 text-xs ${t.active ? "bg-white/20" : "bg-gray-100 text-gray-600"}`}>
              {t.count}
            </span>
          </Link>
        ))}
      </div>

      {messages.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-white p-10 text-center text-sm text-gray-500 shadow-sm ring-1 ring-gray-100">
          {onlyUnread ? "Aucun message non lu." : "Aucun message pour l'instant."}
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {messages.map((m) => (
            <MessageItem
              key={m.id}
              message={{
                id: m.id,
                name: m.name,
                email: m.email,
                phone: m.phone,
                message: m.message,
                read: m.read,
                dateLabel: formatShortDateTime(m.createdAt),
                whatsappHref: m.phone
                  ? `https://wa.me/${toWhatsAppNumber(m.phone)}?text=${encodeURIComponent(
                      `Bonjour ${m.name}, ici ${siteConfig.name}. Merci pour votre message, `
                    )}`
                  : null,
              }}
            />
          ))}
        </ul>
      )}
    </AdminShell>
  );
}