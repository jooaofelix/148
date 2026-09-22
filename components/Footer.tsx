import Link from "next/link";
import { site } from "@/data/site";
import { LogoMark } from "./icons/LogoMark";
import { StarMark } from "./icons/StarMark";

export function Footer() {
  return (
    <footer className="border-t border-paper/10 bg-ink">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-3">
            <div className="h-12">
              <LogoMark />
            </div>
            <p className="max-w-[16rem] text-sm text-paper/50">
              Toda a criação louva.
              <br />
              <span className="font-blackletter text-base tracking-wide text-paper/40">
                Salmo 148
              </span>
            </p>
          </div>

          <nav
            aria-label="Links do rodapé"
            className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm text-paper/60 sm:flex sm:gap-10"
          >
            <a href={site.social.instagram} target="_blank" rel="noreferrer" className="hover:text-paper">
              Instagram
            </a>
            <a href={`mailto:contato@${site.domain}`} className="hover:text-paper">
              Contato
            </a>
            <Link href="/privacidade" className="hover:text-paper">
              Política de Privacidade
            </Link>
            <Link href="/termos" className="hover:text-paper">
              Termos
            </Link>
          </nav>
        </div>

        <div className="mt-10 flex flex-col-reverse items-start justify-between gap-4 border-t border-paper/10 pt-6 text-xs text-paper/40 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} 148. Todos os direitos reservados.</p>
          <p className="flex items-center gap-2">
            <StarMark className="h-3 w-3" />
            Pré-lançamento
          </p>
        </div>
      </div>
    </footer>
  );
}
