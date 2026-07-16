"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProjectMock } from "@/components/v5d/ProjectMock";
import type { Project } from "@/components/v5d/projects";

type Props = {
  project: Project;
  onClose: () => void;
};

/**
 * Full-detail card for a work-row, opened on click. Overlay pattern
 * mirrors the command palette: backdrop click or Esc closes.
 */
export function ProjectDetail({ project, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      // Focus trap: keep Tab cycling inside the dialog.
      if (e.key === "Tab") {
        const card = cardRef.current;
        if (!card) return;
        const focusables = card.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        const inside = active instanceof Node && card.contains(active);
        if (e.shiftKey && (active === first || !inside)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (active === last || !inside)) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const p = project;
  return (
    <div
      className="proj-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={cardRef}
        className="proj-card"
        role="dialog"
        aria-modal="true"
        aria-label={`${p.title} — details`}
      >
        <div className="proj-card-head">
          <span className="num">{p.num}</span>
          <h3>{p.title}</h3>
          {p.status === "shipping" && (
            <span className="pill live">
              <span className="dot s5"></span> live
            </span>
          )}
          {p.status === "active" && <span className="pill accent">active</span>}
          {p.status === "paused" && <span className="pill">paused</span>}
          {p.status === "internal" && <span className="pill">internal</span>}
          {p.status === "archived" && <span className="pill">archived</span>}
          <span className="proj-card-meta">
            {p.year} · {p.type}
          </span>
          <button ref={closeRef} type="button" className="proj-close" onClick={onClose} aria-label="Close details">
            esc ✕
          </button>
        </div>

        {p.screenshot ? (
          <div className="proj-card-mock shot">
            <Image
              src={p.screenshot}
              alt={`${p.title} — screenshot`}
              fill
              sizes="(max-width: 700px) 92vw, 640px"
            />
          </div>
        ) : (
          <>
            <div className="proj-card-mock" aria-hidden>
              <ProjectMock id={p.mockId} />
            </div>
            {p.mockNote && <p className="proj-mock-note">{p.mockNote}</p>}
          </>
        )}

        <p className="proj-about">{p.details.about}</p>

        <ul className="proj-highlights">
          {p.details.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>

        {p.metrics && p.metrics.length > 0 && (
          <div className="metrics-row">
            {p.metrics.map((m) => (
              <span className="metric" key={m}>
                {m}
              </span>
            ))}
          </div>
        )}

        <div className="stack">
          {p.stack.map((s) => (
            <span className="chip" key={s}>
              {s}
            </span>
          ))}
        </div>

        {p.details.post && (
          <Link className="proj-post-link" href={p.details.post.href} onClick={onClose}>
            <span className="lbl">from the blog</span>
            {p.details.post.title} ↗
          </Link>
        )}

        {(p.live || p.repo) && (
          <div className="proj-links">
            {p.live && (
              <a href={`https://${p.live}`} target="_blank" rel="noopener noreferrer">
                ↗ {p.live}
              </a>
            )}
            {p.repo && (
              <a href={`https://${p.repo}`} target="_blank" rel="noopener noreferrer">
                ↗ {p.repo.replace("github.com/", "")}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
