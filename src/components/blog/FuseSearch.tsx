"use client";

import Fuse from "fuse.js";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { PostListItem } from "@/sanity/lib/types";
import { formatDateShort } from "@/lib/blog";

export function FuseSearch({ posts }: { posts: PostListItem[] }) {
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
        includeScore: false,
      }),
    [posts],
  );

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    return fuse.search(q).slice(0, 8).map((r) => r.item);
  }, [query, fuse]);

  return (
    <div style={{ position: "relative" }}>
      <input
        type="search"
        className="v5-search"
        placeholder="Search posts"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search posts"
      />
      {results.length > 0 ? (
        <ul
          role="listbox"
          aria-label="Search results"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            right: 0,
            minWidth: 320,
            zIndex: 10,
            background: "var(--v5-paper)",
            border: "1px solid var(--v5-rule-2)",
            borderRadius: 2,
            listStyle: "none",
            margin: 0,
            padding: 6,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          {results.map((post) => (
            <li key={post._id}>
              <Link
                href={`/blog/${post.slug}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px 1fr",
                  gap: 12,
                  padding: "8px 10px",
                  textDecoration: "none",
                  color: "var(--v5-ink)",
                  borderBottom: "1px dashed var(--v5-rule)",
                }}
                onClick={() => setQuery("")}
              >
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains), monospace",
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--v5-muted)",
                  }}
                >
                  {formatDateShort(post.publishedAt)}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-newsreader), serif",
                    fontSize: 15,
                    lineHeight: 1.3,
                  }}
                >
                  {post.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
