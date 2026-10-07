"use client";

import Script from "next/script";
import { useEffect } from "react";
import { eventForHref, track } from "@/lib/analytics";
import { useConsent } from "@/lib/consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * GA4 loads only after consent (Consent Mode v2: everything "denied", analytics flipped to "granted").
 * Contact, CV and outbound clicks are counted by a single document listener.
 */
export function GoogleAnalytics() {
  const consent = useConsent();
  const isEnabled = Boolean(GA_ID) && consent === "granted";

  useEffect(() => {
    // Consent withdrawn mid-visit: gtag stays in memory but stops writing cookies.
    if (consent === "denied") window.gtag?.("consent", "update", { analytics_storage: "denied" });
  }, [consent]);

  useEffect(() => {
    if (!isEnabled) return;
    const onClick = (e: MouseEvent) => {
      const href = (e.target as Element | null)?.closest("a")?.getAttribute("href") ?? "";
      const event = eventForHref(href);
      if (event) track(event, { link_url: href });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [isEnabled]);

  if (!isEnabled) return null;
  return (
    <>
      <Script id="ga-consent" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});
gtag('consent','update',{analytics_storage:'granted'});
gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
    </>
  );
}
