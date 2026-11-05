"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, CheckCheck, Loader2, Trash2, X } from "lucide-react";

type Props = { id: string; status: string; name: string };

export default function AppointmentActions({ id, status, name }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function updateStatus(newStatus: string, confirmText?: string) {
    if (confirmText && !confirm(confirmText)) return;
    setLoading(newStatus);
    const res = await fetch(`/api/admin/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!res.ok) alert("La mise à jour a échoué.");
    setLoading(null);
    router.refresh();
  }

  async function remove() {
    if (!confirm(`Supprimer définitivement le rendez-vous de ${name} ?`)) return;
    setLoading("delete");
    const res = await fetch(`/api/admin/appointments/${id}`, { method: "DELETE" });
    if (!res.ok) alert("La suppression a échoué.");
    setLoading(null);
    router.refresh();
  }

  const btn = "inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition disabled:opacity-50";
  const icon = (key: string, Icon: typeof Check) =>
    loading === key ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Icon className="h-3.5 w-3.5" />;

  return (
    <div className="flex flex-wrap gap-2">
      {status === "EN_ATTENTE" && (
        <button
          type="button"
          onClick={() => updateStatus("CONFIRME")}
          disabled={loading !== null}
          className={`${btn} bg-brand-600 text-white hover:bg-brand-700`}
        >
          {icon("CONFIRME", Check)} Confirmer
        </button>
      )}

      {status === "CONFIRME" && (
        <button
          type="button"
          onClick={() => updateStatus("TERMINE")}
          disabled={loading !== null}
          className={`${btn} bg-gray-800 text-white hover:bg-gray-900`}
        >
          {icon("TERMINE", CheckCheck)} Terminé
        </button>
      )}

      {(status === "EN_ATTENTE" || status === "CONFIRME") && (
        <button
          type="button"
          onClick={() => updateStatus("ANNULE", `Annuler le rendez-vous de ${name} ? Le créneau sera libéré.`)}
          disabled={loading !== null}
          className={`${btn} bg-red-50 text-red-700 hover:bg-red-100`}
        >
          {icon("ANNULE", X)} Annuler
        </button>
      )}

      {(status === "ANNULE" || status === "TERMINE") && (
        <button
          type="button"
          onClick={remove}
          disabled={loading !== null}
          className={`${btn} bg-red-50 text-red-700 hover:bg-red-100`}
        >
          {icon("delete", Trash2)} Supprimer
        </button>
      )}
    </div>
  );
}