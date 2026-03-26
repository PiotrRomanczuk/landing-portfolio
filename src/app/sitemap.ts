import type { MetadataRoute } from "next";

const BASE_URL = "https://romanczuk.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, lastModified: new Date(), priority: 1.0 },
    { url: `${BASE_URL}/cv/fullstack`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/cv/frontend`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/cv/backend`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/cv/devops`, lastModified: new Date(), priority: 0.8 },
  ];
}
