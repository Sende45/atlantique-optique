import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (typeof body?.read !== "boolean") {
    return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  }

  try {
    await prisma.contactMessage.update({ where: { id }, data: { read: body.read } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Message introuvable." }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.contactMessage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Message introuvable." }, { status: 404 });
  }
}