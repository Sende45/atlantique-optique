import Image from "next/image";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { CATEGORIES, formatPrice, labelOf } from "@/lib/catalog";
import AdminShell from "@/components/admin/AdminShell";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

function StatusBadges({ inStock, featured }: { inStock: boolean; featured: boolean }) {
  return (
    <div className="flex flex-wrap gap-1">
      <span
        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
          inStock ? "bg-brand-50 text-brand-700" : "bg-red-50 text-red-700"
        }`}
      >
        {inStock ? "En stock" : "Rupture"}
      </span>
      {featured && (
        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">En avant</span>
      )}
    </div>
  );
}

export default async function ProductsPage() {
  const session = await requireAdmin();
  const products = await prisma.product.findMany({
    include: { brand: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminShell userName={session.name}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-brand-900 sm:text-2xl">Lunettes</h1>
          <p className="text-sm text-gray-500">{products.length} produit(s) dans le catalogue</p>
        </div>
        <Link
          href="/admin/produits/nouveau"
          className="flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700 sm:py-2.5"
        >
          <Plus className="h-4 w-4" /> Ajouter une paire
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-gray-100 sm:p-12">
          <p className="text-gray-600">Aucun produit pour l&apos;instant.</p>
          <Link href="/admin/produits/nouveau" className="mt-3 inline-block text-sm font-semibold text-brand-600">
            Ajouter la première paire →
          </Link>
        </div>
      ) : (
        <>
          {/* Mobile : cartes */}
          <ul className="space-y-3 md:hidden">
            {products.map((p) => (
              <li key={p.id} className="flex gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-gray-100">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {p.images[0] && <Image src={p.images[0]} alt={p.name} fill sizes="80px" className="object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-900">{p.name}</p>
                  <p className="truncate text-xs text-gray-500">
                    {p.brand?.name ?? "Sans marque"} · {labelOf(CATEGORIES, p.category)}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-brand-700">{formatPrice(p.price)}</p>
                  <div className="mt-1">
                    <StatusBadges inStock={p.inStock} featured={p.featured} />
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                  <Link
                    href={`/admin/produits/${p.id}`}
                    aria-label={`Modifier ${p.name}`}
                    className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <DeleteProductButton id={p.id} name={p.name} />
                </div>
              </li>
            ))}
          </ul>

          {/* Tablette / ordinateur : tableau */}
          <div className="hidden overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Produit</th>
                  <th className="px-4 py-3">Catégorie</th>
                  <th className="px-4 py-3">Prix</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          {p.images[0] && (
                            <Image src={p.images[0]} alt={p.name} fill sizes="56px" className="object-cover" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900">{p.name}</p>
                          <p className="text-xs text-gray-500">{p.brand?.name ?? "Sans marque"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">{labelOf(CATEGORIES, p.category)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-900">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3">
                      <StatusBadges inStock={p.inStock} featured={p.featured} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/admin/produits/${p.id}`}
                          aria-label={`Modifier ${p.name}`}
                          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <DeleteProductButton id={p.id} name={p.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminShell>
  );
}