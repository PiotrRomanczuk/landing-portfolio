import Image from "next/image";
import { projects } from "@/lib/data/projects";

type CaseExtras = {
  label: string;
  kicker: string;
  pills?: { text: string; live?: boolean }[];
  lede: string;
  quote?: string;
  shotCaption: string;
};

const extras: Record<string, CaseExtras> = {
  strummy: {
    label: "Lead",
    kicker: "SaaS · 2024 →",
    pills: [
      { text: "In production", live: true },
      { text: "20–30 DAU" },
    ],
    lede:
      "A CRM and lesson-management SaaS for guitar teachers — students, billing, scheduling, attendance. Solo-built, in production since late 2024, paying users month-to-month. The product I'd most want a future employer to read the code of.",
    quote: "First product I shipped that survived its own users.",
    shotCaption: "screenshot · strummy.app dashboard",
  },
  "instagram-webhook": {
    label: "Tooling",
    kicker: "Internal · 2025",
    pills: [{ text: "Meta Graph · FFmpeg" }],
    lede:
      "Automated IG Story publishing via the Meta Graph API. FFmpeg pipeline, distributed cron with DB-level locking, idempotent retries. 500+ unit tests, 113 E2E. Built in 123.5 hours across 41 days.",
    quote: "A lot of \"this should be five lines\" turning into five hundred.",
    shotCaption: "screenshot · ig stories pipeline",
  },
  inborr: {
    label: "Client",
    kicker: "Marketing · 2023",
    pills: [{ text: "Next.js · Tailwind" }],
    lede:
      "Marketing site for a B2B short-term rental client in Warsaw. Booking funnel, Google Maps, English/Polish i18n, motion that respects reduced-motion. Shipped, still live, no maintenance tickets.",
    shotCaption: "screenshot · inborr landing",
  },
  "pizza-store": {
    label: "Sketch",
    kicker: "Side · 2023",
    pills: [{ text: "React · Stripe" }],
    lede:
      "A weekend project: ordering UX experiment turned into a small, well-tested app. Useful as a sandbox for state-machine thinking and accessibility patterns I now reuse.",
    shotCaption: "screenshot · pizza store",
  },
};

export function V5Projects() {
  return (
    <section className="v5-section" id="work" aria-labelledby="work-h">
      <header className="v5-section-head">
        <h2 id="work-h">Selected work, in order of weight.</h2>
        <div className="right">{projects.length} cases · 2023 — 2025</div>
      </header>

      <div className="v5-cases">
        {projects.map((project, i) => {
          const meta = extras[project.id];
          const num = String(i + 1).padStart(2, "0");
          const figureId = `fig. ${num}`;
          return (
            <article className="v5-case" key={project.id}>
              <div className="num">
                {num}
                <small>{meta?.label ?? project.category}</small>
              </div>

              <div className="body">
                <div className="kicker-line">
                  <span>{meta?.kicker ?? `${project.category} · ${project.year}`}</span>
                  {meta?.pills?.map((pill) => (
                    <span
                      key={pill.text}
                      className={`pill${pill.live ? " live" : ""}`}
                    >
                      {pill.text}
                    </span>
                  ))}
                </div>
                <h3>{project.title}</h3>
                <p className="lede">{meta?.lede ?? project.description}</p>
                <div
                  className={`shot${project.screenshot ? " has-image" : ""}`}
                  data-shot={meta?.shotCaption ?? `screenshot · ${project.title}`}
                >
                  <span className="corner">{figureId}</span>
                  {project.screenshot && (
                    <Image
                      src={project.screenshot}
                      alt={project.title}
                      fill
                      sizes="(max-width: 1040px) 100vw, 720px"
                      className="object-cover"
                    />
                  )}
                </div>
              </div>

              <aside className="margin">
                <div>
                  <h4>Stack</h4>
                  <div className="stack">
                    {project.tech.slice(0, 5).map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
                {meta?.quote && <p className="quote">{meta.quote}</p>}
                <div className="links">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>Live</span>
                      <span>↗</span>
                    </a>
                  )}
                  <a
                    href={project.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Repo</span>
                    <span>↗</span>
                  </a>
                </div>
              </aside>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default V5Projects;
