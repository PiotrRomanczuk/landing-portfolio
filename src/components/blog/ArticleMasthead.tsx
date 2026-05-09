import Link from "next/link";
import type { Post } from "@/sanity/lib/types";
import { formatDate } from "@/lib/blog";

export function ArticleMasthead({
  post,
  readingMinutes,
}: {
  post: Post;
  readingMinutes: number;
}) {
  const published = new Date(post.publishedAt).getTime();
  const updated = new Date(post._updatedAt).getTime();
  const wasRevised = updated - published > 24 * 60 * 60 * 1000;

  return (
    <header className="v5-article-head">
      <div className="v5-article-kicker">
        <span>{formatDate(post.publishedAt)}</span>
        {post.tags?.length ? (
          <>
            <span className="sep">·</span>
            <span>
              {post.tags.map((tag, i) => (
                <span key={tag._id}>
                  {i > 0 ? " · " : null}
                  <Link href={`/blog/tag/${tag.slug}`}>{tag.name}</Link>
                </span>
              ))}
            </span>
          </>
        ) : null}
        <span className="sep">·</span>
        <span>{readingMinutes} min read</span>
        {wasRevised ? (
          <>
            <span className="sep">·</span>
            <span className="revised">
              Revised {formatDate(post._updatedAt)}
            </span>
          </>
        ) : null}
      </div>
      <h1 className="v5-article-title">{post.title}</h1>
      <p className="v5-article-dek">{post.excerpt}</p>
    </header>
  );
}
