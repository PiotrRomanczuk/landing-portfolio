"use client";

import { useSyncExternalStore } from "react";

/** null = no choice yet (the banner is shown). */
export type Consent = "granted" | "denied" | null;

const STORAGE_KEY = "cookie-consent";
const CHANGE_EVENT = "consent-change";
const OPEN_EVENT = "consent-open";

/** In-memory fallback when localStorage is unavailable. */
let memory: Consent = null;

function read(): Consent {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function setConsent(value: Exclude<Consent, null>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Private window / blocked storage — the choice lasts until reload.
  }
  memory = value;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Returns "denied" on the server so nothing consent-gated renders before hydration. */
export function useConsent(): Consent {
  return useSyncExternalStore(subscribe, () => read() ?? memory, () => "denied");
}

/** Lets a "Cookie settings" link reopen the banner. */
export function openConsentBanner() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onConsentBannerOpen(handler: () => void) {
  window.addEventListener(OPEN_EVENT, handler);
  return () => window.removeEventListener(OPEN_EVENT, handler);
}
