import { prisma } from "@/lib/prisma";
import { siteImages } from "@/config/images";

export const BOUTIQUE_KEY = "boutique";

/** Photos de la boutique : celles du backoffice, sinon l'image par défaut de config/images.ts. */
export async function getBoutiqueImages(): Promise<string[]> {
  try {
    const row = await prisma.siteImages.findUnique({ where: { key: BOUTIQUE_KEY } });
    if (row && row.images.length > 0) return row.images;
  } catch {
    // base indisponible : on retombe sur l'image par défaut
  }
  return siteImages.boutique ? [siteImages.boutique] : [];
}