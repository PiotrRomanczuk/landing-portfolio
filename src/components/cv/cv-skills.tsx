import { CVSection } from "./cv-section";

interface SkillGroupItem {
  label: string;
  skills: string[];
}

const defaultSkillGroups: SkillGroupItem[] = [
  {
    label: "Languages",
    skills: ["TypeScript", "JavaScript", "Python", "Bash", "SQL"],
  },
  {
    label: "Frontend",
    skills: [
      "React",
      "Next.js",
      "Tailwind CSS",
      "Framer Motion",
      "HTML5 Canvas",
    ],
  },
  {
    label: "Backend",
    skills: ["Node.js", "Supabase", "PostgreSQL", "REST APIs", "WebSocket"],
  },
  {
    label: "Testing",
    skills: ["Jest", "Vitest", "Playwright", "E2E Automation"],
  },
  {
    label: "Tools",
    skills: ["Git", "Docker", "Vercel", "Linux CLI", "CI/CD", "ESLint"],
  },
  { label: "Spoken", skills: ["Polish \u2014 Native", "English \u2014 C1"] },
];

interface CVSkillsProps {
  skillGroups?: SkillGroupItem[];
}

export function CVSkills({ skillGroups: skillGroupsProp }: CVSkillsProps) {
  const displayGroups = skillGroupsProp || defaultSkillGroups;

  return (
    <CVSection title="Skills">
      <div className="flex flex-col gap-2">
        {displayGroups.map((group) => (
          <div
            key={group.label}
            className="flex items-baseline gap-3 page-break-avoid"
          >
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
