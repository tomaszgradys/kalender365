// Pomocniki dla numerów tygodni ISO 8601.

/** Poniedziałek tygodnia ISO nr 1 danego roku (data zawierająca 4 stycznia). */
function mondayOfISOWeek1(year: number): Date {
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const dayNum = (jan4.getUTCDay() + 6) % 7; // Monday=0
  const monday = new Date(jan4);
  monday.setUTCDate(jan4.getUTCDate() - dayNum);
  return monday;
}

/** Liczba tygodni ISO w danym roku (52 lub 53). */
export function isoWeeksInYear(year: number): number {
  const p = (y: number) => (y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400)) % 7;
  return p(year) === 4 || p(year - 1) === 3 ? 53 : 52;
}

export type WeekRange = { start: Date; end: Date; week: number; year: number };

/** Zakres dat (pon–niedz) tygodnia ISO nr `week` w roku `year`. */
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

const MONTHS_GEN = [
  "stycznia",
  "lutego",
  "marca",
  "kwietnia",
  "maja",
  "czerwca",
  "lipca",
  "sierpnia",
  "września",
  "października",
  "listopada",
  "grudnia",
];

export function formatDatePL(d: Date): string {
  return `${d.getUTCDate()} ${MONTHS_GEN[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function formatDateShort(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(d.getUTCDate())}.${pad(d.getUTCMonth() + 1)}.${d.getUTCFullYear()}`;
}
