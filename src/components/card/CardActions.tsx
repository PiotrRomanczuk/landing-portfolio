"use client";

import { useState } from "react";
import { CONTACT, waHref, type CardCopy } from "@/data/card";

type Labels = Pick<
  CardCopy,
  "whatsapp" | "waDefault" | "call" | "save" | "actionsLabel" | "copyEmail" | "copyPhone" | "copied"
>;

/** Copies `value`; the label flips to "copied" for 2s (announced politely to screen readers). */
function CopyButton({ value, label, copied, hint }: { value: string; label: string; copied: string; hint?: string }) {
  const [isCopied, setIsCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Clipboard blocked (permissions / insecure context): e-mail and number stay visible on the page to copy by hand.
    }
  }

  return (
    <button type="button" className="card-action only-pointer" onClick={copy}>
      <span aria-live="polite">{isCopied ? `${copied} ✓` : label}</span>
      {hint ? <span className="mono small">{hint}</span> : null}
    </button>
  );
}

/**
 * WhatsApp leads on every device (wa.me works on phones and, via WhatsApp Web, on laptops).
 * Touch screens (QR scans) add Call + vCard; mouse screens add one-click copy, because tel: does nothing
 * on a laptop and mailto: fails for webmail users.
 */
export function CardActions({ copy }: { copy: Labels }) {
  return (
    <nav className="card-actions" aria-label={copy.actionsLabel}>
      <a className="card-action primary" href={waHref(copy.waDefault)} target="_blank" rel="noopener noreferrer">
        <span>{copy.whatsapp}</span>
        <span className="mono">{CONTACT.phoneDisplay}</span>
      </a>
      <a className="card-action only-touch" href={`tel:${CONTACT.phone}`}>
        {copy.call}
      </a>
      <a className="card-action only-touch" href="/kontakt.vcf" download="piotr-romanczuk.vcf">
        <span>{copy.save}</span>
        <span className="mono small">.vcf</span>
      </a>
      <CopyButton value={CONTACT.email} label={copy.copyEmail} copied={copy.copied} />
      <CopyButton value={CONTACT.phone} label={copy.copyPhone} copied={copy.copied} hint={CONTACT.phoneDisplay} />
    </nav>
  );
}
