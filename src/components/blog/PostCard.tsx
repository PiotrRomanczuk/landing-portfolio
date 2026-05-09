import Link from "next/link";
import type { PostListItem } from "@/sanity/lib/types";
import { formatDate } from "@/lib/blog";

export function PostCard({
  post,
  index,
}: {
  post: PostListItem;
  index: number;
}) {
  const num = String(index + 1).padStart(2, "0");
  return (
    <article className="v5-front-item">
      <div className="num">
        {num}
        <small>Issue</small>
      </div>
      <div className="body">
        <div className="kicker">
          <span>{formatDate(post.publishedAt)}</span>
          {post.tags?.length ? (
            <>
              <span className="sep">·</span>
              <span>{post.tags.map((t) => t.name).join(" · ")}</span>
            </>
          ) : null}
        </div>
        <h3>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="dek">{post.excerpt}</p>
      </div>
    </article>
  );
}
