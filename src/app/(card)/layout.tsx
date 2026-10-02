import type { Metadata, Viewport } from "next";

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
  return children;
}
