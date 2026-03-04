"use client";

import type { TimelineMilestone } from "@/types";
import { motion } from "motion/react";

interface TerminalLogEntryProps {
  milestone: TimelineMilestone;
  index: number;
  skipAnimation: boolean;
}

function toKebab(tech: string): string {
  return tech.toLowerCase().replace(/[\s/]+/g, "-");
}

export function TerminalLogEntry({
  milestone,
  index,
  skipAnimation,
}: TerminalLogEntryProps) {
  const indent = "       ";

  return (
    <motion.div
      initial={skipAnimation ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.3, delay: skipAnimation ? 0 : index * 0.15 }}
      className="space-y-0.5"
    >
      <div>
        <span className="text-muted-foreground">[{milestone.period}]</span>{" "}
        <span className="text-green-400">✓</span>{" "}
        <span className="font-medium text-foreground">{milestone.title}</span>
      </div>
      <div className="text-muted-foreground">
        {indent}
        {milestone.description}
      </div>
      <div>
        <span className="text-muted-foreground">{indent}stack: </span>
        <span className="text-primary">
          {milestone.tech.map(toKebab).join(" ")}
        </span>
      </div>
    </motion.div>
  );
}
