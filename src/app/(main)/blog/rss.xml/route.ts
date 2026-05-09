import { client } from "@/sanity/lib/client";
import { isSanityConfigured } from "@/sanity/lib/env";
import { allPostsQuery } from "@/sanity/lib/queries";
import type { PostListItem } from "@/sanity/lib/types";

const BASE_URL = "https://romanczuk.vercel.app";
const TITLE = "The Writing Desk — Piotr Romanczuk";
const SUBTITLE =
  "Engineering writeups on shipping production software — Next.js + Supabase, .NET + Clean Architecture, Python + Node tooling.";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const revalidate = 3600;

export async function GET() {
  let posts: PostListItem[] = [];
  if (isSanityConfigured) {
    posts = await client
      .fetch<PostListItem[]>(allPostsQuery)
      .catch(() => []);
  }

  const updated =
    posts[0]?._updatedAt ?? new Date().toISOString();

  const entries = posts
    .map((post) => {
      const url = `${BASE_URL}/blog/${post.slug}`;
      const tags = post.tags
        ?.map((t) => `<category term="${escapeXml(t.name)}"/>`)
        .join("") ?? "";
      return `<entry>
  <title>${escapeXml(post.title)}</title>
  <id>${url}</id>
  <link href="${url}"/>
  <updated>${new Date(post._updatedAt).toISOString()}</updated>
  <published>${new Date(post.publishedAt).toISOString()}</published>
  <author><name>Piotr Romanczuk</name></author>
  <summary>${escapeXml(post.excerpt)}</summary>
  ${tags}
</entry>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(TITLE)}</title>
  <subtitle>${escapeXml(SUBTITLE)}</subtitle>
  <id>${BASE_URL}/blog</id>
  <link href="${BASE_URL}/blog"/>
  <link rel="self" href="${BASE_URL}/blog/rss.xml"/>
  <updated>${new Date(updated).toISOString()}</updated>
  <author><name>Piotr Romanczuk</name></author>
${entries}
</feed>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
