"use client";

import { useEffect, useState } from "react";

function diff(targetMs: number) {
  const now = Date.now();
  let s = Math.max(0, Math.floor((targetMs - now) / 1000));
  const days = Math.floor(s / 86400);
  s -= days * 86400;
  const hours = Math.floor(s / 3600);
  s -= hours * 3600;
  const minutes = Math.floor(s / 60);
  const seconds = s - minutes * 60;
  return { days, hours, minutes, seconds };
}

function Cell({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="min-w-[3.5rem] rounded-2xl bg-white/15 px-3 py-2 text-4xl font-black tabular-nums text-white backdrop-blur sm:min-w-[4.5rem] sm:text-5xl">
        {String(value).padStart(2, "0")}
      </div>
      <div className="mt-1 text-[11px] uppercase tracking-wide text-white/70">{label}</div>
    </div>
  );
}

export default function Countdown({ targetMs, initialDays }: { targetMs: number; initialDays: number }) {
  const [t, setT] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    setT(diff(targetMs));
    const id = setInterval(() => setT(diff(targetMs)), 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  // Do pierwszego renderu (SSR/hydration) pokazujemy dni policzone serwerowo.
  const view = t ?? { days: Math.max(0, initialDays), hours: 0, minutes: 0, seconds: 0 };

  return (
    <div className="flex flex-wrap items-start justify-center gap-3 sm:gap-4">
      <Cell value={view.days} label="dni" />
      <Cell value={view.hours} label="godz." />
      <Cell value={view.minutes} label="min" />
      <Cell value={view.seconds} label="sek." />
    </div>
  );
}
