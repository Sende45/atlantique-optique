export const CATEGORIES = [
  { value: "VUE", label: "Lunettes de vue" },
  { value: "SOLAIRE", label: "Lunettes de soleil" },
  { value: "ENFANT", label: "Lunettes enfants" },
  { value: "LENTILLE", label: "Lentilles de contact" },
];

export const GENDERS = [
  { value: "HOMME", label: "Homme" },
  { value: "FEMME", label: "Femme" },
  { value: "MIXTE", label: "Mixte" },
  { value: "ENFANT", label: "Enfant" },
];

export const FRAME_SHAPES = [
  "Rectangulaire",
  "Ronde",
  "Carrée",
  "Ovale",
  "Aviateur",
  "Papillon",
  "Œil-de-chat",
  "Hexagonale",
  "Autre",
];

export const MATERIALS = ["Acétate", "Métal", "Titane", "Plastique", "Mixte (métal + acétate)", "Bois"];

export function labelOf(list: { value: string; label: string }[], value: string | null | undefined) {
  return list.find((item) => item.value === value)?.label ?? "—";
}

export function formatPrice(price: number | null | undefined) {
  if (price == null) return "Prix sur demande";
  return `${new Intl.NumberFormat("fr-FR").format(price)} FCFA`;
}