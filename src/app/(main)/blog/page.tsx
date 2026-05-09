import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { isSanityConfigured } from "@/sanity/lib/env";
import {
  allPostsQuery,
  allTagsQuery,
} from "@/sanity/lib/queries";
import type { PostListItem, TagWithCount } from "@/sanity/lib/types";
import { PostCard } from "@/components/blog/PostCard";
import { ArchiveRow } from "@/components/blog/ArchiveRow";
import { TagChips } from "@/components/blog/TagChips";
import { FuseSearch } from "@/components/blog/FuseSearch";
import { groupByYear } from "@/lib/blog";

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
    client.fetch<PostListItem[]>(
      allPostsQuery,
      {},
      { next: { tags: ["posts"] } },
    ),
    client.fetch<TagWithCount[]>(
      allTagsQuery,
      {},
      { next: { tags: ["tags"] } },
    ),
  ]);
  return { posts, tags };
}

export default async function BlogIndex() {
  const { posts, tags } = await getData();
  const front = posts.slice(0, 5);
  const archive = posts.slice(5);
  const archiveByYear = groupByYear(archive);

  return (
    <>
      <section className="v5-writing-head">
        <h2>The Writing Desk</h2>
        <div className="right">{posts.length} issues · archive</div>
      </section>

      <div className="v5-writing-tools">
        <TagChips tags={tags.filter((t) => t.postCount > 0)} />
        {posts.length > 0 ? <FuseSearch posts={posts} /> : null}
      </div>

      {posts.length === 0 ? (
        <div className="v5-empty">
          {isSanityConfigured ? (
            <>
              <b>No posts yet.</b> First issue on press soon.
            </>
          ) : (
            <>
              <b>Sanity not configured.</b> Set
              {" "}<code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> in .env.local.
            </>
          )}
        </div>
      ) : (
        <>
          <section className="v5-front" aria-label="Latest">
            {front.map((post, i) => (
              <PostCard key={post._id} post={post} index={i} />
            ))}
          </section>

          {archive.length > 0 ? (
            <section className="v5-archive" aria-label="Archive">
              <div className="v5-archive-head">Archive · all issues</div>
              {archiveByYear.map(({ year, posts: yearPosts }) => (
                <div key={year}>
                  <div className="v5-year">
                    {year} · {yearPosts.length} issue
                    {yearPosts.length === 1 ? "" : "s"}
                  </div>
                  {yearPosts.map((post) => (
                    <ArchiveRow key={post._id} post={post} />
                  ))}
                </div>
              ))}
            </section>
          ) : null}
        </>
      )}
    </>
  );
}
