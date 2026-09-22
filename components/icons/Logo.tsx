import { HTMLAttributes } from "react";

/**
 * Wordmark. "148" set in the display face — the mark stands on its own,
 * no accompanying text needed.
 */
export function Logo({ className = "", ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`font-display tracking-wide leading-none select-none ${className}`}
      {...props}
    >
      148
    </span>
  );
}
