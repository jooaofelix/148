interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  align?: "left" | "center";
  tone?: "ink" | "paper";
  className?: string;
}

export function SectionTitle({
  eyebrow,
  title,
  align = "left",
  tone = "paper",
  className = "",
}: SectionTitleProps) {
  return (
    <div
      className={`flex flex-col gap-3 ${
        align === "center" ? "items-center text-center" : "items-start text-left"
      } ${className}`}
    >
      {eyebrow && (
        <span
          className={`text-xs font-medium uppercase tracking-[0.3em] ${
            tone === "ink" ? "text-ink/50" : "text-paper/50"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-display text-4xl uppercase leading-[0.95] tracking-wide sm:text-5xl md:text-6xl ${
          tone === "ink" ? "text-ink" : "text-paper"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}
