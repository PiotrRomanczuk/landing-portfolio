import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import type { Locale } from "@/data/card";
import { SITE_HOST } from "@/lib/site";

/** Share preview for the business card (/ and /en) — Claude Design "Open Graph 1200×630 · jasny". */

export const dynamic = "force-static";
export const generateStaticParams = () => [{ lang: "pl" }, { lang: "en" }];

const COPY: Record<Locale, { eyebrow: string; sub: string }> = {
  pl: { eyebrow: "INŻYNIER OPROGRAMOWANIA", sub: "Automatyzacja procesów i AI" },
  en: { eyebrow: "SOFTWARE ENGINEER", sub: "Process automation & AI" },
};

/** Google Fonts subset to exactly `text` (keeps Polish glyphs, tiny payload). Null on failure → system font. */
async function loadFont(family: string, weight: number, text: string): Promise<ArrayBuffer | null> {
  try {
    const query = `family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await fetch(`https://fonts.googleapis.com/css2?${query}`).then((r) => r.text());
    const url = css.match(/src: url\((.+?)\) format/)?.[1];
    return url ? await fetch(url).then((r) => r.arrayBuffer()) : null;
  } catch {
    return null;
  }
}

export async function GET(_req: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const copy = COPY[lang === "en" ? "en" : "pl"];
  const photo = await readFile(path.join(process.cwd(), "public/profile.jpg"));
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;
  const [serif, sans, mono] = await Promise.all([
    loadFont("Newsreader", 400, "Piotr Romańczuk"),
    loadFont("Instrument Sans", 400, copy.sub),
    loadFont("JetBrains Mono", 400, copy.eyebrow + SITE_HOST),
  ]);
  const fonts = [
    serif && { name: "Newsreader", data: serif, weight: 400 as const },
    sans && { name: "Instrument Sans", data: sans, weight: 400 as const },
    mono && { name: "JetBrains Mono", data: mono, weight: 400 as const },
  ].filter((f): f is NonNullable<typeof f> => Boolean(f));

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", gap: 56, padding: "72px 84px", background: "#f6f5f1", color: "#1a1a1a", fontFamily: "Instrument Sans" }}>
        <div style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "JetBrains Mono", fontSize: 20, letterSpacing: "0.14em", color: "#a0561a" }}>{copy.eyebrow}</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Newsreader", fontSize: 118, lineHeight: 0.95, letterSpacing: "-0.03em", display: "flex", flexDirection: "column" }}>
              <span>Piotr</span>
              <span>Romańczuk</span>
            </div>
            <div style={{ marginTop: 28, fontSize: 32, color: "#5d5a54" }}>{copy.sub}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: "JetBrains Mono", fontSize: 26 }}>
            <div style={{ width: 44, height: 2, background: "#a0561a" }} />
            {SITE_HOST}
          </div>
        </div>
        {/* Satori ignores object-position: crop the portrait (458×800) by hand, head near the top edge. */}
        <div style={{ width: 300, height: 300, display: "flex", position: "relative", overflow: "hidden", borderRadius: 150, boxShadow: "0 0 0 1px rgba(26,26,26,.14)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> */}
          <img src={photoSrc} width={300} height={524} alt="" style={{ position: "absolute", top: -14, left: 0 }} />
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts },
  );
}
