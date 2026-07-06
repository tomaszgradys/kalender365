"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { type DateCtx } from "@/lib/calendars";
import { MENU, MENU_ICONS, resolveHref } from "@/lib/menu";
import CalendarSidebar from "@/components/CalendarSidebar";
import Logo from "@/components/Logo";

export default function MainNav({ ctx }: { ctx: DateCtx }) {
  const [mega, setMega] = useState(false);
  const [drawer, setDrawer] = useState(false);

  // Escape zamyka otwarte menu (drawer mobilny / mega-menu) — obsługa klawiatury (WCAG 2.1.2).
  useEffect(() => {
    if (!drawer && !mega) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawer(false);
        setMega(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawer, mega]);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" aria-label="Kalendarz.pro — strona główna">
          <Logo />
        </Link>

        {/* DESKTOP */}
        <nav className="hidden items-center gap-1 text-sm md:flex">
          <button
            type="button"
            onClick={() => setMega((v) => !v)}
            onMouseEnter={() => setMega(true)}
            className="flex items-center gap-1 rounded-full px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100"
            aria-expanded={mega}
          >
            Kalendarze
            <svg width="12" height="12" viewBox="0 0 12 12" className={`transition ${mega ? "rotate-180" : ""}`}>
              <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          <Link href="/imieniny" className="rounded-full px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100">
            Imieniny
          </Link>
          <Link href={`/dni-wolne-od-pracy/${ctx.year}`} className="rounded-full px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100">
            Dni wolne
          </Link>
          <Link href="/generatory" className="rounded-full px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100">
            Generatory
          </Link>
          <Link href="/narzedzia" className="rounded-full px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100">
            Narzędzia
          </Link>
          <Link href="/blog" className="rounded-full px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100">
            Blog
          </Link>
          <form action="/szukaj" role="search" className="ml-1">
            <label className="relative block">
              <span className="sr-only">Szukaj</span>
              <input
                type="search"
                name="q"
                placeholder="Szukaj…"
                className="w-36 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 pl-8 text-sm text-slate-700 focus:w-48 focus:border-navy-300 focus:outline-none"
              />
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4-4" strokeLinecap="round" />
              </svg>
            </label>
          </form>
        </nav>

        {/* MOBILE trigger */}
        <button
          type="button"
          onClick={() => setDrawer(true)}
          className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-100 md:hidden"
          aria-label="Otwórz menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </div>

      {/* DESKTOP MEGA-MENU */}
      {mega && (
        <div
          className="absolute inset-x-0 top-full hidden border-b border-slate-100 bg-white shadow-lg md:block"
          onMouseLeave={() => setMega(false)}
        >
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-8 gap-y-6 px-4 py-6 lg:grid-cols-4">
            {MENU.map((s) => (
              <div key={s.title}>
                <h3 className="mb-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {s.popular && <span className="text-[#f5b800]">★</span>} {s.title}
                </h3>
                <ul className="space-y-0.5">
                  {s.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={resolveHref(item.href, ctx)}
                        onClick={() => setMega(false)}
                        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-700 hover:bg-navy-50 hover:text-navy-700"
                      >
                        <span aria-hidden="true" className="w-5 shrink-0 text-center text-base leading-none">{MENU_ICONS[item.icon]?.emoji ?? "•"}</span>
                        {resolveHref(item.label, ctx)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 bg-slate-50 py-3 text-center">
            <Link href="/kalendarze" onClick={() => setMega(false)} className="text-sm font-medium text-navy-600 hover:underline">
              Zobacz wszystkie kalendarze →
            </Link>
          </div>
        </div>
      )}

      {/* MOBILE DRAWER — przez portal do <body>, bo backdrop-blur na headerze
          robi z niego containing block dla position:fixed i drawer chowałby się
          pod nagłówkiem. */}
      {drawer &&
        createPortal(
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Menu — kalendarze i narzędzia">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setDrawer(false)} />
          <div className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <span className="font-bold text-slate-900">Kalendarze</span>
              <button
                type="button"
                onClick={() => setDrawer(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100"
                aria-label="Zamknij menu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-4">
              <form action="/szukaj" role="search" className="mb-4">
                <input
                  type="search"
                  name="q"
                  aria-label="Szukaj w kalendarzu"
                  placeholder="Szukaj w kalendarzu…"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-[15px] text-slate-700 focus:border-navy-300 focus:outline-none"
                />
              </form>
              <nav className="mb-4 border-b border-slate-100 pb-4">
                {[
                  { href: "/generatory", label: "Generatory" },
                  { href: "/blog", label: "Blog" },
                  { href: "/kalendarze", label: "Wszystkie kalendarze" },
                ].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setDrawer(false)}
                    className="block rounded-xl px-2 py-2.5 text-[15px] font-semibold text-slate-800 active:bg-navy-50"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
              {/* Pełne, uporządkowane menu (te same 8 sekcji co sidebar) */}
              <CalendarSidebar ctx={ctx} mobile showSearch={false} onNavigate={() => setDrawer(false)} />
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}
