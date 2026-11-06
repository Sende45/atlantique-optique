import crypto from "crypto";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: "Cloudinary n'est pas configuré." }, { status: 500 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const body = await req.json().catch(() => null);
  const folder = body?.folder === "boutique" ? "atlantique-optique/boutique" : "atlantique-optique/produits";

  // Paramètres triés par ordre alphabétique, puis le secret à la fin
  const toSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto.createHash("sha1").update(toSign + apiSecret).digest("hex");

  return NextResponse.json({ timestamp, signature, folder, apiKey, cloudName });
}