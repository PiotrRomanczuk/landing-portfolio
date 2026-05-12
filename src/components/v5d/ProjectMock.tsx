"use client";

import type { ReactElement, ReactNode } from "react";

/**
 * Faked-but-believable mini product mocks shown in the work-row
 * hover popover. Each mock is a tiny self-contained SVG-or-DOM
 * sketch — not a real screenshot, but the silhouette is honest.
 */

type Key = "strummy" | "stories" | "shortscannon" | "inborr" | "pizzayolo";

function Shell({ title, host, children }: { title: string; host: string; children: ReactNode }) {
  return (
    <div className="mock-shell">
      <div className="mock-chrome">
        <span className="d r" />
        <span className="d y" />
        <span className="d g" />
        <span className="mock-host">{host}</span>
      </div>
      <div className="mock-body" aria-label={title}>
        {children}
      </div>
    </div>
  );
}

function Strummy() {
  return (
    <Shell title="Strummy dashboard" host="strummy.app/dashboard">
      <div className="mk-row mk-head">
        <span className="mk-pill">12 students</span>
        <span className="mk-pill on">€ 1,840 mrr</span>
      </div>
      <div className="mk-cal">
        {Array.from({ length: 28 }).map((_, i) => (
          <span key={i} data-on={[2, 5, 9, 11, 14, 18, 22, 25].includes(i) ? "1" : "0"} />
        ))}
      </div>
      <div className="mk-row">
        <span className="mk-bar" style={{ width: "62%" }} />
        <span className="mk-tag">tue 16:00 · Marek</span>
      </div>
      <div className="mk-row">
        <span className="mk-bar" style={{ width: "44%" }} />
        <span className="mk-tag">wed 18:30 · Ania</span>
      </div>
    </Shell>
  );
}

function Stories() {
  return (
    <Shell title="Stories queue" host="stories.internal/queue">
      <div className="mk-row mk-head">
        <span className="mk-pill on">queued · 14</span>
        <span className="mk-pill">retried · 2</span>
      </div>
      {["@brand_a · 09:14", "@brand_b · 09:30", "@brand_c · 10:00", "@brand_d · 10:12"].map((t, i) => (
        <div className="mk-row mk-job" key={t}>
          <span className="mk-dot" data-state={i === 0 ? "ok" : i === 1 ? "run" : "wait"} />
          <span className="mk-tag mono">{t}</span>
          <span className="mk-bar" style={{ width: `${[100, 64, 22, 4][i]}%` }} />
        </div>
      ))}
    </Shell>
  );
}

function ShortsCannon() {
  return (
    <Shell title="ShortsCannon API" host="localhost:5210/swagger">
      <pre className="mk-code">
        <span className="kw">POST</span> /api/v1/jobs
        {"\n"}
        <span className="kw">200</span> &#123; id, status: queued &#125;
        {"\n"}
        <span className="dim">{"// MediatR · CQRS · EF Core"}</span>
      </pre>
      <div className="mk-row">
        <span className="mk-bar" style={{ width: "78%" }} />
        <span className="mk-tag mono">tiktok ✓</span>
      </div>
      <div className="mk-row">
        <span className="mk-bar" style={{ width: "55%" }} />
        <span className="mk-tag mono">ig ✓</span>
      </div>
    </Shell>
  );
}

function Inborr() {
  return (
    <Shell title="INBORR" host="inborr.pl">
      <div className="mk-hero">
        <div className="mk-h1">Apartament 4D</div>
        <div className="mk-h2">Białystok · 52 m²</div>
      </div>
      <div className="mk-thumbs">
        <span /><span /><span /><span />
      </div>
      <div className="mk-row">
        <span className="mk-pill on">3 200 zł / mc</span>
        <span className="mk-pill">dostępne</span>
      </div>
    </Shell>
  );
}

function Pizzayolo() {
  return (
    <Shell title="Pizzayolo cart" host="pizzayolo.dev">
      <div className="mk-state">cart → checkout → paid</div>
      <div className="mk-stepper">
        <span data-on="1" /><span data-on="1" /><span data-on="0" />
      </div>
      <div className="mk-row">
        <span className="mk-tag">Margherita ×2</span>
        <span className="mk-tag mono">38 zł</span>
      </div>
      <div className="mk-row">
        <span className="mk-tag">Napoli ×1</span>
        <span className="mk-tag mono">22 zł</span>
      </div>
    </Shell>
  );
}

const REGISTRY: Record<Key, () => ReactElement> = {
  strummy: Strummy,
  stories: Stories,
  shortscannon: ShortsCannon,
  inborr: Inborr,
  pizzayolo: Pizzayolo,
};

export function ProjectMock({ id }: { id: Key }) {
  const C = REGISTRY[id];
  return <C />;
}

export type ProjectMockId = Key;
