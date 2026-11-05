import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { siteConfig, whatsappLink } from "@/config/site";
import { siteImages } from "@/config/images";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez Atlantique Optique, Cocody Blockhaus, Abidjan.",
};

export default function ContactPage() {
  const mapQuery = encodeURIComponent("Atlantique Optique Blockhaus Cocody Abidjan");

  return (
    <>
      <PageHero title="Contact" crumbs={[{ label: "Contact" }]} image={siteImages.heroContact} />

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-12">
        <div>
          <h2 className="text-2xl font-bold text-brand-900 sm:text-3xl">Nous contacter</h2>
          <p className="mt-3 text-gray-600">
            Une question, une demande de devis ou un renseignement ? Notre équipe vous répond.
          </p>

          <ul className="mt-8 space-y-5 text-sm">
            {siteConfig.phones.map((p) => (
              <li key={p.tel} className="flex items-center gap-4">
                <Phone className="h-5 w-5 shrink-0 text-brand-600" />
                <a href={`tel:${p.tel}`} className="hover:text-brand-600">
                  {p.display} <span className="text-gray-400">({p.label})</span>
                </a>
              </li>
            ))}
            <li className="flex items-center gap-4">
              <Mail className="h-5 w-5 shrink-0 text-brand-600" />
              <a href={`mailto:${siteConfig.email}`} className="break-all hover:text-brand-600">
                {siteConfig.email}
              </a>
            </li>
            <li className="flex items-start gap-4">
              <MapPin className="h-5 w-5 shrink-0 text-brand-600" />
              <span>
                {siteConfig.address.line}, {siteConfig.address.district}, {siteConfig.address.city}
              </span>
            </li>
            <li className="flex items-start gap-4">
              <Clock className="h-5 w-5 shrink-0 text-brand-600" />
              <span>{siteConfig.hoursSummary}</span>
            </li>
          </ul>

          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-brand-700 sm:inline-flex sm:w-auto"
          >
            <MessageCircle className="h-4 w-4" /> Écrire sur WhatsApp
          </a>
        </div>

        <ContactForm />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16">
        <div className="overflow-hidden rounded-2xl ring-1 ring-gray-100">
          <iframe
            title="Plan d'accès Atlantique Optique"
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            className="h-[280px] w-full border-0 sm:h-[380px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}