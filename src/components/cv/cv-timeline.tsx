import { CVSection } from "./cv-section";

const mainBullets = [
  "Self-taught path: JavaScript → React → TypeScript → full-stack Next.js with auth, databases, and CI/CD",
  "Built and shipped 2 production SaaS apps with 1,750+ combined tests and 35+ releases",
  "Integrated 5+ external APIs (Spotify, Google Calendar, Meta Graph, OpenRouter, Vercel)",
  "Delivered commercial client projects — dashboards, CRMs, and data visualization tools",
];

const previousBullets = [
  "Guitar Teacher (2022–Present) — private lessons, curriculum design, student management",
  "PC Sales Consultant (2020–2022) — technical advisory, e-commerce, B2C sales",
  "International Chef (2015–2020) — worked in Poland, Ireland, and Netherlands",
];

export function CVTimeline() {
  return (
    <CVSection title="Background">
      <div className="flex flex-col gap-3" role="list" aria-label="Professional background">
        {/* Main tech role */}
        <div className="page-break-avoid flex gap-4" role="listitem">
          <div className="flex-shrink-0 w-[100px] pt-0.5">
            <time
              className="text-[11px] font-semibold font-mono tabular-nums"
              style={{ color: "var(--cv-accent)" }}
            >
              2021 — Present
            </time>
          </div>
          <div className="flex-1 border-l-2 border-[var(--cv-divider)] pl-4">
            <h3 className="text-sm font-semibold leading-tight" style={{ color: "#111827" }}>
              Software Engineer &amp; Entrepreneur (Self-taught)
            </h3>
            <ul className="mt-1 text-xs text-[var(--cv-subtle)] leading-snug space-y-0.5 list-disc pl-4">
              {mainBullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Previous roles */}
        <div className="page-break-avoid flex gap-4" role="listitem">
          <div className="flex-shrink-0 w-[100px] pt-0.5">
            <time
              className="text-[11px] font-semibold font-mono tabular-nums"
              style={{ color: "var(--cv-accent)" }}
            >
              2015 — 2022
            </time>
          </div>
          <div className="flex-1 border-l-2 border-[var(--cv-divider)] pl-4">
            <h3 className="text-sm font-semibold leading-tight" style={{ color: "#111827" }}>
              Previous Roles
            </h3>
            <ul className="mt-1 text-xs text-[var(--cv-subtle)] leading-snug space-y-0.5 list-disc pl-4">
              {previousBullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </CVSection>
  );
}
