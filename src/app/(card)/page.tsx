import type { Metadata } from "next";
import { BusinessCard } from "@/components/card/BusinessCard";
import { CARD } from "@/data/card";
import { SITE_URL } from "@/lib/site";

const copy = CARD.pl;

const ogImage = { url: "/og/card/pl", width: 1200, height: 630, alt: copy.title };

export const metadata: Metadata = {
  title: copy.title,
  description: copy.description,
  alternates: { canonical: "/", languages: { pl: "/", en: "/en" } },
  openGraph: { title: copy.title, description: copy.description, url: SITE_URL, locale: "pl_PL", type: "profile", images: [ogImage] },
  twitter: { card: "summary_large_image", title: copy.title, description: copy.description, images: [ogImage] },
};

export default function CardPagePl() {
  return <BusinessCard locale="pl" />;
}
