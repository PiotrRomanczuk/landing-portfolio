"use client";

import { AnimatedSection } from "@/components/AnimatedSection";
import { TimelineItem } from "@/components/TimelineItem";
import { timeline } from "@/lib/data/timeline";

export function TimelineSection() {
  return (
    <section className="mx-auto max-w-4xl py-20">
      <AnimatedSection>
        <div className="mb-16 text-center">
          <h2 className="inline-block border-b-2 border-primary pb-1 font-mono text-2xl font-bold tracking-tight md:text-3xl">
            PATH
          </h2>
        </div>
      </AnimatedSection>

      <AnimatedSection variant="fade">
        <div className="relative flex flex-col gap-12">
          {timeline.map((milestone) => (
            <TimelineItem key={milestone.year} milestone={milestone} />
          ))}
        </div>
      </AnimatedSection>
    </section>
  );
}
