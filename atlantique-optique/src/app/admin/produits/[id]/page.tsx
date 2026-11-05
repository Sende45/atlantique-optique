import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import ProductForm from "@/components/admin/ProductForm";
import type { ProductFormValues } from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  const { id } = await params;

  const [product, brands] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { brand: true } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  const initial: ProductFormValues = {
    name: product.name,
    brandName: product.brand?.name ?? "",
    category: product.category,
    gender: product.gender ?? "",
    price: product.price?.toString() ?? "",
    frameShape: product.frameShape ?? "",
    material: product.material ?? "",
    color: product.color ?? "",
    description: product.description ?? "",
    images: product.images,
    inStock: product.inStock,
    featured: product.featured,
  };

  return (
    <AdminShell userName={session.name}>
      <Link href="/admin/produits" className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-600">
        <ArrowLeft className="h-4 w-4" /> Retour aux lunettes
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-brand-900">Modifier : {product.name}</h1>
      <ProductForm productId={product.id} initial={initial} brands={brands.map((b) => b.name)} />
    </AdminShell>
  );
}