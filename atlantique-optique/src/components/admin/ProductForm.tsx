"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import ImageUploader from "./ImageUploader";
import { CATEGORIES, FRAME_SHAPES, GENDERS, MATERIALS } from "@/lib/catalog";

export type ProductFormValues = {
  name: string;
  brandName: string;
  category: string;
  gender: string;
  price: string;
  frameShape: string;
  material: string;
  color: string;
  description: string;
  images: string[];
  inStock: boolean;
  featured: boolean;
};

const EMPTY: ProductFormValues = {
  name: "",
  brandName: "",
  category: "VUE",
  gender: "",
  price: "",
  frameShape: "",
  material: "",
  color: "",
  description: "",
  images: [],
  inStock: true,
  featured: false,
};

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100";
const labelClass = "mb-1 block text-sm font-medium text-gray-700";

export default function ProductForm({
  productId,
  initial,
  brands,
}: {
  productId?: string;
  initial?: ProductFormValues;
  brands: string[];
}) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>(initial ?? EMPTY);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const isLens = values.category === "LENTILLE";

  function set<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!values.name.trim()) return setError("Le nom du produit est obligatoire.");
    if (values.images.length === 0) return setError("Ajoutez au moins une photo.");

    setSaving(true);
    try {
      const res = await fetch(productId ? `/api/admin/products/${productId}` : "/api/admin/products", {
        method: productId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'enregistrement.");

      router.push("/admin/produits");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'enregistrement.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Photos */}
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <h2 className="mb-4 font-semibold text-brand-900">Photos</h2>
        <ImageUploader
          images={values.images}
          onChange={(update) => setValues((prev) => ({ ...prev, images: update(prev.images) }))}
        />
      </section>

      {/* Infos principales */}
      <section className="grid gap-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:grid-cols-2">
        <h2 className="font-semibold text-brand-900 sm:col-span-2">Informations</h2>

        <div className="sm:col-span-2">
          <label className={labelClass}>Nom du produit *</label>
          <input
            className={inputClass}
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Ex : Ray-Ban Clubmaster RB3016"
            required
          />
        </div>

        <div>
          <label className={labelClass}>Catégorie *</label>
          <select className={inputClass} value={values.category} onChange={(e) => set("category", e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Marque</label>
          <input
            className={inputClass}
            value={values.brandName}
            onChange={(e) => set("brandName", e.target.value)}
            list="brands-list"
            placeholder="Choisir ou saisir une marque"
          />
          <datalist id="brands-list">
            {brands.map((b) => (
              <option key={b} value={b} />
            ))}
          </datalist>
        </div>

        <div>
          <label className={labelClass}>Pour qui</label>
          <select className={inputClass} value={values.gender} onChange={(e) => set("gender", e.target.value)}>
            <option value="">Non précisé</option>
            {GENDERS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Prix (FCFA)</label>
          <input
            className={inputClass}
            inputMode="numeric"
            value={values.price}
            onChange={(e) => set("price", e.target.value.replace(/[^\d]/g, ""))}
            placeholder="Laisser vide = prix sur demande"
          />
        </div>
      </section>

      {/* Caractéristiques */}
      <section className="grid gap-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:grid-cols-3">
        <h2 className="font-semibold text-brand-900 sm:col-span-3">Caractéristiques</h2>

        {!isLens && (
          <>
            <div>
              <label className={labelClass}>Forme de la monture</label>
              <select
                className={inputClass}
                value={values.frameShape}
                onChange={(e) => set("frameShape", e.target.value)}
              >
                <option value="">Non précisée</option>
                {FRAME_SHAPES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Matériau</label>
              <select className={inputClass} value={values.material} onChange={(e) => set("material", e.target.value)}>
                <option value="">Non précisé</option>
                {MATERIALS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <div className={isLens ? "sm:col-span-3" : ""}>
          <label className={labelClass}>Couleur</label>
          <input
            className={inputClass}
            value={values.color}
            onChange={(e) => set("color", e.target.value)}
            placeholder="Ex : Noir mat, Écaille…"
          />
        </div>

        <div className="sm:col-span-3">
          <label className={labelClass}>Description</label>
          <textarea
            className={`${inputClass} min-h-[120px]`}
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Points forts, dimensions, traitements possibles…"
          />
        </div>
      </section>

      {/* Visibilité */}
      <section className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:flex-row sm:gap-10">
        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={values.inStock}
            onChange={(e) => set("inStock", e.target.checked)}
            className="h-4 w-4 accent-brand-600"
          />
          En stock
        </label>
        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={values.featured}
            onChange={(e) => set("featured", e.target.checked)}
            className="h-4 w-4 accent-brand-600"
          />
          Mettre en avant sur l&apos;accueil
        </label>
      </section>

      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/produits")}
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {productId ? "Enregistrer les modifications" : "Publier le produit"}
        </button>
      </div>
    </form>
  );
}