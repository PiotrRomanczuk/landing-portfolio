"use client";

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: Gtag;
    dataLayer?: unknown[];
  }
}

/** Event names to mark as key events in GA4 (Admin → Events). */
export type TrackedEvent = "contact_click" | "cv_download" | "vcard_download" | "outbound_click";

/** Without consent gtag is never loaded, so the call is a no-op. */
export function track(event: TrackedEvent, params: Record<string, string> = {}) {
  window.gtag?.("event", event, params);
}

/** Maps a clicked link to the event worth reporting, or null for plain navigation. */
export function eventForHref(href: string): TrackedEvent | null {
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return "contact_click";
  if (href.endsWith(".vcf")) return "vcard_download";
  if (href.endsWith(".pdf")) return "cv_download";
  if (/^https?:\/\//.test(href) && !href.includes(window.location.host)) return "outbound_click";
  return null;
}
