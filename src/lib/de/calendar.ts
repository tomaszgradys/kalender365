// Calendar grid + year-summary helpers for the German views (Monday-first).

import type { StateCode } from "./bundeslaender";
import { getAllFeiertage, workFreeHolidaySet } from "./feiertage";
import { arbeitstageInYear } from "./arbeitstage";
import { isoWeeksInYear } from "./weeks";
import { isoWeekOf } from "./now";
import { parseMonthYearSlugDE } from "./locale";

/** Parse a /kalender/[slug] segment: "2026" (year) or "juli-2026" (month). */
export type KalenderSlug =
  | { kind: "year"; year: number }
  | { kind: "month"; year: number; month0: number };

export function parseKalenderSlug(slug: string): KalenderSlug | null {
  if (/^\d{4}$/.test(slug)) {
    const year = Number(slug);
    return year >= 1900 && year <= 2100 ? { kind: "year", year } : null;
  }
  const my = parseMonthYearSlugDE(slug);
  if (my && my.year >= 1900 && my.year <= 2100) return { kind: "month", year: my.year, month0: my.monthIndex };
  return null;
}

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

export type MonthWeek = { kw: number; days: GridDay[] };

/** Month grid with the ISO calendar week (KW) for each row. */
export function monthView(year: number, month0: number, state?: StateCode): MonthWeek[] {
  const rows = monthMatrix(year, month0, state);
  const first = new Date(Date.UTC(year, month0, 1));
  const startPad = (first.getUTCDay() + 6) % 7; // Mon=0
  return rows.map((days, i) => {
    // Monday date of this row (may fall in the previous/next month).
    const mondayNum = 1 - startPad + i * 7;
    const monday = new Date(Date.UTC(year, month0, mondayNum));
    const { week } = isoWeekOf(monday.getUTCFullYear(), monday.getUTCMonth(), monday.getUTCDate());
    return { kw: week, days };
  });
}

/** Feiertage that fall within a given month for a state (or national baseline). */
export function feiertageInMonth(year: number, month0: number, state?: StateCode) {
  const prefix = `${year}-${pad(month0 + 1)}-`;
  return getAllFeiertage(year).filter((h) => {
    if (!h.date.startsWith(prefix)) return false;
    if (h.scope === "national") return true;
    if (state && h.scope === "state" && h.states.includes(state)) return true;
    return false;
  });
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
