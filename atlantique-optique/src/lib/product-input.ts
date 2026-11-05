import { Category, Gender } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

export type ParsedProduct = {
  name: string;
  brandName: string;
  category: Category;
  gender: Gender | null;
  price: number | null;
  frameShape: string | null;
  material: string | null;
  color: string | null;
  description: string | null;
  images: string[];
  inStock: boolean;
  featured: boolean;
};

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const opt = (v: unknown) => str(v) || null;

export function parseProductInput(body: unknown): { data: ParsedProduct } | { error: string } {
  if (!body || typeof body !== "object") return { error: "Données invalides." };
  const b = body as Record<string, unknown>;

  const name = str(b.name);
  if (!name) return { error: "Le nom est obligatoire." };

  const category = str(b.category) as Category;
  if (!Object.values(Category).includes(category)) return { error: "Catégorie invalide." };

  const genderRaw = str(b.gender);
  if (genderRaw && !Object.values(Gender).includes(genderRaw as Gender)) {
    return { error: "Genre invalide." };
  }

  let price: number | null = null;
  const priceRaw = String(b.price ?? "").replace(/\s/g, "");
  if (priceRaw) {
    const n = Number(priceRaw);
    if (!Number.isInteger(n) || n < 0) return { error: "Prix invalide (nombre entier en FCFA)." };
    price = n;
  }

  const images = Array.isArray(b.images)
    ? b.images.filter((u): u is string => typeof u === "string" && u.startsWith("https://res.cloudinary.com/"))
    : [];
  if (images.length === 0) return { error: "Ajoutez au moins une photo." };

  const isLens = category === "LENTILLE";

  return {
    data: {
      name,
      brandName: str(b.brandName),
      category,
      gender: (genderRaw as Gender) || null,
      price,
      frameShape: isLens ? null : opt(b.frameShape),
      material: isLens ? null : opt(b.material),
      color: opt(b.color),
      description: opt(b.description),
      images,
      inStock: b.inStock !== false,
      featured: b.featured === true,
    },
  };
}

export async function resolveBrandId(brandName: string) {
  if (!brandName) return null;
  const slug = slugify(brandName);
  if (!slug) return null;

  const brand = await prisma.brand.upsert({
    where: { slug },
    update: {},
    create: { name: brandName, slug },
  });
  return brand.id;
}