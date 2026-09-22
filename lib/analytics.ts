"use client";

/**
 * Thin analytics facade. Pushes to GA4 (gtag) and Meta Pixel (fbq) when
 * their loader scripts are present (wired via env vars in app/layout.tsx);
 * always no-ops safely otherwise, so events can be sprinkled through the
 * UI before real IDs exist.
 */

export const ANALYTICS_EVENTS = {
  siteView: "site_view",
  collectionView: "collection_view",
  productView: "product_view",
  productClick: "product_click",
  waitlistCtaClick: "waitlist_cta_click",
  waitlistFormStart: "waitlist_form_start",
  waitlistSignupComplete: "waitlist_signup_complete",
  share: "share",
} as const;

export type AnalyticsEvent =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function track(event: AnalyticsEvent, params: EventParams = {}): void {
  if (typeof window === "undefined") return;

  try {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ event, ...params });
    window.gtag?.("event", event, params);
    window.fbq?.("trackCustom", event, params);
  } catch {
    // Analytics must never break the UI.
  }
}
