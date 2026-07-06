import { getZodiac } from "./dayInfo";
import { getNonWorkingHolidays } from "./holidays";

function parts(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m: m - 1, d };
}
function utc(iso: string) {
  const { y, m, d } = parts(iso);
  return Date.UTC(y, m, d);
}
function isoFromUTC(ms: number) {
  const d = new Date(ms);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}
export function todayISO() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Wiek
// ---------------------------------------------------------------------------
export type AgeResult = {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  weekdayBornIdx: number;
  nextBirthdayInDays: number;
  zodiac: { name: string; symbol: string };
};

export function computeAge(birthISO: string, atISO: string): AgeResult | null {
  const b = parts(birthISO);
  const t = parts(atISO);
  const start = utc(birthISO);
  const now = utc(atISO);
  if (Number.isNaN(start) || Number.isNaN(now) || now < start) return null;

  let years = t.y - b.y;
  let months = t.m - b.m;
  let days = t.d - b.d;
  if (days < 0) {
    months--;
    days += new Date(Date.UTC(t.y, t.m, 0)).getUTCDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  const totalDays = Math.floor((now - start) / 86400000);
  const weekdayBornIdx = (new Date(start).getUTCDay() + 6) % 7;

  let nb = Date.UTC(t.y, b.m, b.d);
  if (nb < now) nb = Date.UTC(t.y + 1, b.m, b.d);
  const nextBirthdayInDays = Math.round((nb - now) / 86400000);

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks: Math.floor(totalDays / 7),
    weekdayBornIdx,
    nextBirthdayInDays,
    zodiac: getZodiac(b.m, b.d),
  };
}

// ---------------------------------------------------------------------------
// Ciąża (reguła Naegelego: OM + 280 dni)
// ---------------------------------------------------------------------------
export type PregnancyResult = {
  eddISO: string;
  weeks: number;
  daysIntoWeek: number;
  trimester: 1 | 2 | 3;
  daysRemaining: number;
  daysPregnant: number;
  progressPct: number;
};

export function computePregnancy(lmpISO: string, atISO: string): PregnancyResult | null {
  const lmp = utc(lmpISO);
  const now = utc(atISO);
  if (Number.isNaN(lmp) || Number.isNaN(now)) return null;
  const edd = lmp + 280 * 86400000;
  const daysPregnant = Math.floor((now - lmp) / 86400000);
  if (daysPregnant < 0 || daysPregnant > 320) return null;
  const weeks = Math.floor(daysPregnant / 7);
  const daysIntoWeek = daysPregnant % 7;
  const trimester: 1 | 2 | 3 = weeks < 13 ? 1 : weeks < 27 ? 2 : 3;
  const daysRemaining = Math.ceil((edd - now) / 86400000);
  const progressPct = Math.max(0, Math.min(100, Math.round((daysPregnant / 280) * 100)));
  return { eddISO: isoFromUTC(edd), weeks, daysIntoWeek, trimester, daysRemaining, daysPregnant, progressPct };
}

// ---------------------------------------------------------------------------
// Dni robocze między datami (z wyłączeniem weekendów i świąt)
// ---------------------------------------------------------------------------
export type WorkdaysBetween = {
  calendarDays: number;
  working: number;
  weekend: number;
  holidays: number;
  holidayList: string[];
};

export function workingDaysBetween(fromISO: string, toISO: string): WorkdaysBetween | null {
  let a = utc(fromISO);
  let b = utc(toISO);
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  if (a > b) [a, b] = [b, a];

  const hs = new Set<string>();
  for (let y = new Date(a).getUTCFullYear(); y <= new Date(b).getUTCFullYear(); y++) {
    getNonWorkingHolidays(y).forEach((h) => hs.add(h.date));
  }

  let calendarDays = 0;
  let working = 0;
  let weekend = 0;
  let holidays = 0;
  const holidayList: string[] = [];
  for (let t = a; t <= b; t += 86400000) {
    calendarDays++;
    const wd = (new Date(t).getUTCDay() + 6) % 7;
    const iso = isoFromUTC(t);
    const isWknd = wd >= 5;
    const isHol = hs.has(iso);
    if (isWknd) weekend++;
    else if (isHol) {
      holidays++;
      holidayList.push(iso);
    } else working++;
  }
  return { calendarDays, working, weekend, holidays, holidayList };
}
