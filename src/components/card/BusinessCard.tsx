import Image from "next/image";
import Link from "next/link";
import { CARD, CONTACT, mailHref, type Locale } from "@/data/card";
import { CardTile } from "./CardTile";
import "./card.css";

export function BusinessCard({ locale }: { locale: Locale }) {
  const copy = CARD[locale];
  const fullName = `${CONTACT.firstName} ${CONTACT.lastName}`;

  return (
    <div className="card-root" lang={locale}>
      <main className="card-wrap">
        <nav className="card-top" aria-label={locale === "pl" ? "Język" : "Language"}>
          <Link className="card-lang" href={copy.switchHref} hrefLang={locale === "pl" ? "en" : "pl"}>
            {copy.switchLabel}
          </Link>
        </nav>

        <header className="card-hero">
          <Image className="card-photo" src="/profile.jpg" alt={fullName} width={96} height={96} priority />
          <h1 className="card-name">{fullName}</h1>
          <p className="card-role">{copy.role}</p>
          <p className="card-intro">{copy.intro}</p>
        </header>

        <div className="card-actions">
          <a className="card-action primary" href={`tel:${CONTACT.phone}`}>
            {copy.call}
            <small>{CONTACT.phoneDisplay}</small>
          </a>
          <a className="card-action" href={mailHref()}>
            {copy.write}
            <small>e-mail</small>
          </a>
          <a className="card-action" href="/kontakt.vcf" download="piotr-romanczuk.vcf">
            {copy.save}
            <small>.vcf</small>
          </a>
        </div>

        <div className="card-tiles">
          {copy.tiles.map((tile) => (
            <CardTile key={tile.id} tile={tile} soonLabel={copy.soon} askLabel={copy.ask} />
          ))}
        </div>

        <footer className="card-foot">
          <span>{CONTACT.email}</span>
          <span>{CONTACT.city} · romanczuk.online</span>
        </footer>
      </main>
    </div>
  );
}
