"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Glasses, LayoutDashboard, Mail, Store, type LucideIcon } from "lucide-react";

type Counts = { pendingAppointments: number; unreadMessages: number };

type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  countKey?: keyof Counts;
};

const links: NavLink[] = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/produits", label: "Lunettes", icon: Glasses },
  { href: "/admin/boutique", label: "Photos boutique", icon: Store },
  { href: "/admin/rendez-vous", label: "Rendez-vous", icon: CalendarDays, countKey: "pendingAppointments" },
  { href: "/admin/messages", label: "Messages", icon: Mail, countKey: "unreadMessages" },
];

export default function AdminNav({ counts, variant }: { counts: Counts; variant: "sidebar" | "mobile" }) {
  const pathname = usePathname();
  const isActive = (l: NavLink) => (l.exact ? pathname === l.href : pathname.startsWith(l.href));

  if (variant === "mobile") {
    return (
      <nav className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
        {links.map((l) => {
          const Icon = l.icon;
          const count = l.countKey ? counts[l.countKey] : 0;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${
                isActive(l) ? "bg-white text-brand-900" : "bg-white/10 text-white/80"
              }`}
            >
              <Icon className="h-4 w-4" />
              {l.label}
              {count > 0 && (
                <span className="rounded-full bg-gold-400 px-1.5 text-[11px] font-bold text-brand-900">{count}</span>
              )}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="flex-1 space-y-1 px-3">
      {links.map((l) => {
        const Icon = l.icon;
        const count = l.countKey ? counts[l.countKey] : 0;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              isActive(l) ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="flex-1">{l.label}</span>
            {count > 0 && (
              <span className="rounded-full bg-gold-400 px-2 py-0.5 text-xs font-bold text-brand-900">{count}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}