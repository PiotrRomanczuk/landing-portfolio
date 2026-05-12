"use client";

import Fuse from "fuse.js";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { PostListItem } from "@/sanity/lib/types";

function fmt(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function BlogSearch({ posts }: { posts: PostListItem[] }) {
  const [query, setQuery] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: [
          { name: "title", weight: 0.5 },
          { name: "excerpt", weight: 0.3 },
          { name: "tags.name", weight: 0.2 },
        ],
        threshold: 0.35,
      }),
    [posts],
  );

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    return fuse.search(q).slice(0, 8).map((r) => r.item);
  }, [query, fuse]);

  return (
    <div className="blog-search">
      <input
        type="search"
        placeholder="Search posts…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search posts"
      />
      {results.length > 0 ? (
        <ul role="listbox" aria-label="Search results">
          {results.map((p) => (
            <li key={p._id}>
              <Link href={`/blog/${p.slug}`} onClick={() => setQuery("")}>
                <span className="date">{fmt(p.publishedAt)}</span>
                <span className="title">{p.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
