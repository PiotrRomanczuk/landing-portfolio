import { client } from "@/sanity/lib/client";
import { isSanityConfigured } from "@/sanity/lib/env";
import { latestPostsQuery } from "@/sanity/lib/queries";
import type { PostListItem } from "@/sanity/lib/types";
import V5DLanding, {
  type WritingEntry,
} from "@/components/v5d/V5DLanding";
import { getGithubActivity } from "@/lib/data/github-activity";

export const revalidate = 3600;

function toEntry(post: PostListItem): WritingEntry {
  const d = new Date(post.publishedAt);
  const date = d.toLocaleDateString("en-US", { month: "short" }) +
    " · " + d.getFullYear();
  const kind = post.tags?.[0]?.name?.toLowerCase() ?? "";
  const minutes = Math.max(1, post.readingMinutes ?? 0);
  return {
    date,
    title: post.title,
    kind,
    minutes,
    state: "live",
    href: `/blog/${post.slug}`,
  };
}

async function getPosts(): Promise<WritingEntry[]> {
  if (!isSanityConfigured) return [];
  try {
    const posts = await client.fetch<PostListItem[]>(
      latestPostsQuery,
      { limit: 5 },
      { next: { tags: ["posts"] } },
    );
    return posts.map(toEntry);
  } catch (err) {
    console.warn(`[landing] Sanity posts fetch failed: ${String(err)}`);
    return [];
  }
}

export default async function Page() {
  const [posts, activity] = await Promise.all([getPosts(), getGithubActivity()]);
  const stamp = new Date()
    .toLocaleDateString("en-US", { month: "short", year: "numeric" })
    .toLowerCase();
  return <V5DLanding posts={posts} activity={activity} stamp={stamp} />;
}
