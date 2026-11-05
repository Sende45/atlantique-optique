"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Clock, Eye, Truck } from "lucide-react";
import { siteConfig } from "@/config/site";
import { siteImages } from "@/config/images";

const ease = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const highlights = [
  { icon: Clock, label: "Ouvert du lundi au samedi" },
  { icon: Eye, label: "Examen de la vue sur RDV" },
  { icon: Truck, label: "Livraison à Abidjan" },
];

export default function Hero() {
  return (
    <section className="overflow-hidden bg-gradient-to-r from-gray-50 to-white">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-2 lg:gap-10 lg:py-0">
        <motion.div variants={container} initial="hidden" animate="show" className="lg:py-24">
          <motion.p
            variants={item}
            className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500 sm:text-xs"
          >
            Bienvenue chez {siteConfig.name}
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-4 text-[2.25rem] font-light leading-tight text-brand-900 sm:text-5xl xl:text-6xl"
          >
            Votre vision,
            <br />
            <span className="relative inline-block font-bold">
              notre priorité
              <motion.span
                className="absolute -bottom-1 left-0 h-1.5 w-full origin-left rounded-full bg-gold-400/60"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.9, duration: 0.8, ease }}
              />
            </span>
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-md text-gray-600">
            Des lunettes de qualité, un service professionnel et une vision claire de votre avenir.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link
              href="/lunettes"
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/25"
            >
              Découvrir nos montures
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/rendez-vous"
              className="inline-flex items-center justify-center rounded-lg border border-brand-600 px-6 py-3.5 text-sm font-semibold text-brand-700 transition duration-300 hover:-translate-y-0.5 hover:bg-brand-50"
            >
              Prendre rendez-vous
            </Link>
          </motion.div>

          <motion.ul variants={item} className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
            {highlights.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-xs font-medium text-gray-600 sm:text-sm">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50">
                  <Icon className="h-3.5 w-3.5 text-brand-600" />
                </span>
                {label}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease }}
          className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand-50 sm:aspect-[16/10] lg:aspect-auto lg:h-[560px] lg:rounded-none lg:rounded-bl-[3rem]"
        >
          {siteImages.hero && (
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ duration: 6, ease: "easeOut" }}
            >
              <Image
                src={siteImages.hero}
                alt="Examen de la vue et choix de montures chez Atlantique Optique"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </motion.div>
          )}

          {/* Badges flottants */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6, ease }}
            className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-3 rounded-xl bg-white/95 px-4 py-3 shadow-xl shadow-black/10 backdrop-blur"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600">
                <Eye className="h-5 w-5 text-white" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-gray-900">Examen de la vue</span>
                <span className="block text-xs text-gray-500">Sur rendez-vous</span>
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6, ease }}
            className="absolute right-4 top-4 hidden sm:block sm:right-6 sm:top-6"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 shadow-xl shadow-black/10 backdrop-blur"
            >
              <Truck className="h-4 w-4 text-brand-600" />
              <span className="text-xs font-semibold text-gray-900">Livraison à Abidjan</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}