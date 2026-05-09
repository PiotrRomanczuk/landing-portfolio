import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Newsreader } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Piotr Romanczuk | Software Developer",
  description:
    "Software developer based in Warsaw, Poland. Building production-ready web applications with TypeScript, React, and Next.js.",
  keywords: [
    "software developer",
    "web developer",
    "React",
    "Next.js",
    "TypeScript",
    "Warsaw",
    "freelance",
  ],
  authors: [{ name: "Piotr Romanczuk" }],
  openGraph: {
    title: "Piotr Romanczuk | Software Developer",
    description:
      "Building production-ready web applications with TypeScript, React, and Next.js.",
    type: "website",
    locale: "en_US",
    url: "https://romanczuk.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Piotr Romanczuk | Software Developer",
    description:
      "Building production-ready web applications with TypeScript, React, and Next.js.",
  },
  metadataBase: new URL("https://romanczuk.vercel.app"),
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://formspree.io" />
        <link
          rel="alternate"
          type="application/atom+xml"
          title="The Writing Desk — Piotr Romanczuk"
          href="/blog/rss.xml"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Piotr Romanczuk",
              jobTitle: "Software Engineer",
              url: "https://romanczuk.vercel.app",
              email: "mailto:p.romanczuk@gmail.com",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Warsaw",
                addressCountry: "PL",
              },
              sameAs: ["https://github.com/PiotrRomanczuk"],
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${newsreader.variable} font-sans antialiased selection:bg-primary/30 selection:text-white`}
      >
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
