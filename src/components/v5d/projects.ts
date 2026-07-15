import type { ProjectMockId } from "@/components/v5d/ProjectMock";

export type Status = "shipping" | "active" | "internal" | "archived";
export type ProjectType = "saas" | "tool" | "oss" | "site" | "experiment";

export type Project = {
  num: string;
  title: string;
  short: string;
  stack: string[];
  type: ProjectType;
  year: number;
  status: Status;
  live?: string;
  repo?: string;
  mockId: ProjectMockId;
  featured?: boolean;
  metrics?: string[];
  details: {
    about: string;
    highlights: string[];
  };
};

export function repoSlugFromUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return url.replace(/^github\.com\//, "");
}

export const PROJECTS: Project[] = [
  {
    num: "01",
    title: "Strummy",
    short: "CRM for guitar teachers. Paying users since 2024.",
    stack: ["Next.js 16", "TypeScript", "Supabase", "Stripe", "Tailwind"],
    type: "saas",
    year: 2024,
    status: "shipping",
    live: "strummy.app",
    repo: "github.com/PiotrRomanczuk/guitar-crm",
    mockId: "strummy",
    featured: true,
    metrics: ["~25 dau", "paying since 2024", "stripe billing"],
    details: {
      about:
        "Full CRM for independent guitar teachers — students, lesson scheduling, a shared song library, and Stripe subscriptions. Started as a tool for one teacher; it has had paying users since 2024 and ~25 people in it daily.",
      highlights: [
        "Supabase Postgres with row-level security — every table policy-locked per teacher",
        "Stripe billing driven by webhooks; subscription state, invoices and disputes handled in production",
        "Jest suite on the hot paths; lint + tests gate every deploy",
        "v3 in flight: invoicing & lesson reminders",
      ],
    },
  },
  {
    num: "02",
    title: "Stories Automation",
    short: "IG Stories at scale. Queues, retries, idempotency.",
    stack: ["Next.js 16", "TypeScript", "Supabase", "Playwright", "Meta Graph"],
    type: "tool",
    year: 2025,
    status: "internal",
    mockId: "stories",
    details: {
      about:
        "Internal platform that publishes Instagram Stories at scale through the Meta Graph API. Built around a job queue where every publish is idempotent, retried with backoff, and auditable after the fact.",
      highlights: [
        "Queue with idempotency keys — a retried job can never double-post",
        "Meta webhook ingestion with signature validation at the boundary",
        "Vitest units plus Playwright E2E; cron-driven scheduling on Vercel",
        "Supabase holds queue state, media metadata and the audit trail",
      ],
    },
  },
  {
    num: "03",
    title: "ShortsCannon",
    short: "Video job pipeline. Learning .NET + Angular in anger.",
    stack: [".NET 9", "C#", "Angular 19", "EF Core", "SQL Server"],
    type: "oss",
    year: 2025,
    status: "active",
    repo: "github.com/PiotrRomanczuk/ShortsCannon",
    mockId: "shortscannon",
    details: {
      about:
        "Multi-platform short-video dispatcher and a deliberate learning project: the goal is to internalise .NET the way I know Next.js. Clean Architecture, CQRS via MediatR, EF Core against SQL Server, Angular 19 up front.",
      highlights: [
        "4-layer Clean Architecture — the domain never references infrastructure",
        "CQRS command/query handlers via MediatR, validation at the boundary",
        "EF Core migrations against SQL Server; tests on domain + application layers",
        "Angular 19 standalone components consuming the API",
      ],
    },
  },
  {
    num: "04",
    title: "Home-Ops",
    short:
      "Self-hosted platform on real hardware. Pi monitoring hub, Tailscale mesh, systemd services, nightly restic backups.",
    stack: ["Linux", "systemd", "Docker", "Tailscale", "Postgres", "Cloudflare Tunnel"],
    type: "tool",
    year: 2025,
    status: "internal",
    mockId: "homeops",
    metrics: ["4 hosts", "uptime kuma + beszel", "nightly restic → nas"],
    details: {
      about:
        "The platform under everything else: four machines on a Tailscale mesh, monitored from a Raspberry Pi hub, with nightly restic backups to a NAS. When a database, deploy target or GPU box misbehaves, this stack tells me before users do.",
      highlights: [
        "Uptime Kuma + Beszel dashboards on the Pi — uptime and host metrics in one place",
        "systemd units for every long-running service, so everything is reboot-safe",
        "Cloudflare Tunnel ingress — nothing port-forwarded on the router",
        "GPU box serves Ollama to the LAN; Ubuntu box runs the Supabase dev stack",
      ],
    },
  },
  {
    num: "05",
    title: "INBORR",
    short: "Apartment rental landing site. Shipped fast, still live.",
    stack: ["Next.js", "TypeScript", "Tailwind", "Playwright"],
    type: "site",
    year: 2024,
    status: "shipping",
    live: "inborr.pl",
    mockId: "inborr",
    details: {
      about:
        "Landing site for an apartment rental in Białystok — a real client and a real deadline. Scoped tight, shipped in days, and it still quietly does its job.",
      highlights: [
        "Static-first Next.js pages — image-heavy but fast on mobile data",
        "Playwright smoke tests guard the contact flow",
        "Polish-language content and metadata tuned for local search",
      ],
    },
  },
  {
    num: "06",
    title: "Pizzayolo",
    short: "Ordering UX sandbox. State machines + a11y.",
    stack: ["React", "TypeScript", "XState", "Vitest"],
    type: "experiment",
    year: 2023,
    status: "archived",
    repo: "github.com/PiotrRomanczuk/pizzayolo",
    mockId: "pizzayolo",
    details: {
      about:
        "A sandbox for ordering-flow UX: the whole checkout is an explicit XState statechart, so every edge case — payment failed, cart emptied mid-checkout — is a modelled transition instead of a bug report.",
      highlights: [
        "Cart → checkout → paid as a statechart; impossible states are unrepresentable",
        "Keyboard-first checkout with a11y as a design constraint, not an afterthought",
        "Vitest asserts on machine transitions directly — no DOM required",
        "Archived, but the patterns moved into Strummy",
      ],
    },
  },
];

export type FilterKey = "all" | "shipping" | ProjectType;

export const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "all" },
  { key: "shipping", label: "shipping" },
  { key: "oss", label: "oss" },
  { key: "tool", label: "tooling" },
  { key: "site", label: "sites" },
  { key: "experiment", label: "experiments" },
];
