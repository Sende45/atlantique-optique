import { NextResponse } from "next/server";
import { AppointmentType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { MAX_DAYS_AHEAD, slotsForDate } from "@/lib/appointments";

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

// Renvoie les heures déjà prises pour une date (pas de données personnelles)
export async function GET(req: Request) {
  const date = new URL(req.url).searchParams.get("date") ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({ taken: [] });

  const start = new Date(`${date}T00:00:00Z`);
  const end = new Date(start.getTime() + 86_400_000);

  const appointments = await prisma.appointment.findMany({
    where: { date: { gte: start, lt: end }, status: { not: "ANNULE" } },
    select: { date: true },
  });

  return NextResponse.json({ taken: appointments.map((a) => a.date.toISOString().slice(11, 16)) });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Données invalides." }, { status: 400 });

  if (str(body.website)) return NextResponse.json({ ok: true });

  const fullName = str(body.fullName);
  const phone = str(body.phone);
  const email = str(body.email).toLowerCase();
  const type = str(body.type) as AppointmentType;
  const date = str(body.date);
  const time = str(body.time);
  const message = str(body.message);

  if (!fullName) return NextResponse.json({ error: "Indiquez votre nom." }, { status: 400 });
  if (phone.replace(/\D/g, "").length < 8) {
    return NextResponse.json({ error: "Numéro de téléphone invalide." }, { status: 400 });
  }
  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  }
  if (!Object.values(AppointmentType).includes(type)) {
    return NextResponse.json({ error: "Type de rendez-vous invalide." }, { status: 400 });
  }
  if (!slotsForDate(date).includes(time)) {
    return NextResponse.json({ error: "Ce créneau n'est pas disponible (boutique fermée)." }, { status: 400 });
  }

  const when = new Date(`${date}T${time}:00Z`);
  if (when.getTime() < Date.now()) {
    return NextResponse.json({ error: "Ce créneau est déjà passé." }, { status: 400 });
  }
  if (when.getTime() > Date.now() + MAX_DAYS_AHEAD * 86_400_000) {
    return NextResponse.json({ error: `Réservation possible jusqu'à ${MAX_DAYS_AHEAD} jours.` }, { status: 400 });
  }

  const conflict = await prisma.appointment.findFirst({
    where: { date: when, status: { not: "ANNULE" } },
  });
  if (conflict) {
    return NextResponse.json({ error: "Ce créneau vient d'être réservé. Choisissez-en un autre." }, { status: 409 });
  }

  await prisma.appointment.create({
    data: { fullName, phone, email: email || null, type, date: when, message: message || null },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}