"use client";

import { AnimatedSection } from "@/components/AnimatedSection";
import { TimelineItem } from "@/components/TimelineItem";
import { TimelinePath } from "@/components/TimelinePath";
import { useTimelinePathData } from "@/hooks/useTimelinePathData";
import { timeline } from "@/lib/data/timeline";
import { useRef } from "react";

export function TimelineSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const milestoneRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { pathD, dots, isReady, svgWidth, svgHeight } = useTimelinePathData(
    containerRef,
    milestoneRefs
  );

  return (
    <section className="mx-auto max-w-4xl py-20">
      <AnimatedSection>
        <div className="mb-16 text-center">
          <h2 className="inline-block border-b-2 border-primary pb-1 font-mono text-2xl font-bold tracking-tight md:text-3xl">
            PATH
          </h2>
        </div>
      </AnimatedSection>

      <div ref={containerRef} className="relative pb-20">
        {isReady && (
          <TimelinePath
            pathD={pathD}
            dots={dots}
            svgWidth={svgWidth}
            svgHeight={svgHeight}
            containerRef={containerRef}
          />
        )}

        <div className="relative z-10 flex flex-col gap-14 md:gap-28">
          {timeline.map((milestone, index) => (
            <TimelineItem
              key={milestone.year}
              milestone={milestone}
              alignment={index % 2 === 0 ? "left" : "right"}
              ref={(el) => {
                milestoneRefs.current[index] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
