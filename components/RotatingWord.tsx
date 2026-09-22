"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** True once hydrated on the client — lets us skip the interval on the server without a mismatch. */
function useMounted() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

interface RotatingWordProps {
  words: string[];
  intervalMs?: number;
  className?: string;
}

/** Crossfades between words on a timer. Static (first word only) under prefers-reduced-motion. */
export function RotatingWord({ words, intervalMs = 2200, className = "" }: RotatingWordProps) {
  const mounted = useMounted();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!mounted) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const fadeOut = setInterval(() => setVisible(false), intervalMs);
    return () => clearInterval(fadeOut);
  }, [mounted, intervalMs]);

  useEffect(() => {
    if (visible) return;
    const swap = setTimeout(() => {
      setIndex((i) => (i + 1) % words.length);
      setVisible(true);
    }, 300);
    return () => clearTimeout(swap);
  }, [visible, words.length]);

  return (
    <span
      className={`inline-block transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
      } ${className}`}
    >
      {words[index]}
    </span>
  );
}
