import { ImageReveal } from "./ImageReveal";
import { LogoMark } from "./icons/LogoMark";

export function Manifesto() {
  return (
    <section className="on-paper relative overflow-hidden bg-paper-dim py-28 text-ink sm:py-36">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4 opacity-[0.06]">
        <span className="font-impact text-center text-6xl uppercase leading-[0.9] tracking-wide sm:text-8xl md:text-9xl">
          Created
          <br />
          to Create
        </span>
      </div>

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 text-center sm:px-6">
        <ImageReveal>
          <div className="h-40 drop-shadow-[0_18px_30px_rgba(10,10,10,0.18)] sm:h-56 md:h-64">
            <LogoMark priority className="invert" />
          </div>
        </ImageReveal>
      </div>
    </section>
  );
}
