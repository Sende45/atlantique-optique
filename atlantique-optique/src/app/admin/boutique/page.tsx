import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BOUTIQUE_KEY, POURQUOI_KEY } from "@/lib/site-images";
import AdminShell from "@/components/admin/AdminShell";
import BoutiqueImagesForm from "@/components/admin/BoutiqueImagesForm";

export default async function AdminBoutiquePage() {
  const session = await requireAdmin();
  const rows = await prisma.siteImages.findMany({ where: { key: { in: [BOUTIQUE_KEY, POURQUOI_KEY] } } });
  const byKey = (key: string) => rows.find((r) => r.key === key)?.images ?? [];

  return (
    <AdminShell userName={session.name}>
      <h1 className="mb-8 text-2xl font-bold text-brand-900">Photos du site</h1>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-brand-900">Notre boutique (page À propos)</h2>
        <p className="mb-4 mt-1 text-sm text-gray-600">
          Ces photos s&apos;affichent à côté de « Notre boutique ». Plusieurs photos défilent automatiquement.
        </p>
        <BoutiqueImagesForm imageKey="boutique" initial={byKey(BOUTIQUE_KEY)} />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-900">Pourquoi nous choisir ? (page d&apos;accueil)</h2>
        <p className="mb-4 mt-1 text-sm text-gray-600">
          Une seule photo, à gauche du bloc « Pourquoi nous choisir ? ». Idéal : la salle d&apos;examen.
        </p>
        <BoutiqueImagesForm
          imageKey="pourquoi"
          single
          initial={byKey(POURQUOI_KEY).slice(0, 1)}
          hint="JPG, PNG ou WebP, 10 Mo max. Une nouvelle photo remplace l'ancienne."
        />
      </section>
    </AdminShell>
  );
}