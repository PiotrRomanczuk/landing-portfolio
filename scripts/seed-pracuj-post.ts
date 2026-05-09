/**
 * Seed the Pracuj scraping post into Sanity. Idempotent — re-running replaces.
 *
 * Run with:
 *   npx sanity exec scripts/seed-pracuj-post.ts --with-user-token
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
type PullQuote = {
  _type: "pullQuote";
  _key: string;
  text: string;
  attribution?: string;
};
type BodyChild = Block | CodeBlock | PullQuote;

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
const pullQuote = (text: string, attribution?: string): PullQuote => ({
  _type: "pullQuote",
  _key: k(),
  text,
  ...(attribution ? { attribution } : {}),
});

const body: BodyChild[] = [
  p(
    span("Looking for a developer job in Warsaw means dealing with Pracuj.pl, the dominant Polish job board. Their search filters are coarse, their results page is paginated, and every offer has structured data hidden inside the HTML that the UI only partly exposes. I wanted to ask questions like "),
    span(
      "“backend roles in Warsaw, hybrid, paying over 18k PLN, with .NET in the optional tech list”",
      ["em"],
    ),
    span(
      " — and get answers in seconds, not by clicking through 40 listings. So I built a scraper.",
    ),
  ),
  p(
    span(
      "The result is three files: a Node script that drives Playwright through 200 offer pages, a Python script that normalizes the JSON output into SQLite, and a query script for the day-to-day filtering. ~600 lines total. I want to walk through the four decisions that mattered.",
    ),
  ),

  h2("Why Playwright instead of fetch"),

  p(
    span("The first thing I tried was the obvious thing: "),
    span("fetch(url)", ["code"]),
    span(
      ", parse the HTML, extract what I needed. That hit two walls in the first ten requests.",
    ),
  ),
  p(
    span("Wall one: Cloudflare.", ["strong"]),
    span(
      " Pracuj sits behind Cloudflare's bot protection, which serves a JavaScript challenge before the real page renders. A plain HTTP client never sees the offer — it sees the challenge HTML. You can solve this with custom headers and rotating user agents up to a point, then you can't.",
    ),
  ),
  p(
    span("Wall two: client-side rendering.", ["strong"]),
    span(
      " Even past Cloudflare, the offer details — required technologies, salary breakdown, position level — are populated by client-side React after the initial HTML loads. ",
    ),
    span("cheerio", ["code"]),
    span(" over the raw response gets you a skeleton with empty divs."),
  ),
  p(
    span(
      "Playwright solves both at once. It runs a real Chromium, executes the JavaScript, waits for Cloudflare's challenge to clear, and exposes the fully-rendered DOM. The cost is real — each page takes ~12 seconds end to end versus ~200ms for a ",
    ),
    span("fetch", ["code"]),
    span(" — but the alternative isn't a faster scrape, it's no scrape."),
  ),

  code(
    "js",
    `const { chromium } = require('playwright');

const PAGE_WAIT_MS = 10000;     // wait for Cloudflare challenge
const BETWEEN_PAGES_MS = 2500;  // polite delay between pages

async function scrape(urls) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  for (const url of urls) {
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(PAGE_WAIT_MS);
    const data = await extractOfferData(page);
    await page.close();
    await page.waitForTimeout(BETWEEN_PAGES_MS);
  }
}`,
    "scrape_offers.cjs",
  ),

  p(
    span(
      "The 2.5-second delay between pages is not politeness theater. It's the difference between completing a 200-offer run and getting throttled at offer 80.",
    ),
  ),

  h2("The DOM strategy: anchor on data-scroll-id"),

  p(
    span("Class names on big React sites are useless for scraping. Pracuj's are emitted by a CSS-in-JS pipeline — "),
    span("t1u8helo", ["code"]),
    span(", "),
    span("c1bf6vbi", ["code"]),
    span(" — and they change between deploys. Anchoring on those class names buys you a scraper that breaks every two weeks."),
  ),
  p(
    span("What survives is the "),
    span("semantic", ["em"]),
    span(" attributes. Pracuj uses "),
    span("data-scroll-id", ["code"]),
    span(" on every section heading because the page's anchor-link navigation needs them. Those IDs are descriptive ("),
    span("requirements-expected-1", ["code"]),
    span(", "),
    span("position-levels", ["code"]),
    span(", "),
    span("responsibilities-1", ["code"]),
    span(") and they don't churn. Twelve sections, twelve stable anchors."),
  ),

  code(
    "js",
    `const scrollSections = [
  'work-schedules', 'position-levels', 'work-modes',
  'about-project-1', 'responsibilities-1',
  'requirements-expected-1', 'requirements-optional-1',
  'offered-1', 'benefits-1',
  'development-practices-1',
  'about-us-description-1',
  'attribute-secondary-it-specializations',
];

for (const sectionId of scrollSections) {
  const el = document.querySelector(\`[data-scroll-id="\${sectionId}"]\`);
  if (el) {
    const items = el.querySelectorAll('li, [data-test*="item"]');
    sections[sectionId] = items.length
      ? [...items].map(i => i.textContent.trim()).filter(Boolean)
      : el.textContent.trim();
  }
}`,
    "extract.js — section anchors",
  ),

  p(
    span(
      "There's also the JSON-LD block at the top of every offer — the structured data Pracuj emits for Google's job-posting rich results. That's the canonical source for company, salary, employment type, and dates. The DOM-scraped sections fill in everything that doesn't fit the schema.org ",
    ),
    span("JobPosting", ["code"]),
    span(" schema."),
  ),

  pullQuote(
    "The DOM is unreliable; the schema.org JSON-LD is contractual. Read both, prefer the contract.",
  ),

  h2("Why SQLite, not Postgres"),

  p(
    span(
      "The instinct in 2026 is to reach for a managed Postgres. For a personal scraper, that's the wrong instinct. SQLite gets four things right that matter at this scale:",
    ),
  ),
  p(
    span("1. The database is a file.", ["strong"]),
    span(" "),
    span("job_offers.db", ["code"]),
    span(" lives next to the scraper. I can "),
    span(".gitignore", ["code"]),
    span(" it. I can "),
    span("rm", ["code"]),
    span(" it to reset. I can "),
    span("cp", ["code"]),
    span(
      " it to a USB drive. There is no service to start, no port to expose, no credentials to rotate.",
    ),
  ),
  p(
    span("2. Tools that already speak it.", ["strong"]),
    span(" "),
    span("sqlite3 job_offers.db", ["code"]),
    span(
      " from the terminal is a complete query environment. DBeaver opens it without a connection string. Python's stdlib has ",
    ),
    span("sqlite3", ["code"]),
    span(". No driver to install."),
  ),
  p(
    span("3. WAL mode handles the only concurrency I need.", ["strong"]),
    span(
      " The scraper writes; the query script reads. WAL (",
    ),
    span("PRAGMA journal_mode=WAL", ["code"]),
    span(
      ") lets the reader see consistent snapshots while the writer is appending, which is the entire concurrency story for this app.",
    ),
  ),
  p(
    span("4. The schema is normalized properly anyway.", ["strong"]),
    span(
      " SQLite isn't a downgrade from Postgres for tabular data. The schema below has foreign keys, cascading deletes, and a unique constraint preventing duplicate technologies per offer.",
    ),
  ),

  code(
    "sql",
    `CREATE TABLE offers (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  pracuj_id       TEXT UNIQUE,
  url             TEXT NOT NULL,
  title           TEXT,
  company         TEXT,
  city            TEXT,
  salary_min      REAL,
  salary_max      REAL,
  salary_currency TEXT,
  position_level  TEXT,
  work_mode       TEXT,
  date_posted     TEXT,
  raw_json_ld     TEXT
  -- ...20 more fields
);

CREATE TABLE offer_technologies (
  offer_id   INTEGER REFERENCES offers(id) ON DELETE CASCADE,
  technology TEXT NOT NULL,
  required   BOOLEAN DEFAULT 1,
  UNIQUE(offer_id, technology)
);`,
    "build_db.py — schema",
  ),

  h2("Why Node and Python in the same folder"),

  p(
    span(
      "The scraper is Node. The database build script is Python. The query CLI is Python. Mixing runtimes inside one project is usually a smell. Here it's a feature, because each runtime is doing what its ecosystem is best at.",
    ),
  ),
  p(
    span("Playwright's Node API is the most-used and best-documented surface.", ["strong"]),
    span(
      " Selector debugging, codegen, the trace viewer — all of them exist for the Node API and are hand-me-downs for the Python port. For a scraper that ",
    ),
    span("will", ["em"]),
    span(" break when the site changes, you want the best debugging tools, not the most-cohesive language choice."),
  ),
  p(
    span("Python's stdlib is built for this kind of data work.", ["strong"]),
    span(" "),
    span("sqlite3", ["code"]),
    span(", "),
    span("re", ["code"]),
    span(" for text cleanup (Pracuj's job descriptions are full of emoji bullets I want to strip), "),
    span("json", ["code"]),
    span(" for the JSON-LD payloads, "),
    span("argparse", ["code"]),
    span(
      " for the query CLI. Node can do all of these but everything is a library install. Python ships with a working version on day one.",
    ),
  ),

  code(
    "py",
    `BULLET_RE = re.compile(
    r"^[\\s]*[•✔️✅❌⭐🔹🔸💻🛠️📌▪▸►‣⁃–—\\-\\*]\\s*",
    re.MULTILINE,
)

def clean_text(val):
    if not val:
        return val
    if isinstance(val, list):
        return ", ".join(clean_text(v) for v in val if v)
    return BULLET_RE.sub("", str(val))`,
    "build_db.py — bullet stripping",
  ),

  p(
    span("The interface between the two is a single "),
    span("scraped_offers.json", ["code"]),
    span(
      " file. The Node side's only job is “produce that file”; the Python side's only job is “read that file.” There's no shared state, no shared types, no foreign function call. The seam is just JSON and the filesystem — the most portable interface in computing.",
    ),
  ),

  h2("What the pipeline actually produces"),

  p(
    span(
      "After a scrape run I get a SQLite database with a few hundred rows. The query CLI is built around the questions I actually ask:",
    ),
  ),
  p(
    span("— "),
    span(
      "“Which Warsaw backend roles list .NET as a required technology and pay over 18k PLN?”",
      ["em"],
    ),
  ),
  p(
    span("— "),
    span(
      "“Which companies have posted three or more roles in the last 30 days?”",
      ["em"],
    ),
  ),
  p(
    span("— "),
    span(
      "“Show me hybrid roles tagged 'mid' that mention React in the optional list.”",
      ["em"],
    ),
  ),
  p(
    span("These are SQL joins with WHERE clauses, indexed on "),
    span("position_level", ["code"]),
    span(", "),
    span("work_mode", ["code"]),
    span(", "),
    span("salary_min", ["code"]),
    span(", and the "),
    span("offer_technologies", ["code"]),
    span(
      " table. They run in milliseconds. The cover-letter generator (different post) reads from the same database to tailor each application.",
    ),
  ),
  p(
    span(
      "The pipeline is small enough to be in one folder, weird enough that nobody else has built it, and useful enough that I run it weekly. That's the right shape for a tool you make for yourself: do one specific thing nobody else cares about, do it offline, do it in whatever language is best at the part you're doing.",
    ),
  ),
];

async function main() {
  const client = getCliClient();
  const tagSlugs = ["python", "nodejs", "playwright"];
  const tags = await client.fetch<{ _id: string; slug: string }[]>(
    `*[_type == "tag" && slug.current in $slugs]{ _id, "slug": slug.current }`,
    { slugs: tagSlugs },
  );
  const missing = tagSlugs.filter((s) => !tags.find((t) => t.slug === s));
  if (missing.length > 0) {
    throw new Error(`Missing tags in Sanity: ${missing.join(", ")}`);
  }
  const post = {
    _id: "post-scraping-pracuj-with-playwright",
    _type: "post" as const,
    title: "Building a job-search pipeline with Playwright, SQLite, and Python",
    slug: {
      _type: "slug" as const,
      current: "scraping-pracuj-with-playwright",
    },
    excerpt:
      "A polyglot scraper that pulls structured offer data from Pracuj.pl, normalizes it into SQLite, and lets me grep for jobs that actually match. Why Playwright over fetch, why SQLite over a real database, and why Node and Python in the same folder is the right call.",
    publishedAt: "2026-05-09T10:02:00Z",
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
