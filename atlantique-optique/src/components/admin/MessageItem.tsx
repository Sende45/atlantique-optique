"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Loader2, Mail, MailOpen, MessageCircle, Phone, Trash2 } from "lucide-react";

type Props = {
  message: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    message: string;
    read: boolean;
    dateLabel: string;
    whatsappHref: string | null;
  };
};

export default function MessageItem({ message: m }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function setRead(read: boolean) {
    await fetch(`/api/admin/messages/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });
    router.refresh();
  }

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next && !m.read) setRead(true);
  }

  async function remove() {
    if (!confirm(`Supprimer le message de ${m.name} ?`)) return;
    setBusy(true);
    const res = await fetch(`/api/admin/messages/${m.id}`, { method: "DELETE" });
    if (!res.ok) alert("La suppression a échoué.");
    setBusy(false);
    router.refresh();
  }

  const subject = encodeURIComponent("Re : votre message à Atlantique Optique");

  return (
    <li
      className={`overflow-hidden rounded-xl shadow-sm ring-1 transition ${
        m.read ? "bg-white ring-gray-100" : "bg-brand-50/60 ring-brand-200"
      }`}
    >
      <button type="button" onClick={toggle} className="flex w-full items-start gap-3 p-4 text-left">
        <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${m.read ? "bg-transparent" : "bg-brand-500"}`} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className={`truncate text-sm ${m.read ? "font-medium text-gray-800" : "font-bold text-gray-900"}`}>
              {m.name}
            </p>
            <p className="shrink-0 text-xs text-gray-400">{m.dateLabel}</p>
          </div>
          {!open && <p className="mt-1 line-clamp-1 text-sm text-gray-600">{m.message}</p>}
        </div>
        <ChevronDown className={`mt-1 h-4 w-4 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 sm:pl-10">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
            <a href={`mailto:${m.email}`} className="flex items-center gap-1.5 break-all hover:text-brand-600">
              <Mail className="h-3.5 w-3.5 shrink-0" /> {m.email}
            </a>
            {m.phone && (
              <a href={`tel:${m.phone}`} className="flex items-center gap-1.5 hover:text-brand-600">
                <Phone className="h-3.5 w-3.5" /> {m.phone}
              </a>
            )}
          </div>

          <p className="mt-3 whitespace-pre-line rounded-lg bg-white p-3 text-sm leading-relaxed text-gray-800 ring-1 ring-gray-100">
            {m.message}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={`mailto:${m.email}?subject=${subject}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white hover:bg-brand-700"
            >
              <Mail className="h-3.5 w-3.5" /> Répondre par email
            </a>
            {m.whatsappHref && (
              <a
                href={m.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366]/10 px-3 py-2 text-xs font-semibold text-[#128C7E] hover:bg-[#25D366]/20"
              >
                <MessageCircle className="h-3.5 w-3.5" /> Répondre sur WhatsApp
              </a>
            )}
            <button
              type="button"
              onClick={() => setRead(false)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200"
            >
              <MailOpen className="h-3.5 w-3.5" /> Marquer non lu
            </button>
            <button
              type="button"
              onClick={remove}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />} Supprimer
            </button>
          </div>
        </div>
      )}
    </li>
  );
}