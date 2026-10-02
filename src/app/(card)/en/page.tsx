import type { Metadata } from "next";
import { BusinessCard } from "@/components/card/BusinessCard";
import { CARD } from "@/data/card";
import { SITE_URL } from "@/lib/site";

const copy = CARD.en;

export const metadata: Metadata = {
  title: copy.title,
  description: copy.description,
  alternates: { canonical: "/en", languages: { pl: "/", en: "/en" } },
  openGraph: { title: copy.title, description: copy.description, url: `${SITE_URL}/en`, locale: "en_US", type: "profile" },
  twitter: { title: copy.title, description: copy.description },
};

export default function CardPageEn() {
  return <BusinessCard locale="en" />;
}
