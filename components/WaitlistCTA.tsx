"use client";

import { useState } from "react";
import { StarMark } from "./icons/StarMark";
import { WaitlistForm } from "./WaitlistForm";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";

interface WaitlistCTAProps {
  label?: string;
  productInterest?: string;
  source?: string;
  helperText?: string;
  className?: string;
  /** "paper" (default) for use on dark/ink backgrounds; "ink" for use on paper/light backgrounds. */
  tone?: "paper" | "ink";
}

/** Button that expands into the waitlist form inline, without navigation. */
export function WaitlistCTA({
  label = "Entrar na fila",
  productInterest,
  source = "cta",
  helperText,
  className = "",
  tone = "paper",
}: WaitlistCTAProps) {
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <div className={className}>
        <WaitlistForm productInterest={productInterest} source={source} tone={tone} />
      </div>
    );
  }

  const button =
    tone === "paper" ? "bg-paper text-ink" : "bg-ink text-paper";
  const helper = tone === "paper" ? "text-paper/50" : "text-ink/50";

  return (
    <div className={`flex flex-col items-start gap-3 ${className}`}>
      <button
        type="button"
        onClick={() => {
          track(ANALYTICS_EVENTS.waitlistCtaClick, { productInterest, source });
          setOpen(true);
        }}
        className={`group flex items-center gap-3 px-7 py-4 text-sm font-medium uppercase tracking-[0.2em] transition-opacity hover:opacity-90 ${button}`}
      >
        {label}
        <StarMark className="h-3.5 w-3.5 transition-transform group-hover:rotate-90" />
      </button>
      {helperText && <p className={`text-xs ${helper}`}>{helperText}</p>}
    </div>
  );
}
