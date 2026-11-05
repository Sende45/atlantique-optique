import type { Metadata } from "next";
import { Clock, MapPin, Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import { siteImages } from "@/config/images";
import { APPOINTMENT_TYPES } from "@/lib/appointments";
import PageHero from "@/components/PageHero";
import AppointmentForm from "@/components/AppointmentForm";

export const metadata: Metadata = {
  title: "Prendre rendez-vous",
  description: "Réservez un examen de la vue ou un essayage chez Atlantique Optique, Cocody Blockhaus.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function RendezVousPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const typeParam = typeof sp.type === "string" ? sp.type : "";
  const produit = typeof sp.produit === "string" ? sp.produit : "";

  const defaultType = APPOINTMENT_TYPES.some((t) => t.value === typeParam) ? typeParam : "EXAMEN_VUE";
  const product = produit
    ? await prisma.product.findUnique({ where: { slug: produit }, select: { name: true } })
    : null;

  return (
    <>
      <PageHero title="Prendre rendez-vous" crumbs={[{ label: "Rendez-vous" }]} image={siteImages.heroRendezVous} />

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[2fr_3fr]">
        <div>
          <h2 className="text-3xl font-bold text-brand-900">Réservez votre créneau</h2>
          <p className="mt-3 text-gray-600">
            Choisissez une date et une heure, nous vous appelons ensuite pour confirmer votre rendez-vous.
          </p>

          <ul className="mt-8 space-y-5 text-sm">
            <li className="flex items-start gap-4">
              <MapPin className="h-5 w-5 shrink-0 text-brand-600" />
              <span>
                {siteConfig.address.line}, {siteConfig.address.district}, {siteConfig.address.city}
              </span>
            </li>
            <li className="flex items-center gap-4">
              <Clock className="h-5 w-5 text-brand-600" />
              <span>{siteConfig.hoursSummary}</span>
            </li>
            <li className="flex items-center gap-4">
              <Phone className="h-5 w-5 text-brand-600" />
              <a href={`tel:${siteConfig.phones[0].tel}`} className="hover:text-brand-600">
                {siteConfig.phones[0].display}
              </a>
            </li>
          </ul>

          <p className="mt-8 rounded-xl bg-brand-50 p-4 text-sm text-brand-800">
            Pensez à apporter votre ordonnance et vos lunettes actuelles si vous en avez.
          </p>
        </div>

        <AppointmentForm defaultType={defaultType} productName={product?.name} />
      </section>
    </>
  );
}