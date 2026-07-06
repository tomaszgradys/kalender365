// German locale primitives: month/weekday names, slugs and date formatting.
// Week starts on Monday. Formats follow de-DE conventions:
//   long  → "6. Juli 2026"
//   short → "06.07.2026"

export const MONTH_NAMES_DE = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

// ASCII slugs for month routes, e.g. /kalender/maerz-2026. Umlaut ä→ae.
export const MONTH_SLUGS_DE = [
  "januar", "februar", "maerz", "april", "mai", "juni",
  "juli", "august", "september", "oktober", "november", "dezember",
];

export const MONTH_ABBR_DE = [
  "Jan", "Feb", "Mär", "Apr", "Mai", "Jun",
  "Jul", "Aug", "Sep", "Okt", "Nov", "Dez",
];

// Monday-first, matching ISO week and the PL layout.
export const WEEKDAY_NAMES_DE = [
  "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag",
];

// Two-letter headers used in calendar grids and PDF: "Mo Di Mi Do Fr Sa So".
export const WEEKDAY_SHORT_DE = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

export function monthSlugToIndexDE(slug: string): number | null {
  const idx = MONTH_SLUGS_DE.indexOf(slug);
  return idx === -1 ? null : idx;
}

/** "juli-2026" → { monthIndex, year }. */
export function parseMonthYearSlugDE(slug: string): { monthIndex: number; year: number } | null {
  const m = slug.match(/^([a-z]+)-(\d{4})$/);
  if (!m) return null;
  const monthIndex = monthSlugToIndexDE(m[1]);
  const year = Number(m[2]);
  if (monthIndex === null) return null;
  return { monthIndex, year };
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

/** "2026-07-06" → "6. Juli 2026". */
export function formatLongDE(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  return `${d}. ${MONTH_NAMES_DE[m - 1]} ${y}`;
}

/** "2026-07-06" → "06.07.2026". */
export function formatShortDE(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  return `${pad(d)}.${pad(m)}.${y}`;
}

/** "2026-07-06" → "Montag". */
export function weekdayDE(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const idx = (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7; // Monday=0
  return WEEKDAY_NAMES_DE[idx];
}

/** "2026-07-06" → "Montag, 6. Juli 2026". */
export function formatFullDE(isoDate: string): string {
  return `${weekdayDE(isoDate)}, ${formatLongDE(isoDate)}`;
}
