import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { isSanityConfigured } from "@/sanity/lib/env";
import {
  allTagSlugsQuery,
  allTagsQuery,
  postsByTagQuery,
  tagBySlugQuery,
} from "@/sanity/lib/queries";
import type { PostListItem, Tag, TagWithCount } from "@/sanity/lib/types";
import { ArchiveRow } from "@/components/blog/ArchiveRow";
import { TagChips } from "@/components/blog/TagChips";
import { groupByYear } from "@/lib/blog";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  if (!isSanityConfigured) return [];
  const slugs = await client.fetch<string[]>(allTagSlugsQuery);
  return slugs.map((slug) => ({ slug }));
}

async function getData(slug: string) {
  if (!isSanityConfigured) {
    return { tag: null, posts: [] as PostListItem[], allTags: [] as TagWithCount[] };
  }
  const [tag, posts, allTags] = await Promise.all([
    client.fetch<Tag | null>(tagBySlugQuery, { slug }),
    client.fetch<PostListItem[]>(postsByTagQuery, { tagSlug: slug }, {
      next: { tags: [`tag:${slug}`] },
    }),
    client.fetch<TagWithCount[]>(allTagsQuery, {}, { next: { tags: ["tags"] } }),
  ]);
  return { tag, posts, allTags };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { tag } = await getData(slug);
  if (!tag) return { title: "Not found" };
  return {
    title: `${tag.name} · The Writing Desk`,
    description: tag.description,
    alternates: { canonical: `/blog/tag/${slug}` },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const { tag, posts, allTags } = await getData(slug);
  if (!tag) notFound();

  const byYear = groupByYear(posts);

  return (
    <>
      <section className="v5-tag-head">
        <div className="eyebrow">Tag · The Writing Desk</div>
        <h1>
          <em>{tag.name}</em>
        </h1>
        <p className="desc">{tag.description}</p>
      </section>

      <div className="v5-writing-tools">
        <TagChips
          tags={allTags.filter((t) => t.postCount > 0)}
          activeSlug={slug}
        />
      </div>

      {posts.length === 0 ? (
        <div className="v5-empty">
          <b>No posts</b> filed under {tag.name} yet.
        </div>
      ) : (
        <section className="v5-archive" aria-label={`Posts tagged ${tag.name}`}>
          {byYear.map(({ year, posts: yearPosts }) => (
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
      )}
    </>
  );
}
