import type { PostListItem } from "@/sanity/lib/types";
import { BlogPostRow } from "./BlogPostRow";

function getYear(iso: string): number {
  return new Date(iso).getFullYear();
}

function groupByYear(posts: PostListItem[]): { year: number; posts: PostListItem[] }[] {
  const map = new Map<number, PostListItem[]>();
  for (const p of posts) {
    const y = getYear(p.publishedAt);
    const arr = map.get(y) ?? [];
    arr.push(p);
    map.set(y, arr);
  }
  return Array.from(map.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([year, posts]) => ({ year, posts }));
}

export function BlogArchive({ posts }: { posts: PostListItem[] }) {
  if (!posts.length) return null;
  const groups = groupByYear(posts);
  return (
    <div className="blog-archive">
      {groups.map(({ year, posts }) => (
        <section key={year}>
          <div className="section-head">
            <span className="lbl">{year}</span>
            <div className="rule" />
            <span className="meta">
              {posts.length} issue{posts.length === 1 ? "" : "s"}
            </span>
          </div>
          <div>
            {posts.map((p) => (
              <BlogPostRow key={p._id} post={p} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
