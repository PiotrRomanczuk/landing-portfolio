import type { Metadata } from "next";
import { BusinessCard } from "@/components/card/BusinessCard";
import { CARD } from "@/data/card";
import { SITE_URL } from "@/lib/site";

const copy = CARD.en;

const ogImage = { url: "/og/card/en", width: 1200, height: 630, alt: copy.title };

export const metadata: Metadata = {
  title: copy.title,
  description: copy.description,
  alternates: { canonical: "/en", languages: { pl: "/", en: "/en" } },
  openGraph: { title: copy.title, description: copy.description, url: `${SITE_URL}/en`, locale: "en_US", type: "profile", images: [ogImage] },
  twitter: { card: "summary_large_image", title: copy.title, description: copy.description, images: [ogImage] },
};

export default function CardPageEn() {
  return <BusinessCard locale="en" />;
}
