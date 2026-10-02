import Link from "next/link";
import { mailHref, type CardTile as Tile } from "@/data/card";

type Props = { tile: Tile; soonLabel: string; askLabel: string };

function TileLink({ href, label, className }: { href: string; label: string; className: string }) {
  if (href.startsWith("/")) {
    return (
      <Link className={className} href={href}>
        {label} →
      </Link>
    );
  }
  const isExternal = href.startsWith("http");
  return (
    <a className={className} href={href} {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {label} {isExternal ? "↗" : "→"}
    </a>
  );
}

/** One destination on the card. Tiles without a live href fall back to a pre-filled e-mail. */
export function CardTile({ tile, soonLabel, askLabel }: Props) {
  const mainHref = tile.href ?? (tile.mailSubject ? mailHref(tile.mailSubject) : null);
  const hasSecondaryMail = tile.href !== null && tile.mailSubject !== undefined;

  return (
    <section className={`card-tile${tile.id === "vector" ? " lead" : ""}`} aria-labelledby={`tile-${tile.id}`}>
      <div className="card-tile-head">
        <h2 id={`tile-${tile.id}`}>{tile.title}</h2>
        {tile.isComingSoon ? <span className="card-badge">{soonLabel}</span> : null}
      </div>
      <p>{tile.body}</p>
      {tile.note ? <p className="note">{tile.note}</p> : null}
      {mainHref || hasSecondaryMail ? (
        <div className="card-tile-links">
          {mainHref ? <TileLink className="card-tile-link" href={mainHref} label={tile.cta} /> : null}
          {hasSecondaryMail ? (
            <TileLink className="card-tile-link quiet" href={mailHref(tile.mailSubject)} label={askLabel} />
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
