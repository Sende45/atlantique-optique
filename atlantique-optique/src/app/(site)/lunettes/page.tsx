import type { Metadata } from "next";
import Link from "next/link";
import { Category, Gender, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { siteImages } from "@/config/images";
import { CATEGORIES, GENDERS } from "@/lib/catalog";
import PageHero from "@/components/PageHero";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Nos lunettes",
  description: "Lunettes de vue, solaires, montures enfants et lentilles de contact chez Atlantique Optique, Cocody Blockhaus.",
};

const CATEGORY_SLUGS: Record<string, Category> = {
  vue: "VUE",
  solaire: "SOLAIRE",
  enfant: "ENFANT",
  lentille: "LENTILLE",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function LunettesPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const get = (key: string) => {
    const v = sp[key];
    return typeof v === "string" ? v : "";
  };

  const categorie = get("categorie");
  const marque = get("marque");
  const genre = get("genre").toUpperCase();

  const where: Prisma.ProductWhereInput = {};
  if (CATEGORY_SLUGS[categorie]) where.category = CATEGORY_SLUGS[categorie];
  if (marque) where.brand = { slug: marque };
  if (Object.values(Gender).includes(genre as Gender)) where.gender = genre as Gender;

  const [products, brands] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { brand: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    }),
    prisma.brand.findMany({
      where: { products: { some: {} } },
      orderBy: { name: "asc" },
    }),
  ]);

  const hrefWith = (changes: Record<string, string>) => {
    const params = new URLSearchParams();
    const merged = { categorie, marque, genre: genre.toLowerCase(), ...changes };
    Object.entries(merged).forEach(([k, v]) => v && params.set(k, v));
    const qs = params.toString();
    return qs ? `/lunettes?${qs}` : "/lunettes";
  };

  const chipClass = (active: boolean) =>
    `shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
      active ? "bg-brand-600 text-white" : "bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-brand-500"
    }`;

  const selectClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500 sm:w-auto sm:min-w-[160px]";

  const hasFilters = Boolean(categorie || marque || genre);

  return (
    <>
      <PageHero title="Nos lunettes" crumbs={[{ label: "Nos lunettes" }]} image={siteImages.heroLunettes} />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Catégories : défilement horizontal sur mobile */}
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:gap-3 sm:overflow-visible sm:px-0">
          <Link href={hrefWith({ categorie: "" })} className={chipClass(!categorie)}>
            Tout
          </Link>
          {CATEGORIES.map((c) => {
            const slug = Object.keys(CATEGORY_SLUGS).find((k) => CATEGORY_SLUGS[k] === c.value)!;
            return (
              <Link key={c.value} href={hrefWith({ categorie: slug })} className={chipClass(categorie === slug)}>
                {c.label}
              </Link>
            );
          })}
        </div>

        {/* Filtres marque / genre */}
        <form method="get" action="/lunettes" className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:flex sm:flex-wrap sm:items-end">
          {categorie && <input type="hidden" name="categorie" value={categorie} />}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Marque</label>
            <select name="marque" defaultValue={marque} className={selectClass}>
              <option value="">Toutes</option>
              {brands.map((b) => (
                <option key={b.id} value={b.slug}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Pour qui</label>
            <select name="genre" defaultValue={genre.toLowerCase()} className={selectClass}>
              <option value="">Tous</option>
              {GENDERS.map((g) => (
                <option key={g.value} value={g.value.toLowerCase()}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2 flex items-center gap-3 sm:col-span-1">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 sm:flex-none"
            >
              Filtrer
            </button>
            {hasFilters && (
              <Link href="/lunettes" className="px-2 py-2.5 text-sm text-gray-500 hover:text-brand-600">
                Réinitialiser
              </Link>
            )}
          </div>
        </form>

        {/* Résultats */}
        <p className="mt-6 text-sm text-gray-500 sm:mt-8">{products.length} produit(s)</p>

        {products.length === 0 ? (
          <div className="mt-4 rounded-2xl bg-brand-50 px-6 py-10 text-center sm:p-12">
            <p className="text-gray-700">Aucune monture ne correspond à votre recherche pour le moment.</p>
            <p className="mt-1 text-sm text-gray-500">
              Notre boutique en propose bien d&apos;autres : passez nous voir ou prenez rendez-vous.
            </p>
            <Link
              href="/rendez-vous"
              className="mt-5 inline-block rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Prendre rendez-vous
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}