/**
 * Seed launch tags for the blog. Idempotent — re-running is safe.
 *
 * Run with:
 *   npx sanity exec scripts/seed-tags.ts --with-user-token
 *
 * Tags with deterministic _ids prefixed `tag-` so they can be referenced
 * stably and not duplicated across runs. The pre-existing `Next.js` tag
 * (created via Studio) is left alone — we look it up by slug and skip if
 * present, otherwise create with id `tag-nextjs`.
 */

import { getCliClient } from "sanity/cli";

type Seed = {
  slug: string;
  name: string;
  description: string;
  accent?: string;
};

const tags: Seed[] = [
  {
    slug: "nextjs",
    name: "Next.js",
    description:
      "App Router, Server Components, ISR, deployment on Vercel — and the production lessons that come with shipping it.",
  },
  {
    slug: "supabase",
    name: "Supabase",
    description:
      "Postgres, auth, and row-level security shipped as one product. Lessons from running it in production.",
  },
  {
    slug: "saas",
    name: "SaaS",
    description:
      "Lessons running production SaaS with real users — pricing, on-call, schema migrations, and the gap between side project and live system.",
  },
  {
    slug: "dotnet",
    name: ".NET",
    description:
      "ASP.NET Core, Clean Architecture, CQRS + MediatR, Entity Framework Core — the Microsoft enterprise stack and what it earns over the JAMstack.",
  },
  {
    slug: "architecture",
    name: "Architecture",
    description:
      "Decisions about boundaries, layers, and stack choice — and the second-order costs nobody mentions until they bite.",
  },
  {
    slug: "python",
    name: "Python",
    description:
      "Data work, scrapers, and CLI tools where the stdlib still earns its place over a fresh dependency.",
  },
  {
    slug: "nodejs",
    name: "Node.js",
    description:
      "Backend Node and CLI scripts — Playwright, automation, and the edges where TypeScript ends and the runtime begins.",
  },
  {
    slug: "playwright",
    name: "Playwright",
    description:
      "Browser automation for testing and scraping — what survives when sites are JS-rendered and Cloudflare-fronted.",
  },
];

async function main() {
  const client = getCliClient();

  const existing = await client.fetch<{ slug: string; _id: string }[]>(
    `*[_type == "tag"]{ "slug": slug.current, _id }`,
  );
  const existingSlugs = new Set(existing.map((t) => t.slug));

  let created = 0;
  let skipped = 0;

  for (const tag of tags) {
    if (existingSlugs.has(tag.slug)) {
      console.log(`  skip  ${tag.slug.padEnd(14)} (already exists)`);
      skipped += 1;
      continue;
    }
    await client.create({
      _id: `tag-${tag.slug}`,
      _type: "tag",
      name: tag.name,
      slug: { _type: "slug", current: tag.slug },
      description: tag.description,
      ...(tag.accent ? { accent: tag.accent } : {}),
    });
    console.log(`✓ created  ${tag.slug.padEnd(14)} ${tag.name}`);
    created += 1;
  }

  console.log("");
  console.log(`Done. ${created} created, ${skipped} skipped.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
