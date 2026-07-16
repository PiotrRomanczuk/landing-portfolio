"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import "../../app/(main)/v5d.css";
import contrib from "@/data/github-contrib.json";
import { MagneticBtn } from "@/components/v5d/MagneticBtn";
import { CursorReticle } from "@/components/v5d/CursorReticle";
import { Reveal } from "@/components/v5d/Reveal";
import { ScrollProgress } from "@/components/v5d/ScrollProgress";
import { ProjectMock } from "@/components/v5d/ProjectMock";
import { FluencyTimeline, type FluencyRow } from "@/components/v5d/FluencyTimeline";
import { ProjectDetail } from "@/components/v5d/ProjectDetail";
import {
  PROJECTS,
  FILTERS,
  repoSlugFromUrl,
  type FilterKey,
} from "@/components/v5d/projects";
import type { GithubActivity, RepoStats } from "@/lib/data/github-activity";

export type WritingEntry = {
  date: string;
  title: string;
  kind: string;
  minutes: number;
  state: "draft" | "live";
  href: string;
};

type Props = {
  posts: WritingEntry[];
  activity: GithubActivity;
  /** Current "mon yyyy" label, computed server-side so it never goes stale. */
  stamp: string;
};

function buildAnchors(hasWriting: boolean) {
  const bases = hasWriting
    ? ["intro", "work", "stack", "writing", "now", "contact"]
    : ["intro", "work", "stack", "now", "contact"];
  return bases.map((id, i) => ({
    id,
    label: `${String(i).padStart(2, "0")} ${id}`,
  }));
}

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

const FLUENCY: FluencyRow[] = [
  { name: "TypeScript", startYear: 2019, endYear: 2026, use: "daily", group: "frontend" },
  { name: "Next.js / React", startYear: 2021, endYear: 2026, use: "daily", group: "frontend" },
  { name: "Tailwind", startYear: 2022, endYear: 2026, use: "daily", group: "frontend" },
  { name: "Node / Bun", startYear: 2020, endYear: 2026, use: "daily", group: "backend" },
  { name: "Postgres / SQL", startYear: 2019, endYear: 2026, use: "weekly", group: "backend" },
  { name: "Supabase", startYear: 2024, endYear: 2026, use: "daily", group: "backend" },
  { name: "Stripe (webhooks)", startYear: 2024, endYear: 2026, use: "weekly", group: "backend" },
  { name: ".NET / C#", startYear: 2024, endYear: 2026, use: "weekly", group: "backend" },
  { name: "Angular", startYear: 2025, endYear: 2026, use: "occasional", group: "frontend" },
  { name: "Python 3", startYear: 2023, endYear: 2026, use: "weekly", group: "backend" },
  { name: "Docker / Compose", startYear: 2021, endYear: 2026, use: "weekly", group: "infra" },
  { name: "Linux / systemd", startYear: 2021, endYear: 2026, use: "weekly", group: "infra" },
  { name: "GitHub Actions (CI)", startYear: 2022, endYear: 2026, use: "weekly", group: "infra" },
  { name: "Vercel / Fly", startYear: 2022, endYear: 2026, use: "weekly", group: "infra" },
  { name: "Tailscale / networking", startYear: 2024, endYear: 2026, use: "weekly", group: "infra" },
  { name: "Monitoring (Kuma · Beszel)", startYear: 2025, endYear: 2026, use: "weekly", group: "infra" },
  { name: "Claude Code / agents", startYear: 2025, endYear: 2026, use: "daily", group: "ai" },
  { name: "Copilot / Codex", startYear: 2023, endYear: 2026, use: "daily", group: "ai" },
  { name: "LLM APIs (OpenRouter · Ollama)", startYear: 2024, endYear: 2026, use: "weekly", group: "ai" },
  { name: "Playwright", startYear: 2023, endYear: 2026, use: "weekly", group: "testing" },
  { name: "Vitest / Jest", startYear: 2022, endYear: 2026, use: "daily", group: "testing" },
  { name: "XState", startYear: 2023, endYear: 2024, use: "past", group: "testing" },
];

function formatRelative(iso: string | null, now: number): string {
  if (!iso) return "—";
  const t = new Date(iso).getTime();
  const diff = now - t;
  const mins = Math.round(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 36) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 14) return `${days}d ago`;
  const weeks = Math.round(days / 7);
  return `${weeks}w ago`;
}

