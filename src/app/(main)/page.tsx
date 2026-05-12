import { client } from "@/sanity/lib/client";
import { isSanityConfigured } from "@/sanity/lib/env";
import { latestPostsQuery } from "@/sanity/lib/queries";
import type { PostListItem } from "@/sanity/lib/types";
import V5DLanding, {
  type WritingEntry,
} from "@/components/v5d/V5DLanding";

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
  } catch {
    return [];
  }
}

export default async function Page() {
  const posts = await getPosts();
  return <V5DLanding posts={posts} />;
}
