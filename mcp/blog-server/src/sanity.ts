import { createClient, type SanityClient } from "@sanity/client";

function required(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(
      `Missing env var: ${name}. The blog MCP server needs Sanity credentials.`,
    );
  }
  return v;
}

let cached: SanityClient | null = null;

export function getClient(): SanityClient {
  if (cached) return cached;
  cached = createClient({
    projectId: required("BLOG_SANITY_PROJECT_ID"),
    dataset: process.env.BLOG_SANITY_DATASET ?? "production",
    apiVersion: process.env.BLOG_SANITY_API_VERSION ?? "2025-01-01",
    token: required("BLOG_SANITY_WRITE_TOKEN"),
    useCdn: false,
  });
  return cached;
}
