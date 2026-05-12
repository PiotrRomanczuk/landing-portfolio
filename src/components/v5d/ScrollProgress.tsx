"use client";

import { useEffect, useRef } from "react";

/**
 * Thin top progress bar — used at narrow viewports where the right
 * anchor rail would otherwise squish. CSS hides it on wide screens.
 */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const update = () => {
      const el = bar.current;
      if (!el) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? window.scrollY / max : 0;
      el.style.transform = `scaleX(${Math.min(1, Math.max(0, pct)).toFixed(4)})`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="v5d-progress" aria-hidden>
      <div ref={bar} className="v5d-progress-fill" />
    </div>
  );
}
