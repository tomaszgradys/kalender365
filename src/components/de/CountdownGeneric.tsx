"use client";

import { useState } from "react";
import { berlinMidnight } from "@/lib/de/countdowns";
import CountdownClient from "@/components/de/CountdownClient";

export default function CountdownGeneric() {
  const [date, setDate] = useState("");
  let target: number | null = null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [y, m, d] = date.split("-").map(Number);
    target = berlinMidnight(y, m - 1, d);
  }
  return (
    <div>
      <label className="text-sm">
        <span className="block text-slate-500">Zieldatum</span>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-navy-800 outline-none focus:border-navy-300" />
      </label>
      {target !== null && (
        <div className="mt-6">
          <CountdownClient target={target} doneLabel="Der Tag ist gekommen!" />
        </div>
      )}
    </div>
  );
}
