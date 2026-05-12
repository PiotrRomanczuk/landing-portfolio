"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Options = {
  radius?: number;
  strength?: number;
};

export function useMagnetic<T extends HTMLElement>({
  radius = 80,
  strength = 0.35,
}: Options = {}) {
  const ref = useRef<T | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    let raf = 0;
    let active = false;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > radius) {
        if (active) {
          active = false;
          cancelAnimationFrame(raf);
          el.style.transform = "";
        }
        return;
      }
      active = true;
      const pull = 1 - dist / radius;
      const tx = dx * strength * pull;
      const ty = dy * strength * pull;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
      });
    };

    const reset = () => {
      cancelAnimationFrame(raf);
      active = false;
      el.style.transform = "";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", reset);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", reset);
      cancelAnimationFrame(raf);
      el.style.transform = "";
    };
  }, [radius, strength, reduced]);

  return ref;
}
