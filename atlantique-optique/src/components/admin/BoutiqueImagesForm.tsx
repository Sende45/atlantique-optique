"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import ImageUploader from "./ImageUploader";

type Props = {
  initial: string[];
  /** Zone du site concernée : "boutique" ou "pourquoi". */
  imageKey?: "boutique" | "pourquoi";
  /** Une seule photo : un nouvel envoi remplace l'ancienne. */
  single?: boolean;
  hint?: string;
};

export default function BoutiqueImagesForm({ initial, imageKey = "boutique", single = false, hint }: Props) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/admin/boutique", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: imageKey, images }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'enregistrement.");
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm">
      <ImageUploader
        images={images}
        onChange={(update) => {
          setSaved(false);
          setImages((prev) => {
            const next = update(prev);
            return single ? next.slice(-1) : next;
          });
        }}
        folder="boutique"
        hint={
          hint ??
          "JPG, PNG ou WebP, 10 Mo max par photo. S'il y a plusieurs photos, elles défilent sur la page À propos."
        }
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-green-700">Photos enregistrées. Le site est à jour.</p>}

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Enregistrer
      </button>
    </div>
  );
}