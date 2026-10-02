import type { Metadata } from "next";
import { BusinessCard } from "@/components/card/BusinessCard";
import { CARD } from "@/data/card";
import { SITE_URL } from "@/lib/site";

const copy = CARD.pl;

export const metadata: Metadata = {
  title: copy.title,
  description: copy.description,
  alternates: { canonical: "/", languages: { pl: "/", en: "/en" } },
  openGraph: { title: copy.title, description: copy.description, url: SITE_URL, locale: "pl_PL", type: "profile" },
  twitter: { title: copy.title, description: copy.description },
};

export default function CardPagePl() {
  return <BusinessCard locale="pl" />;
}
