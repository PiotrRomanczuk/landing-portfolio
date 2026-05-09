"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

const EDITION_VOLUME = "Vol. V · No. 01";
const EDITION_PLACE = "Warsaw · May 2026";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function V5Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const isDark = mounted && resolvedTheme === "dark";
  const label = mounted ? (isDark ? "Light" : "Dark") : "Theme";

  return (
    <header role="banner" aria-label="Masthead">
      <div className="v5-masthead">
        <h1 className="name">Piotr&nbsp;Romanczuk</h1>
        <div className="meta">
          <span className="vol">{EDITION_VOLUME}</span>
          <span>{EDITION_PLACE}</span>
        </div>
      </div>
      <div className="v5-edition">
        <span>An ongoing record of work shipped</span>
        <span>Est. 2020</span>
      </div>
      <div className="v5-subnav">
        <nav aria-label="Primary">
          <a href="#work">Work</a>
          <a href="#path">Path</a>
          <a href="#contact">Contact</a>
          <a
            href="https://github.com/PiotrRomanczuk"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub ↗
          </a>
        </nav>
        <div className="actions">
          <button
            type="button"
            className="v5-tog"
            aria-pressed={isDark}
            aria-label="Toggle dark mode"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {label}
          </button>
        </div>
      </div>
    </header>
  );
}

export default V5Header;
