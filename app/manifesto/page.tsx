import type { Metadata } from "next";
import { RevealText } from "@/components/RevealText";
import { WaitlistCTA } from "@/components/WaitlistCTA";
import { StarMark } from "@/components/icons/StarMark";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Manifesto",
  description:
    "148 nasce do Salmo 148 — a ideia de que toda a criação, do céu à terra, louva ao Senhor.",
};

export default function ManifestoPage() {
  return (
    <>
      <section className="flex min-h-[70vh] flex-col justify-center bg-ink px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-14">
          <RevealText
            lines={[
              "Do céu à terra.",
              "Do que respira ao que permanece em silêncio.",
              "Tudo foi criado para louvar.",
            ]}
            className="flex flex-col gap-2"
            lineClassName="font-display text-4xl uppercase leading-[1.05] tracking-wide text-paper sm:text-5xl md:text-6xl"
          />

          <div className="flex items-center gap-3">
            <StarMark className="h-4 w-4 text-paper/50" />
            <span className="font-blackletter text-2xl text-paper/70 sm:text-3xl">
              {site.psalm.reference}
            </span>
          </div>
        </div>
      </section>

      <section className="on-paper border-t border-ink/10 bg-paper py-20 text-ink sm:py-28">
        <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 sm:px-6">
          <p className="text-lg leading-relaxed text-ink/80 sm:text-xl">
            148 é um número antes de ser uma frase. É um capítulo antes de ser um conceito.
            É o Salmo em que sol, lua, montanhas, animais e povos — cada parte da criação —
            aparecem convocados para a mesma coisa: louvar.
          </p>
          <p className="text-lg leading-relaxed text-ink/80 sm:text-xl">
            A marca começa aí. Cada peça carrega essa ideia — às vezes na frente, às vezes
            escondida nas costas, às vezes só num detalhe que alguém vai notar semanas depois
            de já ter feito da camiseta uma peça favorita.
          </p>
          <p className="text-lg leading-relaxed text-ink/80 sm:text-xl">
            Não é sobre explicar tudo de uma vez. É sobre deixar você descobrir.
          </p>

          <blockquote className="mt-6 flex flex-col gap-3 border-l-2 border-ink/20 pl-6">
            {site.psalm.lines.map((line) => (
              <span key={line} className="text-base italic text-ink/60 sm:text-lg">
                {line}
              </span>
            ))}
          </blockquote>
        </div>
      </section>

      <section className="bg-ink py-20 sm:py-24">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 text-center sm:px-6">
          <p className="font-display text-2xl uppercase tracking-wide sm:text-3xl">
            Created to praise.
          </p>
          <WaitlistCTA source="manifesto_page" />
        </div>
      </section>
    </>
  );
}
