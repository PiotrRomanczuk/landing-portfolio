import { ImageResponse } from "next/og";
import { client } from "@/sanity/lib/client";
import { isSanityConfigured } from "@/sanity/lib/env";
import { postBySlugQuery } from "@/sanity/lib/queries";
import type { Post } from "@/sanity/lib/types";
import { formatDate } from "@/lib/blog";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "Piotr Romanczuk — Writing Desk";

async function loadFont(family: string, weight: number, italic = false) {
  const ital = italic ? "1" : "0";
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      family,
    )}:ital,wght@${ital},${weight}&display=swap`,
    { headers: { "User-Agent": "Mozilla/5.0" } },
  ).then((r) => r.text());
  const url = css.match(/src: url\((.+?)\) format/)?.[1];
  if (!url) throw new Error(`Font URL not found for ${family}`);
  return fetch(url).then((r) => r.arrayBuffer());
}

export default async function PostOG({ params }: { params: { slug: string } }) {
  let post: Post | null = null;
  if (isSanityConfigured) {
    post = await client.fetch<Post | null>(postBySlugQuery, {
      slug: params.slug,
    });
  }

  const title = post?.title ?? "The Writing Desk";
  const date = post?.publishedAt ? formatDate(post.publishedAt) : "";
  const tags = post?.tags?.map((t) => t.name).join(" · ") ?? "";

  const [newsreaderRegular, newsreaderItalic, jetbrains] = await Promise.all([
    loadFont("Newsreader", 500),
    loadFont("Newsreader", 500, true),
    loadFont("JetBrains+Mono", 500),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#f6f2ea",
          padding: "64px 72px",
          fontFamily: "Newsreader",
          color: "#16130f",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "JetBrains Mono",
            fontSize: 16,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#7a7065",
            paddingBottom: 18,
            borderBottom: "2px solid #16130f",
          }}
        >
          <span>The Writing Desk · Piotr Romanczuk</span>
          <span>{date}</span>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            paddingTop: 32,
          }}
        >
          <div
            style={{
              fontSize: 84,
              lineHeight: 0.98,
              letterSpacing: -2,
              fontStyle: "italic",
              fontWeight: 500,
              color: "#16130f",
              maxWidth: 1000,
              display: "flex",
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            paddingTop: 18,
            borderTop: "1px solid #d6cfc1",
          }}
        >
          <div
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: 16,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#7a7065",
            }}
          >
            {tags}
          </div>
          <div
            style={{
              width: 120,
              height: 4,
              background: "#a8421f",
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Newsreader", data: newsreaderRegular, weight: 500 },
        {
          name: "Newsreader",
          data: newsreaderItalic,
          weight: 500,
          style: "italic",
        },
        { name: "JetBrains Mono", data: jetbrains, weight: 500 },
      ],
    },
  );
}
