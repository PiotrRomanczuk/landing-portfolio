"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const href = project.liveUrl || project.sourceUrl;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_0_30px_-5px_rgba(96,165,250,0.08)]">
      {/* Screenshot area */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        {project.screenshot ? (
          <Image
            src={project.screenshot}
            alt={`${project.title} screenshot`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={
              project.variant === "large"
                ? "(max-width: 768px) 100vw, 100vw"
                : "(max-width: 768px) 100vw, 50vw"
            }
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 via-card to-muted">
            <span className="font-mono text-lg text-muted-foreground/60">
              {project.title}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="mb-3 flex items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground/50">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-primary">
            {project.category} &middot; {project.year}
          </span>
        </div>

        <h3 className="mb-2 text-xl font-bold tracking-tight transition-colors group-hover:text-primary">
          {project.title}
        </h3>

        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        <div className="mb-5 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-auto">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:text-primary"
          >
            View Project
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
          </a>
        </div>
      </div>
    </article>
  );
}
