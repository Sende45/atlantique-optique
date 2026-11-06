import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { SITE_IMAGE_KEYS, type SiteImageKey } from "@/lib/site-images";

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const body = await req.json().catch(() => null);

  const key = (body?.key ?? "boutique") as SiteImageKey;
  if (!SITE_IMAGE_KEYS.includes(key)) {
    return NextResponse.json({ error: "Zone d'images inconnue." }, { status: 400 });
  }

  const images: unknown = body?.images;
  if (!Array.isArray(images) || images.length > 20) {
    return NextResponse.json({ error: "Liste d'images invalide (20 max)." }, { status: 400 });
  }

  const urls = images.filter(
    (u): u is string => typeof u === "string" && u.startsWith("https://res.cloudinary.com/"),
  );
  if (urls.length !== images.length) {
    return NextResponse.json({ error: "Image non autorisée." }, { status: 400 });
  }

  await prisma.siteImages.upsert({
    where: { key },
    update: { images: urls },
    create: { key, images: urls },
  });

  return NextResponse.json({ ok: true });
}