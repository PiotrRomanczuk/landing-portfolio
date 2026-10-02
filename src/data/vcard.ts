import { CARD, CONTACT } from "./card";

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
