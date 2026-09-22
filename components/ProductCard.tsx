"use client";

import Link from "next/link";
import { useState } from "react";
import { Product } from "@/lib/types";
import { SmartImage } from "./SmartImage";
import { ImageReveal } from "./ImageReveal";
import { StarMark } from "./icons/StarMark";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  // Prefer the true back shot; if the piece has none (e.g. a clean, unprinted
  // back), fall back to its first detail shot so the hover still reveals something.
  const hoverImage = product.images.back ?? product.images.details?.[0];

  return (
    <ImageReveal>
      <Link
        href={`/produto/${product.slug}`}
        onClick={() => track(ANALYTICS_EVENTS.productClick, { slug: product.slug })}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group flex flex-col gap-4"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-ink-soft">
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${
              hovered && hoverImage ? "opacity-0" : "opacity-100"
            }`}
          >
            <SmartImage
              src={product.images.front}
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
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-paper/40">
            {product.code}
          </span>
          <h3 className="font-display text-xl uppercase leading-tight tracking-wide text-paper">
            {product.name}
          </h3>
          {product.tagline && (
            <p className="text-sm text-paper/50">{product.tagline}</p>
          )}
        </div>
      </Link>
    </ImageReveal>
  );
}
