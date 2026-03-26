"use client";

import { useState, type FormEvent } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-lg font-semibold">Thanks for reaching out!</p>
        <p className="mt-2 text-muted-foreground">
          I&apos;ll get back to you as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border/50 bg-card p-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="name"
            className="font-mono text-xs uppercase tracking-wider text-muted-foreground"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="John Doe"
            className="border-0 border-b border-border bg-transparent px-0 py-2 text-foreground outline-none transition-colors placeholder:text-muted-foreground/30 focus:border-primary focus:ring-0"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="font-mono text-xs uppercase tracking-wider text-muted-foreground"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="john@example.com"
            className="border-0 border-b border-border bg-transparent px-0 py-2 text-foreground outline-none transition-colors placeholder:text-muted-foreground/30 focus:border-primary focus:ring-0"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="message"
            className="font-mono text-xs uppercase tracking-wider text-muted-foreground"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            placeholder="Tell me about your project..."
            className="resize-none border-0 border-b border-border bg-transparent px-0 py-2 text-foreground outline-none transition-colors placeholder:text-muted-foreground/30 focus:border-primary focus:ring-0"
          />
        </div>

        <button
          type="submit"
          disabled={status === "sending"}
          className="mt-4 self-start rounded bg-primary px-8 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {status === "sending" ? "Sending..." : "Send Message"}
        </button>

        {status === "error" && (
          <p className="text-sm text-destructive">
            Something went wrong. Please try emailing me directly at{" "}
            <a href="mailto:p.romanczuk@gmail.com" className="underline hover:text-foreground">
              p.romanczuk@gmail.com
            </a>.
          </p>
        )}
      </form>
    </div>
  );
}
