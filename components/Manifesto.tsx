import { site } from "@/data/site";
import { RevealText } from "./RevealText";

export function Manifesto() {
  return (
    <section className="on-paper bg-paper py-24 text-ink sm:py-32">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-10 px-4 text-center sm:px-6">
        <RevealText
          lines={[
            "Do céu à terra.",
            "Do que respira ao que permanece em silêncio.",
            "Tudo foi criado para louvar.",
          ]}
          className="flex flex-col gap-1"
          lineClassName="font-display text-3xl uppercase leading-tight tracking-wide sm:text-4xl md:text-5xl"
        />

        <div className="flex flex-col items-center gap-2 pt-4">
          <span className="font-blackletter text-2xl text-ink/70 sm:text-3xl">
            {site.psalm.reference}
          </span>
          <span className="text-xs uppercase tracking-[0.3em] text-ink/40">
            Toda a criação louva
          </span>
        </div>
      </div>
    </section>
  );
}
