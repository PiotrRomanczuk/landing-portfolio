import Link from "next/link";
import type { TagWithCount } from "@/sanity/lib/types";

export function TagChips({
  tags,
  activeSlug,
}: {
  tags: TagWithCount[];
  activeSlug?: string;
}) {
  if (!tags.length) return null;
  return (
    <div className="v5-chips" role="navigation" aria-label="Tags">
      <Link
        href="/blog"
        className={`v5-chip ${activeSlug ? "" : "is-active"}`}
      >
        All
      </Link>
      {tags.map((tag) => {
        const isActive = activeSlug === tag.slug;
        return (
          <Link
            key={tag._id}
            href={`/blog/tag/${tag.slug}`}
            className={`v5-chip ${isActive ? "is-active" : ""}`}
            style={
              isActive && tag.accent
                ? ({ background: tag.accent, borderColor: tag.accent } as React.CSSProperties)
                : undefined
            }
          >
            <span>{tag.name}</span>
            <span className="count">{tag.postCount}</span>
          </Link>
        );
      })}
    </div>
  );
}
