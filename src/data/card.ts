// Single source of truth for the business card at romanczuk.online (/ and /en) and /kontakt.vcf.

export type Locale = "pl" | "en";

export const CONTACT = {
  firstName: "Piotr",
  lastName: "Romańczuk",
  phone: "+48513602768",
  phoneDisplay: "513 602 768",
  email: "p.romanczuk@gmail.com",
  city: "Warszawa",
} as const;

/** Set once Vector Digital has its own domain; until then the tile leads to e-mail. */
export const VECTOR_DIGITAL_URL: string | null = null;
/** Public homelab status page (phase 2: status.romanczuk.online). */
export const STATUS_URL: string | null = null;
export const STRUMMY_URL = "https://strummy.online";

export type CardTile = {
  id: "vector" | "portfolio" | "english" | "guitar" | "homelab" | "blog";
  title: string;
  body: string;
  note?: string;
  /** Where the tile leads; null = falls back to mailHref(mailSubject), or no link at all without a subject. */
  href: string | null;
  /** Shows the "coming soon" badge (destination not live yet). */
  isComingSoon?: boolean;
  cta: string;
  /** Pre-filled e-mail subject: the main link when href is null, otherwise a second, quieter link. */
  mailSubject?: string;
};

export type CardCopy = {
  role: string;
  intro: string;
  call: string;
  write: string;
  save: string;
  soon: string;
  ask: string;
  switchLabel: string;
  switchHref: string;
  title: string;
  description: string;
  tiles: CardTile[];
};

export const CARD: Record<Locale, CardCopy> = {
  pl: {
    role: "Inżynier oprogramowania · automatyzacja procesów i AI",
    intro:
      "Buduję i utrzymuję aplikacje webowe — od kodu po serwer. Pomagam firmom zdjąć z ludzi powtarzalną pracę. Po godzinach uczę angielskiego i gry na gitarze.",
    call: "Zadzwoń",
    write: "Napisz",
    save: "Zapisz kontakt",
    soon: "wkrótce",
    ask: "Zapytaj mailem",
    switchLabel: "EN",
    switchHref: "/en",
    title: "Piotr Romańczuk — wizytówka",
    description:
      "Inżynier oprogramowania z Warszawy. Automatyzacja procesów i wdrożenia AI (Vector Digital), portfolio, korepetycje z angielskiego, lekcje gitary.",
    tiles: [
      {
        id: "vector",
        title: "Vector Digital",
        body: "Usprawniamy powtarzalną pracę w małych firmach: wyceny, raporty, faktury, przepisywanie danych między mailem a Excelem. Automatyzacja procesów i wdrożenia AI na narzędziach, które już macie.",
        note: "Prowadzę audyty i wdrożenia.",
        href: VECTOR_DIGITAL_URL,
        isComingSoon: VECTOR_DIGITAL_URL === null,
        cta: "Napisz w sprawie audytu",
        mailSubject: "Vector Digital — audyt procesów",
      },
      {
        id: "portfolio",
        title: "Portfolio i CV",
        body: "Projekty, doświadczenie i CV — po angielsku.",
        href: "/portfolio",
        cta: "Zobacz portfolio",
      },
      {
        id: "english",
        title: "Korepetycje z angielskiego",
        body: "Lekcje online, przygotowanie do egzaminów i konkursów. Po każdej lekcji notatki i ćwiczenia w aplikacji.",
        note: "Masz link do swoich notatek? Otwórz go bezpośrednio.",
        href: null,
        cta: "Zapytaj o lekcje",
        mailSubject: "Korepetycje z angielskiego",
      },
      {
        id: "guitar",
        title: "Lekcje gitary",
        body: "Uczę gry na gitarze. Uczniów prowadzę w Strummy — aplikacji, którą sam zbudowałem.",
        href: STRUMMY_URL,
        cta: "Strummy",
        mailSubject: "Lekcje gitary",
      },
      {
        id: "homelab",
        title: "Homelab",
        body: "Domowe serwery: monitoring, kopie zapasowe, własne aplikacje. Publiczny status usług.",
        href: STATUS_URL,
        isComingSoon: STATUS_URL === null,
        cta: "Status usług",
      },
      {
        id: "blog",
        title: "Blog",
        body: "Piszę o budowaniu i utrzymaniu oprogramowania — po angielsku.",
        href: "/blog",
        cta: "Czytaj",
      },
    ],
  },
  en: {
    role: "Software engineer · process automation & AI",
    intro:
      "I build and run web applications — from code to server. I help companies take repetitive work off people's plates. After hours I teach English and guitar.",
    call: "Call",
    write: "E-mail",
    save: "Save contact",
    soon: "soon",
    ask: "Ask by e-mail",
    switchLabel: "PL",
    switchHref: "/",
    title: "Piotr Romańczuk — business card",
    description:
      "Software engineer in Warsaw. Process automation and AI implementation (Vector Digital), portfolio, English tutoring, guitar lessons.",
    tiles: [
      {
        id: "vector",
        title: "Vector Digital",
        body: "We streamline repetitive work in small companies: quotes, reports, invoices, copying data between e-mail and Excel. Process automation and AI built on the tools you already use.",
        note: "I run the audits and implementations.",
        href: VECTOR_DIGITAL_URL,
        isComingSoon: VECTOR_DIGITAL_URL === null,
        cta: "Ask about an audit",
        mailSubject: "Vector Digital — process audit",
      },
      {
        id: "portfolio",
        title: "Portfolio & CV",
        body: "Projects, experience and CV.",
        href: "/portfolio",
        cta: "View portfolio",
      },
      {
        id: "english",
        title: "English tutoring",
        body: "Online lessons, exam and competition prep. Notes and exercises in an app after every lesson.",
        note: "Got a link to your notes? Open it directly.",
        href: null,
        cta: "Ask about lessons",
        mailSubject: "English tutoring",
      },
      {
        id: "guitar",
        title: "Guitar lessons",
        body: "I teach guitar. My students use Strummy — an app I built myself.",
        href: STRUMMY_URL,
        cta: "Strummy",
        mailSubject: "Guitar lessons",
      },
      {
        id: "homelab",
        title: "Homelab",
        body: "Servers at home: monitoring, backups, self-hosted apps. Public service status.",
        href: STATUS_URL,
        isComingSoon: STATUS_URL === null,
        cta: "Service status",
      },
      {
        id: "blog",
        title: "Blog",
        body: "Writing about building and running software.",
        href: "/blog",
        cta: "Read",
      },
    ],
  },
};

export function mailHref(subject?: string): string {
  return `mailto:${CONTACT.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;
}

/** vCard 3.0 — what "Save contact" downloads. */
export function buildVCard(): string {
  const { firstName, lastName, phone, email, city } = CONTACT;
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${lastName};${firstName};;;`,
    `FN:${firstName} ${lastName}`,
    `TITLE:${CARD.pl.role}`,
    `TEL;TYPE=CELL:${phone}`,
    `EMAIL;TYPE=INTERNET:${email}`,
    "URL:https://romanczuk.online",
    `ADR;TYPE=WORK:;;;${city};;;Polska`,
    "NOTE:Vector Digital · portfolio · korepetycje z angielskiego · lekcje gitary — romanczuk.online",
    "END:VCARD",
    "",
  ].join("\r\n");
}
