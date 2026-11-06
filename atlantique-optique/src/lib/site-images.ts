import { prisma } from "@/lib/prisma";
import { siteImages } from "@/config/images";

export const BOUTIQUE_KEY = "boutique";
export const POURQUOI_KEY = "pourquoi";

/** Clés autorisées côté backoffice. */
export const SITE_IMAGE_KEYS = [BOUTIQUE_KEY, POURQUOI_KEY] as const;
export type SiteImageKey = (typeof SITE_IMAGE_KEYS)[number];

export async function getSiteImages(key: SiteImageKey, fallback: string[] = []): Promise<string[]> {
  try {
    const row = await prisma.siteImages.findUnique({ where: { key } });
    if (row && row.images.length > 0) return row.images;
  } catch {
    // base indisponible : on retombe sur l'image par défaut
  }
  return fallback;
}

/** Photos de la boutique : celles du backoffice, sinon l'image par défaut de config/images.ts. */
export function getBoutiqueImages(): Promise<string[]> {
  return getSiteImages(BOUTIQUE_KEY, siteImages.boutique ? [siteImages.boutique] : []);
}

/** Photo de la section « Pourquoi nous choisir ? » de l'accueil (vide = fond vert). */
export async function getPourquoiImage(): Promise<string | null> {
  const images = await getSiteImages(POURQUOI_KEY);
  return images[0] ?? null;
}