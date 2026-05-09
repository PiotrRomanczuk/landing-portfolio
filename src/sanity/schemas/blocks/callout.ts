import { defineField, defineType } from "sanity";

export const callout = defineType({
  name: "callout",
  title: "Callout",
  type: "object",
  fields: [
    defineField({
      name: "tone",
      title: "Tone",
      type: "string",
      options: {
        list: [
          { title: "Note", value: "note" },
          { title: "Warning", value: "warning" },
          { title: "Tip", value: "tip" },
        ],
        layout: "radio",
      },
      initialValue: "note",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block", styles: [{ title: "Normal", value: "normal" }] }],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { tone: "tone", body: "body" },
    prepare: ({ tone, body }) => {
      const first = body?.[0]?.children?.[0]?.text || "";
      return { title: tone?.toUpperCase(), subtitle: first.slice(0, 80) };
    },
  },
});
