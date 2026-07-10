"use client";

import { useEffect, useMemo, useState } from "react";
import {
  planUrlaub,
  summarizePlan,
  schoolBreaks,
  ferienHighlights,
  feiertagNames,
  type PlanMode,
} from "@/lib/de/urlaubsplaner";
import { monthMatrix } from "@/lib/de/calendar";
import { BUNDESLAENDER, type StateCode } from "@/lib/de/bundeslaender";
import { MONTH_NAMES_DE, WEEKDAY_SHORT_DE, formatLongDE, weekdayDE } from "@/lib/de/locale";
import { SITE_URL } from "@/lib/de/site";

const fmtRange = (a: string, b: string) =>
  a === b ? `${formatLongDE(a)} (${weekdayDE(a)})` : `${formatLongDE(a)} – ${formatLongDE(b)}`;

// Seed set of vacation days suggested by the optimiser for the given inputs.
function seedPto(year: number, budget: number, mode: PlanMode, state: StateCode): Set<string> {
  const res = planUrlaub({ year, budget, mode, state, fixed: [] });
  return new Set(res.suggestions.flatMap((s) => s.ptoDays));
}

export default function UrlaubsplanerClient({ year }: { year: number }) {
  // Kept as a string so the field can be cleared (empty = 0, but deletable).
  const [budgetStr, setBudgetStr] = useState("30");
  const budget = useMemo(() => {
    const n = Number(budgetStr);
    return budgetStr === "" || Number.isNaN(n) ? 0 : Math.max(0, Math.min(60, n));
  }, [budgetStr]);
  const [mode, setMode] = useState<PlanMode>("full");
  const [state, setState] = useState<StateCode>("BY");
  const [pto, setPto] = useState<Set<string>>(() => seedPto(year, 30, "full", "BY"));
  const [qr, setQr] = useState<string>("");

  // Re-seed from the optimiser whenever the inputs change (year/budget/mode/state).
  // React's recommended "adjust state during render" pattern — avoids an effect.
  const seedKey = `${year}|${budget}|${mode}|${state}`;
  const [seededKey, setSeededKey] = useState(seedKey);
  if (seedKey !== seededKey) {
    setSeededKey(seedKey);
    setPto(seedPto(year, budget, mode, state));
  }

  // Print QR code — points to the Urlaubsplaner (generated client-side).
  useEffect(() => {
    let alive = true;
    import("qrcode")
      .then((m) => m.toDataURL(`${SITE_URL}/urlaubsplaner/${year}`, { margin: 1, width: 240 }))
      .then((url) => { if (alive) setQr(url); })
      .catch(() => {});
    return () => { alive = false; };
  }, [year]);

  const plan = useMemo(() => summarizePlan(year, state, [...pto], budget), [year, state, pto, budget]);

  const months = useMemo(() => Array.from({ length: 12 }, (_, m) => monthMatrix(year, m, state)), [year, state]);
  const holidayNames = useMemo(() => feiertagNames(year, state), [year, state]);
  const highlights = useMemo(() => ferienHighlights(year, state), [year, state]);
  const breaks = useMemo(() => schoolBreaks(year, state), [year, state]);
  const inBreak = (iso: string) => breaks.some((b) => iso >= b.start && iso <= b.end);
  const stateName = BUNDESLAENDER.find((b) => b.code === state)?.name ?? "";

  function toggle(iso: string) {
    setPto((prev) => {
      const n = new Set(prev);
      if (n.has(iso)) n.delete(iso);
      else n.add(iso);
      return n;
    });
  }
  function reseed() {
    setPto(seedPto(year, budget, mode, state));
  }

  return (
    <div className="mt-6 planer-root">
      {/* CONTROLS */}
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 no-print lg:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-navy-800">Wie viele Urlaubstage haben Sie {year}?</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={budgetStr}
            placeholder="30"
            onChange={(e) => {
              let v = e.target.value.replace(/\D/g, "");
              if (v !== "" && Number(v) > 60) v = "60";
              setBudgetStr(v);
            }}
            className="mt-2 w-28 rounded-xl border border-slate-200 px-4 py-2.5 text-lg font-bold outline-none focus:border-navy-400"
          />
          <p className="mt-1 text-xs text-slate-500">Üblich in Deutschland: 20 (gesetzliches Minimum) bis 30 Tage.</p>
        </div>
        <div>
          <span className="block text-sm font-semibold text-navy-800">Planungsmodus</span>
          <div className="mt-2 flex flex-wrap gap-2">
            <button onClick={() => setMode("full")} className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "full" ? "bg-navy-600 text-white" : "border border-slate-200 text-slate-600 hover:border-navy-300"}`}>
              Volle Optimierung
            </button>
            <button onClick={() => setMode("family")} className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "family" ? "bg-brand-green-600 text-white" : "border border-slate-200 text-slate-600 hover:border-navy-300"}`}>
              Familienjahr (Schulferien)
            </button>
          </div>
          <div className="mt-3">
            <label className="block text-sm font-medium text-slate-700">Bundesland (Feiertage &amp; Schulferien)</label>
            <select value={state} onChange={(e) => setState(e.target.value as StateCode)} className="mt-1 w-full max-w-xs rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-navy-400">
              {BUNDESLAENDER.map((b) => (<option key={b.code} value={b.code}>{b.name}</option>))}
            </select>
          </div>
        </div>
      </div>

      {/* STATS + ACTIONS */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-navy-800">Ihr Urlaubsplan für {year}</h2>
        <div className="flex gap-2 no-print">
          <button onClick={reseed} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-navy-300">↻ Plan vorschlagen</button>
          <button onClick={() => window.print()} className="rounded-full bg-navy-600 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700">🖨 Drucken / PDF</button>
        </div>
      </div>

      {plan.overBudget && (
        <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Sie haben {plan.ptoUsed} Urlaubstage markiert — {plan.ptoUsed - budget} mehr als Ihr Budget ({budget}).
        </p>
      )}

      <div className="planer-stats mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat value={plan.ptoUsed} label="Urlaubstage genutzt" />
        <Stat value={plan.totalDaysOff} label="freie Tage insgesamt" accent />
        <Stat value={plan.ptoLeft} label="Urlaubstage übrig" />
        <Stat value={plan.efficiency ? `${plan.efficiency.toFixed(1)}×` : "—"} label="freie Tage / Urlaubstag" />
      </div>

      <div className="planer-info mt-4 grid gap-3 text-sm sm:grid-cols-2 no-print">
        <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
          <p className="font-semibold text-navy-800">🎿 Winterferien ({stateName})</p>
          <p className="mt-1 text-slate-600">{highlights.winter ? fmtRange(highlights.winter.start, highlights.winter.end) : `Termine für ${year} liegen noch nicht vor.`}</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
          <p className="font-semibold text-navy-800">☀️ Sommerferien ({stateName})</p>
          <p className="mt-1 text-slate-600">{highlights.sommer ? fmtRange(highlights.sommer.start, highlights.sommer.end) : `Termine für ${year} liegen noch nicht vor.`}</p>
        </div>
      </div>

      {/* LEGEND */}
      <div className="planer-legend mt-6 flex flex-wrap gap-4 text-xs text-slate-600">
        <Legend className="bg-brand-green-500" label="Urlaub (klicken zum Hinzufügen/Entfernen)" />
        <Legend className="bg-rose-400" label="Feiertag" />
        <Legend className="bg-amber-300" label="Schulferien" />
        <Legend className="bg-slate-200" label="Wochenende" />
      </div>

      {/* EDITABLE CALENDAR */}
      <div className="planer-months mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {months.map((weeks, m) => (
          <div key={m} className="rounded-2xl border border-slate-200 bg-white p-3">
            <h3 className="mb-1 text-sm font-semibold text-navy-800">{MONTH_NAMES_DE[m]}</h3>
            <table className="w-full table-fixed border-collapse text-center">
              <thead>
                <tr>
                  {WEEKDAY_SHORT_DE.map((d, i) => (
                    <th key={i} className="pb-1 text-[10px] font-normal text-slate-400">{d[0]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weeks.map((week, wi) => (
                  <tr key={wi}>
                    {week.map((day, di) => {
                      if (day.day === 0) return <td key={`p${di}`} className="p-px" />;
                      const isPto = pto.has(day.iso);
                      const isHol = day.holiday;
                      const isWknd = day.weekend;
                      const isBreak = inBreak(day.iso);
                      const clickable = !isHol && !isWknd;
                      let cls = "text-slate-700";
                      if (isPto) cls = "bg-brand-green-500 text-white font-semibold";
                      else if (isHol) cls = "bg-rose-100 text-rose-600 font-semibold";
                      else if (isBreak) cls = "bg-amber-200 text-amber-800";
                      else if (isWknd) cls = "bg-slate-100 text-slate-400";
                      return (
                        <td key={day.iso} className="p-px">
                          <button
                            disabled={!clickable}
                            onClick={() => clickable && toggle(day.iso)}
                            title={isHol ? (holidayNames.get(day.iso) ?? day.iso) : day.iso}
                            className={`flex aspect-square w-full items-center justify-center rounded-md text-[11px] leading-none transition ${cls} ${clickable ? "cursor-pointer hover:bg-brand-green-200" : "cursor-default"}`}
                          >
                            {day.day}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* PRINT FOOTER — logo + QR + note (print only, almost no text) */}
      <div className="print-only mt-6 items-center justify-between gap-6 border-t border-slate-200 pt-4">
        <div>
          <span className="text-xl font-extrabold leading-none">
            <span className="text-navy-600">kalender365</span>
            <span className="text-brand-green-600">.pro</span>
          </span>
          <p className="mt-1 text-xs text-slate-500">
            Urlaubsplan erstellt auf kalender365.pro — Code scannen und selbst planen.
          </p>
        </div>
        {/* QR ist eine data-URI, nur im Druck sichtbar — next/image kann data:-URLs nicht optimieren. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {qr && <img src={qr} alt="QR-Code — Urlaubsplaner auf kalender365.pro" width={84} height={84} />}
      </div>

      {/* FREE BLOCKS */}
      {plan.suggestions.length > 0 && (
        <div className="mt-6 no-print">
          <h3 className="mb-2 text-lg font-bold text-navy-800">Ihre freien Blöcke</h3>
          <ol className="space-y-2">
            {plan.suggestions.map((s, i) => (
              <li key={i} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white p-3">
                <div>
                  <span className="text-sm font-bold text-navy-800">{s.label}</span>
                  <p className="text-sm text-slate-600">{fmtRange(s.offStart, s.offEnd)}</p>
                </div>
                <span className="rounded-full bg-brand-green-50 px-3 py-1 text-sm font-semibold text-brand-green-700">
                  {s.offTotal} freie Tage für {s.ptoCount} Urlaubstag{s.ptoCount === 1 ? "" : "e"}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <p className="mt-4 text-xs text-slate-400 no-print">
        Klicken Sie einen Arbeitstag im Kalender an, um Urlaub hinzuzufügen oder zu entfernen. „Plan vorschlagen“
        stellt die Empfehlung des Planers wieder her. Der Urlaubsantrag wird letztlich vom Arbeitgeber genehmigt.
      </p>
    </div>
  );
}

function Stat({ value, label, accent }: { value: string | number; label: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl px-3 py-3 text-center ${accent ? "bg-brand-green-50" : "bg-slate-50"}`}>
      <div className={`text-2xl font-black ${accent ? "text-brand-green-700" : "text-navy-800"}`}>{value}</div>
      <div className="mt-0.5 text-[11px] text-slate-500">{label}</div>
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-block h-3 w-3 rounded ${className}`} />
      {label}
    </span>
  );
}
