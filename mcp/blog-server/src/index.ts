#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  createDraftInput,
  getPostInput,
  updateDraftInput,
} from "./schema.js";
import {
  createDraft,
  getPost,
  listDrafts,
  listTags,
  updateDraft,
} from "./tools.js";

const server = new McpServer({
  name: "romanczuk-blog",
  version: "0.1.0",
});

server.registerTool(
  "blog_list_tags",
  {
    title: "List blog tags",
    description:
      "Return the available tag taxonomy (slug, name, post count). Always call this before blog_create_draft so tag slugs are correct.",
    inputSchema: {},
  },
  async () => {
    const tags = await listTags();
    return { content: [{ type: "text", text: JSON.stringify(tags, null, 2) }] };
  },
);

server.registerTool(
  "blog_list_drafts",
  {
    title: "List existing drafts",
    description:
      "Return drafts currently queued in Sanity. Use to avoid duplicate slugs and to find a draft ID to update.",
    inputSchema: {},
  },
  async () => {
    const drafts = await listDrafts();
    return {
      content: [{ type: "text", text: JSON.stringify(drafts, null, 2) }],
    };
  },
);

server.registerTool(
  "blog_get_post",
  {
    title: "Get a post by slug",
    description:
      "Fetch a published post (or draft if no published copy exists) by slug. Useful for reading existing posts before drafting a follow-up.",
    inputSchema: getPostInput.shape,
  },
  async ({ slug }) => {
    const post = await getPost(slug);
    return { content: [{ type: "text", text: JSON.stringify(post, null, 2) }] };
  },
);

server.registerTool(
  "blog_create_draft",
  {
    title: "Create a blog post draft",
    description: [
      "Create a new draft post in Sanity. The draft is NOT published — review and publish must happen in the Studio UI.",
      "",
      "BODY SHAPE: an array of sections, each with a `type` field. Inline marks (within `text` fields) use markdown-lite: `**bold**`, `*italic*`, `` `code` ``. No links, no images, no tables — those are out of scope on purpose.",
      "",
      "Section types: p (paragraph), h2 (heading), h3 (subheading), code (figure with optional language and filename), callout (note/warning/tip), pullQuote (italic quote with optional attribution).",
      "",
      "Always call blog_list_tags first to use correct tag slugs. Body must have ≥5 sections and ≥1 h2 — drafts shorter than this read as fragments.",
    ].join("\n"),
    inputSchema: createDraftInput.shape,
  },
  async (input) => {
    const result = await createDraft(input);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
);

server.registerTool(
  "blog_update_draft",
  {
    title: "Update an existing draft",
    description:
      "Patch fields of an existing draft, identified by slug. Pass only the fields you want to change. Use blog_list_drafts to find what exists.",
    inputSchema: updateDraftInput.shape,
  },
  async (input) => {
    const result = await updateDraft(input);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
