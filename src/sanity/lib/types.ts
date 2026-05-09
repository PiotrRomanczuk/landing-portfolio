import type { PortableTextBlock } from "@portabletext/types";

export type SanityImageRef = {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  alt?: string;
};

export type TagRef = {
  _id: string;
  name: string;
  slug: string;
  accent?: string;
};

export type TagWithCount = TagRef & { postCount: number };

export type PostListItem = {
  _id: string;
  _updatedAt: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  coverImage?: SanityImageRef;
  tags: TagRef[];
};

export type Post = PostListItem & {
  body: PortableTextBlock[];
  seo?: { title?: string; description?: string };
};

export type Tag = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  accent?: string;
};
