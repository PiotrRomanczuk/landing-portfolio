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
 * Respects prefers-reduced-motion (renders immediately, no transform).
 */
export function Reveal({ as = "div", delay = 0, className, children, style }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const [observed, setObserved] = useState(false);
  const shown = reduced || observed;

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setObserved(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
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
