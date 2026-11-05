import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Logo from "@/components/Logo";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminShell({ userName, children }: { userName: string; children: React.ReactNode }) {
  const [pendingAppointments, unreadMessages] = await Promise.all([
    prisma.appointment.count({ where: { status: "EN_ATTENTE", date: { gte: new Date() } } }),
    prisma.contactMessage.count({ where: { read: false } }),
  ]);
  const counts = { pendingAppointments, unreadMessages };

  return (
    <div className="flex min-h-screen">
      {/* Barre latérale (ordinateur / tablette) */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-brand-900 text-white md:flex">
        <div className="p-6">
          <Logo className="text-[15px]" />
          <p className="mt-3 text-xs uppercase tracking-widest text-white/50">Back-office</p>
        </div>

        <AdminNav counts={counts} variant="sidebar" />

        <div className="space-y-3 border-t border-white/10 p-4 text-sm">
          <p className="truncate text-white/60">
            Connecté : <span className="text-white">{userName}</span>
          </p>
          <Link href="/" target="_blank" className="flex items-center gap-2 text-white/70 hover:text-white">
            <ExternalLink className="h-4 w-4" /> Voir le site
          </Link>
          <form action="/api/admin/logout" method="post">
            <button type="submit" className="flex items-center gap-2 text-white/70 hover:text-white">
              <LogOut className="h-4 w-4" /> Déconnexion
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* En-tête mobile */}
        <header className="sticky top-0 z-40 bg-brand-900 text-white md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <Logo className="text-[13px]" />
            <div className="flex items-center">
              <Link href="/" target="_blank" aria-label="Voir le site" className="p-2 text-white/80">
                <ExternalLink className="h-5 w-5" />
              </Link>
              <form action="/api/admin/logout" method="post">
                <button type="submit" aria-label="Déconnexion" className="p-2 text-white/80">
                  <LogOut className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
          <AdminNav counts={counts} variant="mobile" />
        </header>

        <div className="mx-auto max-w-6xl p-4 sm:p-8">{children}</div>
      </div>
    </div>
  );
}