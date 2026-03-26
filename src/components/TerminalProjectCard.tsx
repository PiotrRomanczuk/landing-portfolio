"use client";

import Image from "next/image";
import { ArrowRight, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import type { Project, TerminalLine } from "@/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface TerminalProjectCardProps {
  project: Project;
  index: number;
}

function LineContent({ line }: { line: TerminalLine }) {
  switch (line.type) {
    case "command":
      return (
        <div>
          <span className="text-muted-foreground">$ {line.text}</span>
        </div>
      );
    case "output":
      return <div className="text-foreground">{line.text}</div>;
    case "success":
      return (
        <div className="text-green-400">✓ {line.text}</div>
      );
    case "comment":
      return (
        <div className="text-primary"># {line.text}</div>
      );
  }
}

function TerminalBlock({
  project,
  prefersReducedMotion,
}: {
  project: Project;
  prefersReducedMotion: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-500/80 dark:bg-red-500/70" />
        <span className="h-3 w-3 rounded-full bg-yellow-500/80 dark:bg-yellow-500/70" />
        <span className="h-3 w-3 rounded-full bg-green-500/80 dark:bg-green-500/70" />
        <span className="ml-2 font-mono text-xs text-muted-foreground">
          {project.terminalPath}
        </span>
      </div>

      {/* Terminal body */}
      <div className="flex-1 space-y-1 p-4 font-mono text-sm leading-relaxed">
        {project.terminalLines.map((line, i) => (
          <motion.div
            key={i}
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.2,
              delay: prefersReducedMotion ? 0 : i * 0.05,
            }}
          >
            <LineContent line={line} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ScreenshotBlock({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  if (!project.screenshot) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-primary/10 via-card to-muted ${className}`}
      >
        <span className="font-mono text-lg text-muted-foreground/60">
          {project.title}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-muted ${className}`}>
      <Image
        src={project.screenshot}
        alt={`${project.title} screenshot`}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes={
          project.variant === "large"
            ? "(max-width: 768px) 100vw, 700px"
            : "(max-width: 768px) 100vw, 400px"
        }
      />
    </div>
  );
}

function Footer({ project }: { project: Project }) {
  return (
    <div className="border-t border-border px-4 py-3">
      <div className="mb-3 flex flex-wrap gap-1.5">
        {project.tech.map((t) => (
          <span
            key={t}
            className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:text-primary"
          >
            View Live
            <ExternalLink className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5" />
          </a>
        )}
        <a
          href={project.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:text-primary"
        >
          Source
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
        </a>
      </div>
    </div>
  );
}

export function TerminalProjectCard({
  project,
  index,
}: TerminalProjectCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const isLarge = project.variant === "large";

  return (
    <motion.article
      aria-label={`${project.title} — ${project.category}`}
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.3,
        delay: prefersReducedMotion ? 0 : index * 0.08,
      }}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_0_30px_-5px_rgba(96,165,250,0.08)]"
    >
      {isLarge ? (
        /* Large: screenshot left, terminal right on md+ */
        <div className="flex flex-1 flex-col md:flex-row">
          <ScreenshotBlock
            project={project}
            className="aspect-[16/10] w-full md:aspect-auto md:w-1/2"
          />
          <TerminalBlock
            project={project}
            prefersReducedMotion={prefersReducedMotion}
          />
        </div>
      ) : (
        /* Compact: screenshot on top, terminal below */
        <>
          <ScreenshotBlock
            project={project}
            className="aspect-[16/10] w-full"
          />
          <TerminalBlock
            project={project}
            prefersReducedMotion={prefersReducedMotion}
          />
        </>
      )}

      <Footer project={project} />
    </motion.article>
  );
}
