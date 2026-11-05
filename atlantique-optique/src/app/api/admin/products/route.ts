import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { parseProductInput, resolveBrandId } from "@/lib/product-input";
import { slugify } from "@/lib/slug";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = parseProductInput(body);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const { brandName, ...data } = parsed.data;
  const brandId = await resolveBrandId(brandName);

  const product = await prisma.product.create({
    data: {
      ...data,
      brandId,
      slug: `${slugify(data.name)}-${Date.now().toString(36)}`,
    },
  });

  return NextResponse.json({ id: product.id }, { status: 201 });
}