import { NextResponse } from "next/server";
import { isEmail, parseCardMessage } from "@/lib/card-message";
import { SITE_HOST } from "@/lib/site";

/** Messages from the business card land in the same Formspree inbox as the portfolio contact form. */
const FORMSPREE_URL = "https://formspree.io/f/mnjbeoje";

const TOPIC_LABEL = {
  vector: "Vector Digital — audyt",
  english: "Korepetycje z angielskiego",
  guitar: "Lekcje gitary",
  job: "Praca / współpraca",
  other: "Inne",
} as const;

/** Best-effort per-instance throttle (serverless instances don't share memory; Formspree filters the rest). */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function isThrottled(ip: string, now: number): boolean {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  try {
    const { hostname } = new URL(origin);
    return hostname === SITE_HOST || hostname === `www.${SITE_HOST}` || hostname === "localhost";
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request.headers.get("origin"))) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "invalid" }, { status: 415 });
  }

  const parsed = parseCardMessage(await request.json().catch(() => null));
  // Spam gets the same "ok" as a real send so bots learn nothing; nothing is forwarded.
  if (!parsed.ok) {
    return parsed.reason === "spam"
      ? NextResponse.json({ ok: true })
      : NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  // Only real sends count: the throttle protects the Formspree quota, not the validation path.
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isThrottled(ip, Date.now())) {
    return NextResponse.json({ error: "throttled" }, { status: 429 });
  }

  const { name, contact, topic, message, lang } = parsed.value;
  const res = await fetch(FORMSPREE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      _subject: `Wizytówka (${lang.toUpperCase()}): ${TOPIC_LABEL[topic]}`,
      topic: TOPIC_LABEL[topic],
      name: name || "—",
      contact,
      message,
      // Formspree turns a valid `email` into the Reply-To of the notification.
      ...(isEmail(contact) ? { email: contact } : {}),
    }),
  }).catch(() => null);

  if (!res?.ok) return NextResponse.json({ error: "upstream" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
