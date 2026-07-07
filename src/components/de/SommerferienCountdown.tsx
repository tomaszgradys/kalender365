"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BUNDESLAENDER, type StateCode } from "@/lib/de/bundeslaender";
import { getFerienByTyp } from "@/lib/de/schulferien";
import { berlinMidnight } from "@/lib/de/countdowns";
import { formatLongDE } from "@/lib/de/locale";
import CountdownClient from "@/components/de/CountdownClient";

/** Next Sommerferien start (>= today) for a state across the seeded years. */
function nextStart(state: StateCode): string | null {
  const now = new Date();
  const todayMs = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const candidates: string[] = [];
  for (const y of [now.getFullYear(), now.getFullYear() + 1, now.getFullYear() + 2]) {
    const p = getFerienByTyp(y, state, "sommerferien");
    if (p) candidates.push(p.start);
  }
  candidates.sort();
  return candidates.find((iso) => new Date(iso + "T00:00:00Z").getTime() >= todayMs) ?? null;
}

export default function SommerferienCountdown() {
  const [code, setCode] = useState<StateCode>("BY");
  const start = useMemo(() => nextStart(code), [code]);
  const state = BUNDESLAENDER.find((b) => b.code === code)!;
  const target = start ? (() => { const [y, m, d] = start.split("-").map(Number); return berlinMidnight(y, m - 1, d); })() : null;

  return (
    <div>
      <label className="inline-flex items-center gap-2 text-sm">
        <span className="font-medium text-slate-600">Bundesland:</span>
        <select value={code} onChange={(e) => setCode(e.target.value as StateCode)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-navy-700 outline-none focus:border-navy-300">
          {BUNDESLAENDER.map((b) => <option key={b.code} value={b.code}>{b.name}</option>)}
        </select>
      </label>

      {target !== null && start ? (
        <div className="mt-6">
          <p className="text-slate-600">Die nächsten Sommerferien in {state.name} beginnen am <strong>{formatLongDE(start)}</strong>.</p>
          <div className="mt-4"><CountdownClient target={target} doneLabel={`Sommerferien in ${state.name}! 🎉`} /></div>
          <p className="mt-4 text-sm"><Link href={`/schulferien/${start.slice(0, 4)}/${state.slug}`} className="font-medium text-navy-600 underline">Alle Schulferien in {state.name} →</Link></p>
        </div>
      ) : (
        <p className="mt-6 text-sm text-slate-500">Für {state.name} sind noch keine kommenden Sommerferien-Termine hinterlegt.</p>
      )}
    </div>
  );
}
