import Link from "next/link";
import { site } from "@/data/site";
import { Logo } from "./icons/Logo";
import { StarMark } from "./icons/StarMark";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-paper/10 bg-ink/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-paper"
          aria-label="148 — página inicial"
        >
          <Logo className="text-2xl sm:text-3xl" />
        </Link>

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-8 md:flex"
        >
          {site.nav.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-medium uppercase tracking-[0.2em] text-paper/70 transition-colors hover:text-paper"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/fila"
            className="group flex items-center gap-2 border border-paper/30 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-paper transition-colors hover:border-paper hover:bg-paper hover:text-ink"
          >
            {site.cta.primary}
            <StarMark className="h-3 w-3 transition-transform group-hover:rotate-90" />
          </Link>
        </div>

        <MobileMenu />
      </div>
    </header>
  );
}
