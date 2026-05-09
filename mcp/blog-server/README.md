# Blog MCP Server

Local MCP server that lets Claude Code (and other MCP clients) draft blog posts to the Sanity-backed `romanczuk.vercel.app/blog`. **Draft-only** — never publishes directly. Publish must happen by hand from the Studio UI.

## Tools

| Tool | Purpose |
|---|---|
| `blog_list_tags` | Read the tag taxonomy (slug, name, post count). Call before `blog_create_draft`. |
| `blog_list_drafts` | List existing drafts (avoid slug collisions, find a draft to update). |
| `blog_get_post` | Read a published post by slug — useful for follow-ups or stylistic reference. |
| `blog_create_draft` | Create a new draft (`drafts.post-<slug>` in Sanity). Returns Studio URL. |
| `blog_update_draft` | Patch fields of an existing draft. |

There is **no `publish` tool**. Publishing is a manual gesture in Studio.

## Install

```bash
cd mcp/blog-server
npm install
npm run build
```

## Environment

The server reads three env vars (set per-project where it's used, or in your shell rc):

| Var | Required | Default |
|---|---|---|
| `BLOG_SANITY_PROJECT_ID` | yes | — |
| `BLOG_SANITY_WRITE_TOKEN` | yes | — (Editor scope from sanity.io) |
| `BLOG_SANITY_DATASET` | no | `production` |
| `BLOG_SANITY_API_VERSION` | no | `2025-01-01` |
| `BLOG_STUDIO_URL` | no | `https://romanczuk.vercel.app/studio` |

The write token must be Editor scope (Viewer can't create documents). Generate at https://www.sanity.io/manage/project/<projectId>/api/tokens. Different from the read token used by the Next.js app — rotate independently.

## Per-project opt-in

Add to `.mcp.json` in any repo where you want agents to be able to draft posts (e.g. `guitar-crm/`, `ShortsCannon/`, `instagram-stories-webhook/`). Don't add it everywhere — only repos whose work is interesting enough to write about.

```json
{
  "mcpServers": {
    "blog": {
      "command": "node",
      "args": ["/Users/piotr/Desktop/MainCV/landing-portfolio/mcp/blog-server/dist/index.js"],
      "env": {
        "BLOG_SANITY_PROJECT_ID": "bp7esa39",
        "BLOG_SANITY_WRITE_TOKEN": "<editor-scope-token>",
        "BLOG_STUDIO_URL": "https://romanczuk.vercel.app/studio"
      }
    }
  }
}
```

## Body shape

Section discriminated union — agents pass an array of these in `body`:

```ts
type Section =
  | { type: "p"; text: string }                                // paragraph
  | { type: "h2"; text: string }                               // section heading
  | { type: "h3"; text: string }                               // subheading
  | { type: "code"; language: string; code: string; filename?: string }
  | { type: "callout"; tone: "note" | "warning" | "tip"; text: string }
  | { type: "pullQuote"; text: string; attribution?: string }
```

Within `text` fields, **markdown-lite inline marks** are supported:

- `` `code` `` → inline code
- `**bold**` → strong
- `*italic*` → em

Marks do not nest. Anything else (links, images, tables, lists) is intentionally not supported — express those as separate sections, or skip them.

## Validation

Server-side validation rejects drafts that are likely to read as fragments:

- title 5–120 chars · slug kebab-case ≤96 · excerpt 40–220 chars
- body ≥5 sections, must contain at least one `h2` and at least 3 paragraphs
- 1–5 tags, all must exist in Sanity (call `blog_list_tags` to confirm)
- slug must not collide with a published post (use `blog_update_draft` for existing drafts)

## Why draft-only

The blog is a portfolio asset. Auto-publishing agent-generated content reads as AI slop and actively hurts the recruiter signal. Draft-only forces a human review step where voice, framing, and accuracy can be polished. The 30-second cost of "open Studio, read, click publish" is the entire point.
