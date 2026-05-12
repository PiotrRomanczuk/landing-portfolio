import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Common shell for /blog pages — sets up the same gutters + narrow
 * column as the landing, with a quieter header that links back home.
 */
type ShellProps = {
  children: ReactNode;
} & (
  | { eyebrow: string; title: string; meta?: ReactNode }
  | { eyebrow?: undefined; title?: undefined; meta?: undefined }
);

export function BlogShell(props: ShellProps) {
  const { children, eyebrow, title, meta } = props;
  return (
    <div className="v5d-root" data-theme="dark">
      <div className="shell">
        <aside className="gutter-l">
          <div className="gutter-l-sticky">
            <Link href="/" className="mark" title="Back to home">pr</Link>
            <div className="gutter-meta">
              <div>v5 · 2026</div>
              <div>warsaw, pl</div>
              <Link href="/" className="available" style={{ display: "block" }}>
                ← home
              </Link>
            </div>
          </div>
        </aside>

        <main>
          {title ? (
            <header className="blog-head">
              <div className="eyebrow">{eyebrow}</div>
              <h1>{title}</h1>
              {meta ? <div className="blog-head-meta">{meta}</div> : null}
            </header>
          ) : null}
          {children}
        </main>

        <aside className="gutter-r" />
      </div>
    </div>
  );
}
