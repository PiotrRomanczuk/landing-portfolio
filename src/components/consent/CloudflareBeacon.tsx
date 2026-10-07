import Script from "next/script";

const TOKEN = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;

/**
 * Cloudflare Web Analytics: no cookies or identifiers, so it runs regardless of consent
 * and also counts visitors who declined the banner.
 */
export function CloudflareBeacon() {
  if (!TOKEN) return null;
  return (
    <Script
      src="https://static.cloudflareinsights.com/beacon.min.js"
      strategy="afterInteractive"
      data-cf-beacon={JSON.stringify({ token: TOKEN })}
    />
  );
}
