import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarCheck, MessageCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { whatsappLink } from "@/config/site";
import { CATEGORIES, GENDERS, formatPrice, labelOf } from "@/lib/catalog";
import ProductGallery from "@/components/ProductGallery";

type Params = Promise<{ slug: string }>;

async function getProduct(slug: string) {
  return prisma.product.findUnique({ where: { slug }, include: { brand: true } });
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Produit introuvable" };
  return {
    title: product.name,
    description: product.description ?? `${product.name} disponible chez Atlantique Optique, Cocody Blockhaus.`,
    openGraph: { images: product.images.slice(0, 1) },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const specs = [
    { label: "Catégorie", value: labelOf(CATEGORIES, product.category) },
    { label: "Pour qui", value: product.gender ? labelOf(GENDERS, product.gender) : null },
    { label: "Forme", value: product.frameShape },
    { label: "Matériau", value: product.material },
    { label: "Couleur", value: product.color },
  ].filter((s) => s.value);

  const needsPrescription = product.category === "VUE" || product.category === "ENFANT";

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
      <nav className="mb-5 flex min-w-0 items-center gap-2 text-xs text-gray-500 sm:mb-6 sm:text-sm">
        <Link href="/" className="shrink-0 hover:text-brand-600">
          Accueil
        </Link>
        <span>/</span>
        <Link href="/lunettes" className="shrink-0 hover:text-brand-600">
          Nos lunettes
        </Link>
        <span>/</span>
        <span className="truncate text-gray-800">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          {product.brand && (
            <p className="text-xs font-semibold uppercase tracking-wider text-gold-500 sm:text-sm">
              {product.brand.name}
            </p>
          )}
          <h1 className="mt-2 text-2xl font-bold leading-tight text-brand-900 sm:text-3xl">{product.name}</h1>
          <p className="mt-3 text-xl font-semibold text-brand-700 sm:mt-4 sm:text-2xl">{formatPrice(product.price)}</p>

          <span
            className={`mt-4 inline-block rounded-full px-3 py-1 text-xs font-medium ${
              product.inStock ? "bg-brand-50 text-brand-700" : "bg-red-50 text-red-700"
            }`}
          >
            {product.inStock ? "Disponible en boutique" : "Actuellement en rupture"}
          </span>

          {/* Boutons placés tôt sur mobile pour être visibles sans défiler */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={`/rendez-vous?type=ESSAYAGE&produit=${product.slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              <CalendarCheck className="h-4 w-4" /> Réserver un essayage
            </Link>
            <a
              href={whatsappLink(`Bonjour Atlantique Optique, je suis intéressé(e) par : ${product.name}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-brand-600 px-6 py-3.5 text-sm font-semibold text-brand-700 hover:bg-brand-50"
            >
              <MessageCircle className="h-4 w-4" /> Demander sur WhatsApp
            </a>
          </div>

          {product.description && (
            <p className="mt-8 whitespace-pre-line leading-relaxed text-gray-600">{product.description}</p>
          )}

          {specs.length > 0 && (
            <dl className="mt-6 divide-y divide-gray-100 rounded-xl ring-1 ring-gray-100">
              {specs.map((s) => (
                <div key={s.label} className="flex justify-between gap-4 px-4 py-3 text-sm">
                  <dt className="text-gray-500">{s.label}</dt>
                  <dd className="text-right font-medium text-gray-900">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {needsPrescription && (
            <p className="mt-6 rounded-xl bg-brand-50 p-4 text-sm text-brand-800">
              Les verres correcteurs sont réalisés sur ordonnance, après prise de mesures en boutique. Prenez
              rendez-vous pour un essayage ou un examen de la vue.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}