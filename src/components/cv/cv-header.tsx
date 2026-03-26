"use client";

import { Mail, Phone, MapPin, Github, Globe } from "lucide-react";
import { personalInfo } from "@/data/cv-data";

interface CVHeaderProps {
  title?: string;
}

export function CVHeader({ title = "Software Engineer" }: CVHeaderProps) {
  return (
    <header className="flex flex-col gap-3 pb-4 border-b border-[var(--cv-divider)]">
      {/* Name + Title row */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">
            Piotr Romanczuk
          </h1>
          <p className="mt-1 text-base font-medium tracking-wide font-sans" style={{ color: "var(--cv-accent)" }}>
            {title}
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
              href={`mailto:${personalInfo.email}`}
              className="flex items-center gap-1.5 text-xs text-[var(--cv-subtle)] hover:text-foreground transition-colors"
            >
              <Mail size={13} aria-hidden="true" />
              {personalInfo.email}
            </a>
          </li>
          <li>
            <a
              href={`tel:${personalInfo.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 text-xs text-[var(--cv-subtle)] hover:text-foreground transition-colors"
            >
              <Phone size={13} aria-hidden="true" />
              {personalInfo.phone}
            </a>
          </li>
          <li>
            <span className="flex items-center gap-1.5 text-xs text-[var(--cv-subtle)]">
              <MapPin size={13} aria-hidden="true" />
              {personalInfo.location}
            </span>
          </li>
          <li>
            <a
              href={personalInfo.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-[var(--cv-subtle)] hover:text-foreground transition-colors"
            >
              <Github size={13} aria-hidden="true" />
              {personalInfo.github}
            </a>
          </li>
          <li>
            <a
              href={personalInfo.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-[var(--cv-subtle)] hover:text-foreground transition-colors"
            >
              <Globe size={13} aria-hidden="true" />
              {personalInfo.portfolio}
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
