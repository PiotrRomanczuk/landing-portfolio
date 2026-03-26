import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono, Inter, Playfair_Display, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
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
        className={`${spaceGrotesk.variable} ${spaceMono.variable} ${inter.variable} ${playfair.variable} ${sourceSerif.variable} ${jetbrainsMono.variable} font-sans antialiased selection:bg-primary/30 selection:text-white`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
