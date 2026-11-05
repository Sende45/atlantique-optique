import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Eye, Glasses, MessageCircle, Sun, Truck, Droplets } from "lucide-react";
import { siteImages } from "@/config/images";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Nos services",
  description: "Examen de la vue, lunettes de vue, solaires, lentilles de contact et livraison à Abidjan.",
};

const services = [
  {
    icon: Eye,
    title: "Examen de la vue",
    text: "Un contrôle complet de votre vision pour déterminer la correction adaptée à vos yeux.",
  },
  {
    icon: Glasses,
    title: "Lunettes de vue",
    text: "Un large choix de montures et des verres correcteurs réalisés selon votre ordonnance.",
  },
  {
    icon: Sun,
    title: "Lunettes de soleil",
    text: "Des solaires de marque pour protéger vos yeux avec style, avec ou sans correction.",
  },
  {
    icon: Droplets,
    title: "Lentilles de contact",
    text: "Lentilles et produits d'entretien, avec un accompagnement pour bien les adopter.",
  },
  {
    icon: MessageCircle,
    title: "Conseils personnalisés",
    text: "Nous vous aidons à choisir la monture qui convient à votre visage et à votre quotidien.",
  },
  {
    icon: Truck,
    title: "Livraison",
    text: "Vos commandes livrées à Abidjan, pour vous éviter un déplacement.",
  },
];

const steps = [
  { n: "01", title: "Prise de rendez-vous", text: "En ligne, par téléphone ou sur WhatsApp." },
  { n: "02", title: "Examen et conseil", text: "Contrôle de la vue et choix de la monture avec un opticien." },
  { n: "03", title: "Réalisation", text: "Vos verres sont préparés et montés selon votre correction." },
  { n: "04", title: "Retrait ou livraison", text: "Ajustement final en boutique ou livraison à domicile." },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero title="Nos services" crumbs={[{ label: "Nos services" }]} image={siteImages.heroServices} />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold text-brand-900">Des services complets pour une vision optimale</h2>
          <p className="mt-4 text-gray-600">
            Chez Atlantique Optique, nous vous proposons une gamme complète de services pour prendre soin de
            votre vue et de votre style.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50">
                <Icon className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="mt-5 font-semibold text-gray-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold">Comment ça se passe ?</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n}>
                <p className="text-3xl font-bold text-gold-400">{s.n}</p>
                <p className="mt-3 font-semibold">{s.title}</p>
                <p className="mt-1 text-sm text-white/70">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-2xl font-bold text-brand-900">Besoin d&apos;un examen de la vue ?</h2>
        <p className="mt-2 text-gray-600">Réservez votre créneau en quelques clics.</p>
        <Link
          href="/rendez-vous?type=EXAMEN_VUE"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Prendre rendez-vous <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </>
  );
}