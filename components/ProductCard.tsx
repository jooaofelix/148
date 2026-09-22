"use client";

import Link from "next/link";
import { useState } from "react";
import { Product } from "@/lib/types";
import { SmartImage } from "./SmartImage";
import { ImageReveal } from "./ImageReveal";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);

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
              hovered && product.images.back ? "opacity-0" : "opacity-100"
            }`}
          >
            <SmartImage
              src={product.images.front}
              alt={`${product.name} — frente`}
              sizes="(min-width: 768px) 33vw, 50vw"
            />
          </div>
          {product.images.back && (
            <div
              className={`absolute inset-0 transition-opacity duration-500 ${
                hovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <SmartImage
                src={product.images.back}
                alt={`${product.name} — costas`}
                sizes="(min-width: 768px) 33vw, 50vw"
              />
            </div>
          )}
          <span className="absolute left-3 top-3 bg-ink/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-paper">
            Em breve
          </span>
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
