import Link from "next/link";
import type { PostListItem } from "@/sanity/lib/types";

function fmt(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function BlogPostRow({ post }: { post: PostListItem }) {
  const minutes = post.readingMinutes ?? 0;
  return (
    <Link className="write-row" href={`/blog/${post.slug}`}>
      <span className="date">{fmt(post.publishedAt)}</span>
      <div className="ttl">
        {post.title}
        {post.tags?.length ? (
          <span className="kind">
            · {post.tags.map((t) => t.name).join(" · ")}
          </span>
        ) : null}
      </div>
      <div className="write-meta">
        {minutes > 0 ? <span className="rt">{minutes} min</span> : null}
        <span className="arr">↗</span>
      </div>
    </Link>
  );
}
