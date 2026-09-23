import { ImageReveal } from "./ImageReveal";
import { LogoMark } from "./icons/LogoMark";
import { RotatingWord } from "./RotatingWord";

export function Manifesto() {
  return (
    <section className="on-paper relative overflow-hidden bg-paper-dim py-28 text-ink sm:py-36">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.09]">
        <div className="h-64 sm:h-80 md:h-96">
          <LogoMark className="invert" />
        </div>
      </div>

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 text-center sm:px-6">
        <ImageReveal>
          <p className="font-gothic text-4xl leading-tight text-ink sm:text-6xl md:text-7xl">
            Created to{" "}
            <RotatingWord
              words={["Create", "Praise", "Love"]}
              intervalMs={3400}
              className="text-ink"
            />
          </p>
        </ImageReveal>
      </div>
    </section>
  );
}
