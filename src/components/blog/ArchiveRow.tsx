import Link from "next/link";
import type { PostListItem } from "@/sanity/lib/types";
import { formatDateShort } from "@/lib/blog";

export function ArchiveRow({ post }: { post: PostListItem }) {
  return (
    <Link href={`/blog/${post.slug}`} className="v5-row">
      <span className="row-date">{formatDateShort(post.publishedAt)}</span>
      <span className="row-title">{post.title}</span>
      <span className="row-tags">
        {post.tags?.map((t) => t.name).join(" · ")}
      </span>
    </Link>
  );
}
