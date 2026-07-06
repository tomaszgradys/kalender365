"use client";

import { useEffect, useMemo, useState } from "react";
import { planVacation, summarizePlan, ferieForRegion, wakacjeWindow, schoolBreaks, WOJEWODZTWA, type PlanMode } from "@/lib/vacationPlanner";
import { buildMonthData } from "@/lib/calendar";
import { MONTH_NAMES, WEEKDAY_SHORT } from "@/lib/months";
import { formatISODatePL, weekdayPL } from "@/lib/format";

const fmtRange = (a: string, b: string) =>
  a === b ? `${formatISODatePL(a)} (${weekdayPL(a)})` : `${formatISODatePL(a)} – ${formatISODatePL(b)}`;

export default function VacationPlanner({ year }: { year: number }) {
  // Pole trzymamy jako string, żeby dało się je wyczyścić (puste = 0, ale można kasować).
  const [budgetStr, setBudgetStr] = useState("26");
  const budget = useMemo(() => {
    const n = Number(budgetStr);
    return budgetStr === "" || Number.isNaN(n) ? 0 : Math.max(0, Math.min(60, n));
  }, [budgetStr]);
  const [mode, setMode] = useState<PlanMode>("full");
  const [region, setRegion] = useState<string>("mazowieckie");
  const [pto, setPto] = useState<Set<string>>(new Set());
  const [qr, setQr] = useState<string>("");

  // Kod QR do wydruku — prowadzi do planera urlopu (generowany po stronie klienta).
  useEffect(() => {
    let alive = true;
    import("qrcode")
      .then((m) => m.toDataURL(`https://kalendarz.pro/planer-urlopu/${year}`, { margin: 1, width: 240 }))
      .then((url) => { if (alive) setQr(url); })
      .catch(() => {});
    return () => { alive = false; };
  }, [year]);

  // Seed z optymalizatora — przy starcie i po zmianie budżetu/trybu/województwa.
  useEffect(() => {
    const res = planVacation({ year, budget, mode, region, fixed: [] });
    setPto(new Set(res.suggestions.flatMap((s) => s.ptoDays)));
  }, [year, budget, mode, region]);

  const plan = useMemo(() => summarizePlan(year, [...pto], budget), [year, pto, budget]);

  const months = useMemo(() => Array.from({ length: 12 }, (_, m) => buildMonthData(year, m)), [year]);
  const ferieHL = useMemo(() => ferieForRegion(region, year), [region, year]);
  const wakacjeHL = useMemo(() => wakacjeWindow(year), [year]);
  const breaks = useMemo(() => schoolBreaks(year, region), [year, region]);
  const inBreak = (iso: string) => breaks.some((b) => iso >= b.start && iso <= b.end);

  function toggle(iso: string) {
    setPto((prev) => {
      const n = new Set(prev);
      if (n.has(iso)) n.delete(iso);
      else n.add(iso);
      return n;
    });
  }
  function reseed() {
    const res = planVacation({ year, budget, mode, region, fixed: [] });
    setPto(new Set(res.suggestions.flatMap((s) => s.ptoDays)));
  }

  return (
    <div className="mt-6 planer-root">
      {/* STEROWANIE */}
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 no-print lg:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-navy-800">Ile masz dni urlopu w {year}?</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={budgetStr}
            placeholder="26"
            onChange={(e) => {
              let v = e.target.value.replace(/\D/g, "");
              if (v !== "" && Number(v) > 60) v = "60";
              setBudgetStr(v);
            }}
            className="mt-2 w-28 rounded-xl border border-slate-200 px-4 py-2.5 text-lg font-bold outline-none focus:border-navy-400"
          />
          <p className="mt-1 text-xs text-slate-500">Standardowo w Polsce 20 lub 26 dni.</p>
        </div>
        <div>
          <span className="block text-sm font-semibold text-navy-800">Tryb planowania</span>
          <div className="mt-2 flex flex-wrap gap-2">
            <button onClick={() => setMode("full")} className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "full" ? "bg-navy-600 text-white" : "border border-slate-200 text-slate-600 hover:border-navy-300"}`}>
              Pełna optymalizacja
            </button>
            <button onClick={() => setMode("family")} className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "family" ? "bg-brand-green-600 text-white" : "border border-slate-200 text-slate-600 hover:border-navy-300"}`}>
              Rok rodzinny (ferie + wakacje)
            </button>
          </div>
          <div className="mt-3">
            <label className="block text-sm font-medium text-slate-700">Województwo (ferie zimowe)</label>
            <select value={region} onChange={(e) => setRegion(e.target.value)} className="mt-1 w-full max-w-xs rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-navy-400">
              {WOJEWODZTWA.map((w) => (<option key={w} value={w}>{w}</option>))}
            </select>
          </div>
        </div>
      </div>

      {/* STATYSTYKI + AKCJE */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-navy-800">Twój plan urlopu na {year}</h2>
        <div className="flex gap-2 no-print">
          <button onClick={reseed} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-navy-300">↻ Zaproponuj plan</button>
          <button onClick={() => window.print()} className="rounded-full bg-navy-600 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700">🖨 Drukuj / PDF</button>
        </div>
      </div>

      {plan.overBudget && (
        <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Zaznaczyłeś {plan.ptoUsed} dni urlopu — o {plan.ptoUsed - budget} więcej niż masz w budżecie ({budget}).
        </p>
      )}

      <div className="planer-stats mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat value={plan.ptoUsed} label="dni urlopu użyto" />
        <Stat value={plan.totalDaysOff} label="dni wolnego łącznie" accent />
        <Stat value={plan.ptoLeft} label="dni urlopu zostało" />
        <Stat value={plan.efficiency ? `${plan.efficiency.toFixed(1)}×` : "—"} label="dni wolnego / urlop" />
      </div>

      <div className="planer-info mt-4 grid gap-3 text-sm sm:grid-cols-2 no-print">
        <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
          <p className="font-semibold text-navy-800">🎿 Ferie zimowe ({region})</p>
          <p className="mt-1 text-slate-600">{ferieHL ? fmtRange(ferieHL.start, ferieHL.end) : `Terminy ferii ${year} nie są jeszcze dostępne.`}</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
          <p className="font-semibold text-navy-800">🏖️ Wakacje letnie</p>
          <p className="mt-1 text-slate-600">{fmtRange(wakacjeHL.start, wakacjeHL.end)}</p>
        </div>
      </div>

      {/* LEGENDA */}
      <div className="planer-legend mt-6 flex flex-wrap gap-4 text-xs text-slate-600">
        <Legend className="bg-brand-green-500" label="urlop (kliknij, by dodać/usunąć)" />
        <Legend className="bg-rose-400" label="święto wolne" />
        <Legend className="bg-amber-300" label="dni wolne od szkoły (ferie, wakacje, przerwy świąteczne)" />
        <Legend className="bg-slate-200" label="weekend" />
      </div>

      {/* KALENDARZ EDYTOWALNY */}
      <div className="planer-months mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {months.map((md, m) => (
          <div key={m} className="rounded-2xl border border-slate-200 bg-white p-3">
            <h3 className="mb-1 text-sm font-semibold text-navy-800">{MONTH_NAMES.pl[m]}</h3>
            <table className="w-full table-fixed border-collapse text-center">
              <thead>
                <tr>
                  {WEEKDAY_SHORT.pl.map((d, i) => (
                    <th key={i} className="pb-1 text-[10px] font-normal text-slate-400">{d[0]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {md.weeks.map((week, wi) => (
                  <tr key={wi}>
                    {week.map((day) => {
                      if (!day.inCurrentMonth) return <td key={day.date} className="p-px" />;
                      const isPto = pto.has(day.date);
                      const isHol = !!day.holiday;
                      const isWknd = day.isWeekend;
                      const isBreak = inBreak(day.date);
                      const clickable = !isHol && !isWknd;
                      let cls = "text-slate-700";
                      if (isPto) cls = "bg-brand-green-500 text-white font-semibold";
                      else if (isHol) cls = "bg-rose-100 text-rose-600 font-semibold";
                      else if (isBreak) cls = "bg-amber-200 text-amber-800";
                      else if (isWknd) cls = "bg-slate-100 text-slate-400";
                      return (
                        <td key={day.date} className="p-px">
                          <button
                            disabled={!clickable}
                            onClick={() => clickable && toggle(day.date)}
                            title={isHol ? day.holiday!.name.pl : day.date}
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

      {/* STOPKA WYDRUKU — logo + QR + info (tylko na wydruku, prawie bez tekstu) */}
      <div className="print-only mt-6 items-center justify-between gap-6 border-t border-slate-200 pt-4">
        <div>
          <span className="text-xl font-extrabold leading-none">
            <span className="text-navy-600">kalendarz</span>
            <span className="text-brand-green-600">.pro</span>
          </span>
          <p className="mt-1 text-xs text-slate-500">
            Plan urlopu wygenerowany na kalendarz.pro — zeskanuj kod i zaplanuj swój.
          </p>
        </div>
        {qr && <img src={qr} alt="Kod QR — planer urlopu na kalendarz.pro" width={84} height={84} />}
      </div>

      {/* BLOKI WOLNEGO */}
      {plan.suggestions.length > 0 && (
        <div className="mt-6 no-print">
          <h3 className="mb-2 text-lg font-bold text-navy-800">Twoje bloki wolnego</h3>
          <ol className="space-y-2">
            {plan.suggestions.map((s, i) => (
              <li key={i} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white p-3">
                <div>
                  <span className="text-sm font-bold text-navy-800">{s.label}</span>
                  <p className="text-sm text-slate-600">{fmtRange(s.offStart, s.offEnd)}</p>
                </div>
                <span className="rounded-full bg-brand-green-50 px-3 py-1 text-sm font-semibold text-brand-green-700">
                  {s.offTotal} dni wolnego za {s.ptoCount} {s.ptoCount === 1 ? "dzień" : "dni"} urlopu
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <p className="mt-4 text-xs text-slate-400 no-print">
        Kliknij dzień roboczy w kalendarzu, aby dodać lub usunąć urlop. „Zaproponuj plan" wraca do sugestii
        planera. Ostateczny wniosek urlopowy zatwierdza pracodawca.
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
