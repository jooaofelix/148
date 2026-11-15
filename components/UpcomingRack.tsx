"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Product } from "@/lib/types";
import { SmartImage } from "./SmartImage";

interface UpcomingRackProps {
  products: Product[];
}

const ITEM_WIDTH = 220;
const GAP = 20;
const ADVANCE_MS = 2400;
const TRANSITION_MS = 650;
/** Two copies is enough since the rack only ever advances forward. */
const COPIES = 2;

/**
 * Auto-advancing "rack" of upcoming ART pieces: the row glides sideways one
 * item at a time, a highlight frame tracks the centered piece, and its name
 * + reference crossfade in sync. Loops by rendering the list `COPIES` times
 * and snapping (transition disabled for one frame) back to the middle copy
 * once the lead copy is exhausted — the seam is invisible since every copy
 * is identical.
 */
export function UpcomingRack({ products }: UpcomingRackProps) {
  const n = products.length;
  const [index, setIndex] = useState(0);
  const [withTransition, setWithTransition] = useState(true);
  const [paused, setPaused] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused || n < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setIndex((i) => i + 1), ADVANCE_MS);
    return () => clearInterval(timer);
  }, [paused, n]);

  // Once the lead copy of the list is exhausted, jump back to the identical
  // position in the middle copy with no transition, so the loop is seamless.
  useEffect(() => {
    if (index < n * (COPIES - 1)) return;
    const settle = setTimeout(() => {
      setWithTransition(false);
      setIndex(index - n);
    }, TRANSITION_MS);
    return () => clearTimeout(settle);
  }, [index, n]);

  useEffect(() => {
    if (withTransition) return;
    const raf = requestAnimationFrame(() => setWithTransition(true));
    return () => cancelAnimationFrame(raf);
  }, [withTransition]);

  if (n === 0) return null;

  const activeProduct = products[index % n];
  const itemOffset = index * (ITEM_WIDTH + GAP);
  const translateX = containerWidth / 2 - itemOffset - ITEM_WIDTH / 2;

  return (
    <div
      className="flex flex-col gap-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div ref={containerRef} className="relative overflow-hidden py-3">
        <div
          className="pointer-events-none absolute inset-y-0 left-1/2 z-10 -translate-x-1/2"
          style={{ width: ITEM_WIDTH }}
        >
          <div className="absolute inset-2">
            <span className="absolute -left-2 -top-2 h-4 w-4 border-l border-t border-paper" />
            <span className="absolute -right-2 -top-2 h-4 w-4 border-r border-t border-paper" />
            <span className="absolute -bottom-2 -left-2 h-4 w-4 border-b border-l border-paper" />
            <span className="absolute -bottom-2 -right-2 h-4 w-4 border-b border-r border-paper" />
          </div>
        </div>

        <div
          className="flex"
          style={{
            gap: GAP,
            transform: `translateX(${translateX}px)`,
            transition: withTransition ? `transform ${TRANSITION_MS}ms cubic-bezier(0.65,0,0.35,1)` : "none",
          }}
        >
          {Array.from({ length: COPIES }, () => products)
            .flat()
            .map((product, i) => (
              <div
                key={`${product.slug}-${i}`}
                className="relative aspect-[4/5] shrink-0 overflow-hidden bg-ink-soft"
                style={{ width: ITEM_WIDTH }}
              >
                <SmartImage
                  src={product.images.back ?? product.images.front}
                  alt={product.name}
                  sizes={`${ITEM_WIDTH}px`}
                />
                <span className="absolute left-2 top-2 bg-ink/80 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.2em] text-paper">
                  Em breve
                </span>
              </div>
            ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-1.5 text-center">
        <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-paper/40">
          {activeProduct.code}
        </span>
        <h3 className="font-display text-2xl uppercase tracking-wide text-paper sm:text-3xl">
          {activeProduct.name}
        </h3>
        {activeProduct.reference && (
          <p className="font-blackletter text-lg text-paper/70">{activeProduct.reference.citation}</p>
        )}
      </div>
    </div>
  );
}
