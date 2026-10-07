"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { onConsentBannerOpen, setConsent, useConsent } from "@/lib/consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

// The card at "/" is Polish; every other route (card /en, portfolio, CV, blog) is English.
const copy = {
  pl: {
    label: "Zgoda na cookies",
    text: "Używam cookies Google Analytics, żeby wiedzieć, które strony i projekty są czytane. Strona działa tak samo, czy je zaakceptujesz, czy odrzucisz.",
    accept: "Akceptuję",
    decline: "Odrzucam",
  },
  en: {
    label: "Cookie consent",
    text: "I use Google Analytics cookies to see which pages and projects people read. The site works the same whether you accept or decline.",
    accept: "Accept",
    decline: "Decline",
  },
};

const choice =
  "min-h-11 cursor-pointer rounded-md border border-foreground bg-foreground text-sm font-semibold text-background transition-opacity hover:opacity-85";

/** "Accept" and "Decline" are visually equal, as GDPR guidance expects. */
export function CookieBanner() {
  const consent = useConsent();
  const t = copy[usePathname() === "/" ? "pl" : "en"];
  const [isReopened, setIsReopened] = useState(false);

  useEffect(() => onConsentBannerOpen(() => setIsReopened(true)), []);

  // Nothing to consent to without a GA ID. On the server useConsent() is "denied",
  // so the banner only appears after hydration.
  if (!GA_ID || (consent !== null && !isReopened)) return null;

  const choose = (value: "granted" | "denied") => {
    setConsent(value);
    setIsReopened(false);
  };

  return (
    <div
      role="dialog"
      aria-label={t.label}
      className="fixed right-4 bottom-4 left-4 z-[70] flex flex-col gap-3 rounded-lg border border-border bg-card p-5 text-card-foreground shadow-lg sm:right-auto sm:w-[380px]"
    >
      <p className="m-0 text-sm leading-relaxed">{t.text}</p>
      <div className="grid grid-cols-2 gap-2.5">
        <button type="button" className={choice} onClick={() => choose("granted")}>
          {t.accept}
        </button>
        <button type="button" className={choice} onClick={() => choose("denied")}>
          {t.decline}
        </button>
      </div>
    </div>
  );
}
