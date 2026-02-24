"use client";

import type { DotPosition } from "@/hooks/useTimelinePathData";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  type MotionValue,
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import type { RefObject } from "react";

interface TimelinePathProps {
  pathD: string;
  dots: DotPosition[];
  svgWidth: number;
  svgHeight: number;
  containerRef: RefObject<HTMLDivElement | null>;
}

const ARROW_EXTENSION = 30;

export function TimelinePath({
  pathD,
  dots,
  svgWidth,
  svgHeight,
  containerRef,
}: TimelinePathProps) {
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.5"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const arrowOpacity = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]);

  if (!pathD || dots.length === 0) return null;

  const lastDot = dots[dots.length - 1];
  const arrowX = lastDot.x;
  const arrowY = lastDot.y + ARROW_EXTENSION;

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      fill="none"
      aria-hidden="true"
    >
      <path
        d={pathD}
        stroke="var(--border)"
        strokeWidth={2}
        strokeDasharray="6 4"
        fill="none"
      />

      <motion.path
        d={pathD}
        stroke="var(--primary)"
        strokeWidth={2}
        fill="none"
        style={{ pathLength: reducedMotion ? 1 : pathLength }}
      />

      {dots.map((dot, i) => {
        const threshold = dots.length > 1 ? i / (dots.length - 1) : 0;
        return (
          <DotMarker
            key={i}
            cx={dot.x}
            cy={dot.y}
            threshold={threshold}
            scrollProgress={scrollYProgress}
            reducedMotion={reducedMotion}
          />
        );
      })}

      <motion.polygon
        points={`${arrowX - 6},${arrowY - 4} ${arrowX + 6},${arrowY - 4} ${arrowX},${arrowY + 6}`}
        fill="var(--primary)"
        style={{ opacity: reducedMotion ? 1 : arrowOpacity }}
      />
    </svg>
  );
}

function DotMarker({
  cx,
  cy,
  threshold,
  scrollProgress,
  reducedMotion,
}: {
  cx: number;
  cy: number;
  threshold: number;
  scrollProgress: MotionValue<number>;
  reducedMotion: boolean;
}) {
  const opacity = useTransform(
    scrollProgress,
    [Math.max(0, threshold - 0.05), threshold + 0.01],
    [0, 1]
  );

  return (
    <motion.g style={{ opacity: reducedMotion ? 1 : opacity }}>
      <circle
        cx={cx}
        cy={cy}
        r={8}
        fill="var(--background)"
        stroke="var(--primary)"
        strokeWidth={2}
      />
      <circle cx={cx} cy={cy} r={4} fill="var(--primary)" />
    </motion.g>
  );
}
