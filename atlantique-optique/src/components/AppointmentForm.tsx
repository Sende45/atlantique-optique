"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, CheckCircle2, Loader2 } from "lucide-react";
import {
  APPOINTMENT_TYPES,
  MAX_DAYS_AHEAD,
  addDaysISO,
  slotsForDate,
  toMinutes,
  todayISO,
} from "@/lib/appointments";

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

type Props = { defaultType?: string; productName?: string };

export default function AppointmentForm({ defaultType = "EXAMEN_VUE", productName }: Props) {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    type: defaultType,
    date: "",
    time: "",
    message: productName ? `Je souhaite essayer : ${productName}` : "",
    website: "",
  });
  const [taken, setTaken] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  const set = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    if (!form.date) return;
    let cancelled = false;
    setLoadingSlots(true);
    fetch(`/api/appointments?date=${form.date}`)
      .then((r) => r.json())
      .then((d) => !cancelled && setTaken(d.taken ?? []))
      .catch(() => !cancelled && setTaken([]))
      .finally(() => !cancelled && setLoadingSlots(false));
    return () => {
      cancelled = true;
    };
  }, [form.date]);

  const now = new Date();
  const nowMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const slots = form.date
    ? slotsForDate(form.date).filter((s) => form.date !== todayISO() || toMinutes(s) > nowMinutes + 30)
    : [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.date || !form.time) return setError("Choisissez une date et un créneau.");

    setStatus("sending");
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "La réservation a échoué.");
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "La réservation a échoué.");
      setStatus("idle");
      if (form.date) {
        fetch(`/api/appointments?date=${form.date}`)
          .then((r) => r.json())
          .then((d) => setTaken(d.taken ?? []))
          .catch(() => {});
      }
    }
  }

  if (status === "done") {
    const dateLabel = new Date(`${form.date}T00:00:00Z`).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      timeZone: "UTC",
    });
    return (
      <div className="rounded-2xl bg-brand-50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-brand-600" />
        <p className="mt-4 text-lg font-semibold text-brand-900">Demande de rendez-vous envoyée !</p>
        <p className="mt-2 text-sm text-gray-600">
          {dateLabel} à {form.time.replace(":", "h")}. Nous vous appelons pour confirmer.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
      <div>
        <label className="mb-1 block text-sm font-medium">Motif du rendez-vous *</label>
        <select className={inputClass} value={form.type} onChange={(e) => set("type", e.target.value)}>
          {APPOINTMENT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Date *</label>
        <input
          type="date"
          className={inputClass}
          value={form.date}
          min={todayISO()}
          max={addDaysISO(MAX_DAYS_AHEAD)}
          onChange={(e) => setForm((f) => ({ ...f, date: e.target.value, time: "" }))}
          required
        />
      </div>

      {form.date && (
        <div>
          <label className="mb-2 block text-sm font-medium">Créneau *</label>
          {loadingSlots ? (
            <p className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Chargement des créneaux…
            </p>
          ) : slots.length === 0 ? (
            <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Aucun créneau ce jour-là (boutique fermée le dimanche). Choisissez une autre date.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slots.map((s) => {
                const isTaken = taken.includes(s);
                const selected = form.time === s;
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={isTaken}
                    onClick={() => set("time", s)}
                    className={`rounded-lg px-2 py-2 text-sm font-medium transition ${
                      selected
                        ? "bg-brand-600 text-white"
                        : isTaken
                          ? "cursor-not-allowed bg-gray-100 text-gray-400 line-through"
                          : "bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-brand-500"
                    }`}
                  >
                    {s.replace(":", "h")}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Nom complet *</label>
          <input className={inputClass} value={form.fullName} onChange={(e) => set("fullName", e.target.value)} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Téléphone *</label>
          <input
            type="tel"
            className={inputClass}
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="07 00 00 00 00"
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Email (facultatif)</label>
        <input type="email" className={inputClass} value={form.email} onChange={(e) => set("email", e.target.value)} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Précisions (facultatif)</label>
        <textarea
          className={`${inputClass} min-h-[100px]`}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="Ex : je porte déjà des lunettes, j'ai une ordonnance récente…"
        />
      </div>

      <input
        type="text"
        name="website"
        value={form.website}
        onChange={(e) => set("website", e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarCheck className="h-4 w-4" />}
        Confirmer la demande
      </button>
    </form>
  );
}