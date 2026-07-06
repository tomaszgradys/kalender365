"use client";

import { useEffect, useState } from "react";

// Banner „Dodaj kalendarz.pro do ekranu głównego" (instalacja PWA). Na Androidzie
// i desktopie Chrome/Edge daje instalację JEDNYM kliknięciem (beforeinstallprompt).
// Na iOS pokazuje instrukcję (Safari nie udostępnia programowej instalacji).
// UWAGA: przeglądarki NIE pozwalają ustawić strony jako „startowej" z poziomu kodu —
// to ustawienie użytkownika. Instalacja PWA to legalny, nowoczesny odpowiednik.

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

const DISMISS_KEY = "kp-install-dismissed";
const DISMISS_DAYS = 45;

export default function InstallBanner() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [iosHint, setIosHint] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // Już zainstalowane (uruchomione jako aplikacja) → nie pokazuj.
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) return;

    // Niedawno odrzucone → nie nagabuj.
    const d = localStorage.getItem(DISMISS_KEY);
    if (d && Date.now() - Number(d) < DISMISS_DAYS * 86_400_000) return;

    // Pokaż dopiero po chwili na stronie (nie od razu) — dla zaangażowanych osób.
    const mountedAt = Date.now();
    const MIN_MS = 35_000; // ~35 sekund
    let timer: number | undefined;
    const scheduleShow = () => {
      const left = MIN_MS - (Date.now() - mountedAt);
      if (left <= 0) setShow(true);
      else timer = window.setTimeout(() => setShow(true), left);
    };

    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      scheduleShow();
    };
    window.addEventListener("beforeinstallprompt", onBip);

    // iOS Safari — brak beforeinstallprompt.
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
    if (isIOS) {
      setIosHint(true);
      scheduleShow();
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBip);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {}
    setShow(false);
  }

  async function install() {
    if (!deferred) return;
    try {
      await deferred.prompt();
      await deferred.userChoice;
    } catch {}
    dismiss();
  }

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3 no-print">
      <div className="flex w-full max-w-lg items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
        <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-xl">
          📅
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-navy-800">Dodaj kalendarz.pro do ekranu głównego</p>
          <p className="mt-0.5 text-xs text-slate-500">
            {iosHint
              ? 'W Safari kliknij przycisk Udostępnij, a potem „Dodaj do ekranu głównego".'
              : "Miej kalendarz zawsze pod ręką — jak aplikacja, jednym kliknięciem."}
          </p>
        </div>
        {!iosHint && (
          <button
            onClick={install}
            className="shrink-0 rounded-full bg-brand-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-green-700"
          >
            Dodaj
          </button>
        )}
        <button
          onClick={dismiss}
          aria-label="Zamknij"
          className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
