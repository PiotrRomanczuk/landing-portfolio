export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "missing-project-id";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";

export const studioUrl = "/studio";

export const readToken = process.env.SANITY_API_READ_TOKEN;

export const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET;

export const isSanityConfigured =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== undefined &&
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID.length > 0;
