"use client";

import { useState } from "react";
import Image from "next/image";
import { PlaceholderImage } from "./PlaceholderImage";

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  tone?: "ink" | "paper";
  sizes?: string;
  priority?: boolean;
}

/**
 * Renders the real asset at `src` when it loads, falling back to
 * `PlaceholderImage` on 404 (asset not supplied yet) — so components can
 * point at the final path from day one and upgrade automatically the
 * moment a real file lands in public/images/, no code changes needed.
 */
export function SmartImage({
  src,
  alt,
  className = "",
  tone = "ink",
  sizes = "100vw",
  priority = false,
}: SmartImageProps) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return <PlaceholderImage label={alt} className={className} tone={tone} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
      onError={() => setErrored(true)}
    />
  );
}
