import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import type { SanityImageRef } from "@/sanity/lib/types";

type CodeBlock = {
  _type: "codeBlock";
  language?: string;
  filename?: string;
  code: string;
};

type CalloutBlock = {
  _type: "callout";
  tone: "note" | "warning" | "tip";
  body: PortableTextBlock[];
};

type PullQuoteBlock = {
  _type: "pullQuote";
  text: string;
  attribution?: string;
};

type InlineImageBlock = Omit<SanityImageRef, "_type"> & {
  _type: "inlineImage";
  caption?: string;
};

function makeComponents(): PortableTextComponents {
  let figureCounter = 0;

  return {
    block: {
      normal: ({ children }) => <p>{children}</p>,
      h2: ({ children }) => <h2>{children}</h2>,
      h3: ({ children }) => <h3>{children}</h3>,
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
        const block = value as InlineImageBlock;
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
        const block = value as CalloutBlock;
        return (
          <aside className={`v5-callout ${block.tone}`}>
            <span className="v5-callout-tone">{block.tone}</span>
            <PortableText
              value={block.body}
              components={{ block: { normal: ({ children }) => <p>{children}</p> } }}
            />
          </aside>
        );
      },
      pullQuote: ({ value }) => {
        const block = value as PullQuoteBlock;
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
  return (
    <div className="v5-prose">
      <PortableText value={value} components={makeComponents()} />
    </div>
  );
}
