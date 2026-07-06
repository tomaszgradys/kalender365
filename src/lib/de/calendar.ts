// Calendar grid + year-summary helpers for the German views (Monday-first).

import type { StateCode } from "./bundeslaender";
import { getAllFeiertage, workFreeHolidaySet } from "./feiertage";
import { arbeitstageInYear } from "./arbeitstage";
import { isoWeeksInYear } from "./weeks";

export type GridDay = {
  day: number; // 1..31, or 0 for padding cells
  month0: number;
  iso: string; // "" for padding
  weekday: number; // 0=Mon..6=Sun
  weekend: boolean;
  holiday: boolean;
};

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

/**
 * A month as an array of weeks (each 7 cells, Monday-first). Padding cells have
 * day=0. `state` optional → highlights that Land's statutory holidays; without
 * it, only national holidays are flagged.
 */
export function monthMatrix(year: number, month0: number, state?: StateCode): GridDay[][] {
  const holidays = state
    ? workFreeHolidaySet(year, state)
    : new Set(getAllFeiertage(year).filter((h) => h.scope === "national").map((h) => h.date));
  const first = new Date(Date.UTC(year, month0, 1));
  const startPad = (first.getUTCDay() + 6) % 7; // Mon=0
  const daysInMonth = new Date(Date.UTC(year, month0 + 1, 0)).getUTCDate();

  const cells: GridDay[] = [];
  for (let i = 0; i < startPad; i++) {
    cells.push({ day: 0, month0, iso: "", weekday: i, weekend: i >= 5, holiday: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const weekday = (new Date(Date.UTC(year, month0, d)).getUTCDay() + 6) % 7;
    const iso = `${year}-${pad(month0 + 1)}-${pad(d)}`;
    cells.push({ day: d, month0, iso, weekday, weekend: weekday >= 5, holiday: holidays.has(iso) });
  }
  while (cells.length % 7 !== 0) {
    const weekday = cells.length % 7;
    cells.push({ day: 0, month0, iso: "", weekday, weekend: weekday >= 5, holiday: false });
  }
  const weeks: GridDay[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export type YearSummary = {
  year: number;
  totalDays: number;
  weekends: number;
  feiertageCount: number; // national statutory days that fall on a weekday
  arbeitstage: number; // 5-day week, national baseline (no regional holidays)
  isoWeeks: number;
};

/**
 * Year summary at the national ("Deutschland") baseline. Feiertage count = the 9
 * nationwide holidays that fall Mon–Fri (weekend ones don't reduce Arbeitstage).
 * When a state is given, uses that Land's holiday set instead.
 */
export function yearSummary(year: number, state?: StateCode): YearSummary {
  const totalDays = (Date.UTC(year, 11, 31) - Date.UTC(year, 0, 1)) / 86400000 + 1;
  let weekends = 0;
  for (let t = Date.UTC(year, 0, 1); t <= Date.UTC(year, 11, 31); t += 86400000) {
    if (new Date(t).getUTCDay() % 6 === 0) weekends++; // Sat(6)/Sun(0)
  }
  const holidaySet = state
    ? workFreeHolidaySet(year, state)
    : new Set(getAllFeiertage(year).filter((h) => h.scope === "national").map((h) => h.date));
  let feiertageOnWeekday = 0;
  for (const iso of holidaySet) {
    const dow = new Date(iso + "T00:00:00Z").getUTCDay();
    if (dow !== 0 && dow !== 6) feiertageOnWeekday++;
  }
  // For the national baseline we approximate Arbeitstage as (weekday count −
  // national weekday holidays). arbeitstageInYear needs a state; for a state view
  // we use it directly.
  let arbeitstage: number;
  if (state) {
    arbeitstage = arbeitstageInYear(year, state);
  } else {
    let weekdays = 0;
    for (let t = Date.UTC(year, 0, 1); t <= Date.UTC(year, 11, 31); t += 86400000) {
      const dow = new Date(t).getUTCDay();
      if (dow !== 0 && dow !== 6) weekdays++;
    }
    arbeitstage = weekdays - feiertageOnWeekday;
  }
  return {
    year,
    totalDays,
    weekends,
    feiertageCount: feiertageOnWeekday,
    arbeitstage,
    isoWeeks: isoWeeksInYear(year),
  };
}
