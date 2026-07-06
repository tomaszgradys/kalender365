// "Dzisiaj" liczone zawsze w polskiej strefie czasowej (Europe/Warsaw),
// niezależnie od strefy serwera (Vercel działa w UTC — bez tego kartka
// z kalendarza pokazywała poprzedni dzień między północą a 1:00/2:00).
const TZ = "Europe/Warsaw";

export function warsawNow(): { year: number; month0: number; day: number } {
  // en-CA daje format YYYY-MM-DD
  const iso = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const [y, m, d] = iso.split("-").map(Number);
  return { year: y, month0: m - 1, day: d };
}

/** Północ dzisiejszego dnia (wg Warszawy) jako Date w UTC — do porównań dat. */
export function warsawToday(): Date {
  const { year, month0, day } = warsawNow();
  return new Date(Date.UTC(year, month0, day));
}

/**
 * Numer tygodnia ISO 8601 wraz z rokiem ISO (na przełomie roku rok ISO może
 * różnić się od kalendarzowego — np. 1 stycznia bywa 52./53. tygodniem
 * poprzedniego roku). Zwraca dane potrzebne do URL-a /tydzien/{isoYear}/{week}.
 */
export function isoWeekOf(year: number, month0: number, day: number): { isoYear: number; week: number } {
  const d = new Date(Date.UTC(year, month0, day));
  const dayNum = (d.getUTCDay() + 6) % 7; // poniedziałek = 0
  d.setUTCDate(d.getUTCDate() - dayNum + 3); // najbliższy czwartek wyznacza rok i tydzień ISO
  const isoYear = d.getUTCFullYear();
  const firstThursday = new Date(Date.UTC(isoYear, 0, 4));
  const firstDayNum = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNum + 3);
  const week = 1 + Math.round((d.getTime() - firstThursday.getTime()) / (7 * 24 * 60 * 60 * 1000));
  return { isoYear, week };
}

/** Bieżący tydzień ISO (wg Warszawy) — domyślny dla /tydzien i „Numery tygodni". */
export function warsawISOWeek(): { isoYear: number; week: number } {
  const { year, month0, day } = warsawNow();
  return isoWeekOf(year, month0, day);
}
