"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./v5d.css";
import contrib from "@/data/github-contrib.json";
import { MagneticBtn } from "@/components/v5d/MagneticBtn";
import { CursorReticle } from "@/components/v5d/CursorReticle";
import { Reveal } from "@/components/v5d/Reveal";
import { ScrollProgress } from "@/components/v5d/ScrollProgress";
import { ProjectMock, type ProjectMockId } from "@/components/v5d/ProjectMock";
import { FluencyTimeline, type FluencyRow } from "@/components/v5d/FluencyTimeline";

type Status = "shipping" | "active" | "internal" | "archived";
type ProjectType = "saas" | "tool" | "oss" | "site" | "experiment";

type Project = {
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
};

const PROJECTS: Project[] = [
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
  },
  {
    num: "04",
    title: "INBORR",
    short: "Apartment rental landing site. Shipped fast, still live.",
    stack: ["Next.js", "TypeScript", "Tailwind", "Playwright"],
    type: "site",
    year: 2024,
    status: "shipping",
    live: "inborr.pl",
    mockId: "inborr",
  },
  {
    num: "05",
    title: "Pizzayolo",
    short: "Ordering UX sandbox. State machines + a11y.",
    stack: ["React", "TypeScript", "XState", "Vitest"],
    type: "experiment",
    year: 2023,
    status: "archived",
    repo: "github.com/PiotrRomanczuk/pizzayolo",
    mockId: "pizzayolo",
  },
];

type FilterKey = "all" | "shipping" | ProjectType;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "all" },
  { key: "shipping", label: "shipping" },
  { key: "oss", label: "oss" },
  { key: "tool", label: "tooling" },
  { key: "site", label: "sites" },
  { key: "experiment", label: "experiments" },
];

const ANCHORS = [
  { id: "intro", label: "00 intro" },
  { id: "work", label: "01 work" },
  { id: "stack", label: "02 stack" },
  { id: "writing", label: "03 writing" },
  { id: "now", label: "04 now" },
  { id: "contact", label: "05 contact" },
];

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

const WRITING = [
  { date: "Mar · 2026", title: "Stripe webhooks that don't lie to you", kind: "billing engineering", minutes: 8, state: "draft" as const },
  { date: "Jan · 2026", title: "A year of running a tiny SaaS solo", kind: "postmortem", minutes: 12, state: "live" as const },
  { date: "Nov · 2025", title: ".NET 9 from a TypeScript brain", kind: "learning notes", minutes: 6, state: "live" as const },
  { date: "Aug · 2025", title: "Playwright as a deploy pipeline", kind: "tooling", minutes: 5, state: "live" as const },
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
  { name: "Vercel / Fly", startYear: 2022, endYear: 2026, use: "weekly", group: "infra" },
  { name: "Playwright", startYear: 2023, endYear: 2026, use: "weekly", group: "testing" },
  { name: "Vitest / Jest", startYear: 2022, endYear: 2026, use: "daily", group: "testing" },
  { name: "XState", startYear: 2023, endYear: 2024, use: "past", group: "testing" },
];

function formatRelative(iso: string | null): string {
  if (!iso) return "—";
  const t = new Date(iso).getTime();
  const diff = Date.now() - t;
  const mins = Math.round(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 36) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 14) return `${days}d ago`;
  const weeks = Math.round(days / 7);
  return `${weeks}w ago`;
}

const SMALL_CONTRIB = contrib.days.slice(-12 * 7).map((d) => ({
  opacity: [0, 0.25, 0.55, 0.9][d.intensity] ?? 0,
}));
const BIG_CONTRIB = contrib.days.map((d) => ({
  opacity: [0, 0.25, 0.55, 0.9][d.intensity] ?? 0,
}));

const DEFAULT_ACCENT = "#F5B453";
const KONAMI_ACCENT = "#22c55e";

