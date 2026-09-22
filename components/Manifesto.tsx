import { RevealText } from "./RevealText";

export function Manifesto() {
  return (
    <section className="on-paper bg-paper-dim py-24 text-ink sm:py-32">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 text-center sm:px-6">
        <RevealText
          lines={[
            "Do céu à terra.",
            "Do que respira ao que permanece em silêncio.",
            "Tudo foi criado para louvar.",
          ]}
          className="flex flex-col gap-1"
          lineClassName="font-serif text-2xl italic leading-snug tracking-tight text-ink/90 sm:text-3xl md:text-4xl"
        />
      </div>
    </section>
  );
}
