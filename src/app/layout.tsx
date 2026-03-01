import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Piotr Romanczuk | Software Developer",
    description:
      "Building production-ready web applications with TypeScript, React, and Next.js.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Temporary: Figma capture script - remove after design capture */}
        <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>
      </head>
      <body
        className={`${spaceGrotesk.variable} ${spaceMono.variable} font-sans antialiased selection:bg-primary/30 selection:text-white`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
