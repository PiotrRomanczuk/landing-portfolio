"use client";

import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const lines = [
  { text: "$ next dev", delay: 0 },
  { text: "✓ Ready in 1.2s", delay: 1.2, isSuccess: true },
  { text: "$ const portfolio = await build()", delay: 2.4 },
  { text: '$ portfolio.deploy(\'production\')', delay: 3.6 },
  { text: "✓ Deployed in 2.3s", delay: 5.0, isSuccess: true },
];

function TypingLine({
  text,
  delay,
  isSuccess,
  isLast,
  skipAnimation,
}: {
  text: string;
  delay: number;
  isSuccess?: boolean;
  isLast: boolean;
  skipAnimation: boolean;
}) {
  const count = useMotionValue(0);
  const displayed = useTransform(count, (v) => text.slice(0, Math.round(v)));
  const [value, setValue] = useState(skipAnimation ? text : "");
  const [done, setDone] = useState(skipAnimation);

  useEffect(() => {
    if (skipAnimation) return;
    const timeout = setTimeout(() => {
      const controls = animate(count, text.length, {
        duration: text.length * 0.04,
        ease: "linear",
        onComplete: () => setDone(true),
      });
      return () => controls.stop();
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [count, text, delay, skipAnimation]);

  useEffect(() => {
    if (skipAnimation) return;
    return displayed.on("change", (v) => setValue(v));
  }, [displayed, skipAnimation]);

  if (!skipAnimation && !done && value === "") return null;

  return (
    <div className="flex">
      <span className={isSuccess ? "text-green-400" : "text-muted-foreground"}>
        {skipAnimation ? text : value}
      </span>
      {isLast && done && !skipAnimation && (
        <span className="ml-0.5 animate-blink text-primary">|</span>
      )}
    </div>
  );
}

export function HeroTerminal() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{
        opacity: 1,
        y: prefersReducedMotion ? 0 : [0, -8, 0],
      }}
      transition={
        prefersReducedMotion
          ? { duration: 0.4, delay: 0.4, ease: "easeOut" }
          : {
              opacity: { duration: 0.4, delay: 0.4, ease: "easeOut" },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.4 },
            }
      }
      className="relative"
    >
      {/* Glow */}
      <motion.div
        className="absolute -inset-4 rounded-2xl bg-primary/10 blur-2xl dark:bg-primary/5"
        animate={
          prefersReducedMotion
            ? { opacity: 0.3 }
            : { opacity: [0.3, 0.6, 0.3] }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }
      />

      {/* Terminal window */}
      <div className="relative overflow-hidden rounded-lg border border-border bg-card shadow-lg shadow-primary/20 dark:shadow-primary/10">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-500/80 dark:bg-red-500/70" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80 dark:bg-yellow-500/70" />
          <span className="h-3 w-3 rounded-full bg-green-500/80 dark:bg-green-500/70" />
          <span className="ml-2 font-mono text-xs text-muted-foreground">
            ~/projects
          </span>
        </div>

        {/* Terminal body */}
        <div className="space-y-1.5 p-4 font-mono text-sm leading-relaxed">
          {lines.map((line, i) => (
            <TypingLine
              key={i}
              text={line.text}
              delay={line.delay}
              isSuccess={line.isSuccess}
              isLast={i === lines.length - 1}
              skipAnimation={prefersReducedMotion}
            />
          ))}
          {prefersReducedMotion && (
            <span className="ml-0.5 animate-blink text-primary">|</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
