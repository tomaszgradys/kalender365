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
