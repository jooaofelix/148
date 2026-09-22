"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import { PlaceholderImage } from "./PlaceholderImage";

interface ProductGalleryProps {
  product: Product;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const shots: { key: string; label: string }[] = [
    { key: "front", label: `${product.name} — frente` },
    ...(product.images.back ? [{ key: "back", label: `${product.name} — costas` }] : []),
    ...(product.images.details?.map((_, i) => ({
      key: `detail-${i}`,
      label: `${product.name} — detalhe`,
    })) ?? []),
  ];

  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/5] overflow-hidden bg-ink-soft sm:aspect-[3/4]">
        <PlaceholderImage label={shots[active].label} className="absolute inset-0 h-full w-full" />
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
              className={`h-16 w-16 shrink-0 border transition-colors ${
                active === i ? "border-paper" : "border-paper/20"
              }`}
            >
              <PlaceholderImage label={shot.label} className="h-full w-full" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
