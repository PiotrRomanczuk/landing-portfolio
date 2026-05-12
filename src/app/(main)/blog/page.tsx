import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { isSanityConfigured } from "@/sanity/lib/env";
import {
  allPostsQuery,
  allTagsQuery,
} from "@/sanity/lib/queries";
import type { PostListItem, TagWithCount } from "@/sanity/lib/types";
import { BlogShell } from "@/components/v5d/blog/BlogShell";
import { BlogTagPills } from "@/components/v5d/blog/BlogTagPills";
import { BlogSearch } from "@/components/v5d/blog/BlogSearch";
import { BlogArchive } from "@/components/v5d/blog/BlogArchive";

export const metadata: Metadata = {
  title: "The Writing Desk · Piotr Romanczuk",
  description:
    "Engineering writeups on shipping production software — Next.js + Supabase, .NET + Clean Architecture, Python + Node tooling.",
};

export const revalidate = 3600;

async function getData() {
  if (!isSanityConfigured) {
    return { posts: [] as PostListItem[], tags: [] as TagWithCount[] };
  }
  const [posts, tags] = await Promise.all([
    client.fetch<PostListItem[]>(allPostsQuery, {}, { next: { tags: ["posts"] } }),
    client.fetch<TagWithCount[]>(allTagsQuery, {}, { next: { tags: ["tags"] } }),
  ]);
  return { posts, tags };
}

export default async function BlogIndex() {
  const { posts, tags } = await getData();

  return (
    <BlogShell
      eyebrow="§ writing · archive"
      title="The Writing Desk"
      meta={
        posts.length > 0
          ? `${posts.length} issue${posts.length === 1 ? "" : "s"} · infrequent, honest`
          : "infrequent, honest"
      }
    >
      {posts.length === 0 ? (
        <div className="blog-empty">
          {isSanityConfigured ? (
            <>
              <b>No posts yet.</b> First issue on press soon.
            </>
          ) : (
            <>
              <b>Sanity not configured.</b> Set{" "}
              <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> in <code>.env.local</code>.
            </>
          )}
        </div>
      ) : (
        <>
          <div className="blog-tools">
            <BlogTagPills tags={tags.filter((t) => t.postCount > 0)} />
            <BlogSearch posts={posts} />
          </div>
          <BlogArchive posts={posts} />
        </>
      )}
    </BlogShell>
  );
}
