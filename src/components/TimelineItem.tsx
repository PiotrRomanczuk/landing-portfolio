"use client";

import type { TimelineMilestone } from "@/types";
import { motion } from "motion/react";

interface TimelineItemProps {
  milestone: TimelineMilestone;
  alignment: "left" | "right";
  ref?: React.Ref<HTMLDivElement>;
}

export function TimelineItem({ milestone, alignment, ref }: TimelineItemProps) {
  const isLeft = alignment === "left";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`py-4 pl-10 md:pl-0 md:w-[40%] ${
        isLeft ? "md:text-right" : "md:ml-auto"
      }`}
    >
      <span className="font-mono text-lg font-bold text-primary">
        {milestone.year}
      </span>
      <p className="mt-2 text-muted-foreground">{milestone.description}</p>
    </motion.div>
  );
}
