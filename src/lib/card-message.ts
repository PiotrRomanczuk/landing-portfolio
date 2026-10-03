/** Validation for the business-card message form (shared by the API route; the form mirrors the limits). */

export const TOPICS = ["vector", "english", "guitar", "job", "other"] as const;
export type Topic = (typeof TOPICS)[number];

export const LIMITS = { name: 100, contact: 120, message: 2000, messageMin: 5, contactMin: 3 } as const;

export type CardMessage = { name: string; contact: string; topic: Topic; message: string; lang: "pl" | "en" };

export type ParseResult =
  | { ok: true; value: CardMessage }
  | { ok: false; reason: "invalid" | "spam" };

/** Minimum time between the form appearing and being submitted; bots post instantly. */
const MIN_FILL_MS = 2000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const isEmail = (value: string) => EMAIL_RE.test(value);

const text = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export function parseCardMessage(input: unknown): ParseResult {
  if (typeof input !== "object" || input === null) return { ok: false, reason: "invalid" };
  const raw = input as Record<string, unknown>;

  // Honeypot (hidden field humans never fill) and implausibly fast submissions are dropped as spam.
  if (text(raw.website) !== "") return { ok: false, reason: "spam" };
  if (typeof raw.elapsedMs !== "number" || raw.elapsedMs < MIN_FILL_MS) return { ok: false, reason: "spam" };

  const name = text(raw.name);
  const contact = text(raw.contact);
  const message = text(raw.message);
  const topic = TOPICS.find((t) => t === raw.topic);

  const isValid =
    topic !== undefined &&
    name.length <= LIMITS.name &&
    contact.length >= LIMITS.contactMin &&
    contact.length <= LIMITS.contact &&
    message.length >= LIMITS.messageMin &&
    message.length <= LIMITS.message;
  if (!isValid) return { ok: false, reason: "invalid" };

  return { ok: true, value: { name, contact, topic, message, lang: raw.lang === "en" ? "en" : "pl" } };
}
