"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Product } from "@/lib/types";
import { SmartImage } from "./SmartImage";

interface UpcomingRackProps {
  products: Product[];
}

const ITEM_WIDTH = 220;
const GAP = 28;
const ADVANCE_MS = 2400;
const TRANSITION_MS = 650;
const HANGER_HEIGHT = 34;
/** How far the image overlaps the hanger above it, in px ("-mt-1"). */
const IMAGE_OVERLAP = 4;
const IMAGE_TOP_OFFSET = HANGER_HEIGHT - IMAGE_OVERLAP;
/** Two copies is enough since the rack only ever advances forward. */
const COPIES = 2;

/** A bare wire-hanger silhouette — hooks onto the rail, the garment hangs from its shoulders. */
function Hanger({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 48 34" className={className} style={style} fill="none">
      <path
        d="M24 3c0 2.5-2.5 2.5-2.5 5.5M24 8.5 4 24.5l3.5 4L24 15l16.5 13.5 3.5-4-20-16Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface RackItemProps {
  product: Product;
  swayDelay: string;
}

/** One hanging piece — hovering crossfades to the back/detail shot, same trick as the product cards. */
function RackItem({ product, swayDelay }: RackItemProps) {
  const [hovered, setHovered] = useState(false);
  // Rest state leads with the striking back print (the actual sales pitch);
  // hovering flips to the front, mirroring the product cards but reversed —
  // here the back is the "default" and the front is the reveal.
  const hasBack = Boolean(product.images.back);
  const primaryImage = product.images.back ?? product.images.front;
  const hoverImage = hasBack ? product.images.front : product.images.details?.[0];

  return (
    <div
      className="w-full shrink-0 origin-top animate-hanger-sway"
      style={{ width: ITEM_WIDTH, animationDelay: swayDelay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Hanger
        className="mx-auto text-paper/60"
        style={{ height: HANGER_HEIGHT, width: HANGER_HEIGHT * 1.4 }}
      />
      <div className="relative aspect-[4/5] overflow-hidden bg-ink-soft" style={{ marginTop: -IMAGE_OVERLAP }}>
        <div className={`absolute inset-0 transition-opacity duration-500 ${hovered && hoverImage ? "opacity-0" : "opacity-100"}`}>
          <SmartImage src={primaryImage} alt={product.name} sizes={`${ITEM_WIDTH}px`} />
        </div>
        {hoverImage && (
          <div className={`absolute inset-0 transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}>
            <SmartImage src={hoverImage} alt={`${product.name} — detalhe`} sizes={`${ITEM_WIDTH}px`} />
          </div>
        )}
        <span className="absolute left-2 top-2 bg-ink/80 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.2em] text-paper">
          Em breve
        </span>
      </div>
    </div>
  );
}

/**
 * Auto-advancing "rack" of upcoming pieces: real hangers glide along a
 * stationary rail one at a time, a highlight frame tracks the centered
 * piece, and hovering any piece flips it to its back/detail shot — the
 * same reveal the product cards use. Name + reference crossfade below in
 * sync with the active piece. Loops by rendering the list `COPIES` times
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
      <div ref={containerRef} className="relative overflow-hidden pb-3 pt-6">
        {/* The closet rail — stationary; the garments glide along it. */}
        <div className="absolute inset-x-0 top-6 z-10 h-[3px] bg-gradient-to-r from-paper/0 via-paper/50 to-paper/0" />

        <div
          className="pointer-events-none absolute left-1/2 z-20 -translate-x-1/2"
          style={{ width: ITEM_WIDTH, top: 24, bottom: 12 }}
        >
          <div className="absolute inset-x-2 bottom-0" style={{ top: IMAGE_TOP_OFFSET }}>
            <span className="absolute -left-2 -top-2 h-4 w-4 border-l border-t border-paper" />
            <span className="absolute -right-2 -top-2 h-4 w-4 border-r border-t border-paper" />
            <span className="absolute -bottom-2 -left-2 h-4 w-4 border-b border-l border-paper" />
            <span className="absolute -bottom-2 -right-2 h-4 w-4 border-b border-r border-paper" />
          </div>
        </div>

        <div
          className="flex items-start"
          style={{
            gap: GAP,
            transform: `translateX(${translateX}px)`,
            transition: withTransition ? `transform ${TRANSITION_MS}ms cubic-bezier(0.65,0,0.35,1)` : "none",
          }}
        >
          {Array.from({ length: COPIES }, () => products)
            .flat()
            .map((product, i) => (
              <RackItem key={`${product.slug}-${i}`} product={product} swayDelay={`${(i % 5) * -0.7}s`} />
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
