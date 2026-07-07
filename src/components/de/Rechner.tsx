"use client";

import { useState } from "react";
import { BUNDESLAENDER, type StateCode } from "@/lib/de/bundeslaender";
import { arbeitstageBetween } from "@/lib/de/arbeitstage";
import { formatFullDE } from "@/lib/de/locale";

const inputCls = "rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-navy-800 outline-none focus:border-navy-300";
const cardCls = "rounded-2xl border border-slate-200 bg-white p-5";

function daysBetween(a: string, b: string): number | null {
  if (!a || !b) return null;
  const ta = new Date(a + "T00:00:00Z").getTime();
  const tb = new Date(b + "T00:00:00Z").getTime();
  if (Number.isNaN(ta) || Number.isNaN(tb)) return null;
  return Math.round((tb - ta) / 86400000);
}

export function TageRechner() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const diff = daysBetween(from, to);
  return (
    <div className={cardCls}>
      <div className="flex flex-wrap items-end gap-4">
        <label className="text-sm">
          <span className="block text-slate-500">Von</span>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={inputCls} />
        </label>
        <label className="text-sm">
          <span className="block text-slate-500">Bis</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={inputCls} />
        </label>
      </div>
      {diff !== null && (
        <p className="mt-4 text-lg text-navy-800">
          Dazwischen liegen <strong>{Math.abs(diff)} Tage</strong> ({Math.abs(diff) + 1} Tage inklusive Start und Ende).
        </p>
      )}
    </div>
  );
}

export function ArbeitstageRechner() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [state, setState] = useState<StateCode>("BY");
  const valid = from && to && from <= to;
  const result = valid ? arbeitstageBetween(from, to, state, "5") : null;
  return (
    <div className={cardCls}>
      <div className="flex flex-wrap items-end gap-4">
        <label className="text-sm">
          <span className="block text-slate-500">Von</span>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={inputCls} />
        </label>
        <label className="text-sm">
          <span className="block text-slate-500">Bis</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={inputCls} />
        </label>
        <label className="text-sm">
          <span className="block text-slate-500">Bundesland</span>
          <select value={state} onChange={(e) => setState(e.target.value as StateCode)} className={inputCls}>
            {BUNDESLAENDER.map((b) => <option key={b.code} value={b.code}>{b.name}</option>)}
          </select>
        </label>
      </div>
      {result !== null && (
        <p className="mt-4 text-lg text-navy-800">
          <strong>{result} Arbeitstage</strong> (Mo–Fr ohne Feiertage) im gewählten Zeitraum.
        </p>
      )}
      <p className="mt-2 text-xs text-slate-400">Zeitraum inklusive Start- und Endtag. 5-Tage-Woche.</p>
    </div>
  );
}

export function WochentagRechner() {
  const [date, setDate] = useState("");
  return (
    <div className={cardCls}>
      <label className="text-sm">
        <span className="block text-slate-500">Datum</span>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
      </label>
      {date && <p className="mt-4 text-lg text-navy-800">Das ist ein <strong>{formatFullDE(date)}</strong>.</p>}
    </div>
  );
}

export function AltersRechner() {
  const [birth, setBirth] = useState("");
  const valid = /^\d{4}-\d{2}-\d{2}$/.test(birth);
  let out: { years: number; months: number; days: number; totalDays: number; weekday: string; nextIn: number } | null = null;
  if (valid) {
    const [by, bm, bd] = birth.split("-").map(Number);
    const now = new Date();
    const ny = now.getUTCFullYear(), nm = now.getUTCMonth() + 1, nd = now.getUTCDate();
    const birthMs = Date.UTC(by, bm - 1, bd);
    const todayMs = Date.UTC(ny, nm - 1, nd);
    if (birthMs <= todayMs) {
      let years = ny - by, months = nm - bm, days = nd - bd;
      if (days < 0) { months -= 1; days += new Date(Date.UTC(ny, nm - 1, 0)).getUTCDate(); }
      if (months < 0) { years -= 1; months += 12; }
      const totalDays = Math.round((todayMs - birthMs) / 86400000);
      const weekday = formatFullDE(birth).split(",")[0];
      // days until next birthday
      let nextBd = Date.UTC(ny, bm - 1, bd);
      if (nextBd < todayMs) nextBd = Date.UTC(ny + 1, bm - 1, bd);
      const nextIn = Math.round((nextBd - todayMs) / 86400000);
      out = { years, months, days, totalDays, weekday, nextIn };
    }
  }
  return (
    <div className={cardCls}>
      <label className="text-sm">
        <span className="block text-slate-500">Geburtsdatum</span>
        <input type="date" value={birth} onChange={(e) => setBirth(e.target.value)} className={inputCls} />
      </label>
      {out && (
        <div className="mt-4 space-y-1 text-navy-800">
          <p className="text-lg">Sie sind <strong>{out.years} Jahre, {out.months} Monate und {out.days} Tage</strong> alt.</p>
          <p className="text-sm text-slate-600">Das sind insgesamt <strong>{out.totalDays.toLocaleString("de-DE")} Tage</strong>. Geboren an einem <strong>{out.weekday}</strong>.</p>
          <p className="text-sm text-brand-green-700">Nächster Geburtstag in <strong>{out.nextIn} Tagen</strong>.</p>
        </div>
      )}
    </div>
  );
}
