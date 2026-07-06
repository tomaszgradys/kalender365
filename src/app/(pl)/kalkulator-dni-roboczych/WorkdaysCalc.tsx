"use client";

import { useMemo, useState } from "react";
import { workingDaysBetween, todayISO } from "@/lib/calculators";

export default function WorkdaysCalc() {
  const [from, setFrom] = useState(todayISO());
  const [to, setTo] = useState(todayISO());

  const res = useMemo(() => (from && to ? workingDaysBetween(from, to) : null), [from, to]);

  return (
    <div className="mt-6">
      <div className="grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-600">Od</span>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 focus:border-navy-400 focus:outline-none" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-600">Do</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 focus:border-navy-400 focus:outline-none" />
        </label>
      </div>

      {res && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Big label="Dni robocze" value={res.working} accent />
          <Big label="Dni łącznie" value={res.calendarDays} />
          <Big label="Weekendy" value={res.weekend} />
          <Big label="Święta" value={res.holidays} />
        </div>
      )}

      <p className="mt-4 max-w-2xl text-sm text-slate-500">
        Dni robocze liczone jako dni od poniedziałku do piątku z wyłączeniem świąt ustawowo wolnych od
        pracy. Zakres obejmuje obie wybrane daty. Przydatne do policzenia dni urlopu lub terminów.
      </p>
    </div>
  );
}

function Big({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`rounded-2xl px-3 py-4 text-center ${accent ? "bg-brand-green-50" : "bg-slate-50"}`}>
      <div className={`text-3xl font-black ${accent ? "text-brand-green-700" : "text-navy-800"}`}>{value}</div>
      <div className="mt-0.5 text-[11px] text-slate-500">{label}</div>
    </div>
  );
}
