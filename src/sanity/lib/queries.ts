import { groq } from "next-sanity";

const postFields = `
  _id,
  _updatedAt,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  coverImage,
  "tags": tags[]->{ _id, name, "slug": slug.current, accent }
`;

export const latestPostsQuery = groq`
  *[_type == "post" && defined(publishedAt) && publishedAt <= now()]
    | order(publishedAt desc)[0...$limit] {
    ${postFields}
  }
`;

export const allPostsQuery = groq`
  *[_type == "post" && defined(publishedAt) && publishedAt <= now()]
    | order(publishedAt desc) {
    ${postFields}
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    ${postFields},
    seo,
    body[]{
      ...,
      _type == "inlineImage" => { ..., asset-> },
      markDefs[]{ ... }
    }
  }
`;

export const postsByTagQuery = groq`
  *[_type == "post" && defined(publishedAt) && publishedAt <= now()
    && $tagSlug in tags[]->slug.current]
    | order(publishedAt desc) {
    ${postFields}
  }
`;

export const tagBySlugQuery = groq`
  *[_type == "tag" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    description,
    accent
  }
`;

export const allTagsQuery = groq`
  *[_type == "tag"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    accent,
    "postCount": count(*[_type == "post" && references(^._id)
      && defined(publishedAt) && publishedAt <= now()])
  }
`;

export const allPostSlugsQuery = groq`
  *[_type == "post" && defined(publishedAt) && publishedAt <= now()][].slug.current
`;

export const allTagSlugsQuery = groq`
  *[_type == "tag"][].slug.current
`;

export const sitemapQuery = groq`
  {
    "posts": *[_type == "post" && defined(publishedAt) && publishedAt <= now()]{
      "slug": slug.current,
      _updatedAt
    },
    "tags": *[_type == "tag"]{
      "slug": slug.current,
      _updatedAt
    }
  }
`;
