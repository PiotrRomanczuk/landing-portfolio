"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const HEIGHT = 80;
const WIDTH = 24;
const CENTER_X = WIDTH / 2;
const DOT_R = 3;

export function SectionConnector() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.5"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const dotOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);

  return (
    <div
      ref={ref}
      className="flex justify-center"
      aria-hidden="true"
      style={{ pointerEvents: "none" }}
    >
      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        fill="none"
      >
        <line
          x1={CENTER_X}
          y1={0}
          x2={CENTER_X}
          y2={HEIGHT}
          stroke="var(--border)"
          strokeWidth={2}
          strokeDasharray="4 4"
        />

        <motion.line
          x1={CENTER_X}
          y1={0}
          x2={CENTER_X}
          y2={HEIGHT}
          stroke="var(--primary)"
          strokeWidth={2}
          style={{
            pathLength: reducedMotion ? 1 : pathLength,
          }}
        />

        <motion.circle
          cx={CENTER_X}
          cy={HEIGHT / 2}
          r={DOT_R}
          fill="var(--primary)"
          style={{ opacity: reducedMotion ? 1 : dotOpacity }}
        />
      </svg>
    </div>
  );
}
