import { ArrowUpRight } from "lucide-react";
import { CVSection } from "./cv-section";

const projects = [
  {
    name: "Guitar CRM",
    description:
      "Production CRM app for managing guitar inventory, clients, and sales.",
    tech: ["TypeScript", "React", "Next.js", "Tailwind CSS"],
    url: "https://guitar-crm.vercel.app",
    urlLabel: "guitar-crm.vercel.app",
  },
  {
    name: "Radio Signal Visualization",
    description:
      "Real-time visualization of 1000+ radio signal values via WebSocket, rendered on Canvas at 60fps.",
    tech: ["TypeScript", "React", "WebSocket", "Canvas API"],
    url: null,
    urlLabel: null,
  },
  {
    name: "Instagram Stories Webhook",
    description:
      "Automated pipeline for capturing and publishing Instagram stories via webhooks with a content management dashboard.",
    tech: ["TypeScript", "Next.js", "Supabase", "Vercel"],
    url: "https://marszal-arts.vercel.app",
    urlLabel: "marszal-arts.vercel.app",
  },
  {
    name: "Pizza Store",
    description:
      "E-commerce app with cart management, Stripe payments, and animated UI.",
    tech: ["TypeScript", "React", "Framer Motion"],
    url: "https://pizza-store-pearl.vercel.app",
    urlLabel: "pizza-store-pearl.vercel.app",
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
            {/* Project name + link */}
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className="text-sm font-semibold text-foreground leading-tight font-sans">
                {project.name}
              </h3>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 flex items-center gap-0.5 text-[10px] font-medium hover:underline truncate max-w-[140px]"
                  style={{ color: "var(--cv-accent)" }}
                  aria-label={`Visit ${project.name}`}
                >
                  {project.urlLabel}
                  <ArrowUpRight size={10} aria-hidden="true" className="flex-shrink-0" />
                </a>
              )}
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
