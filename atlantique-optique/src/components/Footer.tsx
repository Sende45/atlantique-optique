import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import Logo from "@/components/Logo";

function FacebookIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 sm:py-14 lg:grid-cols-3">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo className="text-[18px] sm:text-[22px]" />
          <p className="mt-5 max-w-sm text-sm text-white/70">{siteConfig.description}</p>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Navigation</h3>
          <ul className="grid grid-cols-2 gap-2 text-sm text-white/70 sm:grid-cols-1">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/rendez-vous" className="hover:text-white">
                Rendez-vous
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Nous trouver</h3>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex gap-3">
              <MapPin className="h-5 w-5 shrink-0 text-gold-400" />
              <span>
                {siteConfig.address.line}, {siteConfig.address.district}, {siteConfig.address.city}
              </span>
            </li>
            {siteConfig.phones.map((p) => (
              <li key={p.tel} className="flex gap-3">
                <Phone className="h-5 w-5 shrink-0 text-gold-400" />
                <a href={`tel:${p.tel}`} className="hover:text-white">
                  {p.display}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={siteConfig.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="mt-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-brand-500"
          >
            <FacebookIcon className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-5 text-center text-xs text-white/50 sm:flex-row sm:justify-between sm:px-6 sm:text-left">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Tous droits réservés.
          </p>
          <p>
            {siteConfig.address.district} Blockhaus, {siteConfig.address.city} – {siteConfig.address.country}
          </p>
        </div>
      </div>
    </footer>
  );
}