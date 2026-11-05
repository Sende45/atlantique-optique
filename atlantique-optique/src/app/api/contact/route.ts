import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Données invalides." }, { status: 400 });

  // Piège anti-robots : un humain ne remplit jamais ce champ caché
  if (str(body.website)) return NextResponse.json({ ok: true });

  const name = str(body.name);
  const email = str(body.email).toLowerCase();
  const phone = str(body.phone);
  const message = str(body.message);

  if (!name) return NextResponse.json({ error: "Indiquez votre nom." }, { status: 400 });
  if (!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  if (message.length < 10) {
    return NextResponse.json({ error: "Votre message est trop court." }, { status: 400 });
  }
  if (message.length > 3000) {
    return NextResponse.json({ error: "Votre message est trop long." }, { status: 400 });
  }

  await prisma.contactMessage.create({
    data: { name, email, phone: phone || null, message },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}