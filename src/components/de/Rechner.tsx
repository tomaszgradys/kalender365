"use client";

import { useState } from "react";
import { BUNDESLAENDER, type StateCode } from "@/lib/de/bundeslaender";
import { arbeitstageDetails } from "@/lib/de/arbeitstage";
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
      <div role="status" aria-live="polite">
        {diff !== null && (
          <p className="mt-4 text-lg text-navy-800">
            Dazwischen liegen <strong>{Math.abs(diff)} Tage</strong> ({Math.abs(diff) + 1} Tage inklusive Start und Ende).
          </p>
        )}
      </div>
    </div>
  );
}

export function ArbeitstageRechner() {
  const thisYear = new Date().getFullYear();
  const [from, setFrom] = useState(`${thisYear}-01-01`);
  const [to, setTo] = useState(`${thisYear}-12-31`);
  const [state, setState] = useState<StateCode>("BY");
  const [woche, setWoche] = useState<"5" | "6">("5");
  const [urlaub, setUrlaub] = useState("");
  const [krank, setKrank] = useState("");
  const valid = Boolean(from && to && from <= to);
  const det = valid ? arbeitstageDetails(from, to, state) : null;
  const brutto = det ? (woche === "5" ? det.arbeitstage5 : det.arbeitstage6) : 0;
  const u = Math.max(0, Math.floor(Number(urlaub) || 0));
  const k = Math.max(0, Math.floor(Number(krank) || 0));
  const netto = Math.max(0, brutto - u - k);
  const abzug = woche === "5" ? det?.feiertageMoFr ?? [] : [...(det?.feiertageMoFr ?? []), ...(det?.feiertageSa ?? [])].sort((a, b) => a.date.localeCompare(b.date));
  const numCls = inputCls + " w-24";
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

      <fieldset className="mt-4">
        <legend className="text-sm text-slate-500">Arbeitswoche</legend>
        <div className="mt-1 flex flex-wrap gap-2 text-sm">
          <label className={`cursor-pointer rounded-lg border px-3 py-1.5 ${woche === "5" ? "border-navy-500 bg-navy-50 font-semibold text-navy-800" : "border-slate-200 text-slate-700"}`}>
            <input type="radio" name="woche" value="5" checked={woche === "5"} onChange={() => setWoche("5")} className="mr-1.5" />
            5-Tage-Woche (Mo–Fr) – Arbeitstage
          </label>
          <label className={`cursor-pointer rounded-lg border px-3 py-1.5 ${woche === "6" ? "border-navy-500 bg-navy-50 font-semibold text-navy-800" : "border-slate-200 text-slate-700"}`}>
            <input type="radio" name="woche" value="6" checked={woche === "6"} onChange={() => setWoche("6")} className="mr-1.5" />
            6-Tage-Woche (Mo–Sa) – Werktage
          </label>
        </div>
      </fieldset>

      <div className="mt-4 flex flex-wrap items-end gap-4">
        <label className="text-sm">
          <span className="block text-slate-500">Urlaubstage abziehen</span>
          <input type="number" min={0} max={400} inputMode="numeric" value={urlaub} onChange={(e) => setUrlaub(e.target.value)} placeholder="0" className={numCls} />
        </label>
        <label className="text-sm">
          <span className="block text-slate-500">Krankheitstage abziehen</span>
          <input type="number" min={0} max={400} inputMode="numeric" value={krank} onChange={(e) => setKrank(e.target.value)} placeholder="0" className={numCls} />
        </label>
      </div>

      <div role="status" aria-live="polite">
        {det && (
          <div className="mt-5 rounded-xl bg-navy-50/60 p-4">
            <p className="text-lg text-navy-800">
              <strong>{brutto} {woche === "5" ? "Arbeitstage" : "Werktage"}</strong> ({woche === "5" ? "Mo–Fr" : "Mo–Sa"} ohne gesetzliche Feiertage) im gewählten Zeitraum
              {u + k > 0 && (
                <>
                  {" "}– abzüglich {u > 0 ? `${u} Urlaubstag${u === 1 ? "" : "en"}` : ""}{u > 0 && k > 0 ? " und " : ""}{k > 0 ? `${k} Krankheitstag${k === 1 ? "" : "en"}` : ""}: <strong>{netto} tatsächliche {woche === "5" ? "Arbeitstage" : "Werktage"}</strong>
                </>
              )}
              .
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-slate-700 sm:grid-cols-3">
              <div><dt className="text-slate-500">Kalendertage</dt><dd className="font-semibold text-navy-800">{det.kalendertage}</dd></div>
              <div><dt className="text-slate-500">Samstage / Sonntage</dt><dd className="font-semibold text-navy-800">{det.samstage} / {det.sonntage}</dd></div>
              <div><dt className="text-slate-500">Abgezogene Feiertage</dt><dd className="font-semibold text-navy-800">{abzug.length}</dd></div>
              <div><dt className="text-slate-500">Arbeitstage (Mo–Fr)</dt><dd className="font-semibold text-navy-800">{det.arbeitstage5}</dd></div>
              <div><dt className="text-slate-500">Werktage (Mo–Sa)</dt><dd className="font-semibold text-navy-800">{det.arbeitstage6}</dd></div>
              <div><dt className="text-slate-500">Feiertage am Wochenende</dt><dd className="font-semibold text-navy-800">{det.feiertageSa.length + det.feiertageSo.length}</dd></div>
            </dl>
            {abzug.length > 0 && (
              <details className="mt-3 text-sm">
                <summary className="cursor-pointer font-medium text-navy-700">Abgezogene Feiertage anzeigen ({abzug.length})</summary>
                <ul className="mt-2 columns-1 gap-6 text-slate-700 sm:columns-2">
                  {abzug.map((h) => <li key={h.date}>{formatFullDE(h.date)} – {h.name}</li>)}
                </ul>
              </details>
            )}
          </div>
        )}
        {!valid && from && to && <p className="mt-4 text-sm text-amber-700">Das Enddatum liegt vor dem Startdatum.</p>}
      </div>
      <p className="mt-2 text-xs text-slate-400">Zeitraum inklusive Start- und Endtag. Gesetzliche Feiertage des gewählten Bundeslandes; nur in Teilen eines Landes geltende Tage (z. B. Fronleichnam in Sachsen, Mariä Himmelfahrt in Bayern) werden nicht abgezogen.</p>
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
      <div role="status" aria-live="polite">
        {date && <p className="mt-4 text-lg text-navy-800">Das ist ein <strong>{formatFullDE(date)}</strong>.</p>}
      </div>
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
        <div role="status" aria-live="polite" className="mt-4 space-y-1 text-navy-800">
          <p className="text-lg">Sie sind <strong>{out.years} Jahre, {out.months} Monate und {out.days} Tage</strong> alt.</p>
          <p className="text-sm text-slate-600">Das sind insgesamt <strong>{out.totalDays.toLocaleString("de-DE")} Tage</strong>. Geboren an einem <strong>{out.weekday}</strong>.</p>
          <p className="text-sm text-brand-green-700">Nächster Geburtstag in <strong>{out.nextIn} Tagen</strong>.</p>
        </div>
      )}
    </div>
  );
}
