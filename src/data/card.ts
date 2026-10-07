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
/** English tutoring landing + students' lesson notes (lesson-notes project). */
export const ENGLISH_URL = "https://lekcje.romanczuk.online";
/** Guitar lessons landing with Cal.com booking (gitara-lekcje project). */
export const GUITAR_URL = "https://gitarawarszawa.pl";
export const GITHUB_URL = "https://github.com/PiotrRomanczuk";
/** Footer link; hidden while null. */
export const LINKEDIN_URL: string | null = null;
export const CV_PDF = "/Romanczuk_Piotr_CV.pdf";
const HOMELAB_POST = "/blog/four-boxes-and-a-pi-homelab-devops-classroom";

export type CardLink = { label: string; href: string; /** Outlined instead of filled inside the dark lead tile. */ quiet?: boolean };

export type CardTile = {
  id: "vector" | "portfolio" | "english" | "guitar" | "homelab" | "blog";
  /** Who the tile is for — lets each audience spot "its" tile at a glance. */
  eyebrow: string;
  title: string;
  body: string;
  /** One hard fact shown above the links (fills the portfolio tile, gives recruiters a number). */
  proof?: string;
  links: CardLink[];
};

export type FormCopy = {
  eyebrow: string;
  title: string;
  name: string;
  nameHint: string;
  contact: string;
  topic: string;
  topics: Record<"vector" | "english" | "guitar" | "job" | "other", string>;
  message: string;
  send: string;
  sending: string;
  sent: string;
  invalid: string;
  failed: string;
};

export type CardCopy = {
  role: string;
  intro: string;
  call: string;
  whatsapp: string;
  save: string;
  actionsLabel: string;
  /** Pre-filled WhatsApp message for the header button (an empty chat is the biggest barrier). */
  waDefault: string;
  copyEmail: string;
  copyPhone: string;
  copied: string;
  tilesLabel: string;
  langLabel: string;
  city: string;
  cookieSettings: string;
  soon: string;
  soonText: string;
  title: string;
  description: string;
  lead: CardTile;
  portfolio: CardTile;
  more: CardTile[];
  form: FormCopy;
};

