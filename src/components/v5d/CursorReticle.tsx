"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Thin trailing reticle that appears only while the cursor is over an
 * element marked `[data-reticle]` (the work rows). Disabled for touch
 * and for users with reduced-motion preference.
 */
export function CursorReticle() {
  const reduced = useReducedMotion();
  const dot = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduced) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
    const el = dot.current;
    if (!el) return;

    const tick = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const target = e.target as HTMLElement | null;
      const over = !!target?.closest("[data-reticle]");
      setVisible(over);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  if (reduced) return null;
  return (
    <div
      ref={dot}
      className="v5d-reticle"
      data-on={visible ? "1" : "0"}
      aria-hidden
    />
  );
}
