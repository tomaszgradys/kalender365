// "Wie viele Tage bis …" — countdown targets. Each resolves the next occurrence
// from a given reference date. Deterministic; times are Berlin midnight (approx).

import { easterSunday } from "./feiertage";
import { getSeasonDate } from "./astroYear";

const TZ = "Europe/Berlin";

/** Epoch ms of local (Berlin) midnight for a calendar date. */
export function berlinMidnight(year: number, month0: number, day: number): number {
  const asUTC = Date.UTC(year, month0, day);
  const off = (() => {
    const d = new Date(Date.UTC(year, month0, day, 12));
    const u = new Date(d.toLocaleString("en-US", { timeZone: "UTC" }));
    const t = new Date(d.toLocaleString("en-US", { timeZone: TZ }));
    return (t.getTime() - u.getTime()) / 60000;
  })();
  return asUTC - off * 60000;
}

export type CountdownEvent = {
  slug: string;
  title: string; // "Weihnachten"
  emoji: string;
  // resolve the next occurrence date (>= today) as {year, month0, day}
  resolve: (now: Date) => { year: number; month0: number; day: number };
};

function nextFixed(month0: number, day: number) {
  return (now: Date) => {
    const y = now.getUTCFullYear();
    const thisYear = Date.UTC(y, month0, day);
    const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const year = thisYear >= todayUTC ? y : y + 1;
    return { year, month0, day };
  };
}

function fromDate(compute: (year: number) => Date) {
  return (now: Date) => {
    const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    let y = now.getUTCFullYear();
    let d = compute(y);
    if (Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) < todayUTC) d = compute(++y);
    return { year: d.getUTCFullYear(), month0: d.getUTCMonth(), day: d.getUTCDate() };
  };
}

export const COUNTDOWNS: CountdownEvent[] = [
  { slug: "weihnachten", title: "Weihnachten", emoji: "🎄", resolve: nextFixed(11, 24) },
  { slug: "silvester", title: "Silvester", emoji: "🎆", resolve: nextFixed(11, 31) },
  { slug: "neujahr", title: "Neujahr", emoji: "🥂", resolve: nextFixed(0, 1) },
  { slug: "ostern", title: "Ostern", emoji: "🐣", resolve: fromDate((y) => easterSunday(y)) },
  { slug: "nikolaus", title: "Nikolaus", emoji: "🎅", resolve: nextFixed(11, 6) },
  { slug: "halloween", title: "Halloween", emoji: "🎃", resolve: nextFixed(9, 31) },
  { slug: "valentinstag", title: "Valentinstag", emoji: "❤️", resolve: nextFixed(1, 14) },
  { slug: "sommeranfang", title: "Sommeranfang", emoji: "☀️", resolve: fromDate((y) => getSeasonDate(y, 1)) },
];

export function getCountdown(slug: string): CountdownEvent | null {
  return COUNTDOWNS.find((c) => c.slug === slug) ?? null;
}
