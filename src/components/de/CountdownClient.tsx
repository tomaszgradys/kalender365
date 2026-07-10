"use client";

import { useEffect, useState } from "react";

function parts(target: number, now: number) {
  const diff = Math.max(0, target - now);
  const totalSec = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSec / 86400),
    hours: Math.floor((totalSec % 86400) / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
    done: diff === 0,
  };
}

function Box({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 tabular-nums">
      <span className="text-3xl font-black text-navy-800 sm:text-4xl">{String(value).padStart(2, "0")}</span>
      <span className="mt-1 text-[11px] uppercase tracking-wide text-slate-500">{label}</span>
    </div>
  );
}

/** Live countdown to a target instant (epoch ms). Renders D/H/M/S, ticking. */
export default function CountdownClient({ target, doneLabel = "Es ist so weit!" }: { target: number; doneLabel?: string }) {
  const [now, setNow] = useState<number>(target); // avoid hydration mismatch: start static
  useEffect(() => {
    // Erste echte Zeit erst nach dem Mount (Date.now() ist nicht SSR-stabil).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const p = parts(target, now);
  if (p.done) {
    return <div className="rounded-2xl border border-brand-green-200 bg-brand-green-50 p-6 text-center text-lg font-bold text-brand-green-800">{doneLabel}</div>;
  }
  return (
    <div className="flex flex-wrap gap-3">
      <Box value={p.days} label="Tage" />
      <Box value={p.hours} label="Std." />
      <Box value={p.minutes} label="Min." />
      <Box value={p.seconds} label="Sek." />
    </div>
  );
}
