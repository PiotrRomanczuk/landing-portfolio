import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { isSanityConfigured } from "@/sanity/lib/env";
import {
  allPostSlugsQuery,
  postBySlugQuery,
} from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/image";
import type { Post } from "@/sanity/lib/types";
import { ArticleMasthead } from "@/components/blog/ArticleMasthead";
import { BlogPortableText } from "@/components/blog/PortableText";
import { extractToc, readingTime } from "@/lib/blog";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  if (!isSanityConfigured) return [];
  const slugs = await client.fetch<string[]>(allPostSlugsQuery);
  return slugs.map((slug) => ({ slug }));
}

async function getPost(slug: string): Promise<Post | null> {
  if (!isSanityConfigured) return null;
  return client.fetch<Post | null>(
    postBySlugQuery,
    { slug },
    { next: { tags: [`post:${slug}`] } },
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Not found" };
  const title = post.seo?.title ?? `${post.title} · Piotr Romanczuk`;
  const description = post.seo?.description ?? post.excerpt;
  return {
    title,
    description,
    openGraph: { title, description, type: "article" },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `/blog/${slug}` },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const minutes = readingTime(post.body);
  const toc = extractToc(post.body);
  const coverUrl = urlForImage(post.coverImage)?.width(1600).url();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.publishedAt,
    dateModified: post._updatedAt,
    description: post.excerpt,
    author: { "@type": "Person", name: "Piotr Romanczuk" },
    image: coverUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://romanczuk.vercel.app/blog/${post.slug}`,
    },
  };

  return (
    <article className="v5-article">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleMasthead post={post} readingMinutes={minutes} />

      {coverUrl ? (
        <figure className="v5-article-cover">
          <Image
            src={coverUrl}
            alt={post.coverImage?.alt ?? post.title}
            width={1600}
            height={900}
            priority
            sizes="(min-width:1240px) 1180px, 100vw"
          />
        </figure>
      ) : null}

      <div className="v5-article-grid">
        <aside className="v5-article-margin" aria-label="Marginalia">
          {toc.length > 1 ? (
            <div>
              <h4>Sections</h4>
              <ol className="v5-article-toc">
                {toc.map((item, i) => (
                  <li key={item.slug}>
                    <span className="num">{String(i + 1).padStart(2, "0")}</span>
                    <a href={`#${item.slug}`}>{item.text}</a>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
          <div>
            <h4>Filed under</h4>
            <div>
              {post.tags?.map((t, i) => (
                <span key={t._id}>
                  {i > 0 ? " · " : null}
                  <Link href={`/blog/tag/${t.slug}`}>{t.name}</Link>
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4>Read</h4>
            <div>{minutes} min</div>
          </div>
        </aside>
        <div>
          <BlogPortableText value={post.body} />
        </div>
      </div>
    </article>
  );
}
