"use client";

import type { TimelineMilestone } from "@/types";
import { motion } from "motion/react";

interface TimelineItemProps {
  milestone: TimelineMilestone;
  index: number;
}

export function TimelineItem({ milestone, index }: TimelineItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.08 }}
      className="rounded-xl border border-border bg-card p-5 transition-colors duration-300 hover:border-primary/20 md:p-6"
    >
      <span className="font-mono text-xs uppercase tracking-widest text-primary">
        {milestone.period}
      </span>

      <h3 className="mt-2 text-lg font-bold tracking-tight">
        {milestone.title}
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {milestone.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {milestone.tech.map((t) => (
          <span
            key={t}
            className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
