import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import type {
  Callout,
  CodeBlock,
  InlineImage,
  PullQuote,
} from "@/sanity/lib/types";
import { slugify } from "@/lib/blog";

function headingText(value: unknown): string {
  const block = value as { children?: ReadonlyArray<{ text?: string }> };
  return block.children?.map((c) => c.text ?? "").join("").trim() ?? "";
}

function makeComponents(): PortableTextComponents {
  let figureCounter = 0;

  return {
    block: {
      normal: ({ children }) => <p>{children}</p>,
      h2: ({ children, value }) => (
        <h2 id={slugify(headingText(value))}>{children}</h2>
      ),
      h3: ({ children, value }) => (
        <h3 id={slugify(headingText(value))}>{children}</h3>
      ),
      blockquote: ({ children }) => <blockquote>{children}</blockquote>,
    },
    marks: {
      strong: ({ children }) => <strong>{children}</strong>,
      em: ({ children }) => <em>{children}</em>,
      code: ({ children }) => <code>{children}</code>,
      link: ({ value, children }) => {
        const href = (value as { href?: string })?.href ?? "#";
        const isExternal = href.startsWith("http");
        return (
          <a
            href={href}
            {...(isExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {children}
          </a>
        );
      },
    },
    types: {
      codeBlock: ({ value }) => {
        const block = value as CodeBlock;
        return (
          <div>
            <figure className="v5-figure-code">
              {block.language ? (
                <span className="lang">{block.language}</span>
              ) : null}
              <pre>
                <code>{block.code}</code>
              </pre>
            </figure>
            {block.filename ? (
              <div className="v5-figure-code-caption">{block.filename}</div>
            ) : null}
          </div>
        );
      },
      inlineImage: ({ value }) => {
        const block = value as InlineImage;
        figureCounter += 1;
        const url = urlForImage(block)?.width(1600).url();
        return (
          <div>
            <figure className="v5-figure-image">
              {url ? (
                <Image
                  src={url}
                  alt={block.alt ?? ""}
                  width={1600}
                  height={900}
                  sizes="(min-width:960px) 760px, 100vw"
                />
              ) : null}
            </figure>
            <div className="v5-figure-image-caption">
              <b>FIG. {figureCounter}</b>
              {block.caption ?? block.alt}
            </div>
          </div>
        );
      },
      callout: ({ value }) => {
        const block = value as Callout;
        return (
          <aside className={`v5-callout ${block.tone}`}>
            <span className="v5-callout-tone">{block.tone}</span>
            {block.body ? (
              <PortableText
                value={block.body as PortableTextBlock[]}
                components={{
                  block: { normal: ({ children }) => <p>{children}</p> },
                }}
              />
            ) : null}
          </aside>
        );
      },
      pullQuote: ({ value }) => {
        const block = value as PullQuote;
        return (
          <blockquote className="v5-pullquote">
            {block.text}
            {block.attribution ? (
              <span className="v5-pullquote-attr">— {block.attribution}</span>
            ) : null}
          </blockquote>
        );
      },
    },
  };
}

export function BlogPortableText({ value }: { value: PortableTextBlock[] }) {
  if (!value?.length) return null;
  return (
    <div className="v5-prose">
      <PortableText value={value} components={makeComponents()} />
    </div>
  );
}
