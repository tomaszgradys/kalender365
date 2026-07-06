"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "kalendarzpro-cookie-consent-v1";

type Consent = { necessary: true; analytics: boolean; ts: number };

export default function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }
    // umożliw ponowne otwarcie z linku w stopce
    const handler = () => setOpen(true);
    window.addEventListener("open-cookie-settings", handler);
    return () => window.removeEventListener("open-cookie-settings", handler);
  }, []);

  function save(analytics: boolean) {
    const c: Consent = { necessary: true, analytics, ts: Date.now() };
    try {
      localStorage.setItem(KEY, JSON.stringify(c));
    } catch {}
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-3 no-print">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(0,56,144,0.15)] sm:flex-row sm:items-center">
        <div className="flex-1 text-sm text-slate-600">
          <p className="font-semibold text-navy-800">🍪 Pliki cookies</p>
          <p className="mt-1">
            Używamy tylko niezbędnych plików i pamięci przeglądarki, aby serwis działał (np. zapis
            planu lekcji i tej zgody). Nie stosujemy śledzenia ani reklam. Więcej w{" "}
            <Link href="/polityka-cookies" className="font-medium text-navy-600 hover:underline">
              polityce cookies
            </Link>{" "}
            i{" "}
            <Link href="/polityka-prywatnosci" className="font-medium text-navy-600 hover:underline">
              prywatności
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => save(false)}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-navy-300"
          >
            Tylko niezbędne
          </button>
          <button
            onClick={() => save(true)}
            className="rounded-full bg-brand-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-green-700"
          >
            Akceptuję
          </button>
        </div>
      </div>
    </div>
  );
}