export default function V5DPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [accent, setAccent] = useState(DEFAULT_ACCENT);
  const [filter, setFilter] = useState<FilterKey>("all");
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
    const ids = ANCHORS.map((a) => a.id);
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
  }, []);

  // Toast helper
  const flashToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const triggerKonami = useCallback(() => {
    setAccent(KONAMI_ACCENT);
    flashToast("konami unlocked · accent: terminal green (6s)");
    if (accentTimer.current) clearTimeout(accentTimer.current);
    accentTimer.current = setTimeout(() => setAccent(DEFAULT_ACCENT), 6000);
  }, [flashToast]);

  // Command palette
  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  const palette = [
    { l: "Jump → Intro", h: "g i", a: () => jumpTo("intro") },
    { l: "Jump → Work", h: "g w", a: () => jumpTo("work") },
    { l: "Jump → Stack", h: "g s", a: () => jumpTo("stack") },
    { l: "Jump → Writing", h: "g b", a: () => jumpTo("writing") },
    { l: "Jump → Now", h: "g n", a: () => jumpTo("now") },
    { l: "Jump → Contact", h: "g c", a: () => jumpTo("contact") },
    {
      l: "Email p.romanczuk@gmail.com",
      h: "↗",
      a: () => window.open("mailto:p.romanczuk@gmail.com", "_self"),
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
      : `color-mix(in oklab, ${accent} ${opacity * 100}%, transparent)`;

  return (
    <div
      className="v5d-root"
      data-theme={theme}
      style={{ ["--accent" as string]: accent }}
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
              <span>piotr romanczuk / fullstack / open to mid+senior</span>
            </div>
            <h1>
              I make products that{" "}
              <Reveal as="span" className="hl-wrap">
                <span className="hl">survive their first users</span>
              </Reveal>
              , then keep shipping past them.
            </h1>
            <p className="deck">
              Seven years between Next.js and .NET. One SaaS live with paying
              users, a tooling stack in Python, and a long backlog of side
              things. I write code, run the boxes, answer the support, and read
              the receipts.
            </p>
            <div className="ctas">
              <MagneticBtn href="#contact" className="btn">
                <span className="accent-dot"></span> Get in touch
              </MagneticBtn>
              <MagneticBtn
                href="/Romanczuk_Piotr_CV.pdf"
                className="btn ghost"
                target="_blank"
                rel="noopener noreferrer"
              >
                cv.pdf ↗
              </MagneticBtn>
            </div>
            <div className="not-for">
              <span className="lbl">not looking for</span>
              <span>agency CTO</span>
              <span>·</span>
              <span>crypto</span>
              <span>·</span>
              <span>ML platforms</span>
            </div>
            <div className="stat-row stat-row-2">
              <div className="stat">
                <div className="lbl">Strummy · live</div>
                <div className="val">~25 dau</div>
                <div className="sub">paying users since 2024</div>
              </div>
              <div className="stat">
                <div className="lbl">Last GitHub push</div>
                <div className="val">{formatRelative(contrib.lastPush)}</div>
                <div className="sub">
                  {contrib.commitsLast30d} commits · last 30d
                </div>
              </div>
            </div>
          </section>

          {/* WORK */}
          <section id="work" data-anchor="work">
            <div className="section-head">
              <span className="lbl">§ 01 · work</span>
              <div className="rule"></div>
              <span className="meta">
                {String(visible.length).padStart(2, "0")} / 05
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
                return (
                  <Reveal
                    key={p.num}
                    delay={i * 60}
                    className={`work-row${hidden ? " hidden" : ""}`}
                  >
                    <div
                      className="work-row-inner"
                      data-type={p.type}
                      data-status={p.status}
                      data-reticle
                    >
                      <div className="num">{p.num}</div>
                      <div>
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
                          {p.status === "internal" && (
                            <span className="pill">internal</span>
                          )}
                          {p.status === "archived" && (
                            <span className="pill">archived</span>
                          )}
                        </div>
                        <p>{p.short}</p>
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
          </section>

          {/* WRITING */}
          <section id="writing" data-anchor="writing">
            <div className="section-head">
              <span className="lbl">§ 03 · writing</span>
              <div className="rule"></div>
              <span className="meta">infrequent, honest</span>
            </div>
            <div>
              {WRITING.map((w) => (
                <a className="write-row" href="#" key={w.title}>
                  <span className="date">{w.date}</span>
                  <div className="ttl">
                    {w.title}
                    <span className="kind">· {w.kind}</span>
                  </div>
                  <div className="write-meta">
                    {w.state === "draft" ? (
                      <span className="pill draft">draft</span>
                    ) : null}
                    <span className="rt">{w.minutes} min</span>
                    <span className="arr">↗</span>
                  </div>
                </a>
              ))}
            </div>
          </section>

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
                  Shipping <b>Strummy v3</b> — invoicing &amp; reminders. Last
                  push <b>{formatRelative(contrib.lastPush)}</b>, three open
                  issues, none on fire. Side: re-reading{" "}
                  <i>Designing Data-Intensive Applications</i>.
                </p>
                <div className="contrib-big">
                  {BIG_CONTRIB.map((c, i) => (
                    <span key={i} style={{ background: accentBg(c.opacity) }} />
                  ))}
                </div>
                <div className="contrib-foot">
                  <span>
                    {contrib.commitsLast30d} commits · last 30d
                  </span>
                  <span className="accent-text">
                    +{contrib.commitsThisWeek} this week
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
              <span className="lbl">§ 05 · contact</span>
              <div className="rule"></div>
              <span className="meta">may 2026</span>
            </div>
            <p className="contact-pitch">
              Looking for a <span>senior fullstack</span> role.
              <br />
              Write to{" "}
              <a
                href="mailto:p.romanczuk@gmail.com"
                style={{ borderBottom: "1px solid var(--rule-hi)" }}
              >
                p.romanczuk@gmail.com
              </a>
              .
            </p>
            <div className="contact-grid">
              <div className="contact-blurb">
                Best bet: email — I answer in a day, two if I&apos;m shipping.
                Available for full-time, contract, or contract-to-hire. Remote
                across EU; happy to travel for onsites in the first weeks.
              </div>
              <div className="channels">
                <a href="mailto:p.romanczuk@gmail.com">
                  <span>Email</span>
                  <span className="href">p.romanczuk@gmail.com</span>
                  <span className="sla">~24h</span>
                </a>
                <a
                  href="https://github.com/PiotrRomanczuk"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>GitHub</span>
                  <span className="href">@PiotrRomanczuk</span>
                  <span className="sla">DMs open</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/piotr-romanczuk/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>LinkedIn</span>
                  <span className="href">/in/piotr-romanczuk</span>
                  <span className="sla">~3d</span>
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
                built with next · tailwind · framer-motion ·{" "}
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
              {ANCHORS.map((a) => (
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
                <b>Strummy v3</b> · billing
              </div>
              <div className="contrib">
                {SMALL_CONTRIB.map((c, i) => (
                  <span key={i} style={{ background: accentBg(c.opacity) }} />
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* COMMAND HINT */}
      <div className="cmd-hint" onClick={openCmd} title="Open command palette">
        <kbd>⌘</kbd>
        <kbd>K</kbd>
        <span>jump anywhere</span>
      </div>

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
      <div className={`toast${toast ? " show" : ""}`}>{toast ?? ""}</div>
    </div>
  );
}
