import Link from "next/link";
import type { Post } from "@/sanity/lib/types";

function fmt(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogArticleHead({
  post,
  minutes,
}: {
  post: Post;
  minutes: number;
}) {
  return (
    <header className="blog-article-head">
      <div className="meta-row">
        <Link href="/blog" className="back">← back to writing</Link>
        <span className="sep">·</span>
        <time dateTime={post.publishedAt}>{fmt(post.publishedAt)}</time>
        <span className="sep">·</span>
        <span>{minutes} min read</span>
      </div>
      <h1>{post.title}</h1>
      {post.excerpt ? <p className="lede">{post.excerpt}</p> : null}
      {post.tags?.length ? (
        <div className="tags">
          {post.tags.map((t) => (
            <Link key={t._id} href={`/blog/tag/${t.slug}`} className="chip">
              {t.name}
            </Link>
          ))}
        </div>
      ) : null}
    </header>
  );
}
