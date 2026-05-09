import { defineField, defineType } from "sanity";

export const pullQuote = defineType({
  name: "pullQuote",
  title: "Pull quote",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Quote",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "attribution",
      title: "Attribution",
      type: "string",
      description: "Optional. e.g. 'Stripe engineering blog, 2024'.",
    }),
  ],
  preview: {
    select: { text: "text", attribution: "attribution" },
    prepare: ({ text, attribution }) => ({
      title: text?.slice(0, 80),
      subtitle: attribution,
    }),
  },
});
