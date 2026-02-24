"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const isReversed = index % 2 === 1;
  const year = project.id === "guitar-crm" ? "2024" : project.id === "radio-signal" ? "2024" : project.id === "inborr" ? "2023" : "2023";
  const category = project.tech[0] || "Web";

  return (
    <article
      className={cn(
        "group relative grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-12",
      )}
    >
      {/* Image */}
      <div
        className={cn(
          "relative aspect-[16/10] overflow-hidden rounded-lg bg-card",
          isReversed ? "order-1 md:order-2 md:col-span-7" : "md:col-span-7"
        )}
      >
        {project.screenshot ? (
          <Image
            src={project.screenshot}
            alt={`${project.title} screenshot`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 58vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-mono text-lg text-muted-foreground">
              {project.title}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-transparent" />
      </div>

      {/* Text */}
      <div
        className={cn(
          "flex flex-col justify-center md:col-span-5",
          isReversed
            ? "order-2 md:order-1 md:items-end md:text-right"
            : ""
        )}
      >
        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">
          {category} &bull; {year}
        </div>
        <h3 className="mb-4 text-3xl font-bold transition-colors group-hover:text-primary">
          {project.title}
        </h3>
        <p className="mb-6 leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        <div
          className={cn(
            "mb-8 flex flex-wrap gap-2",
            isReversed && "md:justify-end"
          )}
        >
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded border border-border px-2 py-1 font-mono text-xs text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>

        <a
          href={project.liveUrl || project.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "group/link inline-flex w-max items-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors hover:text-primary",
            isReversed && "flex-row-reverse"
          )}
        >
          {isReversed && (
            <ArrowRight className="h-4 w-4 rotate-180 transition-transform group-hover/link:-translate-x-1" />
          )}
          View Project
          {!isReversed && (
            <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
          )}
        </a>
      </div>
    </article>
  );
}
