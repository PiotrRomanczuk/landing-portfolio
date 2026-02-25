"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";

export interface DotPosition {
  x: number;
  y: number;
}

interface TimelinePathData {
  pathD: string;
  dots: DotPosition[];
  isReady: boolean;
  svgWidth: number;
  svgHeight: number;
}

const MOBILE_BREAKPOINT = 768;
const MOBILE_DOT_X = 16;
const ARROW_EXTENSION = 30;

export function useTimelinePathData(
  containerRef: RefObject<HTMLDivElement | null>,
  milestoneRefs: RefObject<(HTMLDivElement | null)[]>
): TimelinePathData {
  const [data, setData] = useState<TimelinePathData>({
    pathD: "",
    dots: [],
    isReady: false,
    svgWidth: 0,
    svgHeight: 0,
  });

  const compute = useCallback(() => {
    const container = containerRef.current;
    const refs = milestoneRefs.current;
    if (!container || !refs) return;

    const validRefs = refs.filter(Boolean);
    if (validRefs.length === 0) return;

    const containerRect = container.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;
    const isMobile = width < MOBILE_BREAKPOINT;

    const dots: DotPosition[] = [];
    for (let i = 0; i < refs.length; i++) {
      const el = refs[i];
      if (!el) continue;

      const elRect = el.getBoundingClientRect();
      const y = Math.round(
        elRect.top - containerRect.top + elRect.height / 2
      );

      if (isMobile) {
        dots.push({ x: MOBILE_DOT_X, y });
      } else {
        const x = Math.round(width * 0.5);
        dots.push({ x, y });
      }
    }

    let pathD = "";
    if (dots.length === 0) {
      // No path
    } else if (isMobile) {
      const startY = dots[0].y;
      const endY = dots[dots.length - 1].y + ARROW_EXTENSION;
      pathD = `M ${MOBILE_DOT_X} ${startY} L ${MOBILE_DOT_X} ${endY}`;
    } else if (dots.length === 1) {
      const d = dots[0];
      pathD = `M ${d.x} ${d.y} l 0 ${ARROW_EXTENSION}`;
    } else {
      pathD = `M ${dots[0].x} ${dots[0].y}`;
      for (let i = 1; i < dots.length; i++) {
        const prev = dots[i - 1];
        const curr = dots[i];
        const midY = Math.round((prev.y + curr.y) / 2);
        pathD += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
      }
      pathD += ` l 0 ${ARROW_EXTENSION}`;
    }

    setData({
      pathD,
      dots,
      isReady: true,
      svgWidth: width,
      svgHeight: height,
    });
  }, [containerRef, milestoneRefs]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const rafId = requestAnimationFrame(compute);

    let timeoutId: ReturnType<typeof setTimeout>;
    const observer = new ResizeObserver(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(compute, 100);
    });

    observer.observe(container);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [compute, containerRef]);

  return data;
}
