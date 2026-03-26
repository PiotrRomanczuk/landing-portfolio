"use client";

import { AnimatedSection } from "@/components/AnimatedSection";
import { TerminalLogEntry } from "@/components/TerminalLogEntry";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { timeline } from "@/lib/data/timeline";
import { motion } from "motion/react";

export function TimelineSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="py-20">
      <AnimatedSection>
        <div className="mb-12 flex items-end justify-between border-b border-border pb-4">
          <h2 className="font-mono text-2xl font-bold tracking-tight md:text-3xl">
            MILESTONES
          </h2>
          <span className="hidden font-mono text-sm text-muted-foreground md:block">
            {String(timeline.length).padStart(2, "0")} KEY MOMENTS
          </span>
        </div>
      </AnimatedSection>

      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-lg">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-500/80 dark:bg-red-500/70" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80 dark:bg-yellow-500/70" />
          <span className="h-3 w-3 rounded-full bg-green-500/80 dark:bg-green-500/70" />
          <span className="ml-2 font-mono text-xs text-muted-foreground">
            ~/career
          </span>
        </div>

        {/* Terminal body */}
        <div className="space-y-4 p-4 font-mono text-xs leading-relaxed md:text-sm">
          {/* Command line */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="text-muted-foreground"
          >
            $ git log --oneline --milestones
          </motion.div>

          {/* Milestone entries */}
          {timeline.map((milestone, i) => (
            <TerminalLogEntry
              key={milestone.id}
              milestone={milestone}
              index={i}
              skipAnimation={prefersReducedMotion}
            />
          ))}

          {/* Trailing prompt with blinking cursor */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.3,
              delay: prefersReducedMotion ? 0 : timeline.length * 0.15 + 0.3,
            }}
            className="text-muted-foreground"
          >
            ~/career ${" "}
            <span className="inline-block animate-blink text-primary">█</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
