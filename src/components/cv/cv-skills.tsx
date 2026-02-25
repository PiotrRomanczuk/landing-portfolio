import { CVSection } from "./cv-section";

const skillGroups = [
  {
    label: "Languages",
    skills: ["TypeScript", "JavaScript", "Python"],
  },
  {
    label: "Frontend",
    skills: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "HTML5 Canvas"],
  },
  {
    label: "Backend",
    skills: ["Node.js", "Supabase", "REST APIs", "WebSocket"],
  },
  {
    label: "Tools",
    skills: ["Git", "Vercel", "CI/CD", "ESLint"],
  },
];

export function CVSkills() {
  return (
    <CVSection title="Toolkit">
      <div className="flex flex-col gap-2.5">
        {skillGroups.map((group) => (
          <div key={group.label} className="flex items-baseline gap-3 page-break-avoid">
            <span
              className="flex-shrink-0 w-[72px] text-[10px] font-semibold uppercase tracking-wider text-right"
              style={{ color: "var(--cv-subtle)" }}
            >
              {group.label}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {group.skills.map((skill) => (
                <span
                  key={skill}
                  className="cv-tag inline-block px-2 py-0.5 text-[11px] font-medium rounded"
                  style={{
                    border: "1px solid var(--cv-divider)",
                    background: "var(--cv-accent-light)",
                    color: "#374151",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </CVSection>
  );
}
