import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock, Heart, MapPin, Target, Users } from "lucide-react";
import { siteConfig } from "@/config/site";
import { siteImages } from "@/config/images";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "À propos",
  description: "Atlantique Optique, votre opticien à Cocody Blockhaus, Abidjan.",
};

const pillars = [
  { icon: Target, title: "Notre mission", text: "Vous offrir des solutions visuelles adaptées à vos besoins." },
  { icon: Heart, title: "Nos valeurs", text: "Qualité, professionnalisme et proximité." },
  { icon: Users, title: "Notre équipe", text: "Des professionnels de l'optique à votre écoute." },
];

export default function AProposPage() {
  return (
    <>
      <PageHero title="À propos" crumbs={[{ label: "À propos" }]} image={siteImages.heroAPropos} />

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold text-brand-900">Une expertise au service de votre vision</h2>
          <p className="mt-5 leading-relaxed text-gray-600">
            {siteConfig.name} est votre partenaire de confiance pour une vision claire et un style unique.
            Installés à Cocody Blockhaus, nous mettons notre expertise et notre passion au service de votre regard :
            examen de la vue, conseil, lunettes de vue, solaires et lentilles de contact.
          </p>
        </div>

        <div className="space-y-6">
          {pillars.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50">
                <Icon className="h-6 w-6 text-brand-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{title}</p>
                <p className="text-sm text-gray-600">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="grid overflow-hidden rounded-2xl lg:grid-cols-[3fr_2fr]">
          <div className="relative min-h-[300px] bg-brand-100">
            {siteImages.boutique && (
              <Image
                src={siteImages.boutique}
                alt="La boutique Atlantique Optique"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            )}
          </div>

          <div className="bg-brand-900 p-8 text-white sm:p-10">
            <h2 className="text-xl font-bold">Notre boutique</h2>

            <div className="mt-6 flex gap-3">
              <MapPin className="h-5 w-5 shrink-0 text-gold-400" />
              <div className="text-sm">
                <p className="font-semibold">
                  {siteConfig.address.district} Blockhaus
                </p>
                <p className="text-white/70">{siteConfig.address.line.split(",")[0]}</p>
                <p className="text-white/70">{siteConfig.address.city}, {siteConfig.address.country}</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Clock className="h-5 w-5 shrink-0 text-gold-400" />
              <ul className="w-full space-y-1 text-sm">
                {siteConfig.hours.map((h) => (
                  <li key={h.day} className="flex justify-between gap-4">
                    <span className="text-white/70">{h.label}</span>
                    <span>{h.open ? `${h.open} – ${h.close}` : "Fermé"}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-lg bg-gold-400 px-5 py-2.5 text-sm font-semibold text-brand-900 hover:bg-gold-500"
              >
                Nous contacter
              </Link>
              <a
                href={siteConfig.address.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-white/30 px-5 py-2.5 text-sm font-semibold hover:bg-white/10"
              >
                Itinéraire
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}