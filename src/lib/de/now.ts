// "Heute" is always computed in the German timezone (Europe/Berlin), regardless
// of server timezone (Vercel runs in UTC). Without this the "Kalenderblatt des
// Tages" would show the previous day between midnight and 01:00/02:00 CET.

const TZ = "Europe/Berlin";

export function berlinNow(): { year: number; month0: number; day: number } {
  const isoStr = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const [y, m, d] = isoStr.split("-").map(Number);
  return { year: y, month0: m - 1, day: d };
}

/** Midnight of today (Berlin) as a UTC Date — for date comparisons. */
export function berlinToday(): Date {
  const { year, month0, day } = berlinNow();
  return new Date(Date.UTC(year, month0, day));
}

/** ISO 8601 week number + ISO year for a given calendar date. */
export function isoWeekOf(year: number, month0: number, day: number): { isoYear: number; week: number } {
  const d = new Date(Date.UTC(year, month0, day));
  const dayNum = (d.getUTCDay() + 6) % 7; // Monday = 0
  d.setUTCDate(d.getUTCDate() - dayNum + 3); // nearest Thursday fixes ISO year+week
  const isoYear = d.getUTCFullYear();
  const firstThursday = new Date(Date.UTC(isoYear, 0, 4));
  const firstDayNum = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNum + 3);
  const week = 1 + Math.round((d.getTime() - firstThursday.getTime()) / (7 * 24 * 60 * 60 * 1000));
  return { isoYear, week };
}

/** Current ISO week (Berlin) — default for /kalenderwochen and "aktuelle KW". */
export function berlinISOWeek(): { isoYear: number; week: number } {
  const { year, month0, day } = berlinNow();
  return isoWeekOf(year, month0, day);
}
