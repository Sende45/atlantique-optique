import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Clock, Eye, Glasses, Headphones, Heart, MapPin, Phone, UserCheck } from "lucide-react";
import { siteConfig } from "@/config/site";
import { siteImages } from "@/config/images";
import Hero from "@/components/home/Hero";
import BrandMarquee from "@/components/BrandMarquee";
import WhyChooseImage from "@/components/home/WhyChooseImage";
import { getPourquoiImage } from "@/lib/site-images";
import Reveal from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

const reasons = [
  { icon: Award, title: "Montures de qualité", text: "Des marques reconnues et des matériaux durables." },
  { icon: UserCheck, title: "Experts en vision", text: "Une équipe professionnelle à votre écoute." },
  { icon: Heart, title: "Service personnalisé", text: "Un accompagnement adapté à vos besoins." },
  { icon: Headphones, title: "Suivi après-vente", text: "Votre satisfaction est notre priorité." },
];

const categoryImages: Record<string, string> = {
  solaire: siteImages.catSolaire,
  vue: siteImages.catVue,
  enfant: siteImages.catEnfant,
  lentille: siteImages.catLentilles,
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const pourquoiImage = await getPourquoiImage();

  return (
    <>
      <Hero />

      {/* Bande d'infos */}
      <section className="border-y border-gray-100 bg-white">
        <StaggerGroup className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 md:grid-cols-3 md:gap-6">
          <StaggerItem className="flex items-center gap-4">
            <MapPin className="h-6 w-6 shrink-0 text-brand-600" />
            <div>
              <p className="text-sm font-semibold">{siteConfig.address.district} Blockhaus</p>
              <p className="text-xs text-gray-500">{siteConfig.address.line.split(",")[0]}</p>
            </div>
          </StaggerItem>
          <StaggerItem className="flex items-center gap-4 md:border-x md:border-gray-100 md:px-6">
            <Clock className="h-6 w-6 shrink-0 text-brand-600" />
            <div>
              <p className="text-sm font-semibold">Horaires</p>
              <p className="text-xs text-gray-500">{siteConfig.hoursSummary}</p>
            </div>
          </StaggerItem>
          <StaggerItem className="flex items-center gap-4">
            <Phone className="h-6 w-6 shrink-0 text-brand-600" />
            <div>
              <p className="text-sm font-semibold">Contact</p>
              <a href={`tel:${siteConfig.phones[0].tel}`} className="text-xs text-gray-500 hover:text-brand-600">
                {siteConfig.phones[0].display}
              </a>
            </div>
          </StaggerItem>
        </StaggerGroup>
      </section>

      {/* Nos lunettes */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-10">
          <Reveal>
            <h2 className="text-2xl font-bold text-brand-900 sm:text-3xl">Nos lunettes</h2>
            <p className="mt-3 text-sm text-gray-600 sm:mt-4">
              Découvrez notre large gamme de montures pour tous les styles et toutes les personnalités.
            </p>
            <Link
              href="/lunettes"
              className="group mt-6 hidden items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 lg:inline-flex"
            >
              Voir toute la collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <StaggerGroup className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
            {siteConfig.categories.map((cat) => {
              const img = categoryImages[cat.slug];
              return (
                <StaggerItem key={cat.slug}>
                  <Link
                    href={`/lunettes?categorie=${cat.slug}`}
                    className="group block h-full overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand-900/10"
                  >
                    <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-brand-50">
                      {img ? (
                        <Image
                          src={img}
                          alt={cat.title}
                          fill
                          sizes="(max-width: 768px) 50vw, 20vw"
                          className="object-cover transition duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <Glasses className="h-10 w-10 text-brand-300 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
                      )}
                    </div>
                    <div className="p-3 sm:p-4">
                      <p className="text-sm font-semibold leading-snug transition-colors group-hover:text-brand-700">
                        {cat.title}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">{cat.subtitle}</p>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerGroup>

          <Link
            href="/lunettes"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-3.5 text-sm font-semibold text-white hover:bg-brand-700 lg:hidden"
          >
            Voir toute la collection <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Marques */}
        <Reveal className="mt-14 text-center sm:mt-16">
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-gold-400 sm:w-10" />
            <h2 className="text-xl font-bold text-brand-900 sm:text-2xl">Nos marques</h2>
            <span className="h-px w-8 bg-gold-400 sm:w-10" />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Nous travaillons avec les plus grandes marques pour vous offrir le meilleur.
          </p>
          <div className="mt-8">
            <BrandMarquee brands={siteConfig.brands} />
          </div>
        </Reveal>
      </section>

      {/* Pourquoi nous choisir */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid overflow-hidden rounded-2xl lg:grid-cols-[2fr_3fr]">
          <WhyChooseImage src={pourquoiImage} />
          <Reveal x={40} y={0} className="bg-brand-900 p-6 text-white sm:p-10">
            <h2 className="text-xl font-bold sm:text-2xl">Pourquoi nous choisir ?</h2>
            <StaggerGroup className="mt-8 grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-4" stagger={0.12}>
              {reasons.map(({ icon: Icon, title, text }) => (
                <StaggerItem key={title} className="group flex gap-4 sm:block">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 transition duration-300 group-hover:-translate-y-1 group-hover:bg-gold-400/20">
                    <Icon className="h-6 w-6 text-gold-400" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold sm:mt-4">{title}</p>
                    <p className="mt-1 text-xs text-white/70">{text}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <Reveal>
          <div className="relative flex flex-col gap-6 overflow-hidden rounded-2xl bg-brand-50 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-100" />
            <div className="relative flex items-start gap-4 sm:items-center sm:gap-5">
              <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                <span className="absolute inset-0 animate-ping rounded-full bg-brand-200 opacity-40" />
                <Eye className="relative h-7 w-7 text-brand-600" />
              </span>
              <div>
                <p className="font-semibold text-brand-900">Prenez soin de votre vue</p>
                <p className="mt-1 text-sm text-gray-600">
                  Prenez rendez-vous dès maintenant et bénéficiez d&apos;un examen de la vue professionnel.
                </p>
              </div>
            </div>
            <Link
              href="/rendez-vous"
              className="group relative inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/25"
            >
              Prendre rendez-vous
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}