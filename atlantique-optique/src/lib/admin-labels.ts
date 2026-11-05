export const APPOINTMENT_STATUS: Record<string, { label: string; className: string }> = {
  EN_ATTENTE: { label: "En attente", className: "bg-amber-50 text-amber-700" },
  CONFIRME: { label: "Confirmé", className: "bg-brand-50 text-brand-700" },
  TERMINE: { label: "Terminé", className: "bg-gray-100 text-gray-600" },
  ANNULE: { label: "Annulé", className: "bg-red-50 text-red-700" },
};

// Abidjan = UTC+0 : on formate tout en UTC
export function formatTime(date: Date) {
  return date.toISOString().slice(11, 16).replace(":", "h");
}

export function formatLongDate(date: Date) {
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}

export function formatShortDateTime(date: Date) {
  return date.toLocaleString("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

export function dayLabel(isoDate: string) {
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
  if (isoDate === today) return "Aujourd'hui";
  if (isoDate === tomorrow) return "Demain";
  const label = formatLongDate(new Date(`${isoDate}T00:00:00Z`));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

// "07 49 16 35 71" -> "2250749163571" pour les liens wa.me
export function toWhatsAppNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("225")) return digits;
  if (digits.length === 10) return `225${digits}`;
  return digits;
}

export function startOfTodayUTC() {
  return new Date(`${new Date().toISOString().slice(0, 10)}T00:00:00Z`);
}