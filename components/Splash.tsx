"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";

const SEEN_KEY = "148-splash-seen";
const noopSubscribe = () => () => {};

/** True once hydrated on the client — lets us defer sessionStorage/matchMedia reads without a mismatch. */
function useMounted() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

function shouldShowSplash(): boolean {
  try {
    if (sessionStorage.getItem(SEEN_KEY) === "1") return false;
  } catch {
    return false;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
    return false;
  }

  return true;
}

/**
 * One-time full-screen intro shown on the first page load of a session —
 * a brief, quiet moment with the real 148 mark before the site itself
 * appears. Skipped entirely for prefers-reduced-motion and for anyone
 * navigating within the site (sessionStorage-gated, not shown on every
 * route change).
 */
export function Splash() {
  const mounted = useMounted();
  const [decided, setDecided] = useState(false);
  const [phase, setPhase] = useState<"hidden" | "visible" | "leaving">("hidden");

  if (mounted && !decided) {
    setDecided(true);
    if (shouldShowSplash()) setPhase("visible");
  }

  useEffect(() => {
    if (phase !== "visible") return;
    document.documentElement.style.overflow = "hidden";
    const leaveTimer = setTimeout(() => setPhase("leaving"), 1000);
    return () => clearTimeout(leaveTimer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "leaving") return;
    const removeTimer = setTimeout(() => {
      setPhase("hidden");
      document.documentElement.style.overflow = "";
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {}
    }, 500);
    return () => clearTimeout(removeTimer);
  }, [phase]);

  if (!mounted || phase === "hidden") return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-ink transition-opacity duration-500 ${
        phase === "leaving" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-36 animate-fade-up sm:w-48">
        <Image
          src="/images/brand/148-mark.webp"
          alt="148"
          width={512}
          height={512}
          priority
          className="h-auto w-full"
        />
      </div>
    </div>
  );
}
