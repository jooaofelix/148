"use client";

import { useEffect } from "react";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";

export function ProductViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    track(ANALYTICS_EVENTS.productView, { slug });
  }, [slug]);

  return null;
}
