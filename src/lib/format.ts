import { MONTH_NAMES_GENITIVE_PL, WEEKDAY_NAMES } from "./months";

/** "2026-07-04" → "4 lipca 2026" */
export function formatISODatePL(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTH_NAMES_GENITIVE_PL[m - 1]} ${y}`;
}

/** "2026-07-04" → "sobota" */
export function weekdayPL(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const idx = (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7;
  return WEEKDAY_NAMES.pl[idx].toLowerCase();
}

/** "2026-07-04" → "4 lipca 2026 (sobota)" */
export function formatISOFullPL(iso: string): string {
  return `${formatISODatePL(iso)} (${weekdayPL(iso)})`;
}
