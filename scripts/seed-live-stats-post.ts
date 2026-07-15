/**
 * Seed the "portfolio live stats" post into Sanity AS A DRAFT.
 * Idempotent — re-running replaces the draft. Publish from Studio.
 *
 * Run with:
 *   npx sanity exec scripts/seed-live-stats-post.ts --with-user-token
 */

import { randomUUID } from "node:crypto";
import { getCliClient } from "sanity/cli";

type Mark = "strong" | "em" | "code";

type Span = { _type: "span"; _key: string; text: string; marks: Mark[] };

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

const block = (style: Block["style"], ...children: Span[]): Block => ({
  _type: "block",
  _key: k(),
  style,
  markDefs: [],
  children,
});

const p = (...children: Span[]): Block => block("normal", ...children);
const h2 = (text: string): Block => block("h2", span(text));

const code = (language: string, src: string, filename?: string): CodeBlock => ({
  _type: "codeBlock",
  _key: k(),
  language,
  ...(filename ? { filename } : {}),
  code: src,
});

const callout = (tone: Callout["tone"], ...children: Span[]): Callout => ({
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
      "This week I reviewed my own portfolio the way a recruiter would: cold, on a Tuesday, with fifteen seconds of attention. The hero has a stat card that's supposed to be proof of life — last GitHub push, commits in the last thirty days. It read: ",
    ),
    span("last push 9w ago", ["code"]),
    span(", and right next to it, "),
    span("26 commits · last 30d", ["code"]),
    span(
      ". Those two numbers cannot both be true. If my last push was nine weeks ago, there were zero commits in the last thirty days. Both came from the same JSON file, and both were frozen in May.",
    ),
  ),

  h2("A checked-in JSON file is a cache with no TTL"),

  p(
    span("The setup was reasonable, which is what makes it worth writing down. A "),
    span("prebuild", ["code"]),
    span(
      " script fetched my GitHub activity and wrote it to a JSON file in the repo. Checked in, so builds are offline-safe and never blocked on a flaky API. Rendered straight into the hero at build time. Every choice defensible in isolation.",
    ),
  ),

  code(
    "json",
    `{
  "user": "PiotrRomanczuk",
  "generatedAt": "2026-05-12T11:14:25.498Z",
  "lastPush": "2026-05-12T10:54:35Z",
  "commitsLast30d": 26
}`,
    "src/data/github-contrib.json — note the timestamp nobody renders",
  ),

  p(
    span("The failure mode isn't a bug. It's "),
    span("cadence coupling", ["em"]),
    span(
      ": the data refreshes when the site deploys, and the site deploys when I touch the site. The moment I'm heads-down shipping other projects — which is exactly what the stat is supposed to prove — the portfolio stops deploying and the number starts rotting.",
    ),
  ),

  callout(
    "warning",
    span(
      "The coupling is adversarial. You stop deploying your portfolio precisely when you're busiest elsewhere, so the “last push” stat drifts from hours to weeks at exactly the moment recruiters are reading it. Confident stale data is worse than no data.",
    ),
  ),

  pullQuote("The dashboard was working exactly as built. That was the problem."),

  h2("Fetch at request time, keep the snapshot as a fallback"),

  p(
    span(
      "The fix took an afternoon. The volatile numbers — last push, 30-day and 7-day counts, repo stats — moved to a server-side fetch with incremental static regeneration. The checked-in snapshot stayed, demoted to a fallback.",
    ),
  ),

  code(
    "ts",
    `export async function getGithubActivity(): Promise<GithubActivity> {
  const fallback = fromSnapshot();        // checked-in JSON, refreshed on deploy
  try {
    const [pushActivity, repoStats] = await Promise.all([
      fetchPushActivity(),                // fetch(..., { next: { revalidate: 3600 } })
      Promise.all(SHOWCASED_REPOS.map(fetchRepoStats)),
    ]);
    return merge(pushActivity, repoStats, fallback);
  } catch {
    return fallback;                      // API down ≠ empty hero
  }
}`,
    "src/lib/data/github-activity.ts (essence)",
  ),

  p(
    span("The page itself declares "),
    span("export const revalidate = 3600", ["code"]),
    span(
      ", so the stats regenerate hourly whether or not I ever deploy again. If GitHub is down or rate-limits me, visitors get the snapshot instead of an error. Builds remain offline-safe. And because every number now comes out of the same fetch, the impossible pairing — old push, fresh commits — is structurally unrepresentable.",
    ),
  ),

  h2("The second trap: which GitHub API you ask"),

  p(
    span(
      "While fixing this I regenerated the snapshot without an API token, and the contribution heatmap collapsed: ",
    ),
    span("2 active days out of 182", ["strong"]),
    span(
      ". My site went from “stale” to “abandoned” in one command. The culprit was the fallback data source.",
    ),
  ),
  p(
    span("The public events endpoint ("),
    span("/users/:user/events/public", ["code"]),
    span(
      ") only sees public repositories, only reaches back about ninety days, and caps out at three hundred events. Most of my recent work lives in private repos, so the endpoint reported a ghost town. The GraphQL contributions calendar sees everything you can see — private contributions included — but requires a token.",
    ),
  ),

  code(
    "graphql",
    `query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        weeks { contributionDays { date contributionCount } }
      }
    }
  }
}`,
    "the calendar that tells the truth",
  ),

  p(
    span("With the token: "),
    span("91 of 182 days active, 191 contributions in the last thirty days", ["strong"]),
    span(
      " — against the 26 the events endpoint reported. Same developer, same month. One API said I was prolific; the other said I was gone.",
    ),
  ),

  callout(
    "tip",
    span(
      "If you render GitHub activity anywhere, decide which population of work it should reflect. For “is this person shipping?”, private work counts — use the contributions calendar with a token, and treat the public events feed as the emergency fallback it is.",
    ),
  ),

  h2("Numbers that sit next to timestamps"),

  p(
    span(
      "The general rule I took away: every live-looking number on a page makes an implicit freshness promise, and the page inherits the credibility of its stalest number. A contribution graph, a “last updated” badge, a DAU counter — each one is a claim about now. Render it from data that has an actual TTL, or don't render it.",
    ),
  ),
  p(
    span(
      "If a number can go stale silently, it will — and it will pick the worst possible audience to do it in front of.",
      ["strong"],
    ),
  ),
  p(
    span(
      "The irony isn't lost on me that the page whose headline promises products that “survive their first users” was itself failing its first users. It regenerates hourly now. The snapshot is just a seatbelt.",
    ),
  ),
];

