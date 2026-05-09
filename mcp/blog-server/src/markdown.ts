import { randomUUID } from "node:crypto";

const k = () => randomUUID().replace(/-/g, "").slice(0, 12);

type Mark = "strong" | "em" | "code";

export type Span = {
  _type: "span";
  _key: string;
  text: string;
  marks: Mark[];
};

/**
 * Parse a single line of markdown-inline into Portable Text spans.
 *
 * Supports `**bold**`, `*italic*`, `` `code` ``. Marks do not nest.
 * Anything else (links, images, tables) is intentionally unsupported —
 * those should be expressed as separate body sections, not inline marks.
 */
export function parseInline(text: string): Span[] {
  const tokens: { text: string; mark: Mark | null }[] = [];

  // Pattern groups: `code`, **bold**, *italic*. Order matters — code is
  // greedier than emphasis (so `*foo*` inside backticks stays literal).
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIndex) {
      tokens.push({ text: text.slice(lastIndex, m.index), mark: null });
    }
    if (m[1]) {
      tokens.push({ text: m[1].slice(1, -1), mark: "code" });
    } else if (m[2]) {
      tokens.push({ text: m[2].slice(2, -2), mark: "strong" });
    } else if (m[3]) {
      tokens.push({ text: m[3].slice(1, -1), mark: "em" });
    }
    lastIndex = re.lastIndex;
  }
  if (lastIndex < text.length) {
    tokens.push({ text: text.slice(lastIndex), mark: null });
  }
  if (tokens.length === 0) {
    return [{ _type: "span", _key: k(), text, marks: [] }];
  }
  return tokens
    .filter((t) => t.text.length > 0)
    .map((t) => ({
      _type: "span" as const,
      _key: k(),
      text: t.text,
      marks: t.mark ? [t.mark] : [],
    }));
}
