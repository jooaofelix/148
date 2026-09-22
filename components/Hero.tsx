import { PlaceholderImage } from "./PlaceholderImage";
import { WaitlistCTA } from "./WaitlistCTA";
import { Logo } from "./icons/Logo";

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-end overflow-hidden bg-ink sm:min-h-screen">
      <div className="absolute inset-0">
        <PlaceholderImage
          label="Fotografia editorial — hero-main.webp"
          className="h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
      </div>

      <div className="relative flex w-full flex-col gap-6 px-4 pb-14 sm:px-6 sm:pb-20 lg:px-8">
        <Logo className="animate-fade-up text-[5rem] leading-none text-paper sm:text-[7rem] md:text-[9rem]" />

        <p className="max-w-md animate-fade-up text-lg text-paper/80 sm:text-xl" style={{ animationDelay: "120ms" }}>
          Toda a criação louva.
        </p>

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
