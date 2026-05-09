import { defineField, defineType } from "sanity";

export const tag = defineType({
  name: "tag",
  title: "Tag",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Display name",
      type: "string",
      description: "Shown on chips and tag pages (e.g. '.NET', 'Next.js').",
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 40 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description:
        "Lede on /blog/tag/[slug] and the meta description for that page.",
      validation: (rule) => rule.required().min(20).max(280),
    }),
    defineField({
      name: "accent",
      title: "Accent color",
      type: "string",
      description:
        "Optional CSS color override for chips of this tag (defaults to v5 rust).",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "description" },
  },
});
