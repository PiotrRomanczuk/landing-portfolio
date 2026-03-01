"use client";

import { ProjectCard } from "@/components/ProjectCard";
import { AnimatedSection } from "@/components/AnimatedSection";
import { projects } from "@/lib/data/projects";

export function ProjectsSection() {
  return (
    <section id="projects" className="py-20">
      <AnimatedSection>
        <div className="mb-12 flex items-end justify-between border-b border-border pb-4">
          <h2 className="font-mono text-2xl font-bold tracking-tight md:text-3xl">
            THINGS I&apos;VE BUILT
          </h2>
          <span className="hidden font-mono text-sm text-muted-foreground md:block">
            {String(projects.length).padStart(2, "0")} SELECTED WORKS
          </span>
        </div>
      </AnimatedSection>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {projects.map((project, i) => (
          <AnimatedSection
            key={project.id}
            delay={i * 0.08}
            className={
              project.variant === "large" ? "md:col-span-2" : "md:col-span-1"
            }
          >
            <ProjectCard project={project} index={i} />
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
