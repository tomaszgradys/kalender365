"use client";

import { useEffect, useState } from "react";

// „Teilen"-Leiste für Detail-/Money-Pages. Drop-in ohne Pflicht-Props: liest
// URL (und notfalls den Titel) nach dem Mount aus dem Browser, damit die
// Share-Links immer auf die tatsächliche, kanonische Seite zeigen. Nutzt die
// native Web-Share-API (Handy) mit Fallback auf Messenger-/Netzwerk-Intents
// und „Link kopieren". Keine externen Skripte/Tracker → CSP-konform.

type Props = {
  /** Kurzer Titel für Share-Text; Fallback: document.title. */
  title?: string;
  className?: string;
};

const ICON = "h-5 w-5";

export default function ShareButtons({ title, className = "" }: Props) {
  const [url, setUrl] = useState("");
  const [shareTitle, setShareTitle] = useState(title ?? "");
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
    if (!title) setShareTitle(document.title);
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, [title]);

  const u = encodeURIComponent(url);
  const t = encodeURIComponent(shareTitle);

  async function nativeShare() {
    try {
      await navigator.share({ title: shareTitle, url });
    } catch {
      /* Nutzer hat abgebrochen – kein Fehler. */
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard nicht verfügbar – still ignorieren. */
    }
  }

  const btn =
    "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-navy-700 transition hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-sm";

  return (
    <section className={`mt-10 ${className}`} aria-label="Diese Seite teilen">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Teilen</h2>
      <div className="flex flex-wrap gap-2">
        {canNativeShare && (
          <button type="button" onClick={nativeShare} className={btn}>
            <svg viewBox="0 0 24 24" className={ICON} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
              <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
            </svg>
            Teilen
          </button>
        )}

        <a className={btn} href={`https://api.whatsapp.com/send?text=${t}%20${u}`} target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" className={ICON} fill="#25D366" aria-hidden="true">
            <path d="M12 2a10 10 0 00-8.5 15.3L2 22l4.8-1.5A10 10 0 1012 2zm5.8 14.1c-.2.7-1.4 1.3-2 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5-4.5-.2-.2-1.3-1.7-1.3-3.2 0-1.5.8-2.3 1.1-2.6.3-.3.6-.4.8-.4h.6c.2 0 .5 0 .7.5l.8 2c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.9.9c.3.1.5.2.5.4.1.1.1.6-.1 1.2z" />
          </svg>
          WhatsApp
        </a>

        <a className={btn} href={`https://t.me/share/url?url=${u}&text=${t}`} target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" className={ICON} fill="#229ED9" aria-hidden="true">
            <path d="M21.9 4.3l-3.3 15.6c-.2 1.1-.9 1.3-1.8.8l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.2-8.3c.4-.4-.1-.6-.6-.2L6.3 13.4l-4.9-1.5c-1.1-.3-1.1-1 .2-1.5l19.1-7.4c.9-.3 1.6.2 1.2 1.3z" />
          </svg>
          Telegram
        </a>

        <a className={btn} href={`https://www.facebook.com/sharer/sharer.php?u=${u}`} target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" className={ICON} fill="#1877F2" aria-hidden="true">
            <path d="M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0022 12z" />
          </svg>
          Facebook
        </a>

        <a className={btn} href={`https://twitter.com/intent/tweet?url=${u}&text=${t}`} target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" className={ICON} fill="currentColor" aria-hidden="true">
            <path d="M18.2 2h3.3l-7.2 8.3L23 22h-6.6l-5.2-6.8L5.2 22H1.9l7.7-8.8L1 2h6.8l4.7 6.2L18.2 2zm-1.2 18h1.8L7.1 3.8H5.2L17 20z" />
          </svg>
          X
        </a>

        <a className={btn} href={`mailto:?subject=${t}&body=${t}%0A%0A${u}`}>
          <svg viewBox="0 0 24 24" className={ICON} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" />
          </svg>
          E-Mail
        </a>

        <button type="button" onClick={copyLink} className={btn}>
          <svg viewBox="0 0 24 24" className={ICON} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" />
          </svg>
          {copied ? "Kopiert!" : "Link kopieren"}
        </button>
      </div>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Link in die Zwischenablage kopiert" : ""}
      </span>
    </section>
  );
}
