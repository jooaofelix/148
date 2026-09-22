"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import { SmartImage } from "./SmartImage";

interface ProductGalleryProps {
  product: Product;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const shots: { key: string; src: string; label: string }[] = [
    { key: "front", src: product.images.front, label: `${product.name} — frente` },
    ...(product.images.back
      ? [{ key: "back", src: product.images.back, label: `${product.name} — costas` }]
      : []),
    ...(product.images.details?.map((src, i) => ({
      key: `detail-${i}`,
      src,
      label: `${product.name} — detalhe`,
    })) ?? []),
  ];

  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/5] overflow-hidden bg-ink-soft sm:aspect-[3/4]">
        <SmartImage src={shots[active].src} alt={shots[active].label} sizes="(min-width: 1024px) 50vw, 100vw" priority />
      </div>
      {shots.length > 1 && (
        <div className="flex gap-2" role="tablist" aria-label="Imagens do produto">
          {shots.map((shot, i) => (
            <button
              key={shot.key}
              type="button"
              role="tab"
              aria-selected={active === i}
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 shrink-0 border transition-colors ${
                active === i ? "border-paper" : "border-paper/20"
              }`}
            >
              <SmartImage src={shot.src} alt={shot.label} sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
