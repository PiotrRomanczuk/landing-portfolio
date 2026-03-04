import { ArrowUpRight } from "lucide-react";
import { CVSection } from "./cv-section";

const projects = [
  {
    name: "Guitar CRM",
    bullets: [
      "Production SaaS serving 20–30 daily users — student management, lesson scheduling, practice tracking",
      "Spotify-enriched song library with circuit breaker + 8-strategy fuzzy matching",
      "Bidirectional Google Calendar sync with SSE streaming",
      "9 AI agents (OpenRouter + Ollama) for lesson planning and content generation",
      "50+ RLS policies, event-driven notification pipeline, 1,100+ tests across 7 device profiles",
    ],
    tech: ["TypeScript", "Next.js", "Supabase", "Spotify API", "Google Calendar", "OpenRouter/Ollama"],
    url: "https://strummy.vercel.app",
    urlLabel: "strummy.vercel.app",
    sourceUrl: "github.com/PiotrRomanczuk/guitar-crm",
  },
  {
    name: "Instagram Stories Webhook",
    bullets: [
      "SaaS for programmatic Instagram Story publishing with swipe-to-approve review queue",
      "3-tier video pipeline: FFmpeg.wasm client validation → server transcoding → signed-URL uploads",
      "Distributed cron locking for serverless deduplication on Vercel edge functions",
      "Meta Graph API 3-step container flow with error classification and retry logic",
      "Drag-and-drop calendar scheduling, Supabase realtime sync — 656 tests, 35 releases",
    ],
    tech: ["TypeScript", "Next.js", "Supabase", "Meta Graph API", "FFmpeg", "Vercel Cron"],
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
            {/* Project name with inline links */}
            <div className="flex items-baseline gap-2 mb-1.5">
              <h3 className="text-sm font-semibold text-foreground leading-tight font-sans whitespace-nowrap">
                {project.name}
              </h3>
              <div className="flex items-center gap-2">
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-0.5 text-[10px] font-medium hover:underline whitespace-nowrap"
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
                    className="flex items-center gap-0.5 text-[10px] font-medium text-[var(--cv-subtle)] hover:underline whitespace-nowrap"
                    aria-label={`Source code for ${project.name}`}
                  >
                    source
                    <ArrowUpRight size={10} aria-hidden="true" className="flex-shrink-0" />
                  </a>
                )}
              </div>
            </div>

            {/* Bullet points */}
            <ul className="text-xs text-[var(--cv-subtle)] leading-snug mb-2.5 space-y-0.5 list-disc pl-4">
              {project.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>

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
