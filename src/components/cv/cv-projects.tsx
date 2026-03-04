import { ArrowUpRight } from "lucide-react";
import { CVSection } from "./cv-section";

const projects = [
  {
    name: "Guitar CRM",
    description:
      "Full-stack CRM for guitar teachers — manages student profiles, lesson scheduling, song library, and practice tracking. Built with role-based auth, Supabase backend, and deployed on Vercel.",
    tech: ["TypeScript", "Next.js", "Supabase", "Tailwind CSS", "Vercel"],
    url: "https://strummy.vercel.app",
    urlLabel: "strummy.vercel.app",
    sourceUrl: "github.com/PiotrRomanczuk/guitar-crm",
  },
  {
    name: "Instagram Stories Webhook",
    description:
      "Automated content pipeline that captures Instagram stories via Meta webhooks, processes media, and publishes to a client-facing dashboard. Features cron jobs, content queue management, and Supabase realtime.",
    tech: ["TypeScript", "Next.js", "Supabase", "Meta API", "Vercel Cron"],
    url: "https://stories-webhook.vercel.app",
    urlLabel: "stories-webhook.vercel.app",
    sourceUrl: "github.com/PiotrRomanczuk/instagram-stories-webhook",
  },
];

export function CVProjects() {
  return (
    <CVSection title="Selected Projects">
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project.name}
            className="page-break-avoid border border-[var(--cv-divider)] rounded p-3.5 hover:border-[var(--cv-accent)] transition-colors group"
          >
            {/* Project name + links */}
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className="text-sm font-semibold text-foreground leading-tight font-sans">
                {project.name}
              </h3>
              <div className="flex-shrink-0 flex items-center gap-2">
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-0.5 text-[10px] font-medium hover:underline"
                    style={{ color: "var(--cv-accent)" }}
                    aria-label={`Visit ${project.name}`}
                  >
                    {project.urlLabel}
                    <ArrowUpRight size={10} aria-hidden="true" className="flex-shrink-0" />
                  </a>
                )}
                {project.sourceUrl && (
                  <a
                    href={`https://${project.sourceUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-0.5 text-[10px] font-medium text-[var(--cv-subtle)] hover:underline"
                    aria-label={`Source code for ${project.name}`}
                  >
                    source
                    <ArrowUpRight size={10} aria-hidden="true" className="flex-shrink-0" />
                  </a>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-[var(--cv-subtle)] leading-relaxed mb-2">
              {project.description}
            </p>

            {/* Tech tags */}
            <div className="flex flex-wrap gap-1">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="cv-tag inline-block px-1.5 py-0.5 text-[10px] font-medium border border-[var(--cv-divider)] bg-[var(--cv-accent-light)] text-foreground rounded"
                >
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </CVSection>
  );
}