/** wa.me click-to-chat: opens WhatsApp (app on phones, Web/Desktop on laptops) with `text` pre-filled. */
export function waHref(text: string): string {
  return `https://wa.me/${CONTACT.phone.replace("+", "")}?text=${encodeURIComponent(text)}`;
}

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
    whatsapp: "Napisz na WhatsApp",
    save: "Zapisz kontakt",
    actionsLabel: "Kontakt",
    waDefault: "Cześć Piotr! Piszę ze strony romanczuk.online. ",
    copyEmail: "Kopiuj e-mail",
    copyPhone: "Kopiuj numer",
    copied: "Skopiowano",
    tilesLabel: "Czym się zajmuję",
    langLabel: "Język",
    city: "Warszawa",
    cookieSettings: "Ustawienia cookies",
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
      links: VECTOR_DIGITAL_URL
        ? [{ label: "Napisz w sprawie audytu", href: VECTOR_DIGITAL_URL }]
        : [
            {
              label: "Napisz na WhatsApp",
              href: waHref(
                "Cześć Piotr! Piszę w sprawie audytu procesów (Vector Digital).\nNasza firma robi: …\nNajwięcej czasu zabiera nam: …",
              ),
            },
            { label: "lub e-mailem", href: mailHref("Vector Digital — audyt procesów"), quiet: true },
          ],
    },
    portfolio: {
      id: "portfolio",
      eyebrow: "Dla rekruterów",
      title: "Portfolio\u00a0i\u00a0CV",
      body: "Projekty, doświadczenie i CV — po angielsku.",
      proof: "Strummy · ~25 aktywnych użytkowników dziennie · płacący od 2024",
      links: [
        { label: "Zobacz portfolio", href: "/portfolio" },
        { label: "Pobierz CV (PDF)", href: CV_PDF },
      ],
    },
    more: [
      {
        id: "english",
        eyebrow: "Dla uczniów i rodziców",
        title: "Korepetycje z angielskiego",
        body: "Lekcje 1:1 online z certyfikatem TEFL, przygotowanie do egzaminów i konkursów. Po każdej lekcji notatka, nowe słówka i ćwiczenia.",
        links: [
          { label: "Strona lekcji", href: ENGLISH_URL },
          { label: "Napisz na WhatsApp", href: waHref("Cześć Piotr! Pytam o lekcje angielskiego. Dla kogo: … Poziom / cel: …") },
        ],
      },
      {
        id: "guitar",
        eyebrow: "Dla chcących grać",
        title: "Lekcje gitary",
        body: "Indywidualne lekcje w Warszawie (Praga\u2011Północ). Uczniów prowadzę w Strummy — aplikacji, którą sam zbudowałem.",
        links: [
          { label: "Oferta i zapisy", href: GUITAR_URL },
          { label: "Strummy", href: STRUMMY_URL },
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
    form: {
      eyebrow: "Wolisz napisać tutaj?",
      title: "Wyślij wiadomość",
      name: "Imię",
      nameHint: "opcjonalnie",
      contact: "E-mail lub telefon",
      topic: "Temat",
      topics: {
        vector: "Vector Digital — audyt",
        english: "Korepetycje z angielskiego",
        guitar: "Lekcje gitary",
        job: "Praca / współpraca",
        other: "Inne",
      },
      message: "Wiadomość",
      send: "Wyślij",
      sending: "Wysyłam…",
      sent: "Dzięki — wiadomość poszła. Odezwę się na podany kontakt.",
      invalid: "Uzupełnij kontakt i wiadomość (min. 5 znaków).",
      failed: "Nie udało się wysłać. Spróbuj jeszcze raz albo napisz na WhatsApp lub e-mail.",
    },
  },
  en: {
    role: "Software engineer · process automation & AI",
    intro:
      "I build and run web applications — from code to server. I help companies take repetitive work off people's plates. After hours I teach English and guitar.",
    call: "Call",
    whatsapp: "Message on WhatsApp",
    save: "Save contact",
    actionsLabel: "Contact",
    waDefault: "Hi Piotr! I'm writing from romanczuk.online. ",
    copyEmail: "Copy e-mail",
    copyPhone: "Copy number",
    copied: "Copied",
    tilesLabel: "What I do",
    langLabel: "Language",
    city: "Warsaw",
    cookieSettings: "Cookie settings",
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
      links: VECTOR_DIGITAL_URL
        ? [{ label: "Ask about an audit", href: VECTOR_DIGITAL_URL }]
        : [
            {
              label: "Message on WhatsApp",
              href: waHref(
                "Hi Piotr! I'm writing about a process audit (Vector Digital).\nOur company does: …\nWhat eats most of our time: …",
              ),
            },
            { label: "or by e-mail", href: mailHref("Vector Digital — process audit"), quiet: true },
          ],
    },
    portfolio: {
      id: "portfolio",
      eyebrow: "For recruiters",
      title: "Portfolio\u00a0&\u00a0CV",
      body: "Projects, experience and CV.",
      proof: "Strummy · ~25 daily active users · paying since 2024",
      links: [
        { label: "View portfolio", href: "/portfolio" },
        { label: "Download CV (PDF)", href: CV_PDF },
      ],
    },
    more: [
      {
        id: "english",
        eyebrow: "For students & parents",
        title: "English tutoring",
        body: "1:1 online lessons with a TEFL-certified teacher, exam and competition prep. A note, new words and exercises after every lesson.",
        links: [
          { label: "Lessons site (PL)", href: ENGLISH_URL },
          { label: "Message on WhatsApp", href: waHref("Hi Piotr! I'm asking about English lessons. For whom: … Level / goal: …") },
        ],
      },
      {
        id: "guitar",
        eyebrow: "For aspiring guitarists",
        title: "Guitar lessons",
        body: "One-to-one lessons in Warsaw (Praga\u2011Północ). My students use Strummy — an app I built myself.",
        links: [
          { label: "Details & booking (PL)", href: GUITAR_URL },
          { label: "Strummy", href: STRUMMY_URL },
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
    form: {
      eyebrow: "Prefer to write here?",
      title: "Send a message",
      name: "Name",
      nameHint: "optional",
      contact: "E-mail or phone",
      topic: "Topic",
      topics: {
        vector: "Vector Digital — audit",
        english: "English tutoring",
        guitar: "Guitar lessons",
        job: "Work / collaboration",
        other: "Other",
      },
      message: "Message",
      send: "Send",
      sending: "Sending…",
      sent: "Thanks — your message is in. I'll get back to you on the contact you left.",
      invalid: "Please add a contact and a message (min. 5 characters).",
      failed: "Couldn't send. Try again or write on WhatsApp or by e-mail.",
    },
  },
};
