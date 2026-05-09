import { defineField, defineType } from "sanity";

export const inlineImage = defineType({
  name: "inlineImage",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      validation: (rule) =>
        rule.required().error("Alt text is required for accessibility."),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description:
        "Optional. Auto-numbered as FIG. N · {caption} below the plate.",
    }),
  ],
  preview: {
    select: { alt: "alt", caption: "caption", media: "asset" },
    prepare: ({ alt, caption, media }) => ({
      title: caption || alt,
      subtitle: caption ? alt : undefined,
      media,
    }),
  },
});
