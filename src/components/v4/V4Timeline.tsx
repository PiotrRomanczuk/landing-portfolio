"use client";

import { timeline } from "@/lib/data/timeline";
import { AnimatedSection } from "@/components/AnimatedSection";
import { V4SectionHeader } from "./V4SectionHeader";

export function V4Timeline() {
  return (
    <section className="max-w-[1100px] mx-auto px-8 pt-12 pb-16" id="about">
      <V4SectionHeader title="Timeline" />

      {/* Desktop: alternating 3-column grid */}
      <div className="hidden md:block">
        {timeline.map((item, i) => {
          const isLeft = i % 2 === 0;
          const yearShort = `'${item.period.slice(-2)}`;
          const isFirst = i === 0;

          return (
            <AnimatedSection key={item.id} delay={i * 0.1}>
              <div className="grid grid-cols-[1fr_60px_1fr] mb-8 last:mb-0">
                {/* Left cell */}
                <div className={`flex justify-end pr-5 ${!isLeft ? "" : ""}`}>
                  {isLeft && <TimelineCard item={item} />}
                </div>

                {/* Center dot */}
                <div className="flex justify-center pt-5 relative">
                  {i > 0 && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-5 bg-[var(--v4-light-blue-border)]" />
                  )}
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center font-[family-name:var(--font-jetbrains)] text-[13px] font-bold flex-shrink-0 border-2 border-[var(--v4-navy)] ${
                      isFirst
                        ? "bg-[var(--v4-navy)] text-white"
                        : "bg-white text-[var(--v4-navy)]"
                    }`}
                  >
                    {yearShort}
                  </div>
                  {i < timeline.length - 1 && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-[calc(100%-64px)] bg-[var(--v4-light-blue-border)] top-16" />
                  )}
                </div>

                {/* Right cell */}
                <div className="flex justify-start pl-5">
                  {!isLeft && <TimelineCard item={item} />}
                </div>
              </div>
            </AnimatedSection>
          );
        })}
      </div>

      {/* Mobile: single column */}
      <div className="md:hidden flex flex-col gap-6">
        {timeline.map((item, i) => {
          const yearShort = `'${item.period.slice(-2)}`;
          const isFirst = i === 0;

          return (
            <AnimatedSection key={item.id} delay={i * 0.1}>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-[family-name:var(--font-jetbrains)] text-xs font-bold flex-shrink-0 border-2 border-[var(--v4-navy)] ${
                      isFirst
                        ? "bg-[var(--v4-navy)] text-white"
                        : "bg-white text-[var(--v4-navy)]"
                    }`}
                  >
                    {yearShort}
                  </div>
                  {i < timeline.length - 1 && (
                    <div className="w-0.5 flex-1 bg-[var(--v4-light-blue-border)] mt-2" />
                  )}
                </div>
                <div className="pb-4 flex-1">
                  <TimelineCard item={item} />
                </div>
              </div>
            </AnimatedSection>
          );
        })}
      </div>
    </section>
  );
}

function TimelineCard({ item }: { item: (typeof timeline)[number] }) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-2xl px-7 py-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)] max-w-[420px] w-full">
      <div className="font-[family-name:var(--font-jetbrains)] text-[11px] text-[var(--v4-navy)] uppercase tracking-[1.5px] mb-2 font-semibold">
        {item.period}
      </div>
      <h3 className="font-[family-name:var(--font-source-serif)] text-xl font-bold leading-[1.3] mb-2.5 text-[#1A1A1A]">
        {item.title}
      </h3>
      <p className="text-sm leading-[1.65] text-[#777] mb-3.5">
        {item.description}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {item.tech.slice(0, 3).map((t) => (
          <span
            key={t}
            className="font-[family-name:var(--font-jetbrains)] text-[10px] px-2.5 py-0.5 bg-[var(--v4-light-blue)] border border-[var(--v4-light-blue-border)] rounded text-[var(--v4-navy)]"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
