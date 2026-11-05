import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const session = await requireAdmin();
  const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });

  return (
    <AdminShell userName={session.name}>
      <Link href="/admin/produits" className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-600">
        <ArrowLeft className="h-4 w-4" /> Retour aux lunettes
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-brand-900">Ajouter une paire</h1>
      <ProductForm brands={brands.map((b) => b.name)} />
    </AdminShell>
  );
}