import type { Metadata, Viewport } from "next";
import { Instrument_Sans } from "next/font/google";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  appleWebApp: { capable: true, title: "Romańczuk", statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0b0e" },
    { media: "(prefers-color-scheme: light)", color: "#f6f5f1" },
  ],
  viewportFit: "cover",
};

export default function CardLayout({ children }: LayoutProps<"/">) {
  return <div className={instrumentSans.variable}>{children}</div>;
}
