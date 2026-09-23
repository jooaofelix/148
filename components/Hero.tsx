import { SmartImage } from "./SmartImage";
import { WaitlistCTA } from "./WaitlistCTA";

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-end overflow-hidden bg-ink sm:min-h-screen">
      <div className="absolute inset-0">
        <SmartImage
          src="/images/hero/hero-main.webp"
          alt="148 — fotografia editorial"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
      </div>

      <div className="relative flex w-full flex-col gap-6 px-4 pb-14 sm:px-6 sm:pb-20 lg:px-8">
        <h1 className="animate-fade-up font-impact text-5xl uppercase leading-[0.95] tracking-wide text-paper sm:text-7xl md:text-8xl">
          Algo novo
          <br />
          está surgindo.
          <br />
          Vocês não vêem?
        </h1>

        <div className="flex flex-col items-start gap-4 animate-fade-up" style={{ animationDelay: "220ms" }}>
          <WaitlistCTA source="hero" />
          <p className="text-xs uppercase tracking-[0.2em] text-paper/40">
            Primeiro drop em breve
          </p>
        </div>
      </div>
    </section>
  );
}
