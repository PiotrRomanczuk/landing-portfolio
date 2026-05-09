import { z } from "zod";

const slugRule = z
  .string()
  .min(3)
  .max(96)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "slug must be kebab-case (lowercase letters, digits, hyphens)",
  );

export const sectionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("p"), text: z.string().min(1) }),
  z.object({ type: z.literal("h2"), text: z.string().min(1) }),
  z.object({ type: z.literal("h3"), text: z.string().min(1) }),
  z.object({
    type: z.literal("code"),
    language: z.string().min(1).max(20),
    code: z.string().min(1),
    filename: z.string().max(80).optional(),
  }),
  z.object({
    type: z.literal("callout"),
    tone: z.enum(["note", "warning", "tip"]),
    text: z.string().min(1),
  }),
  z.object({
    type: z.literal("pullQuote"),
    text: z.string().min(1).max(400),
    attribution: z.string().max(120).optional(),
  }),
]);

export type Section = z.infer<typeof sectionSchema>;

export const createDraftInput = z.object({
  title: z.string().min(5).max(120),
  slug: slugRule,
  excerpt: z.string().min(40).max(220),
  publishedAt: z
    .string()
    .datetime()
    .optional()
    .describe("ISO 8601. Defaults to current time."),
  body: z
    .array(sectionSchema)
    .min(5, "Body must have at least 5 sections — drafts shorter than this almost always read like AI slop.")
    .max(60),
  tags: z
    .array(z.string())
    .min(1)
    .max(5)
    .describe("Tag slugs (e.g. 'nextjs', 'dotnet'). Must exist in Sanity — call blog_list_tags first."),
});

export type CreateDraftInput = z.infer<typeof createDraftInput>;

export const updateDraftInput = z.object({
  slug: slugRule,
  title: z.string().min(5).max(120).optional(),
  excerpt: z.string().min(40).max(220).optional(),
  publishedAt: z.string().datetime().optional(),
  body: z.array(sectionSchema).min(5).max(60).optional(),
  tags: z.array(z.string()).min(1).max(5).optional(),
});

export type UpdateDraftInput = z.infer<typeof updateDraftInput>;

export const getPostInput = z.object({ slug: slugRule });

export const validateBodyShape = (sections: Section[]): string | null => {
  const hasH2 = sections.some((s) => s.type === "h2");
  const paraCount = sections.filter((s) => s.type === "p").length;
  if (!hasH2)
    return "Body must contain at least one h2 heading — readers need section anchors.";
  if (paraCount < 3)
    return "Body must contain at least 3 prose paragraphs — short posts of mostly code/callouts read as fragments, not posts.";
  return null;
};
