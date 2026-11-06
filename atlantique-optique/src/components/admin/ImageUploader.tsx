"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlus, Loader2, Star, X } from "lucide-react";

const MAX_SIZE = 10 * 1024 * 1024; // 10 Mo

type Props = {
  images: string[];
  onChange: (update: (prev: string[]) => string[]) => void;
  folder?: "produits" | "boutique";
  hint?: string;
};

export default function ImageUploader({ images, onChange, folder = "produits", hint }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(0);
  const [error, setError] = useState("");

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError("");

    const valid = Array.from(files).filter((file) => {
      if (!file.type.startsWith("image/")) {
        setError(`« ${file.name} » n'est pas une image.`);
        return false;
      }
      if (file.size > MAX_SIZE) {
        setError(`« ${file.name} » dépasse 10 Mo.`);
        return false;
      }
      return true;
    });
    if (valid.length === 0) return;

    setPending(valid.length);

    try {
      const signRes = await fetch("/api/admin/cloudinary-sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder }),
      });
      const sign = await signRes.json();
      if (!signRes.ok) throw new Error(sign.error || "Autorisation d'upload refusée.");

      for (const file of valid) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("api_key", sign.apiKey);
        fd.append("timestamp", String(sign.timestamp));
        fd.append("signature", sign.signature);
        fd.append("folder", sign.folder);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`, {
          method: "POST",
          body: fd,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || "Échec de l'envoi de l'image.");

        onChange((prev) => [...prev, data.secure_url as string]);
        setPending((n) => n - 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'envoi.");
    } finally {
      setPending(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const remove = (url: string) => onChange((prev) => prev.filter((u) => u !== url));
  const makeMain = (url: string) => onChange((prev) => [url, ...prev.filter((u) => u !== url)]);

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {images.map((url, i) => (
          <div key={url} className="relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
            <Image src={url} alt={`Photo ${i + 1}`} fill sizes="200px" className="object-cover" />

            {i === 0 ? (
              <span className="absolute left-2 top-2 rounded-full bg-brand-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                Principale
              </span>
            ) : (
              <button
                type="button"
                onClick={() => makeMain(url)}
                className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-medium text-gray-700 hover:bg-white"
              >
                <Star className="h-3 w-3" /> Principale
              </button>
            )}

            <button
              type="button"
              onClick={() => remove(url)}
              aria-label="Retirer la photo"
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-red-600 hover:bg-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={pending > 0}
          className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 text-sm text-gray-500 transition hover:border-brand-500 hover:text-brand-600 disabled:cursor-wait"
        >
          {pending > 0 ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Envoi… ({pending})</span>
            </>
          ) : (
            <>
              <ImagePlus className="h-6 w-6" />
              <span>Ajouter des photos</span>
            </>
          )}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <p className="mt-2 text-xs text-gray-500">
        {hint ?? "JPG, PNG ou WebP, 10 Mo max par photo. La première photo est l'image principale du produit."}
      </p>
    </div>
  );
}