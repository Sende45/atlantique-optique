"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Glasses } from "lucide-react";
import { formatPrice } from "@/lib/catalog";

type Props = {
  product: {
    slug: string;
    name: string;
    price: number | null;
    images: string[];
    inStock: boolean;
    brand: { name: string } | null;
  };
};

export default function ProductCard({ product }: Props) {
  const secondImage = product.images[1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Link
        href={`/lunettes/${product.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand-900/10"
      >
        <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-gray-50">
          {product.images[0] ? (
            <>
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={`object-cover transition duration-500 group-hover:scale-105 ${
                  secondImage ? "group-hover:opacity-0" : ""
                }`}
              />
              {/* Deuxième photo affichée au survol, si elle existe */}
              {secondImage && (
                <Image
                  src={secondImage}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover opacity-0 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                />
              )}
            </>
          ) : (
            <Glasses className="h-10 w-10 text-gray-300" />
          )}

          {!product.inStock && (
            <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-medium text-red-700 sm:left-3 sm:top-3 sm:text-xs">
              Rupture
            </span>
          )}

          <span className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 translate-y-4 items-center gap-1 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-brand-700 opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:flex">
            Voir <ArrowRight className="h-3 w-3" />
          </span>
        </div>

        <div className="flex flex-1 flex-col p-3 sm:p-4">
          {product.brand && (
            <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-gold-500 sm:text-xs">
              {product.brand.name}
            </p>
          )}
          <p className="mt-1 line-clamp-2 text-sm font-medium leading-snug text-gray-900 transition-colors group-hover:text-brand-700">
            {product.name}
          </p>
          <p className="mt-auto pt-2 text-sm font-semibold text-brand-700">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </motion.div>
  );
}