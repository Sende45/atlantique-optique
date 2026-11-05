import { siteConfig } from "@/config/site";

export const SLOT_MINUTES = 30;
export const MAX_DAYS_AHEAD = 60;

export const APPOINTMENT_TYPES = [
  { value: "EXAMEN_VUE", label: "Examen de la vue" },
  { value: "ESSAYAGE", label: "Essayage de montures" },
  { value: "LENTILLES", label: "Adaptation de lentilles" },
  { value: "CONSEIL", label: "Conseil / renseignement" },
];

export function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function formatTime(minutes: number) {
  const h = String(Math.floor(minutes / 60)).padStart(2, "0");
  const m = String(minutes % 60).padStart(2, "0");
  return `${h}:${m}`;
}

// Abidjan = UTC+0 toute l'année : on travaille directement en UTC
export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function addDaysISO(days: number) {
  return new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);
}

export function slotsForDate(dateStr: string): string[] {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return [];
  const date = new Date(`${dateStr}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return [];

  const day = siteConfig.hours.find((h) => h.day === date.getUTCDay());
  if (!day?.open || !day?.close) return [];

  const slots: string[] = [];
  for (let m = toMinutes(day.open); m + SLOT_MINUTES <= toMinutes(day.close); m += SLOT_MINUTES) {
    slots.push(formatTime(m));
  }
  return slots;
}