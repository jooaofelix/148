import { StarMark } from "./icons/StarMark";

interface MarqueeProps {
  text: string;
  tone?: "ink" | "paper";
}

/** Continuous scrolling strip used as a rhythm break between sections. */
export function Marquee({ text, tone = "paper" }: MarqueeProps) {
  const items = Array.from({ length: 8 });
  return (
    <div
      className={`overflow-hidden border-y py-4 ${
        tone === "ink"
          ? "border-ink/15 bg-paper-dim text-ink"
          : "border-paper/15 bg-ink text-paper"
      }`}
      aria-hidden="true"
    >
      <div className="flex w-max animate-marquee items-center gap-8 motion-reduce:animate-none">
        {[0, 1].map((group) => (
          <div key={group} className="flex items-center gap-8">
            {items.map((_, i) => (
              <span
                key={i}
                className="flex items-center gap-8 font-display text-xl uppercase tracking-wide sm:text-2xl"
              >
                {text}
                <StarMark className="h-3 w-3 opacity-60" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
