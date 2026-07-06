"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { MENU, resolveHref } from "@/lib/de/menu";
import Logo from "@/components/de/Logo";

export default function Header({ year }: { year: number }) {
  const [mega, setMega] = useState(false);
  const [drawer, setDrawer] = useState(false);

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

  const top = [
    { label: "Kalender", href: `/kalender/${year}` },
    { label: "Feiertage", href: `/feiertage/${year}` },
    { label: "Schulferien", href: `/schulferien/${year}` },
    { label: "Brückentage", href: `/brueckentage/${year}` },
    { label: "Tools", href: "/generatoren" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" aria-label="Kalender365.pro — Startseite">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 text-sm md:flex">
          <button
            type="button"
            onClick={() => setMega((v) => !v)}
            onMouseEnter={() => setMega(true)}
            className="flex items-center gap-1 rounded-full px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100"
            aria-expanded={mega}
          >
            Alle Kalender
            <svg width="12" height="12" viewBox="0 0 12 12" className={`transition ${mega ? "rotate-180" : ""}`}>
              <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          {top.map((t) => (
            <Link key={t.label} href={t.href} className="rounded-full px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100">
              {t.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setDrawer(true)}
          className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-100 md:hidden"
          aria-label="Menü öffnen"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </div>

      {mega && (
        <div className="absolute inset-x-0 top-full hidden border-b border-slate-100 bg-white shadow-lg md:block" onMouseLeave={() => setMega(false)}>
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-8 gap-y-6 px-4 py-6 lg:grid-cols-3">
            {MENU.map((s) => (
              <div key={s.title}>
                <h3 className="mb-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {s.popular && <span className="text-[#f5b800]">★</span>} {s.title}
                </h3>
                <ul className="space-y-0.5">
                  {s.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={resolveHref(item.href, year)}
                        onClick={() => setMega(false)}
                        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-700 hover:bg-navy-50 hover:text-navy-700"
                      >
                        <span aria-hidden="true" className="w-5 shrink-0 text-center text-base leading-none">{item.emoji}</span>
                        {resolveHref(item.label, year)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {drawer &&
        createPortal(
          <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Menü">
            <div className="absolute inset-0 bg-slate-900/40" onClick={() => setDrawer(false)} />
            <div className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <span className="font-bold text-slate-900">Menü</span>
                <button type="button" onClick={() => setDrawer(false)} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100" aria-label="Menü schließen">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-2 py-3">
                {MENU.map((s) => (
                  <div key={s.title} className="mb-4">
                    <h3 className="mb-1 px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{s.title}</h3>
                    <ul>
                      {s.items.map((item) => (
                        <li key={item.label}>
                          <Link href={resolveHref(item.href, year)} onClick={() => setDrawer(false)} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-navy-50">
                            <span aria-hidden="true" className="w-5 text-center">{item.emoji}</span>
                            {resolveHref(item.label, year)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </header>
  );
}
