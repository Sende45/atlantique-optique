import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BOUTIQUE_KEY } from "@/lib/site-images";
import AdminShell from "@/components/admin/AdminShell";
import BoutiqueImagesForm from "@/components/admin/BoutiqueImagesForm";

export default async function AdminBoutiquePage() {
  const session = await requireAdmin();
  const row = await prisma.siteImages.findUnique({ where: { key: BOUTIQUE_KEY } });

  return (
    <AdminShell userName={session.name}>
      <h1 className="mb-2 text-2xl font-bold text-brand-900">Photos de la boutique</h1>
      <p className="mb-6 text-sm text-gray-600">
        Ces photos s&apos;affichent à côté de « Notre boutique » sur la page À propos.
      </p>
      <BoutiqueImagesForm initial={row?.images ?? []} />
    </AdminShell>
  );
}