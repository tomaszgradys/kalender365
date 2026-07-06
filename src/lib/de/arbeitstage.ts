// Working-day counting for Germany, per Bundesland.
//
// Terminology (surfaced to users on the page — they are NOT the same):
//   Arbeitstage → Mon–Fri minus statutory holidays in the selected Land
//                 (the "5-Tage-Woche" default).
//   Werktage    → Mon–Sat minus Sundays and statutory holidays (German legal
//                 default when a law says "Werktage"; ~6-day week).
//
// Deliberately NO Polish "Saturday holiday → give a day back" rule here.

import type { StateCode } from "./bundeslaender";
import { workFreeHolidaySet } from "./feiertage";

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export type DayFlag = {
  date: string;
  month0: number;
  day: number;
  weekday: number; // 0=Mon .. 6=Sun
  holiday: boolean;
  /** off under a 5-day week (weekend Sat/Sun or holiday). */
  off5: boolean;
  /** off under a 6-day week (Sun or holiday). */
  off6: boolean;
};

/** All days of the year flagged for 5- and 6-day-week counting in `state`. */
export function yearDays(year: number, state: StateCode): DayFlag[] {
  const hs = workFreeHolidaySet(year, state);
  const days: DayFlag[] = [];
  const start = Date.UTC(year, 0, 1);
  const end = Date.UTC(year, 11, 31);
  for (let t = start; t <= end; t += 86400000) {
    const d = new Date(t);
    const weekday = (d.getUTCDay() + 6) % 7; // Mon=0
    const isoDate = `${year}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
    const holiday = hs.has(isoDate);
    const isSun = weekday === 6;
    const isSat = weekday === 5;
    days.push({
      date: isoDate,
      month0: d.getUTCMonth(),
      day: d.getUTCDate(),
      weekday,
      holiday,
      off5: isSat || isSun || holiday,
      off6: isSun || holiday,
    });
  }
  return days;
}

export type WorkMode = "5" | "6";

export type MonthWork = { month0: number; arbeitstage: number; freie: number; total: number };

export function workingDaysByMonth(year: number, state: StateCode, mode: WorkMode = "5"): MonthWork[] {
  const days = yearDays(year, state);
  const out: MonthWork[] = Array.from({ length: 12 }, (_, m) => ({ month0: m, arbeitstage: 0, freie: 0, total: 0 }));
  for (const d of days) {
    const off = mode === "5" ? d.off5 : d.off6;
    out[d.month0].total++;
    if (off) out[d.month0].freie++;
    else out[d.month0].arbeitstage++;
  }
  return out;
}

export function workingDaysInMonth(year: number, month0: number, state: StateCode, mode: WorkMode = "5") {
  const m = workingDaysByMonth(year, state, mode)[month0];
  return { arbeitstage: m.arbeitstage, freie: m.freie, total: m.total };
}

/** Total Arbeitstage (5-day week) in the year for the state. */
export function arbeitstageInYear(year: number, state: StateCode): number {
  return yearDays(year, state).filter((d) => !d.off5).length;
}

/** Total Werktage (6-day week: Mon–Sat minus holidays) in the year. */
export function werktageInYear(year: number, state: StateCode): number {
  return yearDays(year, state).filter((d) => !d.off6).length;
}

/** Arbeitstage between two ISO dates inclusive (5-day week), for the calculator. */
export function arbeitstageBetween(fromISO: string, toISO: string, state: StateCode, mode: WorkMode = "5"): number {
  let from = new Date(fromISO + "T00:00:00Z").getTime();
  const to = new Date(toISO + "T00:00:00Z").getTime();
  if (from > to) return 0;
  // Gather holiday sets per touched year.
  const years = new Set<number>();
  for (let y = new Date(from).getUTCFullYear(); y <= new Date(to).getUTCFullYear(); y++) years.add(y);
  const hs = new Set<string>();
  for (const y of years) for (const iso of workFreeHolidaySet(y, state)) hs.add(iso);
  let count = 0;
  for (; from <= to; from += 86400000) {
    const d = new Date(from);
    const weekday = (d.getUTCDay() + 6) % 7;
    const isoDate = `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
    const isSat = weekday === 5;
    const isSun = weekday === 6;
    const off = mode === "5" ? isSat || isSun || hs.has(isoDate) : isSun || hs.has(isoDate);
    if (!off) count++;
  }
  return count;
}
