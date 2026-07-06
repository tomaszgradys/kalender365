"use client";

import { useMemo, useState } from "react";
import { BUNDESLAENDER, type StateCode } from "@/lib/de/bundeslaender";
import { getBrueckentage, URLAUBSTAGE_CHIPS } from "@/lib/de/brueckentage";
import { formatLongDE } from "@/lib/de/locale";

export default function UrlaubsplanerClient({ year }: { year: number }) {
  const [state, setState] = useState<StateCode>("BY");
  const [budget, setBudget] = useState<number>(30);

  const { plan, used, free } = useMemo(() => {
    const all = getBrueckentage(year, state); // sorted by efficiency
    const chosen: typeof all = [];
    let spent = 0;
    let freeTotal = 0;
    for (const b of all) {
      if (spent + b.urlaubstage > budget) continue;
      // skip overlaps with already-chosen blocks
      const overlaps = chosen.some((c) => !(b.bis < c.von || b.von > c.bis));
      if (overlaps) continue;
      chosen.push(b);
      spent += b.urlaubstage;
      freeTotal += b.freieTage;
    }
    chosen.sort((a, b) => a.von.localeCompare(b.von));
    return { plan: chosen, used: spent, free: freeTotal };
  }, [year, state, budget]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-navy-50/40 p-4">
        <label className="inline-flex items-center gap-2 text-sm">
          <span className="font-medium text-slate-600">Bundesland:</span>
          <select
            value={state}
            onChange={(e) => setState(e.target.value as StateCode)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-navy-700 outline-none focus:border-navy-300"
          >
            {BUNDESLAENDER.map((b) => (
              <option key={b.code} value={b.code}>{b.name}</option>
            ))}
          </select>
        </label>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-slate-600">Urlaubstage:</span>
          {URLAUBSTAGE_CHIPS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setBudget(n)}
              className={`rounded-full px-3 py-1 font-semibold ${budget === n ? "bg-navy-600 text-white" : "border border-slate-200 bg-white text-slate-600 hover:border-navy-300"}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-brand-green-200 bg-brand-green-50 p-4">
        <p className="text-sm text-brand-green-800">
          Mit <strong>{used}</strong> von {budget} Urlaubstagen erreichen Sie
          <strong> {free} freie Tage</strong> über {plan.length} Brücken.
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {plan.map((b, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-brand-green-50 px-2 py-0.5 text-xs font-bold text-brand-green-700">{b.freieTage} freie Tage</span>
              <span className="text-xs text-slate-400">{b.urlaubstage} Urlaubstag{b.urlaubstage > 1 ? "e" : ""}</span>
            </div>
            <div className="mt-2 text-sm font-semibold text-navy-800">{formatLongDE(b.von)} – {formatLongDE(b.bis)}</div>
            <div className="mt-1 text-xs text-slate-500">Urlaub: {b.urlaub.map((d) => formatLongDE(d)).join(", ")}</div>
          </div>
        ))}
        {plan.length === 0 && <p className="text-sm text-slate-500">Keine passenden Brückentage im Budget gefunden.</p>}
      </div>
      <p className="mt-3 text-xs text-slate-400">Vorschläge zur Urlaubsplanung, keine Rechtsberatung. Bitte mit Arbeitgeber/Tarifvertrag abstimmen.</p>
    </div>
  );
}
