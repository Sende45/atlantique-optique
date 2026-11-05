"use client";

import { motion } from "framer-motion";

export default function BrandMarquee({ brands }: { brands: string[] }) {
  // Liste doublée pour une boucle continue sans à-coup
  const items = [...brands, ...brands];

  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <motion.div
        className="flex w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        {items.map((brand, i) => (
          <span
            key={`${brand}-${i}`}
            aria-hidden={i >= brands.length}
            className="whitespace-nowrap pr-12 text-sm font-semibold uppercase tracking-wider text-gray-400 transition-colors hover:text-brand-600 sm:pr-16 sm:text-lg"
          >
            {brand}
          </span>
        ))}
      </motion.div>
    </div>
  );
}