async function main() {
  const client = getCliClient();

  const tagSlugs = ["nextjs", "architecture"];
  const tags = await client.fetch<{ _id: string; slug: string }[]>(
    `*[_type == "tag" && slug.current in $slugs]{ _id, "slug": slug.current }`,
    { slugs: tagSlugs },
  );

  const missing = tagSlugs.filter((s) => !tags.find((t) => t.slug === s));
  if (missing.length > 0) {
    throw new Error(`Missing tags in Sanity: ${missing.join(", ")}`);
  }

  const post = {
    _id: "drafts.post-portfolio-live-stats",
    _type: "post" as const,
    title: "My portfolio said I hadn't pushed in nine weeks",
    slug: {
      _type: "slug" as const,
      current: "my-portfolio-said-i-hadnt-pushed-in-nine-weeks",
    },
    excerpt:
      "My portfolio hero renders live GitHub stats. In July it claimed my last push was nine weeks ago — right beside “26 commits in the last 30 days”. Both numbers were frozen in May. On build-time data, cadence coupling, and which GitHub API actually tells the truth.",
    publishedAt: "2026-07-15T09:00:00Z",
    tags: tags.map((t) => ({
      _type: "reference" as const,
      _ref: t._id,
      _key: k(),
    })),
    body,
  };

  await client.createOrReplace(post);
  console.log(`✓ Drafted ${post.title}`);
  console.log(`  (unpublished draft — review & publish in /studio)`);
  console.log(`  /blog/${post.slug.current}`);
  console.log(`  ${post.tags.length} tags · ${body.length} body blocks`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
