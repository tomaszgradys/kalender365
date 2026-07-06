// ISO 8601 Kalenderwochen (KW) helpers for the German site. Week starts Monday.

/** Monday of ISO week 1 (the week containing 4 January). */
function mondayOfISOWeek1(year: number): Date {
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const dayNum = (jan4.getUTCDay() + 6) % 7; // Monday=0
  const monday = new Date(jan4);
  monday.setUTCDate(jan4.getUTCDate() - dayNum);
  return monday;
}

/** Number of ISO weeks in a year (52 or 53). */
export function isoWeeksInYear(year: number): number {
  const p = (y: number) => (y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400)) % 7;
  return p(year) === 4 || p(year - 1) === 3 ? 53 : 52;
}

export type WeekRange = { start: Date; end: Date; week: number; year: number };

/** Date range (Mon–Sun) of ISO week `week` in `year`. */
export function getISOWeekRange(year: number, week: number): WeekRange {
  const monday = mondayOfISOWeek1(year);
  monday.setUTCDate(monday.getUTCDate() + (week - 1) * 7);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  return { start: monday, end: sunday, week, year };
}

export function isValidWeek(year: number, week: number): boolean {
  return Number.isInteger(week) && week >= 1 && week <= isoWeeksInYear(year);
}

/** All KW of a year with their date ranges — for /kalenderwochen/[year]. */
export function allWeeks(year: number): WeekRange[] {
  return Array.from({ length: isoWeeksInYear(year) }, (_, i) => getISOWeekRange(year, i + 1));
}
