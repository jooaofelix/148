import Link from "next/link";
import { Logo } from "@/components/icons/Logo";
import { StarMark } from "@/components/icons/StarMark";

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center gap-8 px-4 text-center">
      <Logo className="text-7xl text-paper/20 sm:text-8xl" />
      <div className="flex flex-col items-center gap-3">
        <StarMark className="h-5 w-5 animate-spark text-paper/50" />
        <h1 className="font-display text-2xl uppercase tracking-wide text-paper sm:text-3xl">
          Essa página ainda não existe.
        </h1>
        <p className="max-w-xs text-sm text-paper/50">
          Assim como o drop, talvez esteja a caminho.
        </p>
      </div>
      <Link
        href="/"
        className="border border-paper/30 px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-paper hover:border-paper"
      >
        Voltar para o início
      </Link>
    </section>
  );
}
