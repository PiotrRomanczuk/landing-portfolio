/**
 * Seed the Strummy launch post into Sanity. Idempotent — re-running replaces.
 *
 * Run with:
 *   npx sanity exec scripts/seed-strummy-post.ts --with-user-token
 */

import { randomUUID } from "node:crypto";
import { getCliClient } from "sanity/cli";

type Mark = "strong" | "em" | "code";

type Span = {
  _type: "span";
  _key: string;
  text: string;
  marks: Mark[];
};

type Block = {
  _type: "block";
  _key: string;
  style: "normal" | "h2" | "h3" | "blockquote";
  markDefs: never[];
  children: Span[];
};

type CodeBlock = {
  _type: "codeBlock";
  _key: string;
  language: string;
  filename?: string;
  code: string;
};

type Callout = {
  _type: "callout";
  _key: string;
  tone: "note" | "warning" | "tip";
  body: Block[];
};

type PullQuote = {
  _type: "pullQuote";
  _key: string;
  text: string;
  attribution?: string;
};

type BodyChild = Block | CodeBlock | Callout | PullQuote;

const k = () => randomUUID().replace(/-/g, "").slice(0, 12);

const span = (text: string, marks: Mark[] = []): Span => ({
  _type: "span",
  _key: k(),
  text,
  marks,
});

const block = (
  style: Block["style"],
  ...children: Span[]
): Block => ({
  _type: "block",
  _key: k(),
  style,
  markDefs: [],
  children,
});

const p = (...children: Span[]): Block => block("normal", ...children);
const h2 = (text: string): Block => block("h2", span(text));

const code = (
  language: string,
  src: string,
  filename?: string,
): CodeBlock => ({
  _type: "codeBlock",
  _key: k(),
  language,
  ...(filename ? { filename } : {}),
  code: src,
});

const callout = (
  tone: Callout["tone"],
  ...children: Span[]
): Callout => ({
  _type: "callout",
  _key: k(),
  tone,
  body: [block("normal", ...children)],
});

const pullQuote = (text: string, attribution?: string): PullQuote => ({
  _type: "pullQuote",
  _key: k(),
  text,
  ...(attribution ? { attribution } : {}),
});

