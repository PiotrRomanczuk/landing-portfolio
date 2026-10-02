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

/** Set once Vector Digital has its own domain; until then the tile leads to e-mail and shows "coming soon". */
export const VECTOR_DIGITAL_URL: string | null = null;
export const STRUMMY_URL = "https://strummy.online";
export const GITHUB_URL = "https://github.com/PiotrRomanczuk";
/** Footer link; hidden while null. */
export const LINKEDIN_URL: string | null = null;
const HOMELAB_POST = "/blog/four-boxes-and-a-pi-homelab-devops-classroom";

export type CardLink = { label: string; href: string };

export type CardTile = {
  id: "vector" | "portfolio" | "english" | "guitar" | "homelab" | "blog";
  /** Who the tile is for — lets each audience spot "its" tile at a glance. */
  eyebrow: string;
  title: string;
  body: string;
  links: CardLink[];
};

export type CardCopy = {
  role: string;
  intro: string;
  call: string;
  write: string;
  save: string;
  actionsLabel: string;
  tilesLabel: string;
  langLabel: string;
  city: string;
  soon: string;
  soonText: string;
  title: string;
  description: string;
  lead: CardTile;
  portfolio: CardTile;
  more: CardTile[];
};

export function mailHref(subject?: string): string {
  return `mailto:${CONTACT.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;
}

export const IS_VECTOR_SOON = VECTOR_DIGITAL_URL === null;

export const CARD: Record<Locale, CardCopy> = {
  pl: {
    role: "Inżynier oprogramowania · automatyzacja procesów i AI",
    intro:
      "Buduję i utrzymuję aplikacje webowe — od kodu po serwer. Pomagam firmom zdjąć z ludzi powtarzalną pracę. Po godzinach uczę angielskiego i gry na gitarze.",
    call: "Zadzwoń",
    write: "Napisz",
    save: "Zapisz kontakt",
    actionsLabel: "Kontakt",
    tilesLabel: "Czym się zajmuję",
    langLabel: "Język",
    city: "Warszawa",
    soon: "Wkrótce",
    soonText: "osobna strona Vector Digital",
    title: "Piotr Romańczuk — wizytówka",
    description:
      "Inżynier oprogramowania z Warszawy. Automatyzacja procesów i wdrożenia AI (Vector Digital), portfolio, korepetycje z angielskiego, lekcje gitary.",
    lead: {
      id: "vector",
      eyebrow: "Dla firm",
      title: "Vector Digital",
      body: "Usprawniamy powtarzalną pracę w małych firmach: wyceny, raporty, faktury, przepisywanie danych między mailem a Excelem. Automatyzacja procesów i wdrożenia AI na narzędziach, które już macie. Prowadzę audyty i wdrożenia.",
      links: [{ label: "Napisz w sprawie audytu", href: VECTOR_DIGITAL_URL ?? mailHref("Vector Digital — audyt procesów") }],
    },
    portfolio: {
      id: "portfolio",
      eyebrow: "Dla rekruterów",
      title: "Portfolio i CV",
      body: "Projekty, doświadczenie i CV — po angielsku.",
      links: [{ label: "Zobacz portfolio", href: "/portfolio" }],
    },
    more: [
      {
        id: "english",
        eyebrow: "Dla uczniów i rodziców",
        title: "Korepetycje z angielskiego",
        body: "Lekcje online, przygotowanie do egzaminów i konkursów. Po każdej lekcji notatki i ćwiczenia w aplikacji.",
        links: [{ label: "Zapytaj o lekcje", href: mailHref("Korepetycje z angielskiego") }],
      },
      {
        id: "guitar",
        eyebrow: "Dla chcących grać",
        title: "Lekcje gitary",
        body: "Uczę gry na gitarze. Uczniów prowadzę w Strummy — aplikacji, którą sam zbudowałem.",
        links: [
          { label: "Strummy", href: STRUMMY_URL },
          { label: "Zapytaj mailem", href: mailHref("Lekcje gitary") },
        ],
      },
      {
        id: "homelab",
        eyebrow: "Projekt",
        title: "Homelab",
        body: "Domowe serwery: monitoring, kopie zapasowe, własne aplikacje.",
        links: [{ label: "Jak to zbudowałem", href: HOMELAB_POST }],
      },
      {
        id: "blog",
        eyebrow: "Pisanie",
        title: "Blog",
        body: "Piszę o budowaniu i utrzymywaniu oprogramowania — po angielsku.",
        links: [{ label: "Czytaj", href: "/blog" }],
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
    actionsLabel: "Contact",
    tilesLabel: "What I do",
    langLabel: "Language",
    city: "Warsaw",
    soon: "Coming soon",
    soonText: "dedicated Vector Digital site",
    title: "Piotr Romańczuk — business card",
    description:
      "Software engineer in Warsaw. Process automation and AI implementation (Vector Digital), portfolio, English tutoring, guitar lessons.",
    lead: {
      id: "vector",
      eyebrow: "For businesses",
      title: "Vector Digital",
      body: "We streamline repetitive work in small companies: quotes, reports, invoices, copying data between e-mail and Excel. Process automation and AI built on the tools you already use. I run the audits and implementations.",
      links: [{ label: "Ask about an audit", href: VECTOR_DIGITAL_URL ?? mailHref("Vector Digital — process audit") }],
    },
    portfolio: {
      id: "portfolio",
      eyebrow: "For recruiters",
      title: "Portfolio & CV",
      body: "Projects, experience and CV.",
      links: [{ label: "View portfolio", href: "/portfolio" }],
    },
    more: [
      {
        id: "english",
        eyebrow: "For students & parents",
        title: "English tutoring",
        body: "Online lessons, exam and competition prep. Notes and exercises in an app after every lesson.",
        links: [{ label: "Ask about lessons", href: mailHref("English tutoring") }],
      },
      {
        id: "guitar",
        eyebrow: "For aspiring guitarists",
        title: "Guitar lessons",
        body: "I teach guitar. My students use Strummy — an app I built myself.",
        links: [
          { label: "Strummy", href: STRUMMY_URL },
          { label: "Ask by e-mail", href: mailHref("Guitar lessons") },
        ],
      },
      {
        id: "homelab",
        eyebrow: "Project",
        title: "Homelab",
        body: "Servers at home: monitoring, backups, self-hosted apps.",
        links: [{ label: "How I built it", href: HOMELAB_POST }],
      },
      {
        id: "blog",
        eyebrow: "Writing",
        title: "Blog",
        body: "Writing about building and running software.",
        links: [{ label: "Read", href: "/blog" }],
      },
    ],
  },
};
