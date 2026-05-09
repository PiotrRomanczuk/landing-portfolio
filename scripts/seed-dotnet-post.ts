/**
 * Seed the .NET rebuild post into Sanity. Idempotent — re-running replaces.
 *
 * Run with:
 *   npx sanity exec scripts/seed-dotnet-post.ts --with-user-token
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
      "I have a working Instagram-stories scheduler. It's a Next.js 16 app on top of Supabase, with Vitest + Playwright tests, a Vercel cron that fires every minute, and enough rate-limit handling to publish stories on schedule without getting throttled. It works. I'm replacing it with ASP.NET Core 9 and Angular 19.",
    ),
  ),
  p(
    span(
      "This is not a “Next.js bad, .NET good” post. The old stack got real things right. The new stack costs more — more files, more concepts, longer compile times, more boilerplate per feature. The interesting question is what's worth that cost, and when. This is what pushed me across the line for ",
    ),
    span("this", ["em"]),
    span(" project."),
  ),

  h2("What Next.js + Supabase got right"),

  p(span("Three things, all of them load-bearing for shipping fast:")),
  p(
    span("Auth + database in one tab.", ["strong"]),
    span(
      " Supabase gives you Postgres, an auth service that hands out JWTs, and row-level security policies that let you write ",
    ),
    span("auth.uid() = user_id", ["code"]),
    span(
      " in SQL and call it done. I had real multi-tenant security in week one, not month three.",
    ),
  ),
  p(
    span("The deploy is the build.", ["strong"]),
    span(" "),
    span("git push", ["code"]),
    span(
      " → Vercel rebuilds → preview URL appears in the PR comment. No infra to operate. No image registry. No cluster. The cost of shipping a tiny change is genuinely close to zero.",
    ),
  ),
  p(
    span("TypeScript end-to-end.", ["strong"]),
    span(
      " One language across server actions, client components, Supabase types (generated from the schema), Vitest, and Playwright. Refactoring a column rename is a single TypeScript error away from being correctly propagated.",
    ),
  ),

  pullQuote(
    "None of these are problems I'm trying to solve. I'm rebuilding because the problem changed.",
  ),

  h2("Four things that pushed me across the line"),

  p(
    span("1. The platform count went from one to six.", ["strong"]),
    span(
      " The old app publishes to Instagram. The new one is a “short-form video dispatcher” — same input, six output platforms (IG Reels + Stories, TikTok, YouTube Shorts, Facebook Reels, X, Threads). Each platform has its own auth flow, rate-limit shape, retry semantics, and failure modes. The old app's structure — one route handler per concern, Supabase queries inline — would turn into spaghetti by platform three. I want explicit handlers, explicit pipelines, explicit failure boundaries.",
    ),
  ),
  p(
    span("2. Background jobs stopped being optional.", ["strong"]),
    span(
      " Vercel Cron is fine for one job per minute. It's not fine for “fan out a single post into six platform-specific upload jobs, each with retries, exponential backoff, and a way to inspect the queue.” I could bolt that onto Next.js with Inngest or BullMQ, but at that point I'm running a queue ",
    ),
    span("and", ["em"]),
    span(
      " a web app on a runtime designed for one of them. .NET hosts long-running workers natively — ",
    ),
    span("BackgroundService", ["code"]),
    span(", "),
    span("Channel<T>", ["code"]),
    span(", "),
    span("IHostedService", ["code"]),
    span(" — without leaving the framework I'm already using for HTTP."),
  ),
  p(
    span("3. Strong typing across the wire, not just the language.", ["strong"]),
    span(
      " Supabase's generated types are great inside one TypeScript codebase. They don't help when an external integration sends a payload your client wasn't generated against. .NET's OpenAPI tooling generates an API client ",
    ),
    span("for the Angular frontend", ["em"]),
    span(
      " from the same C# DTOs the backend returns. The contract is enforced at compile time on both sides of the wire. No runtime drift.",
    ),
  ),
  p(
    span("4. I want to learn the Microsoft enterprise stack.", ["strong"]),
    span(
      " This is the honest one. Polish job postings ask for .NET, EF Core, Azure, and Angular at twice the rate they ask for the JAMstack. I'd been writing TypeScript exclusively for two years. Building something real on the Microsoft stack — not toy tutorials — is the fastest way to be credible in interviews for those roles.",
    ),
  ),

  h2("What .NET + Angular gives you that's worth the cost"),

  p(
    span("The cost is real. A four-layer Clean Architecture project ("),
    span("API", ["code"]),
    span(", "),
    span("Application", ["code"]),
    span(", "),
    span("Domain", ["code"]),
    span(", "),
    span("Infrastructure", ["code"]),
    span(") has more files than the same feature in Next.js. CQRS with MediatR means a “create post” endpoint is a command, a handler, a validator, and a DTO instead of a single "),
    span("app/api/posts/route.ts", ["code"]),
    span(
      ". The Angular side has standalone components, observables, and a router that takes a few hours to internalize.",
    ),
  ),
  p(span("What you get for that cost:")),
  p(
    span("Boundaries that survive growth.", ["strong"]),
    span(
      " When the create-post handler grows from 30 lines to 300, it's still a single file with a single responsibility. When you need to add a behavior — logging, validation, transactions — you write a ",
    ),
    span("IPipelineBehavior<TRequest, TResponse>", ["code"]),
    span(
      " once and it applies to every handler. The boundary doesn't decay as the system gets bigger. In the Next.js version, the same growth shows up as a 600-line route handler that nobody wants to touch.",
    ),
  ),
  p(
    span("Background work as a first-class citizen.", ["strong"]),
    span(" A class that implements "),
    span("BackgroundService", ["code"]),
    span(
      " is hosted by the same process that serves HTTP, accesses the same DI container, uses the same EF Core context, logs through the same Serilog pipeline. There's no separate runtime to deploy or monitor. Schedulers, queue consumers, and the web API are siblings in one process.",
    ),
  ),
  p(
    span("A real type system on the frontend, again.", ["strong"]),
    span(" Angular's "),
    span("HttpClient", ["code"]),
    span(
      " typed with the OpenAPI-generated client means every API call has correct request and response types without me writing them. When I rename a field in C#, regenerate the client, and the Angular component fails to compile in three places, that's the system working correctly.",
    ),
  ),

  callout(
    "note",
    span(
      "None of this is unique to .NET. You can get most of it on the JVM, on Go with discipline, or with TypeScript + a heavy dose of structure (Nx + NestJS + BullMQ). Ergonomics-per-line, .NET earns its place when you've already accepted the boilerplate floor and want what's above it.",
    ),
  ),

  h2("Who shouldn't do this"),

  p(
    span(
      "If your app is one platform, two database tables, and a contact form: stay on Next.js. Vercel + Supabase will outpace any .NET stack on time-to-first-deploy by a wide margin, and the JAMstack ergonomics genuinely shrink with project size in the right direction.",
    ),
  ),
  p(
    span(
      "If you're chasing roles where the team uses Next.js, stay on Next.js — depth in one stack beats a thin layer of .NET on your CV.",
    ),
  ),
  p(
    span("If your app's complexity is plateauing — same shape, more rows, more users, but not more "),
    span("kinds", ["em"]),
    span(
      " of things — there's no architecture upside to a rewrite, only a calendar cost. The .NET case lands when the system is becoming structurally different (more platforms, more job types, more contracts), not just bigger.",
    ),
  ),

  h2("Where the rebuild is right now"),

  p(
    span(
      "Three commits in. Domain, Application, Infrastructure, and API projects scaffolded. Clean Architecture dependency rules enforced by project references. Docker compose for local SQL Server (Azure SQL Edge on ARM Macs) and Azurite for blob storage. CI workflow concurrency-controlled so PRs don't pile up. No handlers shipped yet.",
    ),
  ),
  p(
    span(
      "I'll write the follow-up to this post when I've shipped the first three platform integrations and have something concrete to say about pipeline behaviors, FluentValidation in practice, and whether the OpenAPI client generator earns its place. The point of this post isn't “look how it turned out.” It's the part most rewrites skip — the ",
    ),
    span("decision", ["em"]),
    span(
      " to rewrite, and the case it has to make against the version that already works.",
    ),
  ),
];

async function main() {
  const client = getCliClient();
  const tagSlugs = ["dotnet", "nextjs", "architecture"];
  const tags = await client.fetch<{ _id: string; slug: string }[]>(
    `*[_type == "tag" && slug.current in $slugs]{ _id, "slug": slug.current }`,
    { slugs: tagSlugs },
  );
  const missing = tagSlugs.filter((s) => !tags.find((t) => t.slug === s));
  if (missing.length > 0) {
    throw new Error(`Missing tags in Sanity: ${missing.join(", ")}`);
  }
  const post = {
    _id: "post-why-im-rebuilding-on-dotnet",
    _type: "post" as const,
    title: "Why I'm rebuilding my Instagram automation on .NET and Angular",
    slug: {
      _type: "slug" as const,
      current: "why-im-rebuilding-on-dotnet",
    },
    excerpt:
      "I shipped a working Instagram-stories scheduler on Next.js and Supabase. Now I'm rewriting it on ASP.NET Core 9 + Angular 19. Here's the honest comparison — what each stack gets right, and the four things that pushed me across the line.",
    publishedAt: "2026-05-09T10:01:00Z",
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
