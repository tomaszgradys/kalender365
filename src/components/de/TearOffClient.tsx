"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export type DayData = {
  day: number;
  monthIndex: number;
  year: number;
  weekdayName: string;
  monthName: string;
  doy: number;
  remaining: number;
  week: number;
  isRed: boolean;
  sunrise: string | null;
  sunset: string | null;
  moonrise: string | null;
  moonIcon: string;
  moonPhase: string;
  zodiacSymbol: string;
  zodiacName: string;
  names: string[];
  proverb: string;
  holiday: string | null;
  href: string;
};

function Sheet({ d, onNext, onPrev, hint = false }: { d: DayData; onNext?: () => void; onPrev?: () => void; hint?: boolean }) {
  const dateColor = d.isRed ? "text-red-600" : "text-navy-700";
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(0,56,144,0.12)]">
      <div className="relative h-6 bg-navy-600">
        <span className="absolute left-1/3 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full bg-white/90 ring-2 ring-navy-700" />
        <span className="absolute left-2/3 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full bg-white/90 ring-2 ring-navy-700" />
      </div>
      <div
        className="h-2 bg-navy-600"
        style={{
          maskImage: "radial-gradient(6px at 6px 0, transparent 98%, #000) 0 0 / 12px 8px repeat-x",
          WebkitMaskImage: "radial-gradient(6px at 6px 0, transparent 98%, #000) 0 0 / 12px 8px repeat-x",
        }}
      />

      <div className="flex min-h-[500px] flex-col px-6 pb-6 pt-3 text-center">
        <div className="flex items-start justify-between text-[11px] font-medium text-slate-500">
          <div className="text-left leading-tight">
            <div>{d.doy}. Tag des Jahres</div>
            <div>noch {d.remaining} Tage</div>
          </div>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-navy-700">{d.monthName}</div>
          <div className="text-right leading-tight">
            <div className="font-bold text-navy-700">{d.year}</div>
            <div className="text-base leading-none">{d.zodiacSymbol}</div>
          </div>
        </div>

        <div className="mt-3 flex justify-center gap-4 text-[11px] text-slate-500">
          <span>☀ {d.sunrise}–{d.sunset}</span>
          <span>{d.moonIcon} {d.moonrise ?? "—"}</span>
          <span>KW {d.week}</span>
        </div>

        <div className={`mt-1 font-black leading-none ${dateColor}`} style={{ fontSize: "7.5rem" }}>
          {d.day}
        </div>
        <div className={`-mt-1 text-2xl font-black uppercase tracking-wide ${dateColor}`}>{d.weekdayName}</div>

        {d.holiday && (
          <div className="mt-2 inline-block rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
            {d.holiday} — gesetzlicher Feiertag
          </div>
        )}

        {d.names.length > 0 && (
          <p className="mt-3 line-clamp-2 text-sm text-slate-700">
            <span className="text-slate-500">Namenstag: </span>
            <span className="font-semibold text-navy-700">{d.names.join(", ")}</span>
          </p>
        )}

        <p className="mx-auto mt-3 line-clamp-2 max-w-xs text-sm italic leading-snug text-slate-500">„{d.proverb}“</p>

        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-500">
          <span>{d.moonIcon} {d.moonPhase}</span>
          <span>·</span>
          <span>{d.zodiacSymbol} {d.zodiacName}</span>
        </div>

        <div className="mt-auto pt-5">
          <Link
            href={d.href}
            className="inline-flex items-center gap-1 rounded-full bg-brand-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-green-700"
          >
            Ganzes Kalenderblatt öffnen <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      {onNext && (
        <button
          type="button"
          onClick={onNext}
          aria-label="Blatt abreißen — nächster Tag"
          className="group absolute bottom-0 right-0 h-14 w-14 cursor-pointer"
        >
          <span className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-slate-900/10 blur-[3px] transition-all group-hover:h-10 group-hover:w-10" />
          <span
            className={`absolute bottom-0 right-0 block h-12 w-12 rounded-br-2xl shadow-[-3px_-3px_8px_rgba(15,23,42,0.2)] transition-all duration-200 group-hover:h-16 group-hover:w-16 ${hint ? "corner-hint" : ""}`}
            style={{
              transformOrigin: "bottom right",
              clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
              background: "linear-gradient(135deg, #ffffff 0%, #dbe4f0 55%, #b9c7dd 100%)",
            }}
          />
          <span className="pointer-events-none absolute bottom-1 right-1 text-[11px] font-bold text-navy-500">›</span>
        </button>
      )}

      {onPrev && (
        <button
          type="button"
          onClick={onPrev}
          aria-label="Blatt zurück — voriger Tag"
          className="group absolute bottom-0 left-0 h-14 w-14 cursor-pointer"
        >
          <span className="absolute bottom-2 left-2 h-8 w-8 rounded-full bg-slate-900/10 blur-[3px] transition-all group-hover:h-10 group-hover:w-10" />
          <span
            className={`absolute bottom-0 left-0 block h-12 w-12 rounded-bl-2xl shadow-[3px_-3px_8px_rgba(15,23,42,0.2)] transition-all duration-200 group-hover:h-16 group-hover:w-16 ${hint ? "corner-hint" : ""}`}
            style={{
              transformOrigin: "bottom left",
              clipPath: "polygon(0 0, 0 100%, 100% 100%)",
              background: "linear-gradient(225deg, #ffffff 0%, #dbe4f0 55%, #b9c7dd 100%)",
            }}
          />
          <span className="pointer-events-none absolute bottom-1 left-1 text-[11px] font-bold text-navy-500">‹</span>
        </button>
      )}
    </div>
  );
}

export default function TearOffClient({ days, startIndex = 0 }: { days: DayData[]; startIndex?: number }) {
  const [idx, setIdx] = useState(startIndex);
  const [anim, setAnim] = useState<null | "next" | "prev">(null);
  const [hint, setHint] = useState(true);
  const len = days.length;
  const mod = (n: number) => ((n % len) + len) % len;

  useEffect(() => {
    const t = window.setTimeout(() => setHint(false), 5200);
    return () => window.clearTimeout(t);
  }, []);

  const cur = days[idx];
  const next = days[mod(idx + 1)];
  const prev = days[mod(idx - 1)];

  function go(dir: "next" | "prev") {
    if (anim) return;
    setHint(false);
    setAnim(dir);
    window.setTimeout(() => {
      setIdx((i) => mod(i + (dir === "next" ? 1 : -1)));
      setAnim(null);
    }, 600);
  }

  const bottom = anim === "prev" ? cur : next;
  const top = anim === "prev" ? prev : cur;
  const topAnimClass = anim === "next" ? "tearoff-anim" : anim === "prev" ? "untearoff-anim" : "";

  return (
    <div className="relative mx-auto w-full max-w-md" style={{ perspective: "1400px" }}>
      <div className="absolute inset-x-3 -bottom-2 h-4 rounded-b-xl bg-slate-200/70" />
      <div className="absolute inset-x-1.5 -bottom-1 h-4 rounded-b-xl bg-slate-300/70" />

      <div className="relative">
        <div className="absolute inset-0" aria-hidden={!anim}>
          <Sheet d={bottom} />
        </div>
        <div
          className={`relative ${topAnimClass}`}
          style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
        >
          <Sheet
            d={top}
            hint={hint && !anim}
            onNext={anim ? undefined : () => go("next")}
            onPrev={anim ? undefined : () => go("prev")}
          />
        </div>
      </div>
    </div>
  );
}
