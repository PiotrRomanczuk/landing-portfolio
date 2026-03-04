"use client";

import { Mail, Phone, MapPin, Github, Globe } from "lucide-react";

export function CVHeader() {
  return (
    <header className="flex flex-col gap-3 pb-4 border-b border-[var(--cv-divider)]">
      {/* Name + Title row */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">
            Piotr Romanczuk
          </h1>
          <p className="mt-1 text-base font-medium tracking-wide font-sans" style={{ color: "var(--cv-accent)" }}>
            Software Engineer
          </p>
        </div>
        {/* Print button - hidden when printing */}
        <button
          onClick={() => window.print()}
          className="no-print flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[var(--cv-subtle)] border border-[var(--cv-divider)] rounded hover:border-[var(--cv-accent)] hover:text-[var(--cv-accent)] transition-colors cursor-pointer"
          aria-label="Print or save as PDF"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
          Save PDF
        </button>
      </div>

      {/* Contact links */}
      <nav aria-label="Contact information">
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          <li>
            <a
              href="mailto:p.romanczuk@gmail.com"
              className="flex items-center gap-1.5 text-xs text-[var(--cv-subtle)] hover:text-foreground transition-colors"
            >
              <Mail size={13} aria-hidden="true" />
              p.romanczuk@gmail.com
            </a>
          </li>
          <li>
            <a
              href="tel:+48513602768"
              className="flex items-center gap-1.5 text-xs text-[var(--cv-subtle)] hover:text-foreground transition-colors"
            >
              <Phone size={13} aria-hidden="true" />
              +48 513 602 768
            </a>
          </li>
          <li>
            <span className="flex items-center gap-1.5 text-xs text-[var(--cv-subtle)]">
              <MapPin size={13} aria-hidden="true" />
              Warsaw, Poland
            </span>
          </li>
          <li>
            <a
              href="https://github.com/PiotrRomanczuk"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-[var(--cv-subtle)] hover:text-foreground transition-colors"
            >
              <Github size={13} aria-hidden="true" />
              github.com/PiotrRomanczuk
            </a>
          </li>
          <li>
            <a
              href="https://romanczuk.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-[var(--cv-subtle)] hover:text-foreground transition-colors"
            >
              <Globe size={13} aria-hidden="true" />
              romanczuk.vercel.app
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
