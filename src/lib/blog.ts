import type { PortableTextBlock } from "@portabletext/types";

const WORDS_PER_MINUTE = 200;

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function getYear(iso: string): number {
  return new Date(iso).getFullYear();
}

export function readingTime(blocks: PortableTextBlock[] | undefined): number {
  if (!blocks?.length) return 1;
  const text = blocks
    .map((block) => {
      if (block._type === "block") {
        const b = block as { children?: ReadonlyArray<{ text?: string }> };
        return b.children?.map((c) => c.text ?? "").join(" ") ?? "";
      }
      if (block._type === "codeBlock") {
        return (block as { code?: string }).code ?? "";
      }
      return "";
    })
    .join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function groupByYear<T extends { publishedAt: string }>(
  posts: T[],
): Array<{ year: number; posts: T[] }> {
  const groups = new Map<number, T[]>();
  for (const post of posts) {
    if (!post.publishedAt) continue;
    const year = getYear(post.publishedAt);
    const existing = groups.get(year);
    if (existing) {
      existing.push(post);
    } else {
      groups.set(year, [post]);
    }
  }
  return [...groups.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, posts]) => ({ year, posts }));
}
