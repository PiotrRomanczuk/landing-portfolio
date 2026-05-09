import { defineArrayMember, defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Post",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "meta", title: "Meta" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      group: "content",
      description:
        "~160 chars. Shown on the listing card and used as the default <meta description>.",
      validation: (rule) => rule.required().min(40).max(220),
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) =>
            rule.required().error("Alt text is required for accessibility."),
        }),
      ],
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Code", value: "code" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    validation: (rule) =>
                      rule.uri({ scheme: ["http", "https", "mailto"] }),
                  },
                ],
              },
            ],
          },
        }),
        defineArrayMember({ type: "codeBlock" }),
        defineArrayMember({ type: "inlineImage" }),
        defineArrayMember({ type: "callout" }),
        defineArrayMember({ type: "pullQuote" }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      group: "meta",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "meta",
      of: [defineArrayMember({ type: "reference", to: [{ type: "tag" }] })],
      validation: (rule) => rule.required().min(1).max(5),
    }),
    defineField({
      name: "seo",
      title: "SEO overrides",
      type: "object",
      group: "seo",
      description:
        "Optional. Defaults to title + excerpt. Override only when needed.",
      fields: [
        { name: "title", type: "string", title: "Title override" },
        { name: "description", type: "text", rows: 2, title: "Description override" },
      ],
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "newest",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "excerpt",
      media: "coverImage",
      publishedAt: "publishedAt",
    },
    prepare: ({ title, subtitle, media, publishedAt }) => ({
      title,
      subtitle: publishedAt
        ? `${new Date(publishedAt).toISOString().slice(0, 10)} · ${subtitle?.slice(0, 80) ?? ""}`
        : subtitle,
      media,
    }),
  },
});
