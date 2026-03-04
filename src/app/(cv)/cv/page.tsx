import type { Metadata } from "next";
import { CVHeader } from "@/components/cv/cv-header";
import { CVSummary } from "@/components/cv/cv-summary";
import { CVSkills } from "@/components/cv/cv-skills";
import { CVTimeline } from "@/components/cv/cv-timeline";
import { CVProjects } from "@/components/cv/cv-projects";

export const metadata: Metadata = {
  title: "Piotr Romanczuk — CV",
  description:
    "CV/Resume of Piotr Romanczuk, Software Engineer specializing in full-stack web development.",
};

export default function CVPage() {
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
      <main
        className="cv-page mx-auto w-[780px] min-h-[1103px] shadow-sm rounded-sm px-10 py-10 flex flex-col"
        style={{
          background: "#ffffff",
          color: "#111827",
          border: "1px solid #d1d5db",
        }}
        aria-label="Curriculum Vitae"
      >
        <CVHeader />
        <CVSummary />
        <div className="mt-1 border-t border-[var(--cv-divider)]" />
        <CVProjects />
        <div className="mt-1 border-t border-[var(--cv-divider)]" />
        <CVTimeline />
        <div className="mt-1 border-t border-[var(--cv-divider)]" />
        <CVSkills />

        {/* Footer */}
        <footer className="mt-auto pt-3 border-t border-[var(--cv-divider)] flex items-center justify-between flex-wrap gap-2">
          <p className="text-[10px] text-[var(--cv-subtle)] font-mono">
            piotr.romanczuk — 2025
          </p>
          <p className="text-[10px] text-[var(--cv-subtle)] no-print">
            Press{" "}
            <kbd className="px-1 py-0.5 border border-[var(--cv-divider)] rounded text-[9px] font-mono" style={{ background: "#f3f4f6" }}>
              Ctrl+P
            </kbd>{" "}
            /{" "}
            <kbd className="px-1 py-0.5 border border-[var(--cv-divider)] rounded text-[9px] font-mono" style={{ background: "#f3f4f6" }}>
              ⌘P
            </kbd>{" "}
            to save as PDF
          </p>
        </footer>
      </main>
    </div>
  );
}
