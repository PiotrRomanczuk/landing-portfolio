import { CVSection } from "./cv-section";

const experience = [
  {
    period: "2022 — Present",
    role: "Guitar Teacher",
    description:
      "Full-time guitar instructor providing private and group lessons. Building curriculum, managing student progress, and running an independent teaching practice.",
  },
  {
    period: "2021 — Present",
    role: "Software Engineer (Self-taught)",
    description:
      "Self-taught full-stack developer. Progressed from JavaScript fundamentals through React and TypeScript to shipping production Next.js apps with auth, databases, and CI/CD. Currently running multiple live products — business CRMs, real-time data visualizations, and commercial client projects.",
  },
  {
    period: "2020 — 2022",
    role: "Refurbished PC & Parts Sales",
    description:
      "Sourced, refurbished, and sold electrical PCs and components. Managed inventory, pricing, customer relations, and end-to-end sales operations.",
  },
  {
    period: "2015 — 2020",
    role: "International Chef",
    description:
      "Professional chef working in international kitchen environments. Developed strong time management, teamwork under pressure, and creative problem-solving skills across diverse culinary settings.",
  },
];

export function CVTimeline() {
  return (
    <CVSection title="Experience">
      <div className="flex flex-col gap-3" role="list" aria-label="Professional experience">
        {experience.map((item) => (
          <div
            key={item.role}
            className="page-break-avoid flex gap-4"
            role="listitem"
          >
            {/* Period */}
            <div className="flex-shrink-0 w-[100px] pt-0.5">
              <time
                className="text-[11px] font-semibold font-mono tabular-nums"
                style={{ color: "var(--cv-accent)" }}
              >
                {item.period}
              </time>
            </div>

            {/* Content */}
            <div className="flex-1 border-l-2 border-[var(--cv-divider)] pl-4">
              <h3 className="text-sm font-semibold leading-tight" style={{ color: "#111827" }}>
                {item.role}
              </h3>
              <p className="mt-1 text-xs text-[var(--cv-subtle)] leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </CVSection>
  );
}
