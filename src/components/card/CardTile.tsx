import Link from "next/link";
import type { CardLink, CardTile as Tile } from "@/data/card";

type Variant = "lead" | "portfolio" | "more";

function TileLink({ link, className: base }: { link: CardLink; className: string }) {
  const className = link.quiet ? `${base} quiet` : base;
  if (link.href.endsWith(".pdf")) {
    return (
      <a className={className} href={link.href} target="_blank" rel="noopener noreferrer">
        {link.label} ↗
      </a>
    );
  }
  if (link.href.startsWith("/")) {
    return (
      <Link className={className} href={link.href}>
        {link.label} →
      </Link>
    );
  }
  const isExternal = link.href.startsWith("http");
  return (
    <a className={className} href={link.href} {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {link.label} {isExternal ? "↗" : "→"}
    </a>
  );
}

/**
 * One destination on the card. "lead" is the dark, filled Vector Digital tile; "portfolio" the framed
 * second-strongest tile; "more" the light, ruled entries below them.
 */
export function CardTile({ tile, variant, footer }: { tile: Tile; variant: Variant; footer?: React.ReactNode }) {
  const Heading = variant === "more" ? "h3" : "h2";
  const linkClass = variant === "lead" ? "card-btn" : "card-link";

  return (
    <article className={`card-tile ${variant}`} aria-labelledby={`tile-${tile.id}`}>
      <div className="card-tile-head">
        <span className="card-eyebrow">{tile.eyebrow}</span>
        {variant === "portfolio" ? <span className="card-chip">EN</span> : null}
      </div>
      <Heading id={`tile-${tile.id}`}>{tile.title}</Heading>
      <p>{tile.body}</p>
      {tile.proof ? <p className="card-proof">{tile.proof}</p> : null}
      <div className="card-tile-links">
        {tile.links.map((link) => (
          <TileLink key={link.href} link={link} className={linkClass} />
        ))}
      </div>
      {footer}
    </article>
  );
}
