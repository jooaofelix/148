import { ImageReveal } from "./ImageReveal";
import { LogoMark } from "./icons/LogoMark";
import { RotatingWord } from "./RotatingWord";

export function Manifesto() {
  return (
    <section className="on-paper bg-paper-dim py-24 text-ink sm:py-32">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-4 text-center sm:px-6">
        <ImageReveal>
          <div className="h-16 drop-shadow-[0_12px_20px_rgba(10,10,10,0.15)] sm:h-20">
            <LogoMark priority className="invert" />
          </div>
        </ImageReveal>

        <p className="font-blackletter text-4xl leading-tight text-ink sm:text-6xl md:text-7xl">
          Created to{" "}
          <RotatingWord words={["Create", "Praise", "Love"]} className="text-ink" />
        </p>
      </div>
    </section>
  );
}
