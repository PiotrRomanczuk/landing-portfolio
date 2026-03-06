import Image from "next/image";
import { projects } from "@/lib/data/projects";
import { V4SectionHeader } from "./V4SectionHeader";

export function V4Projects() {
  const featured = projects.filter((p) => p.variant === "large");
  const compact = projects.filter((p) => p.variant === "compact");

  return (
    <section className="max-w-[1100px] mx-auto px-8 pt-12 pb-16" id="work">
      <V4SectionHeader title="Selected Work" />

      {/* Featured project cards */}
      {featured.map((project, i) => {
        const reversed = i % 2 !== 0;
        return (
          <div
            key={project.id}
            className={`grid grid-cols-1 md:grid-cols-2 bg-white rounded-[20px] overflow-hidden border border-[var(--border)] mb-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)]`}
          >
            {/* Image */}
            <div className={`aspect-[4/3] bg-[#F0F0EC] overflow-hidden ${reversed ? "md:order-2" : ""}`}>
              {project.screenshot ? (
                <div className="relative w-full h-full">
                  <Image
                    src={project.screenshot}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="550px"
                  />
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#EEEEEA] to-[#E4E4E0] flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-2 opacity-25">
                    {Array.from({ length: 9 }).map((_, j) => (
                      <div key={j} className="w-8 h-8 bg-[var(--v4-navy)] rounded-md" />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Info */}
            <div className={`p-8 md:p-10 flex flex-col justify-between ${reversed ? "md:order-1" : ""}`}>
              <div>
                <div className="font-[family-name:var(--font-jetbrains)] text-[11px] text-[#999] uppercase tracking-[1.5px] mb-3">
                  {project.category} / {project.year}
                </div>
                <h3 className="font-[family-name:var(--font-source-serif)] text-2xl md:text-[32px] font-bold leading-[1.15] tracking-[-0.5px] mb-4 text-[#1A1A1A]">
                  {project.title}
                </h3>
                <p className="text-[15px] leading-[1.7] text-[#666] mb-6">
                  {project.description}
                  {project.id === "strummy" && " Spotify integration for song metadata. Google Calendar sync. 20-30 daily active users since Oct 2024."}
                  {project.id === "instagram-webhook" && " FFmpeg video pipeline, distributed cron with DB-level locking, Meta API 3-step container flow with retry."}
                </p>
                <div className="flex flex-wrap gap-2 mb-7">
                  {project.tech.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="font-[family-name:var(--font-jetbrains)] text-[11px] px-3 py-1 bg-[var(--muted)] border border-[var(--border)] rounded-md text-[#666]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                {project.stat && (
                  <div className="flex items-center gap-3 px-5 py-4 bg-[var(--v4-light-blue)] border-l-[3px] border-[var(--v4-navy)] rounded-r-[10px] mb-6">
                    <div className="font-[family-name:var(--font-source-serif)] text-[28px] font-bold text-[var(--v4-navy)]">
                      {project.stat.value}
                    </div>
                    <div className="text-[13px] text-[#888]">{project.stat.label}</div>
                  </div>
                )}
                <div className="flex gap-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[13px] font-semibold px-5 py-2.5 rounded-[10px] bg-[var(--v4-navy)] text-white hover:opacity-90 transition-opacity"
                    >
                      View Live &#8599;
                    </a>
                  )}
                  <a
                    href={project.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold px-5 py-2.5 rounded-[10px] border border-[#D0D0CC] text-[#555] hover:border-[#999] transition-colors"
                  >
                    Source Code
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Compact project cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-3">
        {compact.map((project) => {
          const initials = project.title
            .split(/[\s—-]+/)
            .map((w) => w[0])
            .filter(Boolean)
            .slice(0, 2)
            .join("")
            .toUpperCase();

          return (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-[var(--border)] p-6 flex flex-col gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
            >
              <div className="flex gap-4 items-start">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--v4-light-blue)] to-[#D6E0F5] flex-shrink-0 flex items-center justify-center font-[family-name:var(--font-jetbrains)] text-lg font-bold text-[#6B88BF]">
                  {initials}
                </div>
                <div>
                  <div className="font-[family-name:var(--font-jetbrains)] text-[10px] text-[#AAA] uppercase tracking-[1.5px] mb-1">
                    {project.category} / {project.year}
                  </div>
                  <div className="font-[family-name:var(--font-source-serif)] text-lg font-bold text-[#1A1A1A] mb-1.5">
                    {project.title}
                  </div>
                </div>
              </div>
              <div className="text-[13px] leading-[1.6] text-[#888]">
                {project.description}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
