"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  if (images.length === 0) return <div className="aspect-square rounded-2xl bg-gray-100" />;

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50">
        <Image
          src={images[active]}
          alt={name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {images.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Voir la photo ${i + 1}`}
              className={`relative aspect-square overflow-hidden rounded-lg ring-2 transition ${
                i === active ? "ring-brand-500" : "ring-transparent hover:ring-gray-300"
              }`}
            >
              <Image src={url} alt="" fill sizes="100px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}