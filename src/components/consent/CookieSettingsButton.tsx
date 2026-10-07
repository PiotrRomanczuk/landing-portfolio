"use client";

import { openConsentBanner } from "@/lib/consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Reopens the cookie banner so consent can be withdrawn as easily as it was given.
 * Styled by the parent (footer / colophon) — it should read as one more footer link.
 */
export function CookieSettingsButton({ label, className }: { label: string; className?: string }) {
  if (!GA_ID) return null;
  return (
    <button type="button" className={className} onClick={openConsentBanner}>
      {label}
    </button>
  );
}
