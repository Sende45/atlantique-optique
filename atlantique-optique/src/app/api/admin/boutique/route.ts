import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { BOUTIQUE_KEY } from "@/lib/site-images";

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const body = await req.json().catch(() => null);
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
    where: { key: BOUTIQUE_KEY },
    update: { images: urls },
    create: { key: BOUTIQUE_KEY, images: urls },
  });

  return NextResponse.json({ ok: true });
}