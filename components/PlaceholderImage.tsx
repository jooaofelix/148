import { StarMark } from "./icons/StarMark";

interface PlaceholderImageProps {
  label: string;
  className?: string;
  tone?: "ink" | "paper";
}

/**
 * Stand-in for real photography/artwork. Keeps the correct footprint and
 * visual rhythm of the page while official assets aren't wired up yet —
 * replace by dropping the real file at the path noted in each data entry.
 */
export function PlaceholderImage({
  label,
  className = "",
  tone = "ink",
}: PlaceholderImageProps) {
  const isPaper = tone === "paper";
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden border ${
        isPaper
          ? "border-ink/15 bg-paper-dim text-ink/40"
          : "border-paper/15 bg-ink-soft text-paper/30"
      } ${className}`}
      role="img"
      aria-label={label}
    >
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, currentColor 0, currentColor 1px, transparent 1px, transparent 14px)",
        }}
      />
      <div className="relative flex flex-col items-center gap-3 px-6 text-center">
        <StarMark className="h-4 w-4 animate-spark" />
        <span className="text-[10px] font-medium uppercase tracking-[0.2em]">
          {label}
        </span>
      </div>
    </div>
  );
}
