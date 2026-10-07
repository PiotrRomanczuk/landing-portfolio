import Image from "next/image";
import Link from "next/link";
import { CARD, CONTACT, GITHUB_URL, IS_VECTOR_SOON, LINKEDIN_URL, mailHref, type Locale } from "@/data/card";
import { CookieSettingsButton } from "@/components/consent/CookieSettingsButton";
import { CardActions } from "./CardActions";
import { CardMessageForm } from "./CardMessageForm";
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
            <CardActions copy={copy} />
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
            <CardMessageForm copy={copy.form} lang={locale} waText={copy.waDefault} />
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
          <CookieSettingsButton label={copy.cookieSettings} className="card-cookie" />
        </footer>
      </div>
    </div>
  );
}
