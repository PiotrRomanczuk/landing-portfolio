import { CVSection } from "./cv-section";

interface TimelineEntry {
  dates: string;
  title: string;
  description: string;
}

const defaultMainBullets = [
  "Self-taught path: JavaScript \u2192 React \u2192 TypeScript \u2192 full-stack Next.js with auth, databases, and CI/CD",
  "Built and shipped 2 production SaaS apps with 1,750+ combined tests and 35+ releases",
  "Integrated 5+ external APIs (Spotify, Google Calendar, Meta Graph, OpenRouter, Vercel)",
  "Delivered commercial client projects \u2014 dashboards, CRMs, and data visualization tools",
];

const defaultPreviousBullets = [
  "Guitar Teacher (2022\u2013Present) \u2014 private lessons, curriculum design, student management",
  "PC Sales Consultant (2020\u20132022) \u2014 technical advisory, e-commerce, B2C sales",
  "International Chef (2015\u20132020) \u2014 worked in Poland, Ireland, and Netherlands",
];

interface CVTimelineProps {
  entries?: TimelineEntry[];
}

export function CVTimeline({ entries }: CVTimelineProps) {
  // When entries are provided, render them all uniformly
  if (entries) {
    return (
      <CVSection title="Experience">
        <div
          className="flex flex-col gap-3"
          role="list"
          aria-label="Professional background"
        >
          {entries.map((entry) => (
            <div
              key={entry.title}
              className="page-break-avoid flex gap-4"
              role="listitem"
            >
              <div className="flex-shrink-0 w-[100px] pt-0.5">
                <time
                  className="text-[11px] font-semibold font-mono tabular-nums"
                  style={{ color: "var(--cv-accent)" }}
                >
                  {entry.dates}
                </time>
              </div>
              <div className="flex-1 border-l-2 border-[var(--cv-divider)] pl-4">
                <h3
                  className="text-sm font-semibold leading-tight"
                  style={{ color: "#111827" }}
                >
                  {entry.title}
                </h3>
                <p className="mt-1 text-xs text-[var(--cv-subtle)] leading-snug">
                  {entry.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CVSection>
    );
  }

  // Default: original hardcoded format with bullet lists
  return (
    <CVSection title="Experience">
      <div
        className="flex flex-col gap-3"
        role="list"
        aria-label="Professional background"
      >
        {/* Main tech role */}
        <div className="page-break-avoid flex gap-4" role="listitem">
          <div className="flex-shrink-0 w-[100px] pt-0.5">
            <time
              className="text-[11px] font-semibold font-mono tabular-nums"
              style={{ color: "var(--cv-accent)" }}
            >
              2021 &mdash; Present
            </time>
          </div>
          <div className="flex-1 border-l-2 border-[var(--cv-divider)] pl-4">
            <h3
              className="text-sm font-semibold leading-tight"
              style={{ color: "#111827" }}
            >
              Software Engineer &amp; Entrepreneur (Self-taught)
            </h3>
            <ul className="mt-1 text-xs text-[var(--cv-subtle)] leading-snug space-y-0.5 list-disc pl-4">
              {defaultMainBullets.map((bullet) => (
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
              2015 &mdash; 2022
            </time>
          </div>
          <div className="flex-1 border-l-2 border-[var(--cv-divider)] pl-4">
            <h3
              className="text-sm font-semibold leading-tight"
              style={{ color: "#111827" }}
            >
              Previous Roles
            </h3>
            <ul className="mt-1 text-xs text-[var(--cv-subtle)] leading-snug space-y-0.5 list-disc pl-4">
              {defaultPreviousBullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </CVSection>
  );
}
