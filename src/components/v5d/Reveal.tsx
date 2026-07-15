"use client";

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = {
  as?: "div" | "section" | "li" | "span";
  delay?: number;
  className?: string;
  children: ReactNode;
  style?: CSSProperties;
};

/**
 * Reveals a child on scroll: opacity 0→1, translateY 20px→0.
 * Fails open: the server renders content visible (no-JS, print,
 * crawlers, full-page snapshots all see it); the hidden state is
 * only applied after hydration, right before observing.
 * Respects prefers-reduced-motion (renders immediately, no transform).
 */
type Phase = "static" | "pre" | "in";

export function Reveal({ as = "div", delay = 0, className, children, style }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("static");
  const shown = phase !== "pre";

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    let io: IntersectionObserver | null = null;
    // Hide only after the first painted frame so the SSR-visible content
    // never flashes, then let the observer reveal it back in.
    const raf = requestAnimationFrame(() => {
      setPhase("pre");
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              setPhase("in");
              io?.disconnect();
              break;
            }
          }
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
      );
      io.observe(el);
    });
    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, [reduced]);

  const Tag = as as "div";
  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`v5d-reveal${shown ? " in" : ""} ${className ?? ""}`}
      style={{ ...style, transitionDelay: shown ? `${delay}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}
