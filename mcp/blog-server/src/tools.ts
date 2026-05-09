import { randomUUID } from "node:crypto";
import { parseInline } from "./markdown.js";
import { getClient } from "./sanity.js";
import {
  type CreateDraftInput,
  type Section,
  type UpdateDraftInput,
  validateBodyShape,
} from "./schema.js";

const k = () => randomUUID().replace(/-/g, "").slice(0, 12);

function sectionToBlock(section: Section) {
  switch (section.type) {
    case "p":
    case "h2":
    case "h3":
      return {
        _type: "block",
        _key: k(),
        style: section.type === "p" ? "normal" : section.type,
        markDefs: [],
        children: parseInline(section.text),
      };
    case "code":
      return {
        _type: "codeBlock",
        _key: k(),
        language: section.language,
        ...(section.filename ? { filename: section.filename } : {}),
        code: section.code,
      };
    case "callout":
      return {
        _type: "callout",
        _key: k(),
        tone: section.tone,
        body: [
          {
            _type: "block",
            _key: k(),
            style: "normal",
            markDefs: [],
            children: parseInline(section.text),
          },
        ],
      };
    case "pullQuote":
      return {
        _type: "pullQuote",
        _key: k(),
        text: section.text,
        ...(section.attribution ? { attribution: section.attribution } : {}),
      };
  }
}

export async function listTags() {
  const client = getClient();
  const tags = await client.fetch<
    { _id: string; name: string; slug: string; postCount: number }[]
  >(
    `*[_type == "tag"] | order(name asc) {
      _id,
      name,
      "slug": slug.current,
      "postCount": count(*[_type == "post" && references(^._id) && defined(publishedAt)])
    }`,
  );
  return tags;
}

export async function listDrafts() {
  const client = getClient();
  const drafts = await client.fetch<
    {
      _id: string;
      title: string;
      slug: string;
      _updatedAt: string;
    }[]
  >(
    `*[_type == "post" && _id in path("drafts.**")] | order(_updatedAt desc) {
      _id,
      title,
      "slug": slug.current,
      _updatedAt
    }`,
  );
  return drafts;
}

export async function getPost(slug: string) {
  const client = getClient();
  return client.fetch(
    `*[_type == "post" && slug.current == $slug] | order(_id desc)[0] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      _updatedAt,
      "tags": tags[]->{ name, "slug": slug.current },
      body
    }`,
    { slug },
  );
}

export async function createDraft(input: CreateDraftInput) {
  const shapeError = validateBodyShape(input.body);
  if (shapeError) throw new Error(shapeError);

  const client = getClient();

  const tagDocs = await client.fetch<{ _id: string; slug: string }[]>(
    `*[_type == "tag" && slug.current in $slugs]{ _id, "slug": slug.current }`,
    { slugs: input.tags },
  );
  const missing = input.tags.filter((s) => !tagDocs.find((t) => t.slug === s));
  if (missing.length > 0) {
    throw new Error(
      `Unknown tags: ${missing.join(", ")}. Call blog_list_tags to see what's available.`,
    );
  }

  const conflict = await client.fetch<string | null>(
    `*[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0]._id`,
    { slug: input.slug },
  );
  if (conflict) {
    throw new Error(
      `Slug "${input.slug}" already used by a published post. Pick a different slug or call blog_update_draft.`,
    );
  }

  const draftId = `drafts.post-${input.slug}`;
  const doc = {
    _id: draftId,
    _type: "post",
    title: input.title,
    slug: { _type: "slug", current: input.slug },
    excerpt: input.excerpt,
    publishedAt: input.publishedAt ?? new Date().toISOString(),
    tags: tagDocs.map((t) => ({
      _type: "reference",
      _ref: t._id,
      _key: k(),
    })),
    body: input.body.map(sectionToBlock),
  };

  await client.createOrReplace(doc);
  return {
    _id: draftId,
    slug: input.slug,
    studioUrl: `${process.env.BLOG_STUDIO_URL ?? "https://romanczuk.vercel.app/studio"}/structure/post;${draftId}`,
    message:
      "Draft created. Review in Studio — publish must be done by hand from the Studio UI.",
  };
}

export async function updateDraft(input: UpdateDraftInput) {
  const client = getClient();
  const draftId = `drafts.post-${input.slug}`;

  const existing = await client.fetch<{ _id: string } | null>(
    `*[_id == $id][0]{ _id }`,
    { id: draftId },
  );
  if (!existing) {
    throw new Error(
      `No draft with slug "${input.slug}". Call blog_create_draft to make one, or blog_list_drafts to see what exists.`,
    );
  }

  const patch: Record<string, unknown> = {};
  if (input.title) patch.title = input.title;
  if (input.excerpt) patch.excerpt = input.excerpt;
  if (input.publishedAt) patch.publishedAt = input.publishedAt;

  if (input.body) {
    const shapeError = validateBodyShape(input.body);
    if (shapeError) throw new Error(shapeError);
    patch.body = input.body.map(sectionToBlock);
  }

  if (input.tags) {
    const tagDocs = await client.fetch<{ _id: string; slug: string }[]>(
      `*[_type == "tag" && slug.current in $slugs]{ _id, "slug": slug.current }`,
      { slugs: input.tags },
    );
    const missing = input.tags.filter(
      (s) => !tagDocs.find((t) => t.slug === s),
    );
    if (missing.length > 0) {
      throw new Error(`Unknown tags: ${missing.join(", ")}.`);
    }
    patch.tags = tagDocs.map((t) => ({
      _type: "reference",
      _ref: t._id,
      _key: k(),
    }));
  }

  await client.patch(draftId).set(patch).commit();
  return {
    _id: draftId,
    slug: input.slug,
    fieldsUpdated: Object.keys(patch),
  };
}
