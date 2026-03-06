"use client";

import { useState } from "react";
import Link from "next/link";

export function V4Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="max-w-[1100px] mx-auto px-8 py-6 flex items-center justify-between border-b border-[var(--border)]">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 bg-gradient-to-br from-[var(--v4-navy)] to-[#2A4A8C] rounded-[10px] flex items-center justify-center font-[family-name:var(--font-source-serif)] font-bold text-[22px] text-white">
          PR
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="font-[family-name:var(--font-source-serif)] text-xl font-bold tracking-[-0.5px] text-[#1A1A1A]">
            Piotr Romanczuk
          </div>
          <div className="text-[11px] text-[#999] tracking-[2px] uppercase">
            Software Engineer &middot; Warsaw
          </div>
        </div>
      </div>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-2">
        {["Work", "About", "Contact"].map((label) => (
          <a
            key={label}
            href={`#${label.toLowerCase()}`}
            className="text-sm font-medium text-[#666] px-4 py-2 rounded-lg hover:text-[#1A1A1A] transition-colors"
          >
            {label}
          </a>
        ))}
        <Link
          href="/cv"
          className="bg-[var(--v4-navy)] text-white font-semibold text-sm px-5 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          View CV
        </Link>
      </nav>

      {/* Mobile hamburger */}
      <button
        className="md:hidden flex flex-col gap-1.5 p-2"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span className={`block w-6 h-0.5 bg-[#1A1A1A] transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
        <span className={`block w-6 h-0.5 bg-[#1A1A1A] transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
        <span className={`block w-6 h-0.5 bg-[#1A1A1A] transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-[76px] left-0 right-0 bg-[var(--background)] border-b border-[var(--border)] p-6 flex flex-col gap-4 z-50 md:hidden">
          {["Work", "About", "Contact"].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="text-base font-medium text-[#666] hover:text-[#1A1A1A]"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <Link
            href="/cv"
            className="bg-[var(--v4-navy)] text-white font-semibold text-sm px-5 py-2 rounded-lg text-center"
            onClick={() => setMenuOpen(false)}
          >
            View CV
          </Link>
        </div>
      )}
    </header>
  );
}
