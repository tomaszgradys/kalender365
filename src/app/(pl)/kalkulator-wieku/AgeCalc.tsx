"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { computeAge, todayISO } from "@/lib/calculators";
import { WEEKDAY_NAMES, MONTH_SLUGS } from "@/lib/months";

export default function AgeCalc() {
  const [birth, setBirth] = useState("2000-01-01");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const res = useMemo(() => (mounted && birth ? computeAge(birth, todayISO()) : null), [birth, mounted]);

  return (
    <div className="mt-6">
      <label className="block max-w-xs">
        <span className="mb-1 block text-sm font-medium text-slate-600">Data urodzenia</span>
        <input
          type="date"
          value={birth}
          onChange={(e) => setBirth(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 focus:border-navy-400 focus:outline-none"
        />
      </label>

      {res && (
        <div className="mt-6">
          <div className="rounded-2xl bg-gradient-to-br from-navy-600 to-navy-800 p-6 text-center text-white">
            <div className="text-4xl font-black">
              {res.years} <span className="text-xl font-semibold text-navy-100">lat</span> {res.months}{" "}
              <span className="text-xl font-semibold text-navy-100">mies.</span> {res.days}{" "}
              <span className="text-xl font-semibold text-navy-100">dni</span>
            </div>
            <div className="mt-2 text-sm text-navy-100">
              Do najbliższych urodzin: {res.nextBirthdayInDays} dni
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Dni łącznie" value={res.totalDays.toLocaleString("pl-PL")} />
            <Stat label="Tygodni" value={res.totalWeeks.toLocaleString("pl-PL")} />
            <Stat label="Dzień urodzenia" value={WEEKDAY_NAMES.pl[res.weekdayBornIdx]} />
            <Stat label="Znak zodiaku" value={`${res.zodiac.symbol} ${res.zodiac.name}`} />
          </div>

          {/* Następny krok — kontekstowe linki przy samym wyniku (głębokość sesji). */}
          {(() => {
            const [by, bm, bd] = birth.split("-");
            const kartka = `/kalendarz/${MONTH_SLUGS.pl[Number(bm) - 1]}-${by}/${Number(bd)}`;
            return (
              <div className="mt-5">
                <p className="mb-2 text-sm font-semibold text-navy-800">Zobacz też</p>
                <div className="flex flex-wrap gap-2">
                  <Link href={kartka} className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:border-navy-300 hover:text-navy-600">
                    📆 Kartka z kalendarza z dnia Twoich urodzin
                  </Link>
                  <Link href="/zodiak" className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:border-navy-300 hover:text-navy-600">
                    {res.zodiac.symbol} Znak zodiaku: {res.zodiac.name}
                  </Link>
                  <Link href="/kalkulator-dni" className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:border-navy-300 hover:text-navy-600">
                    ➕ Ile dni między datami
                  </Link>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-3 text-center">
      <div className="text-base font-bold text-navy-800">{value}</div>
      <div className="text-[11px] text-slate-500">{label}</div>
    </div>
  );
}
