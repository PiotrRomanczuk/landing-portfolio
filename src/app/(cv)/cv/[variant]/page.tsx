import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CVHeader } from "@/components/cv/cv-header";
import { CVSummary } from "@/components/cv/cv-summary";
import { CVSkills } from "@/components/cv/cv-skills";
import { CVTimeline } from "@/components/cv/cv-timeline";
import { CVProjects } from "@/components/cv/cv-projects";
import { CVVariantNav } from "@/components/cv/cv-variant-nav";
import {
  type CVVariant,
  variants,
  getProjectsForVariant,
  getSkillsForVariant,
  getTimelineForVariant,
  expandingSkills,
  education,
} from "@/data/cv-data";

const VALID_VARIANTS: CVVariant[] = [
  "fullstack",
  "frontend",
  "backend",
  "devops",
];

export function generateStaticParams() {
  return VALID_VARIANTS.map((variant) => ({ variant }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ variant: string }>;
}): Promise<Metadata> {
  const { variant } = await params;
  if (!VALID_VARIANTS.includes(variant as CVVariant)) return {};
  const config = variants[variant as CVVariant];
  const variantDescriptions: Record<CVVariant, string> = {
    fullstack: "Full-stack Software Engineer CV — TypeScript, React, Next.js, Supabase. Production SaaS experience with 3 deployed apps.",
    frontend: "Frontend Developer CV — React, TypeScript, Next.js, Tailwind CSS. Responsive, accessible web applications with real-time features.",
    backend: "Backend Developer CV — Node.js, TypeScript, PostgreSQL, Docker. APIs, data pipelines, and cloud infrastructure.",
    devops: "Junior DevOps Engineer CV — CI/CD, Docker, GitHub Actions, Vercel. Infrastructure automation and monitoring.",
  };
  return {
    title: `Piotr Romanczuk — ${config.title}`,
    description: variantDescriptions[variant as CVVariant],
    alternates: {
      canonical: `/cv/${variant}`,
    },
  };
}

export default async function CVVariantPage({
  params,
}: {
  params: Promise<{ variant: string }>;
}) {
  const { variant: variantParam } = await params;
  if (!VALID_VARIANTS.includes(variantParam as CVVariant)) notFound();

  const variant = variantParam as CVVariant;
  const config = variants[variant];
  const projectsData = getProjectsForVariant(variant);
  const skillsData = getSkillsForVariant(variant);
  const timelineData = getTimelineForVariant(variant);

  return (
    <div
      className="cv-light min-h-screen font-sans py-8 px-4 sm:px-6"
      style={{
        background: "#f0f0f0",
        color: "#111",
        ["--cv-accent" as string]: "#2563eb",
        ["--cv-accent-light" as string]: "#eff6ff",
        ["--cv-divider" as string]: "#d1d5db",
        ["--cv-subtle" as string]: "#6b7280",
        ["--cv-year" as string]: "#2563eb",
      }}
    >
      <CVVariantNav currentVariant={variant} />
      <main
        className="cv-page mx-auto w-[780px] min-h-[1103px] shadow-sm rounded-sm px-10 py-10 flex flex-col"
        style={{
          background: "#ffffff",
          color: "#111827",
          border: "1px solid #d1d5db",
        }}
        aria-label="Curriculum Vitae"
      >
        <CVHeader title={config.title} />
        <CVSummary summary={config.summary} />
        <div className="mt-1 border-t border-[var(--cv-divider)]" />
        <CVProjects
          projects={projectsData}
          sectionTitle={config.sectionTitle}
        />
        <div className="mt-1 border-t border-[var(--cv-divider)]" />
        <CVTimeline entries={timelineData} />
        <div className="mt-1 border-t border-[var(--cv-divider)]" />
        <CVSkills skillGroups={skillsData} />

        {config.showExpanding && (
          <>
            <div className="mt-1 border-t border-[var(--cv-divider)]" />
            <section className="pt-5">
              <h2 className="text-[10px] font-semibold tracking-widest uppercase text-[var(--cv-subtle)] mb-2.5 font-sans">
                Currently Expanding
              </h2>
              <p className="text-xs text-[var(--cv-subtle)]">
                {expandingSkills}
              </p>
            </section>
          </>
        )}

        <section className="pt-5">
          <h2 className="text-[10px] font-semibold tracking-widest uppercase text-[var(--cv-subtle)] mb-2.5 font-sans">
            Education
          </h2>
          <p className="text-sm font-medium">{education}</p>
        </section>

        <footer className="mt-auto pt-3 border-t border-[var(--cv-divider)] flex items-center justify-between flex-wrap gap-2">
          <p className="text-[10px] text-[var(--cv-subtle)] font-mono">
            piotr.romanczuk &mdash; 2026
          </p>
          <p className="text-[10px] text-[var(--cv-subtle)] no-print">
            Press{" "}
            <kbd
              className="px-1 py-0.5 border border-[var(--cv-divider)] rounded text-[9px] font-mono"
              style={{ background: "#f3f4f6" }}
            >
              Ctrl+P
            </kbd>{" "}
            /{" "}
            <kbd
              className="px-1 py-0.5 border border-[var(--cv-divider)] rounded text-[9px] font-mono"
              style={{ background: "#f3f4f6" }}
            >
              ⌘P
            </kbd>{" "}
            to save as PDF
          </p>
        </footer>
      </main>
    </div>
  );
}
