"use client";

import { useState, type FormEvent } from "react";

export function V4ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formspree.io/f/mnjbeoje", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
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
      <div className="bg-white border border-[var(--border)] rounded-[20px] p-9 shadow-[0_2px_8px_rgba(0,0,0,0.03)] text-center">
        <p className="text-lg font-semibold text-[#1A1A1A]">Thanks for reaching out!</p>
        <p className="mt-2 text-sm text-[#888]">
          I&apos;ll get back to you as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[var(--border)] rounded-[20px] p-9 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="v4-name"
            className="font-[family-name:var(--font-jetbrains)] text-[11px] uppercase tracking-[1.5px] text-[#999]"
          >
            Name
          </label>
          <input
            type="text"
            id="v4-name"
            name="name"
            required
            placeholder="John Doe"
            className="border-0 border-b border-[var(--border)] bg-transparent px-0 py-2.5 text-[15px] text-[#1A1A1A] outline-none placeholder:text-[#D0D0CC] focus:border-[var(--v4-navy)] transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="v4-email"
            className="font-[family-name:var(--font-jetbrains)] text-[11px] uppercase tracking-[1.5px] text-[#999]"
          >
            Email
          </label>
          <input
            type="email"
            id="v4-email"
            name="email"
            required
            placeholder="john@example.com"
            className="border-0 border-b border-[var(--border)] bg-transparent px-0 py-2.5 text-[15px] text-[#1A1A1A] outline-none placeholder:text-[#D0D0CC] focus:border-[var(--v4-navy)] transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="v4-message"
            className="font-[family-name:var(--font-jetbrains)] text-[11px] uppercase tracking-[1.5px] text-[#999]"
          >
            Message
          </label>
          <textarea
            id="v4-message"
            name="message"
            required
            rows={4}
            placeholder="Tell me about your project..."
            className="resize-none border-0 border-b border-[var(--border)] bg-transparent px-0 py-2.5 text-[15px] text-[#1A1A1A] outline-none placeholder:text-[#D0D0CC] focus:border-[var(--v4-navy)] transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={status === "sending"}
          className="mt-2 self-start inline-flex items-center gap-2 bg-[var(--v4-navy)] text-white font-bold text-[13px] uppercase tracking-[1px] px-8 py-3.5 rounded-[10px] hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {status === "sending" ? "Sending..." : "Send Message"}
        </button>

        {status === "error" && (
          <p className="text-sm text-red-500">
            Something went wrong. Please try emailing me directly.
          </p>
        )}
      </form>
    </div>
  );
}