/**
 * Renders "—" on the server and during the first client render (so the
 * hydrated DOM always matches), then swaps in the real relative time after
 * mount. Avoids a hydration mismatch (React #418) against the up-to-an-hour
 * stale ISR-baked HTML.
 */
function RelativeTime({ iso }: { iso: string | null }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const stamp = () => setNow(Date.now());
    stamp();
  }, []);
  return <>{now === null ? "—" : formatRelative(iso, now)}</>;
}

const SMALL_CONTRIB = contrib.days.slice(-12 * 7).map((d) => ({
  opacity: [0, 0.25, 0.55, 0.9][d.intensity] ?? 0,
}));
const BIG_CONTRIB = contrib.days.map((d) => ({
  opacity: [0, 0.25, 0.55, 0.9][d.intensity] ?? 0,
}));

const KONAMI_ACCENT = "#22c55e";

const EMAIL = "p.romanczuk@gmail.com";
const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent(
  "Hi Piotr — about a role",
)}&body=${encodeURIComponent(
  "Hi Piotr,\n\nI came across your site and wanted to talk about a role at [company].\n\n— ",
)}`;

export default function V5DLanding({ posts, activity, stamp }: Props) {
  const hasWriting = posts.length > 0;
  const anchors = useMemo(() => buildAnchors(hasWriting), [hasWriting]);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  // Accent override: null lets CSS pick a theme-appropriate accent. Set to a
  // hex string only when overriding (e.g. konami).
  const [accentOverride, setAccentOverride] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [openNum, setOpenNum] = useState<string | null>(null);
  const [active, setActive] = useState("intro");
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState("");
  const [cmdSel, setCmdSel] = useState(0);
  const [time, setTime] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const accentTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cmdInputRef = useRef<HTMLInputElement | null>(null);
  const konamiIdx = useRef(0);

  // Theme: respect system preference on first render, persist user override.
  // setState in an effect is intentional here — we can't read localStorage /
  // matchMedia on the server, so we hydrate with "dark" and reconcile once.
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("v5d-theme") : null;
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      return;
    }
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    setTheme(prefersLight ? "light" : "dark");
  }, []);

  const setThemePersist = useCallback((next: "dark" | "light") => {
    setTheme(next);
    try { localStorage.setItem("v5d-theme", next); } catch {}
  }, []);

  const openProject = useMemo(
    () => PROJECTS.find((p) => p.num === openNum) ?? null,
    [openNum],
  );

  // Visible projects after filter
  const visible = useMemo(() => {
    return PROJECTS.filter((p) => {
      if (filter === "all") return true;
      if (filter === "shipping") return p.status === "shipping";
      return p.type === filter;
    });
  }, [filter]);

  // Live time (CET-ish)
  useEffect(() => {
    const tick = () => {
      const t = new Date();
      const hh = String(t.getUTCHours() + 1).padStart(2, "0");
      const mm = String(t.getUTCMinutes()).padStart(2, "0");
      setTime(`${hh}:${mm} cet`);
    };
    tick();
    const i = setInterval(tick, 30000);
    return () => clearInterval(i);
  }, []);

  // Scroll-spy via IntersectionObserver
  useEffect(() => {
    const ids = anchors.map((a) => a.id);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-30% 0px -55% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [anchors]);

  // Toast helper
  const flashToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      flashToast(`copied · ${EMAIL}`);
    } catch {
      flashToast("copy failed — long-press to copy");
    }
  }, [flashToast]);

  const triggerKonami = useCallback(() => {
    setAccentOverride(KONAMI_ACCENT);
    flashToast("konami unlocked · accent: terminal green (6s)");
    if (accentTimer.current) clearTimeout(accentTimer.current);
    accentTimer.current = setTimeout(() => setAccentOverride(null), 6000);
  }, [flashToast]);

  // Command palette
  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  const palette = [
    { l: "Jump → Intro", h: "g i", a: () => jumpTo("intro") },
    { l: "Jump → Work", h: "g w", a: () => jumpTo("work") },
    { l: "Jump → Stack", h: "g s", a: () => jumpTo("stack") },
    ...(hasWriting
      ? [{ l: "Jump → Writing", h: "g b", a: () => jumpTo("writing") }]
      : []),
    { l: "Jump → Now", h: "g n", a: () => jumpTo("now") },
    { l: "Jump → Contact", h: "g c", a: () => jumpTo("contact") },
    {
      l: `Email ${EMAIL}`,
      h: "↗",
      a: () => window.open(MAILTO, "_self"),
    },
    {
      l: "Copy email to clipboard",
      h: "⌘c",
      a: () => { void copyEmail(); },
    },
    {
      l: "Open GitHub",
      h: "↗",
      a: () => window.open("https://github.com/PiotrRomanczuk", "_blank"),
    },
    {
      l: "Toggle theme",
      h: "⇧t",
      a: () => setThemePersist(theme === "dark" ? "light" : "dark"),
    },
    {
      l: "Download CV",
      h: "↓",
      a: () => window.open("/Romanczuk_Piotr_CV.pdf", "_blank"),
    },
  ];

  const q = cmdQuery.toLowerCase();
  // Each palette entry holds an action closure that may eventually touch a
  // ref (toast timer). The lint rule traces transitively but the closures
  // only run on user input, never during render.
  // eslint-disable-next-line react-hooks/refs
  const filteredCmds = palette.filter((c) => c.l.toLowerCase().includes(q));

  const openCmd = useCallback(() => {
    setCmdQuery("");
    setCmdSel(0);
    setCmdOpen(true);
    setTimeout(() => cmdInputRef.current?.focus(), 10);
  }, []);
  const closeCmd = useCallback(() => setCmdOpen(false), []);

  // Global keys: ⌘K, ?, Konami
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openCmd();
        return;
      }
      if (
        e.key === "?" &&
        !cmdOpen &&
        (document.activeElement?.tagName ?? "") !== "INPUT"
      ) {
        openCmd();
        return;
      }
      // Konami
      if (e.key === KONAMI[konamiIdx.current]) {
        konamiIdx.current++;
        if (konamiIdx.current === KONAMI.length) {
          triggerKonami();
          konamiIdx.current = 0;
        }
      } else {
        konamiIdx.current = e.key === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openCmd, cmdOpen, triggerKonami]);

  const onCmdKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") return closeCmd();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCmdSel((s) => Math.min(filteredCmds.length - 1, s + 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setCmdSel((s) => Math.max(0, s - 1));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      filteredCmds[cmdSel]?.a();
      closeCmd();
    }
  };

  const accentBg = (opacity: number) =>
    opacity === 0
      ? undefined
      : `color-mix(in oklab, var(--accent) ${opacity * 100}%, transparent)`;

  const rootStyle = accentOverride
    ? ({ ["--accent" as string]: accentOverride } as React.CSSProperties)
    : undefined;

  return (
    <div
      className="v5d-root"
      data-theme={theme}
      style={rootStyle}
    >
      <ScrollProgress />
      <CursorReticle />

      <div className="shell">
        {/* LEFT GUTTER */}
        <aside className="gutter-l">
          <div className="gutter-l-sticky">
            <div
              className="mark"
              title="Konami code, anyone?"
              onClick={() => flashToast("hi 👋  ⌘K is your friend")}
            >
              pr
            </div>
            <div className="gutter-meta">
              <div>v5 · 2026</div>
              <div>warsaw, pl</div>
              <div className="available">● available</div>
            </div>
          </div>
        </aside>

        {/* MAIN COLUMN */}
        <main>
          {/* HERO */}
          <section className="hero" id="intro" data-anchor="intro">
            <div className="status">
              <span className="dot accent"></span>
              <span>piotr romanczuk / fullstack + infra / open to work</span>
            </div>
            <h1>
              I make products that{" "}
              <Reveal as="span" className="hl-wrap">
                <span className="hl">survive their first users</span>
              </Reveal>
              , then keep shipping past them.
            </h1>
            <p className="deck">
              Fullstack between Next.js and .NET. One SaaS live with paying
              users, a self-hosted ops stack on real hardware, and a long
              backlog of side things. I write code, run the boxes, answer the
              support, and read the receipts.
            </p>
            <div className="ctas">
              <MagneticBtn
                href="/Romanczuk_Piotr_CV.pdf"
                className="btn"
                download
              >
                <span className="accent-dot"></span> Download CV
                <span className="btn-suffix">↓ pdf</span>
              </MagneticBtn>
              <MagneticBtn href="#contact" className="btn ghost">
                Get in touch ↗
              </MagneticBtn>
            </div>
            <div className="not-for">
              <span className="lbl">not looking for</span>
              <span>CTO-for-hire</span>
              <span>·</span>
              <span>crypto</span>
              <span>·</span>
              <span>ML platforms</span>
            </div>
            <div className="stat-row stat-row-2">
              <div className="stat">
                <div className="lbl">Strummy · live</div>
                <div className="val">~25 users/day</div>
                <div className="sub">paying users since 2024</div>
              </div>
              <div className="stat">
                <div className="lbl">Last GitHub push</div>
                <div className="val"><RelativeTime iso={activity.lastPush} /></div>
                <div className="sub">
                  {activity.commitsLast30d} commits · last 30d
                </div>
              </div>
            </div>
          </section>

          {/* APPROACH */}
          <section id="approach" className="approach" aria-label="How I work">
            <div className="approach-eyebrow">{"// how i work"}</div>
            <div className="approach-grid">
              <div className="approach-tile">
                <div className="approach-num">01</div>
                <h4>Ship to real users early</h4>
                <p>
                  Production teaches faster than staging. I get a thin slice
                  in front of someone within a week, then iterate on what
                  actually breaks.
                </p>
              </div>
              <div className="approach-tile">
                <div className="approach-num">02</div>
                <h4>Own the receipts</h4>
                <p>
                  Logs, alerts, on-call, Stripe disputes, support email — I
                  write the code <i>and</i> read the inbox. The feedback loop
                  is the product.
                </p>
              </div>
              <div className="approach-tile">
                <div className="approach-num">03</div>
                <h4>Code that survives Monday</h4>
                <p>
                  Types at boundaries, tests on the hot paths, small files,
                  honest names. Future-me has to debug this at 11pm and
                  deserves a fair chance.
                </p>
              </div>
              <div className="approach-tile wide">
                <div className="approach-num">04</div>
                <h4>Agents on the team</h4>
                <p>
                  Claude Code and Codex are in my daily loop — driven like
                  sharp junior pairs: tight specs in, reviewed diffs out,
                  tests before merge. I also ship LLM features (OpenRouter,
                  self-hosted Ollama), and I stay accountable for every line
                  that ships. Leverage, not autopilot.
                </p>
              </div>
            </div>
          </section>

          {/* WORK */}
          <section id="work" data-anchor="work">
            <div className="section-head">
              <span className="lbl">§ 01 · work</span>
              <div className="rule"></div>
              <span className="meta">
                {String(visible.length).padStart(2, "0")} /{" "}
                {String(PROJECTS.length).padStart(2, "0")}
              </span>
            </div>

            <div className="filters">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  className={`pill${filter === f.key ? " on" : ""}`}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div style={{ marginTop: 14 }}>
              {PROJECTS.map((p, i) => {
                const hidden = !visible.includes(p);
                const repoStats: RepoStats | undefined =
                  activity.repos[repoSlugFromUrl(p.repo) ?? ""];
                return (
                  <Reveal
                    key={p.num}
                    delay={i * 60}
                    className={`work-row${hidden ? " hidden" : ""}${p.featured ? " featured" : ""}`}
                  >
                    <div
                      className="work-row-inner"
                      data-type={p.type}
                      data-status={p.status}
                      data-reticle
                      role="button"
                      tabIndex={0}
                      aria-label={`Open ${p.title} details`}
                      onClick={(e) => {
                        // Links inside the row (live / repo) keep their own behavior.
                        if ((e.target as HTMLElement).closest("a")) return;
                        setOpenNum(p.num);
                      }}
                      onKeyDown={(e) => {
                        if ((e.target as HTMLElement).closest("a")) return;
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setOpenNum(p.num);
                        }
                      }}
                    >
                      <div className="num">{p.num}</div>
                      <div>
                        {p.featured && (
                          <div className="featured-eyebrow">
                            <span className="dot accent s5"></span>
                            featured · live saas
                          </div>
                        )}
                        <div className="title-row">
                          <h3>{p.title}</h3>
                          {p.status === "shipping" && (
                            <span className="pill live">
                              <span className="dot s5"></span> live
                            </span>
                          )}
                          {p.status === "active" && (
                            <span className="pill accent">active</span>
                          )}
                          {p.status === "paused" && (
                            <span className="pill">paused</span>
                          )}
                          {p.status === "internal" && (
                            <span className="pill">internal</span>
                          )}
                          {p.status === "archived" && (
                            <span className="pill">archived</span>
                          )}
                        </div>
                        <p>{p.short}</p>
                        {p.metrics && p.metrics.length > 0 && (
                          <div className="metrics-row">
                            {p.metrics.map((m) => (
                              <span className="metric" key={m}>{m}</span>
                            ))}
                          </div>
                        )}
                        <div className="stack">
                          {p.stack.map((s) => (
                            <span className="chip" key={s}>
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="meta">
                        <span>{p.year}</span>
                        <span>{p.type}</span>
                        {repoStats?.pushedAt && (
                          <span title={`last push ${repoStats.pushedAt}`}>
                            ↳ <RelativeTime iso={repoStats.pushedAt} />
                          </span>
                        )}
                        {repoStats && repoStats.stars > 0 && (
                          <span>★ {repoStats.stars}</span>
                        )}
                        {p.live && (
                          <a
                            className="live"
                            href={`https://${p.live}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            ↗ live
                          </a>
                        )}
                        {p.repo && (
                          <a
                            href={`https://${p.repo}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            ↗ repo
                          </a>
                        )}
                        <button
                          type="button"
                          className="details-link"
                          onClick={() => setOpenNum(p.num)}
                          tabIndex={-1}
                        >
                          + details
                        </button>
                      </div>
                      <div
                        className="shot-pop"
                        data-label={`fig.${p.num} — ${p.title}`}
                      >
                        <ProjectMock id={p.mockId} />
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </section>

          {/* STACK */}
          <section id="stack" data-anchor="stack">
            <div className="section-head">
              <span className="lbl">§ 02 · stack</span>
              <div className="rule"></div>
              <span className="meta">what i reach for</span>
            </div>
            <p className="stack-intro">
              Not a logo grid. Tools I&apos;ve actually shipped with, plotted
              against time so you can see what I&apos;m fluent in <i>now</i>{" "}
              versus what I picked up last week.
            </p>
            <FluencyTimeline rows={FLUENCY} />
            <p className="fluency-footnote">
              2019–2020 was self-taught, pre-professional coding; daily,
              on-the-job use starts 2021.
            </p>
          </section>

          {/* WRITING (rendered only when posts exist) */}
          {hasWriting && (
            <section id="writing" data-anchor="writing">
              <div className="section-head">
                <span className="lbl">§ 03 · writing</span>
                <div className="rule"></div>
                <Link className="section-link" href="/blog">
                  archive ↗
                </Link>
              </div>
              <div>
                {posts.map((w) => (
                  <Link className="write-row" href={w.href} key={w.title}>
                    <span className="date">{w.date}</span>
                    <div className="ttl">
                      {w.title}
                      {w.kind ? <span className="kind">· {w.kind}</span> : null}
                    </div>
                    <div className="write-meta">
                      {w.state === "draft" ? (
                        <span className="pill draft">draft</span>
                      ) : null}
                      {w.minutes > 0 ? (
                        <span className="rt">{w.minutes} min</span>
                      ) : null}
                      <span className="arr">↗</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* NOW */}
          <section id="now" data-anchor="now">
            <div className="section-head">
              <span className="lbl">now</span>
              <div className="rule"></div>
              <span className="meta">{time}</span>
            </div>
            <div className="now-grid">
              <div className="now-block">
                <h5>
                  <span className="dot accent s5"></span> current focus
                </h5>
                <p>
                  Shipping <b>Strummy v3</b> — invoicing &amp; billing. Last
                  push <b><RelativeTime iso={activity.lastPush} /></b>, three open
                  issues, none on fire. Side: re-reading{" "}
                  <i>Designing Data-Intensive Applications</i>.
                </p>
                <div className="contrib-big" aria-hidden="true">
                  {BIG_CONTRIB.map((c, i) => (
                    <span key={i} style={{ background: accentBg(c.opacity) }} />
                  ))}
                </div>
                <div className="contrib-foot">
                  <span>
                    {activity.commitsLast30d} commits · last 30d
                  </span>
                  <span className="accent-text">
                    +{activity.commitsThisWeek} this week
                  </span>
                </div>
              </div>
              <div className="now-block">
                <h5>
                  <span className="dot accent s5"></span> reading · listening
                </h5>
                <ul className="reads">
                  <li>
                    Designing Data-Intensive Apps
                    <span className="by">· Kleppmann</span>
                  </li>
                  <li>
                    How Big Things Get Done <span className="by">· Flyvbjerg</span>
                  </li>
                  <li>
                    Working in Public <span className="by">· Eghbal</span>
                  </li>
                  <li>
                    Acquired podcast <span className="by">· current: Costco</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* CONTACT */}
          <section id="contact" data-anchor="contact">
            <div className="section-head">
              <span className="lbl">{`§ ${hasWriting ? "05" : "04"} · contact`}</span>
              <div className="rule"></div>
              <span className="meta">{stamp}</span>
            </div>
            <p className="contact-pitch">
              Looking for a <span>fullstack or devops</span> role.
              <br />
              Write to{" "}
              <button
                type="button"
                className="pitch-email"
                onClick={copyEmail}
                aria-label="Copy email to clipboard"
                title="Click to copy"
              >
                {EMAIL}
              </button>
            </p>
            <div className="contact-grid">
              <div className="contact-blurb">
                Best bet: email — I answer in a day, two if I&apos;m shipping.
                Available for full-time, contract, or contract-to-hire. Remote
                across EU; happy to travel for onsites in the first weeks.
              </div>
              <div className="channels">
                <button
                  type="button"
                  className="channel-btn"
                  onClick={copyEmail}
                >
                  <span>Email</span>
                  <span className="href">{EMAIL}</span>
                  <span className="sla">click to copy</span>
                </button>
                <a
                  href="https://github.com/PiotrRomanczuk"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>GitHub</span>
                  <span className="href">@PiotrRomanczuk</span>
                  <span className="sla">DMs open</span>
                </a>
                <a href="/Romanczuk_Piotr_CV.pdf" target="_blank" rel="noopener noreferrer">
                  <span>CV (PDF)</span>
                  <span className="href">Romanczuk_Piotr_CV.pdf</span>
                  <span className="sla">latest</span>
                </a>
              </div>
            </div>

            <div className="colophon">
              <div>piotr romanczuk · v5 · 2026 · warsaw</div>
              <div>
                built with next · tailwind ·{" "}
                <a href="#intro" style={{ color: "var(--accent)" }}>
                  ↑ to top
                </a>
              </div>
            </div>
          </section>
        </main>

        {/* RIGHT GUTTER: anchor rail + now */}
        <aside className="gutter-r">
          <div className="gutter-r-sticky">
            <nav className="anchors">
              <div className="eyebrow">on this page</div>
              {anchors.map((a) => (
                <a
                  key={a.id}
                  href={`#${a.id}`}
                  className={active === a.id ? "on" : ""}
                >
                  <span className="bar"></span>
                  <span>{a.label}</span>
                </a>
              ))}
            </nav>

            <div className="now-card">
              <div className="eyebrow">
                <span className="dot accent s5"></span> {"// now"}
              </div>
              <div className="focus">
                <b>Strummy v3</b> · invoicing &amp; billing
              </div>
              <div className="contrib" aria-hidden="true">
                {SMALL_CONTRIB.map((c, i) => (
                  <span key={i} style={{ background: accentBg(c.opacity) }} />
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* PROJECT DETAIL CARD */}
      {openProject && (
        <ProjectDetail project={openProject} onClose={() => setOpenNum(null)} />
      )}

      {/* COMMAND HINT */}
      <button
        type="button"
        className="cmd-hint"
        onClick={openCmd}
        title="Open command palette"
      >
        <kbd>⌘</kbd>
        <kbd>K</kbd>
        <span>jump anywhere</span>
      </button>

      {/* COMMAND PALETTE */}
      <div
        className={`cmd-overlay${cmdOpen ? " open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeCmd();
        }}
      >
        <div className="cmd-panel" role="dialog" aria-label="Command palette">
          <input
            ref={cmdInputRef}
            type="text"
            className="cmd-input"
            placeholder="Type to filter — Enter to jump, Esc to close…"
            value={cmdQuery}
            onChange={(e) => {
              setCmdQuery(e.target.value);
              setCmdSel(0);
            }}
            onKeyDown={onCmdKey}
          />
          <div className="cmd-list">
            {filteredCmds.length === 0 ? (
              <div className="cmd-item" style={{ color: "var(--muted)" }}>
                <span>No matches</span>
                <span className="meta">—</span>
              </div>
            ) : (
              filteredCmds.map((c, i) => (
                <div
                  key={c.l}
                  className={`cmd-item${i === cmdSel ? " on" : ""}`}
                  onMouseEnter={() => setCmdSel(i)}
                  onClick={() => {
                    c.a();
                    closeCmd();
                  }}
                >
                  <span>{c.l}</span>
                  <span className="meta">{c.h}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* TOAST */}
      <div role="status" aria-live="polite" className={`toast${toast ? " show" : ""}`}>
        {toast ?? ""}
      </div>
    </div>
  );
}
