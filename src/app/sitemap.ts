import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { isSanityConfigured } from "@/sanity/lib/env";
import { sitemapQuery } from "@/sanity/lib/queries";

const BASE_URL = "https://romanczuk.vercel.app";

type SitemapData = {
  posts: { slug: string; _updatedAt: string }[];
  tags: { slug: string; _updatedAt: string }[];
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), priority: 1.0 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), priority: 0.9 },
    { url: `${BASE_URL}/cv/fullstack`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/cv/frontend`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/cv/backend`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/cv/devops`, lastModified: new Date(), priority: 0.8 },
  ];

  if (!isSanityConfigured) return staticEntries;

  const data = await client
    .fetch<SitemapData>(sitemapQuery)
    .catch(() => ({ posts: [], tags: [] }));

  const postEntries: MetadataRoute.Sitemap = data.posts.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: new Date(p._updatedAt),
    priority: 0.7,
  }));

  const tagEntries: MetadataRoute.Sitemap = data.tags.map((t) => ({
    url: `${BASE_URL}/blog/tag/${t.slug}`,
    lastModified: new Date(t._updatedAt),
    priority: 0.5,
  }));

  return [...staticEntries, ...postEntries, ...tagEntries];
}
