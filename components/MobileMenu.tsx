"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { site } from "@/data/site";
import { StarMark } from "./icons/StarMark";

const noopSubscribe = () => () => {};

/** True once hydrated on the client — lets us defer `createPortal(..., document.body)` without a mismatch. */
function useMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const mounted = useMounted();
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const overlay = (
    <div
      id="mobile-menu"
      className={`fixed inset-0 z-40 flex flex-col justify-between bg-ink px-6 pb-10 pt-24 transition-opacity duration-300 ${
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <nav aria-label="Navegação principal" className="flex flex-col gap-1">
        {site.nav.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            className="border-b border-paper/10 py-4 font-display text-3xl uppercase tracking-wide text-paper transition-opacity"
            style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex flex-col gap-6">
        <Link
          href="/fila"
          className="flex items-center justify-center gap-2 border border-paper px-6 py-4 text-sm font-medium uppercase tracking-[0.2em] text-paper"
        >
          {site.cta.primary}
          <StarMark className="h-3 w-3" />
        </Link>
        <div className="flex items-center justify-center gap-6 text-xs uppercase tracking-[0.2em] text-paper/50">
          <a href={site.social.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href={site.social.tiktok} target="_blank" rel="noreferrer">
            TikTok
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-[5px]"
      >
        <span
          className={`h-px w-6 bg-paper transition-transform ${
            open ? "translate-y-[3px] rotate-45" : ""
          }`}
        />
        <span
          className={`h-px w-6 bg-paper transition-opacity ${open ? "opacity-0" : "opacity-100"}`}
        />
        <span
          className={`h-px w-6 bg-paper transition-transform ${
            open ? "-translate-y-[3px] -rotate-45" : ""
          }`}
        />
      </button>

      {/* Portalled to <body> so the header's backdrop-blur (which creates a CSS
          containing block) can't clip this fixed-position overlay to the header's box. */}
      {mounted ? createPortal(overlay, document.body) : null}
    </div>
  );
}
