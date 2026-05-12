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
import { BlogShell } from "@/components/v5d/blog/BlogShell";
import { BlogTagPills } from "@/components/v5d/blog/BlogTagPills";
import { BlogArchive } from "@/components/v5d/blog/BlogArchive";

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

  return (
    <BlogShell
      eyebrow={`§ writing · tag · ${tag.name.toLowerCase()}`}
      title={tag.name}
      meta={tag.description}
    >
      <div className="blog-tools">
        <BlogTagPills
          tags={allTags.filter((t) => t.postCount > 0)}
          activeSlug={slug}
        />
      </div>
      {posts.length === 0 ? (
        <div className="blog-empty">
          <b>No posts</b> filed under {tag.name} yet.
        </div>
      ) : (
        <BlogArchive posts={posts} />
      )}
    </BlogShell>
  );
}
