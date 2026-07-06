"use client";

import { useEffect, useMemo, useState } from "react";
import { computePregnancy, todayISO } from "@/lib/calculators";
import { formatISODatePL } from "@/lib/format";

export default function PregnancyCalc() {
  const [lmp, setLmp] = useState("");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const res = useMemo(() => (mounted && lmp ? computePregnancy(lmp, todayISO()) : null), [lmp, mounted]);

  return (
    <div className="mt-6">
      <label className="block max-w-xs">
        <span className="mb-1 block text-sm font-medium text-slate-600">Pierwszy dzień ostatniej miesiączki</span>
        <input
          type="date"
          value={lmp}
          onChange={(e) => setLmp(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 focus:border-navy-400 focus:outline-none"
        />
      </label>

      {lmp && !res && (
        <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Podaj datę w ciągu ostatnich ~10 miesięcy, aby obliczyć tydzień ciąży.
        </p>
      )}

      {res && (
        <div className="mt-6">
          <div className="rounded-2xl bg-gradient-to-br from-navy-600 to-navy-800 p-6 text-center text-white">
            <div className="text-sm text-navy-100">Przewidywany termin porodu</div>
            <div className="mt-1 text-3xl font-black">{formatISODatePL(res.eddISO)}</div>
            <div className="mt-2 text-sm text-navy-100">za {res.daysRemaining} dni</div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Stat label="Tydzień ciąży" value={`${res.weeks} tydz. + ${res.daysIntoWeek} dni`} accent />
            <Stat label="Trymestr" value={`${res.trimester}.`} />
            <Stat label="Dni ciąży" value={`${res.daysPregnant}`} />
          </div>

          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs text-slate-500">
              <span>Postęp ciąży</span>
              <span>{res.progressPct}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-brand-green-500" style={{ width: `${res.progressPct}%` }} />
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Obliczenia orientacyjne wg reguły Naegelego (termin porodu = pierwszy dzień ostatniej
            miesiączki + 280 dni). Nie zastępują konsultacji lekarskiej.
          </p>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl px-3 py-4 text-center ${accent ? "bg-brand-green-50" : "bg-slate-50"}`}>
      <div className={`text-lg font-black ${accent ? "text-brand-green-700" : "text-navy-800"}`}>{value}</div>
      <div className="mt-0.5 text-[11px] text-slate-500">{label}</div>
    </div>
  );
}
