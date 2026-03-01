"use client";

import { AnimatedSection } from "@/components/AnimatedSection";
import { TimelineItem } from "@/components/TimelineItem";
import { timeline } from "@/lib/data/timeline";

export function TimelineSection() {
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {timeline.map((milestone, i) => (
          <TimelineItem key={milestone.id} milestone={milestone} index={i} />
        ))}
      </div>
    </section>
  );
}
