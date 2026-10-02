import Image from "next/image";
import Link from "next/link";
import { CARD, CONTACT, GITHUB_URL, IS_VECTOR_SOON, LINKEDIN_URL, mailHref, type Locale } from "@/data/card";
import { CardTile } from "./CardTile";
import "./card.css";

const LOCALES: { code: Locale; href: string }[] = [
  { code: "pl", href: "/" },
  { code: "en", href: "/en" },
];

function LangSwitch({ locale, label }: { locale: Locale; label: string }) {
  return (
    <nav className="card-lang" aria-label={label}>
      {LOCALES.map(({ code, href }) => (
        <Link key={code} href={href} hrefLang={code} aria-current={code === locale ? "page" : undefined}>
          {code.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}

export function BusinessCard({ locale }: { locale: Locale }) {
  const copy = CARD[locale];
  const fullName = `${CONTACT.firstName} ${CONTACT.lastName}`;
  const soon = IS_VECTOR_SOON ? (
    <div className="card-soon">
      <span className="card-soon-dot" aria-hidden="true" />
      <strong>{copy.soon}</strong>
      <span>{copy.soonText}</span>
    </div>
  ) : null;

  return (
    <div className="card-root" lang={locale}>
      <div className="card-wrap">
        <header className="card-top">
          <Link className="card-home" href={locale === "pl" ? "/" : "/en"}>
            romanczuk.online
          </Link>
          <LangSwitch locale={locale} label={copy.langLabel} />
        </header>

        <main className="card-main">
          <section className="card-profile" aria-label={fullName}>
            <div className="card-id">
              <Image className="card-photo" src="/profile.jpg" alt={fullName} width={124} height={124} priority />
              <h1 className="card-name">{fullName}</h1>
            </div>
            <p className="card-role">{copy.role}</p>
            <p className="card-intro">{copy.intro}</p>
            <nav className="card-actions" aria-label={copy.actionsLabel}>
              <a className="card-action primary" href={`tel:${CONTACT.phone}`}>
                <span>{copy.call}</span>
                <span className="mono">{CONTACT.phoneDisplay}</span>
              </a>
              <a className="card-action" href={mailHref()}>
                {copy.write}
              </a>
              <a className="card-action" href="/kontakt.vcf" download="piotr-romanczuk.vcf">
                <span>{copy.save}</span>
                <span className="mono small">.vcf</span>
              </a>
            </nav>
          </section>

          <section className="card-tiles" aria-label={copy.tilesLabel}>
            <div className="card-featured">
              <CardTile tile={copy.lead} variant="lead" footer={soon} />
              <CardTile tile={copy.portfolio} variant="portfolio" />
            </div>
            <div className="card-more">
              {copy.more.map((tile) => (
                <CardTile key={tile.id} tile={tile} variant="more" />
              ))}
            </div>
          </section>
        </main>

        <footer className="card-foot">
          <a className="mono" href={mailHref()}>
            {CONTACT.email}
          </a>
          <span>{copy.city}</span>
          {LINKEDIN_URL ? (
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              LinkedIn ↗
            </a>
          ) : null}
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            GitHub ↗
          </a>
        </footer>
      </div>
    </div>
  );
}