const body: BodyChild[] = [
  p(
    span(
      "Strummy is a CRM I run for guitar teachers — student rosters, lesson scheduling, song repertoires, practice tracking. It has ~25 daily active users. That's a small number. It's also the number where the gap between “side project” and “production system” becomes legible. Three lessons from the last few months that wouldn't have surfaced at zero users.",
    ),
  ),

  h2("Mocked Supabase tests don't test RLS"),

  p(
    span(
      "Strummy is multi-tenant: each teacher has students, lessons, and songs that no other teacher should see. Postgres row-level security enforces that. The Supabase client just attaches the teacher's auth token; the database does the work.",
    ),
  ),
  p(
    span("I had a healthy integration test suite. I also had a "),
    span("__mocks__/@supabase/supabase-js.ts", ["code"]),
    span(
      " file that aliased the entire client to a hand-rolled stub. Every test that ",
    ),
    span("looked", ["em"]),
    span(" like it was exercising RLS was actually talking to my stub."),
  ),

  callout(
    "warning",
    span(
      "The mock returned what I told it to return. The mock did not run my RLS policies. The mock could not catch the bug where Teacher A could see Teacher B's archived songs.",
    ),
  ),

  p(
    span("The fix wasn't to delete the mock — unit tests benefit from one. The fix was to add a "),
    span("separate", ["em"]),
    span(
      " test track that talks to a real local Supabase, with no mocking, and run it before any change to RLS or auth flow.",
    ),
  ),

  code(
    "ts",
    `const config: Config = {
  testEnvironment: 'node',
  testTimeout: 30_000,
  // No moduleNameMapper alias for @supabase/supabase-js.
  // Crucially, this config DOES NOT mock the client — every other test
  // setup in this repo aliases it to a stub, which would defeat the
  // purpose of testing RLS policies.
  testMatch: ['<rootDir>/**/*.rls.test.{ts,tsx}'],
  maxWorkers: 1,
};`,
    "jest.config.rls.ts",
  ),

  p(
    span("Two configs ("),
    span("jest.config.ts", ["code"]),
    span(" for unit + integration with mocks; "),
    span("jest.config.rls.ts", ["code"]),
    span(
      " for RLS-real). Two npm scripts. Tests opt into one or the other by filename suffix. The RLS suite runs against a service-role-keyed local Supabase, seeds two teachers with overlapping student names, and asserts that each teacher's queries return only their own rows.",
    ),
  ),
  p(
    span("The lesson is older than this project. It's still the one I see violated most often: "),
    span(
      "a mock that's faithful enough to make tests pass is faithful enough to hide the bug you needed the test for.",
      ["strong"],
    ),
    span(
      " Decide which boundary the test is supposed to cross, and don't quietly stub past it.",
    ),
  ),

  h2("A schema rename will quietly break your dashboard"),

  p(
    span("Early in Strummy I had a "),
    span("user_roles", ["code"]),
    span(" table joining users to a role enum. Later I collapsed it into a "),
    span("role", ["code"]),
    span(" column on "),
    span("profiles", ["code"]),
    span(
      " — simpler, one less join, fewer RLS policies to maintain. The migration ran clean. The app worked. Tests passed.",
    ),
  ),
  p(
    span(
      "Two weeks later the admin dashboard started throwing 500s. The “Active Students” metric on the homepage was querying the dropped ",
    ),
    span("user_roles", ["code"]),
    span(
      " table. The query had been written months earlier, lived in a single API route, and was never touched by the migration PR.",
    ),
  ),

  pullQuote("The migration was reviewed. The dashboard wasn't."),

  p(
    span("The fix was twofold. First, the obvious patch — replace the dead query with a "),
    span("profiles", ["code"]),
    span(
      " query that returns the right shape. Second, the real fix — define what “active student” actually means as a ",
    ),
    span("first-class field", ["em"]),
    span(", not a query everyone re-derives."),
  ),

  code(
    "sql",
    `alter table profiles
  add column student_status text
  check (student_status in ('active', 'paused', 'churned'));

-- daily cron flips status to 'paused' after 28 days without a logged lesson`,
    "add student_status field",
  ),

  p(
    span("Now "),
    span("Active Students", ["code"]),
    span(
      " is a single column query maintained by a daily cron job. No joins, no business-logic-in-SELECT, no chance that the next schema rename leaves it stale. When the underlying tables change, the cron breaks loudly in one place, not silently in five dashboard tiles.",
    ),
  ),
  p(
    span("The lesson: "),
    span(
      "derived metrics that show up in admin UIs deserve to be persisted, not re-computed in every read path.",
      ["strong"],
    ),
    span(
      " The performance argument is real but secondary; the real win is centralizing the definition. There's exactly one place that knows what “active” means.",
    ),
  ),

  h2("Three CI providers building the same code is two too many"),

  p(
    span(
      "Strummy ships through Vercel. I had Vercel's git integration enabled. I also had a GitHub Actions CI workflow that ran tests, linted, and on ",
    ),
    span("main", ["code"]),
    span(
      " triggered a Vercel deploy. I also had an automated post-merge workflow that bumped the version and pushed a commit, which itself was a push to ",
    ),
    span("main", ["code"]),
    span(", which triggered Vercel again."),
  ),
  p(
    span("A single PR merge produced "),
    span("three to four Vercel builds", ["strong"]),
    span(
      " for the same commit range. None of them caught anything different. They burned build minutes, race-conditioned each other on Vercel's “current deployment” pointer, and meant the URL ",
    ),
    span("strummy.app", ["code"]),
    span(" could be serving any of three commits depending on which build won."),
  ),

  code(
    "diff",
    ` // vercel.json
 {
+  "git": {
+    "deploymentEnabled": false
+  }
 }

 # .github/workflows/ci-cd.yml — removed
-deploy-preview-main:
-  needs: test
-  if: github.event_name == 'push' && github.ref == 'refs/heads/main'
-  ...
-deploy-production:
-  needs: test
-  if: github.event_name == 'push' && github.ref == 'refs/heads/production'
-  ...`,
    "vercel.json + ci-cd.yml",
  ),

  p(
    span(
      "The new shape: PR previews still deploy automatically (the only deploy that matters during code review). Production deploys are a manual ",
    ),
    span("workflow_dispatch", ["code"]),
    span(" from the Actions UI — one click, one build, one canonical commit on "),
    span("strummy.app", ["code"]),
    span(". Build minutes dropped to a quarter of where they were. The URL means what it says."),
  ),
  p(
    span("The lesson is dull but worth saying: "),
    span(
      "automation that fights other automation costs more than you think.",
      ["strong"],
    ),
    span(
      " Each tool was reasonable in isolation. The bill came from the overlap. Audit your deployment graph the same way you audit your dependency graph — the second build is a liability, not a backup.",
    ),
  ),

  h2("What they have in common"),

  p(
    span(
      "Three lessons, three different parts of the stack — testing, schema, CI. The connective tissue is that none of them surface at zero users, on a side project, or against a mocked test environment. They surface when there's a real client running real queries, when migrations have to be safe in production, when build minutes show up on a bill.",
    ),
  ),
  p(
    span(
      "That's the underrated thing about running something small in production: 25 users is enough to make every shortcut visible. Not enough to justify infrastructure spend, but enough to make sloppy testing, sloppy schema, and sloppy CI cost you something concrete every week. Side projects let you avoid those bills. Production won't.",
    ),
  ),
  p(
    span(
      "Strummy is the project on my CV that other engineers read first. Not because it's the most ambitious — it isn't — but because the questions it raises are the ones that recur on every real system you'll ever maintain.",
    ),
  ),
];

async function main() {
  const client = getCliClient();

  const tagSlugs = ["nextjs", "supabase", "saas"];
  const tags = await client.fetch<{ _id: string; slug: string }[]>(
    `*[_type == "tag" && slug.current in $slugs]{ _id, "slug": slug.current }`,
    { slugs: tagSlugs },
  );

  const missing = tagSlugs.filter((s) => !tags.find((t) => t.slug === s));
  if (missing.length > 0) {
    throw new Error(`Missing tags in Sanity: ${missing.join(", ")}`);
  }

  const post = {
    _id: "post-strummy-three-production-lessons",
    _type: "post" as const,
    title: "Three production lessons from shipping Strummy",
    slug: {
      _type: "slug" as const,
      current: "three-production-lessons-from-shipping-strummy",
    },
    excerpt:
      "Strummy is a guitar-teacher CRM I run with ~25 daily users. Three lessons from shipping it — mocked tests don't cover RLS, schema renames break dashboards quietly, and three CI providers is two too many.",
    publishedAt: "2026-05-09T10:00:00Z",
    tags: tags.map((t) => ({
      _type: "reference" as const,
      _ref: t._id,
      _key: k(),
    })),
    body,
  };

  await client.createOrReplace(post);
  console.log(`✓ Published ${post.title}`);
  console.log(`  /blog/${post.slug.current}`);
  console.log(`  ${post.tags.length} tags · ${body.length} body blocks`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
