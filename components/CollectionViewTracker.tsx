"use client";

import { useEffect } from "react";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";

export function CollectionViewTracker({ collection }: { collection: string }) {
  useEffect(() => {
    track(ANALYTICS_EVENTS.collectionView, { collection });
  }, [collection]);

  return null;
}
