"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, Search, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import Logo from "@/components/Logo";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/95 backdrop-blur transition-shadow duration-300 ${
        scrolled ? "border-gray-200 shadow-md shadow-black/5" : "border-gray-100"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 transition-[height] duration-300 sm:px-6 ${
          scrolled ? "h-14 sm:h-16" : "h-16 sm:h-20"
        }`}
      >
        <Link href="/" className="flex shrink-0 items-center" onClick={() => setOpen(false)}>
          <Logo className="text-[15px] sm:text-[19px] xl:text-[21px]" />
        </Link>

        <nav className="hidden items-center gap-5 lg:flex xl:gap-8">
          {siteConfig.nav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative whitespace-nowrap rounded-sm py-1 text-sm font-medium outline-none transition-colors hover:text-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-4 ${
                  active ? "text-brand-700" : "text-ink"
                }`}
              >
                {item.label}
                {active ? (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-brand-500"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                ) : (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 origin-left scale-x-0 rounded-full bg-brand-200 transition-transform duration-300 group-hover:scale-x-100" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex xl:gap-4">
          <Link
            href="/lunettes"
            aria-label="Rechercher"
            className="rounded-full p-2 text-ink transition hover:bg-brand-50 hover:text-brand-600"
          >
            <Search className="h-5 w-5" />
          </Link>
          <Link
            href="/rendez-vous"
            className="whitespace-nowrap rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/25 xl:px-6"
          >
            Prendre rendez-vous
          </Link>
        </div>

        <button
          className="-mr-2 p-2 text-ink lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "close" : "open"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="block"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute inset-x-0 top-full h-[100dvh] overflow-y-auto border-t border-gray-100 bg-white px-4 pb-32 pt-4 lg:hidden"
          >
            <nav>
              {siteConfig.nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-lg px-3 py-3.5 text-base font-medium ${
                      isActive(item.href) ? "bg-brand-50 text-brand-700" : "text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.3 }}
            >
              <Link
                href="/rendez-vous"
                onClick={() => setOpen(false)}
                className="mt-4 block rounded-full bg-brand-600 px-6 py-3.5 text-center text-sm font-semibold text-white"
              >
                Prendre rendez-vous
              </Link>

              <div className="mt-8 space-y-3 border-t border-gray-100 pt-6">
                {siteConfig.phones.map((p) => (
                  <a key={p.tel} href={`tel:${p.tel}`} className="flex items-center gap-3 text-sm text-gray-700">
                    <Phone className="h-4 w-4 text-brand-600" />
                    {p.display}
                  </a>
                ))}
                <p className="pt-2 text-xs text-gray-500">{siteConfig.hoursSummary}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}