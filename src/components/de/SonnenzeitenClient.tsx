"use client";

import { useMemo, useState } from "react";
import { CITIES, getSunTimes } from "@/lib/de/sun";
import { MONTH_NAMES_DE, WEEKDAY_SHORT_DE } from "@/lib/de/locale";

export default function SonnenzeitenClient({ year, month0 }: { year: number; month0: number }) {
  const [cityIdx, setCityIdx] = useState(0);
  const [m, setM] = useState(month0);
  const [y, setY] = useState(year);
  const city = CITIES[cityIdx];

  const rows = useMemo(() => {
    const days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
    return Array.from({ length: days }, (_, i) => {
      const day = i + 1;
      const t = getSunTimes(y, m, day, city.lat, city.lng);
      const weekday = (new Date(Date.UTC(y, m, day)).getUTCDay() + 6) % 7;
      return { day, weekday, ...t };
    });
  }, [y, m, city]);

  const prev = () => (m === 0 ? (setM(11), setY(y - 1)) : setM(m - 1));
  const next = () => (m === 11 ? (setM(0), setY(y + 1)) : setM(m + 1));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-navy-50/40 p-4">
        <label className="inline-flex items-center gap-2 text-sm">
          <span className="font-medium text-slate-600">Ort:</span>
          <select value={cityIdx} onChange={(e) => setCityIdx(Number(e.target.value))} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-navy-700 outline-none focus:border-navy-300">
            {CITIES.map((c, i) => <option key={c.name} value={i}>{c.name}</option>)}
          </select>
        </label>
        <div className="flex items-center gap-2 text-sm">
          <button type="button" onClick={prev} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300">←</button>
          <span className="font-semibold text-navy-800">{MONTH_NAMES_DE[m]} {y}</span>
          <button type="button" onClick={next} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300">→</button>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Tag</th>
              <th className="px-4 py-2 font-medium">Sonnenaufgang</th>
              <th className="px-4 py-2 font-medium">Sonnenuntergang</th>
              <th className="px-4 py-2 font-medium">Tageslänge</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.day} className={`border-t border-slate-100 ${r.weekday >= 5 ? "bg-slate-50/60" : ""}`}>
                <td className="px-4 py-1.5 text-slate-700">{r.day}. ({WEEKDAY_SHORT_DE[r.weekday]})</td>
                <td className="px-4 py-1.5 text-navy-800">{r.sunrise ?? "—"}</td>
                <td className="px-4 py-1.5 text-navy-800">{r.sunset ?? "—"}</td>
                <td className="px-4 py-1.5 text-slate-500">{r.dayLengthText}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-slate-400">Zeiten in Europe/Berlin (MEZ/MESZ). Berechnung nach dem NOAA-Sonnenstandsalgorithmus.</p>
    </div>
  );
}
