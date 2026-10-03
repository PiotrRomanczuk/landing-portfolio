"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { LIMITS, TOPICS } from "@/lib/card-message";
import { waHref, type FormCopy, type Locale } from "@/data/card";

type Status = "idle" | "sending" | "sent" | "invalid" | "failed";

/** "Prefer to write here?" — posts to /api/card-message, which lands in Piotr's inbox. */
export function CardMessageForm({ copy, lang, waText }: { copy: FormCopy; lang: Locale; waText: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const mountedAt = useRef(0);

  // Clock the server uses to reject instant (bot) posts; it starts when the form appears, not on first focus,
  // so a person pasting a ready message is never mistaken for a bot.
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("sending");
    try {
      const res = await fetch("/api/card-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          contact: form.get("contact"),
          topic: form.get("topic"),
          message: form.get("message"),
          website: form.get("website"),
          lang,
          elapsedMs: Date.now() - mountedAt.current,
        }),
      });
      if (res.ok) {
        setStatus("sent");
        return;
      }
      setStatus(res.status === 400 ? "invalid" : "failed");
    } catch {
      setStatus("failed");
    }
  }

  if (status === "sent") {
    return (
      <section className="card-form" aria-labelledby="card-form-title">
        <span className="card-eyebrow">{copy.eyebrow}</span>
        <h3 id="card-form-title">{copy.title}</h3>
        <p className="card-form-status" role="status">
          {copy.sent} ✓
        </p>
      </section>
    );
  }

  const isSending = status === "sending";
  return (
    <section className="card-form" aria-labelledby="card-form-title">
      <span className="card-eyebrow">{copy.eyebrow}</span>
      <h3 id="card-form-title">{copy.title}</h3>
      <form onSubmit={onSubmit} noValidate>
        <div className="card-form-grid">
          <label>
            <span>
              {copy.name} <small>{copy.nameHint}</small>
            </span>
            <input name="name" type="text" autoComplete="name" maxLength={LIMITS.name} />
          </label>
          <label>
            <span>{copy.contact}</span>
            <input
              name="contact"
              type="text"
              inputMode="email"
              autoComplete="email"
              required
              minLength={LIMITS.contactMin}
              maxLength={LIMITS.contact}
            />
          </label>
        </div>
        <label>
          <span>{copy.topic}</span>
          <select name="topic" defaultValue="vector">
            {TOPICS.map((topic) => (
              <option key={topic} value={topic}>
                {copy.topics[topic]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{copy.message}</span>
          <textarea name="message" rows={4} required minLength={LIMITS.messageMin} maxLength={LIMITS.message} />
        </label>
        {/* Honeypot: invisible to people and assistive tech, bots fill every field. */}
        <div className="card-hp" aria-hidden="true">
          <label>
            Website
            <input name="website" type="text" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <div className="card-form-foot">
          <button type="submit" className="card-submit" disabled={isSending}>
            {isSending ? copy.sending : copy.send}
          </button>
          {status === "invalid" ? (
            <p className="card-form-status error" role="alert">
              {copy.invalid}
            </p>
          ) : null}
          {status === "failed" ? (
            <p className="card-form-status error" role="alert">
              {copy.failed}{" "}
              <a href={waHref(waText)} target="_blank" rel="noopener noreferrer">
                WhatsApp ↗
              </a>
            </p>
          ) : null}
        </div>
      </form>
    </section>
  );
}
