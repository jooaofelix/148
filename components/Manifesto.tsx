import { ImageReveal } from "./ImageReveal";
import { SmartImage } from "./SmartImage";

export function Manifesto() {
  return (
    <section className="on-paper bg-paper-dim py-24 text-ink sm:py-32">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 text-center sm:px-6">
        <ImageReveal>
          <div className="relative aspect-square w-48 overflow-hidden shadow-xl sm:w-64 md:w-72">
            <SmartImage src="/images/brand/148-mark.webp" alt="148" sizes="288px" tone="ink" />
          </div>
        </ImageReveal>
      </div>
    </section>
  );
}
