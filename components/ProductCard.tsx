"use client";

import Link from "next/link";
import { useRef, useState, type MouseEvent } from "react";
import { Product } from "@/lib/types";
import { SmartImage } from "./SmartImage";
import { ImageReveal } from "./ImageReveal";
import { StarMark } from "./icons/StarMark";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";

interface ProductCardProps {
  product: Product;
}

const HOLD_DELAY_MS = 180;

export function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasHolding = useRef(false);

  const colorways = product.colorways;
  const activeFront = colorways?.[colorIndex]?.image ?? product.images.front;
  // Prefer the true back shot; if the piece has none (e.g. a clean, unprinted
  // back), fall back to its first detail shot so the hover still reveals something.
  const hoverImage = product.images.back ?? product.images.details?.[0];

  function clearHoldTimer() {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  }

  // Touch has no hover state, so a press-and-hold stands in for it: hold to
  // reveal the back/detail shot, lift to return to front. A held release is
  // treated as "just looking," not a tap, so it doesn't also navigate.
  function handleTouchStart() {
    clearHoldTimer();
    holdTimer.current = setTimeout(() => {
      wasHolding.current = true;
      setHovered(true);
    }, HOLD_DELAY_MS);
  }

  function handleTouchEnd() {
    clearHoldTimer();
    if (wasHolding.current) {
      setHovered(false);
    }
  }

  function handleTouchMove() {
    clearHoldTimer();
    if (wasHolding.current) {
      wasHolding.current = false;
      setHovered(false);
    }
  }

  function handleClick(e: MouseEvent) {
    if (wasHolding.current) {
      e.preventDefault();
      wasHolding.current = false;
      return;
    }
    track(ANALYTICS_EVENTS.productClick, { slug: product.slug });
  }

  return (
    <ImageReveal>
      <div className="group flex flex-col gap-4">
        <Link
          href={`/produto/${product.slug}`}
          onClick={handleClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
          className="relative block aspect-[4/5] overflow-hidden bg-ink-soft"
        >
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${
              hovered && hoverImage ? "opacity-0" : "opacity-100"
            }`}
          >
            <SmartImage
              src={activeFront}
              alt={`${product.name} — frente`}
              sizes="(min-width: 768px) 33vw, 50vw"
            />
          </div>
          {hoverImage && (
            <div
              className={`absolute inset-0 transition-opacity duration-500 ${
                hovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <SmartImage
                src={hoverImage}
                alt={`${product.name} — detalhe`}
                sizes="(min-width: 768px) 33vw, 50vw"
              />
            </div>
          )}
          <span className="absolute left-3 top-3 bg-ink/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-paper">
            Em breve
          </span>
          {product.premium && (
            <span className="absolute right-3 top-3 flex items-center gap-1.5 border border-paper/70 bg-ink/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-paper">
              <StarMark className="h-2.5 w-2.5" />
              Premium
            </span>
          )}
        </Link>

        {colorways && colorways.length > 1 && (
          <div className="flex items-center gap-2">
            {colorways.map((colorway, i) => (
              <button
                key={colorway.name}
                type="button"
                aria-label={colorway.name}
                aria-pressed={i === colorIndex}
                onClick={(e) => {
                  e.preventDefault();
                  setColorIndex(i);
                }}
                className={`h-4 w-4 shrink-0 rounded-full border transition ${
                  i === colorIndex
                    ? "border-paper ring-1 ring-paper ring-offset-2 ring-offset-ink"
                    : "border-paper/25"
                }`}
                style={{ backgroundColor: colorway.hex }}
              />
            ))}
          </div>
        )}

        <Link href={`/produto/${product.slug}`} onClick={handleClick} className="flex flex-col gap-1">
          <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-paper/40">
            {product.code}
          </span>
          <h3 className="font-display text-xl uppercase leading-tight tracking-wide text-paper">
            {product.name}
          </h3>
          {product.tagline && (
            <p className="text-sm text-paper/50">{product.tagline}</p>
          )}
        </Link>
      </div>
    </ImageReveal>
  );
}
