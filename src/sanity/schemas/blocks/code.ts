import { defineField, defineType } from "sanity";

export const codeBlock = defineType({
  name: "codeBlock",
  title: "Code",
  type: "object",
  fields: [
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      description: "Shown as a corner tag on the figure (e.g. ts, py, sql).",
    }),
    defineField({
      name: "filename",
      title: "Filename",
      type: "string",
      description: "Optional caption below the figure.",
    }),
    defineField({
      name: "code",
      title: "Code",
      type: "text",
      rows: 12,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { language: "language", code: "code", filename: "filename" },
    prepare: ({ language, code, filename }) => ({
      title: filename || `<${language || "code"}>`,
      subtitle: code?.split("\n")[0]?.slice(0, 60),
    }),
  },
});
