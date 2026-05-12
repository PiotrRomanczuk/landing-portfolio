import Link from "next/link";
import type { TagWithCount } from "@/sanity/lib/types";

export function BlogTagPills({
  tags,
  activeSlug,
}: {
  tags: TagWithCount[];
  activeSlug?: string;
}) {
  if (!tags.length) return null;
  return (
    <div className="filters" role="navigation" aria-label="Tags">
      <Link href="/blog" className={`pill${activeSlug ? "" : " on"}`}>
        all
      </Link>
      {tags.map((tag) => {
        const isActive = activeSlug === tag.slug;
        return (
          <Link
            key={tag._id}
            href={`/blog/tag/${tag.slug}`}
            className={`pill${isActive ? " on" : ""}`}
          >
            <span>{tag.name}</span>
            <span className="rt" style={{ marginLeft: 4 }}>
              {tag.postCount}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
