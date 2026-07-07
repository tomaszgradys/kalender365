"use client";

import { useEffect, useState } from "react";

const DAYS = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
const LS_KEY = "kalender365.stundenplan";

type Grid = { rows: number; days: number; cells: Record<string, string>; times: string[] };

const DEFAULT: Grid = {
  rows: 8,
  days: 5,
  times: ["08:00", "08:50", "09:55", "10:45", "11:50", "12:40", "13:45", "14:35"],
  cells: {},
};

export default function StundenplanClient() {
  const [grid, setGrid] = useState<Grid>(DEFAULT);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setGrid({ ...DEFAULT, ...JSON.parse(raw) });
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(LS_KEY, JSON.stringify(grid));
  }, [grid, loaded]);

  const key = (r: number, d: number) => `${r}:${d}`;
  const setCell = (r: number, d: number, v: string) => setGrid((g) => ({ ...g, cells: { ...g.cells, [key(r, d)]: v } }));
  const setTime = (r: number, v: string) => setGrid((g) => { const t = [...g.times]; t[r] = v; return { ...g, times: t }; });

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm print:hidden">
        <label className="inline-flex items-center gap-2">
          <span className="text-slate-600">Stunden:</span>
          <select value={grid.rows} onChange={(e) => setGrid((g) => ({ ...g, rows: Number(e.target.value) }))} className="rounded-lg border border-slate-200 bg-white px-2 py-1">
            {[6, 7, 8, 9, 10, 11, 12].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label className="inline-flex items-center gap-2">
          <span className="text-slate-600">Tage:</span>
          <select value={grid.days} onChange={(e) => setGrid((g) => ({ ...g, days: Number(e.target.value) }))} className="rounded-lg border border-slate-200 bg-white px-2 py-1">
            <option value={5}>Mo–Fr</option>
            <option value={6}>Mo–Sa</option>
          </select>
        </label>
        <button type="button" onClick={() => window.print()} className="rounded-lg bg-navy-600 px-4 py-1.5 font-semibold text-white hover:bg-navy-700">🖨 Drucken</button>
        <button type="button" onClick={() => { if (confirm("Stundenplan leeren?")) setGrid((g) => ({ ...g, cells: {} })); }} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-600 hover:border-navy-300">Leeren</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-20 border border-slate-200 bg-navy-50 p-2 text-xs font-semibold text-navy-700">Zeit</th>
              {DAYS.slice(0, grid.days).map((d) => (
                <th key={d} className="border border-slate-200 bg-navy-50 p-2 font-semibold text-navy-700">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: grid.rows }, (_, r) => (
              <tr key={r}>
                <td className="border border-slate-200 p-1 text-center">
                  <input value={grid.times[r] ?? ""} onChange={(e) => setTime(r, e.target.value)} className="w-16 rounded bg-transparent text-center text-xs text-slate-500 outline-none focus:bg-navy-50" placeholder={`${r + 1}.`} />
                </td>
                {Array.from({ length: grid.days }, (_, d) => (
                  <td key={d} className="border border-slate-200 p-0">
                    <input
                      value={grid.cells[key(r, d)] ?? ""}
                      onChange={(e) => setCell(r, d, e.target.value)}
                      className="w-full bg-transparent px-2 py-2 text-center text-navy-800 outline-none focus:bg-brand-green-50"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-slate-400 print:hidden">Der Stundenplan wird automatisch in Ihrem Browser gespeichert.</p>
    </div>
  );
}
