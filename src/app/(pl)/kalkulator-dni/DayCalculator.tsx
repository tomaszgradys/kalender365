"use client";

import { useMemo, useState } from "react";

function todayISO() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
}

export default function DayCalculator() {
  const [from, setFrom] = useState(todayISO());
  const [to, setTo] = useState(todayISO());

  const result = useMemo(() => {
    if (!from || !to) return null;
    const a = Date.parse(from + "T00:00:00Z");
    const b = Date.parse(to + "T00:00:00Z");
    if (Number.isNaN(a) || Number.isNaN(b)) return null;
    const days = Math.round((b - a) / 86400000);
    const abs = Math.abs(days);
    const weeks = Math.floor(abs / 7);
    const remDays = abs % 7;
    return { days, abs, weeks, remDays };
  }, [from, to]);

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-600">Data początkowa</span>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 focus:border-navy-400 focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-600">Data końcowa</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 focus:border-navy-400 focus:outline-none"
          />
        </label>
      </div>

      {result && (
        <div className="mt-6 rounded-2xl bg-gradient-to-br from-navy-600 to-navy-800 p-6 text-center text-white">
          <div className="text-5xl font-black">{result.abs}</div>
          <div className="mt-1 text-navy-100">
            {result.abs === 1 ? "dzień" : "dni"}
            {result.days < 0 ? " temu" : result.days > 0 ? " do przodu" : ""}
          </div>
          <div className="mt-3 text-sm text-navy-100">
            to {result.weeks} {result.weeks === 1 ? "tydzień" : "tyg."} i {result.remDays} dni
          </div>
        </div>
      )}
    </div>
  );
}
