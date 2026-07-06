import { getNonWorkingHolidays } from "./holidays";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

/** Zbiór dat (YYYY-MM-DD) dni ustawowo wolnych (bez Wielkanocy-niedzieli, bo i tak niedziela). */
function holidaySet(year: number): Set<string> {
  return new Set(getNonWorkingHolidays(year).map((h) => h.date));
}

export type DayFlag = { date: string; month0: number; day: number; weekday: number; off: boolean; holiday: boolean };

/** Wszystkie dni roku z flagą „wolny" (weekend lub święto). */
export function yearDays(year: number): DayFlag[] {
  const hs = holidaySet(year);
  const days: DayFlag[] = [];
  const start = Date.UTC(year, 0, 1);
  const end = Date.UTC(year, 11, 31);
  for (let t = start; t <= end; t += 86400000) {
    const d = new Date(t);
    const weekday = (d.getUTCDay() + 6) % 7; // 0=pon
    const iso = `${year}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
    const isWeekend = weekday >= 5;
    const isHoliday = hs.has(iso);
    days.push({ date: iso, month0: d.getUTCMonth(), day: d.getUTCDate(), weekday, off: isWeekend || isHoliday, holiday: isHoliday });
  }
  return days;
}

export type MonthWork = { month0: number; workingDays: number; freeDays: number; totalDays: number };

export function workingDaysByMonth(year: number): MonthWork[] {
  const days = yearDays(year);
  const out: MonthWork[] = Array.from({ length: 12 }, (_, m) => ({ month0: m, workingDays: 0, freeDays: 0, totalDays: 0 }));
  for (const d of days) {
    out[d.month0].totalDays++;
    if (d.off) out[d.month0].freeDays++;
    else out[d.month0].workingDays++;
  }
  return out;
}

export function workingDaysInMonth(year: number, month0: number): { working: number; free: number; total: number } {
  const m = workingDaysByMonth(year)[month0];
  return { working: m.workingDays, free: m.freeDays, total: m.totalDays };
}

/** Święta przypadające w sobotę (pracodawca oddaje za nie dzień wolny — art. 130 §2 KP). */
export function saturdayHolidays(year: number): string[] {
  const hs = holidaySet(year);
  return [...hs].filter((iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d)).getUTCDay() === 6; // sobota
  });
}

/** Kalendarzowe dni robocze (pon–pt bez świąt). */
export function calendarWorkingDays(year: number): number {
  return yearDays(year).filter((d) => !d.off).length;
}

/** Wymiar czasu pracy = kalendarzowe dni robocze pomniejszone o święta w soboty. */
export function laborWorkingDays(year: number): number {
  return calendarWorkingDays(year) - saturdayHolidays(year).length;
}

export type LongWeekend = { start: string; end: string; length: number };
export type BridgeDay = { bridge: string[]; vacationDays: number; blockLength: number; from: string; to: string };

/** Naturalne długie weekendy (≥3 kolejne dni wolne) w roku. */
export function getLongWeekends(year: number): LongWeekend[] {
  const days = yearDays(year);
  const result: LongWeekend[] = [];
  let i = 0;
  while (i < days.length) {
    if (days[i].off) {
      let j = i;
      while (j + 1 < days.length && days[j + 1].off) j++;
      const len = j - i + 1;
      if (len >= 3) result.push({ start: days[i].date, end: days[j].date, length: len });
      i = j + 1;
    } else i++;
  }
  return result;
}

/** „Dni do wzięcia" — pojedyncze/podwójne dni robocze między blokami wolnego (mostki). */
export function getBridgeDays(year: number): BridgeDay[] {
  const days = yearDays(year);
  const result: BridgeDay[] = [];
  let i = 0;
  while (i < days.length) {
    if (!days[i].off) {
      let j = i;
      while (j + 1 < days.length && !days[j + 1].off) j++;
      const workLen = j - i + 1;
      const leftOff = i > 0 && days[i - 1].off;
      const rightOff = j + 1 < days.length && days[j + 1].off;
      if (workLen <= 2 && leftOff && rightOff) {
        // policz długość bloku wolnego po wzięciu urlopu
        let a = i - 1;
        while (a - 1 >= 0 && days[a - 1].off) a--;
        let b = j + 1;
        while (b + 1 < days.length && days[b + 1].off) b++;
        const blockLength = b - a + 1;
        result.push({
          bridge: days.slice(i, j + 1).map((d) => d.date),
          vacationDays: workLen,
          blockLength,
          from: days[a].date,
          to: days[b].date,
        });
      }
      i = j + 1;
    } else i++;
  }
  return result;
}
