import { getPolishHolidays, type Holiday } from "./holidays";

export type MoonPhaseName =
  | "new"
  | "waxing-crescent"
  | "first-quarter"
  | "waxing-gibbous"
  | "full"
  | "waning-gibbous"
  | "last-quarter"
  | "waning-crescent";

export type MoonPhaseIcon = "🌑" | "🌒" | "🌓" | "🌔" | "🌕" | "🌖" | "🌗" | "🌘";

export type DayInfo = {
  date: string; // YYYY-MM-DD
  day: number;
  weekday: number; // 0=Monday .. 6=Sunday
  inCurrentMonth: boolean;
  isWeekend: boolean;
  isoWeek: number;
  holiday: Holiday | null;
  isNonWorking: boolean;
  moonPhase: MoonPhaseName;
  moonIcon: MoonPhaseIcon;
};

const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14); // 2000-01-06 18:14 UTC
const SYNODIC_MONTH_MS = 29.530588861 * 24 * 60 * 60 * 1000;

export function getMoonAge(date: Date): number {
  const diff = date.getTime() - KNOWN_NEW_MOON;
  const cycles = diff / SYNODIC_MONTH_MS;
  const fraction = cycles - Math.floor(cycles);
  return fraction * 29.530588861;
}

const MOON_PHASES: { max: number; name: MoonPhaseName; icon: MoonPhaseIcon }[] = [
  { max: 1.84566, name: "new", icon: "🌑" },
  { max: 5.53699, name: "waxing-crescent", icon: "🌒" },
  { max: 9.22831, name: "first-quarter", icon: "🌓" },
  { max: 12.91963, name: "waxing-gibbous", icon: "🌔" },
  { max: 16.61096, name: "full", icon: "🌕" },
  { max: 20.30228, name: "waning-gibbous", icon: "🌖" },
  { max: 23.99361, name: "last-quarter", icon: "🌗" },
  { max: 27.68493, name: "waning-crescent", icon: "🌘" },
  { max: 29.530588861, name: "new", icon: "🌑" },
];

export function getMoonPhase(date: Date): { name: MoonPhaseName; icon: MoonPhaseIcon; age: number } {
  const age = getMoonAge(date);
  const phase = MOON_PHASES.find((p) => age < p.max) ?? MOON_PHASES[MOON_PHASES.length - 1];
  return { name: phase.name, icon: phase.icon, age };
}

/** ISO 8601 week number for a UTC date. */
export function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = (d.getUTCDay() + 6) % 7; // Monday=0
  d.setUTCDate(d.getUTCDate() - dayNum + 3); // nearest Thursday
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const firstDayNum = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNum + 3);
  const diff = d.getTime() - firstThursday.getTime();
  return 1 + Math.round(diff / (7 * 24 * 60 * 60 * 1000));
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function toISODate(year: number, month0: number, day: number): string {
  return `${year}-${pad(month0 + 1)}-${pad(day)}`;
}

export type MonthData = {
  year: number;
  month: number; // 0-indexed
  weeks: DayInfo[][]; // each week is 7 DayInfo, Monday-first
  holidaysInMonth: Holiday[];
  nonWorkingCount: number;
  workingDaysCount: number;
  weekendDaysCount: number;
  firstWeekday: number; // 0=Monday
  daysInMonth: number;
  firstIsoWeek: number;
  lastIsoWeek: number;
  fullMoons: string[];
  newMoons: string[];
};

export function buildMonthData(year: number, month0: number): MonthData {
  const daysInMonth = new Date(Date.UTC(year, month0 + 1, 0)).getUTCDate();
  const holidays = getPolishHolidays(year);
  const holidayMap = new Map(holidays.map((h) => [h.date, h]));

  const firstOfMonth = new Date(Date.UTC(year, month0, 1));
  const firstWeekday = (firstOfMonth.getUTCDay() + 6) % 7; // Monday=0

  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
  const startOffset = -firstWeekday;

  const days: DayInfo[] = [];
  const fullMoons: string[] = [];
  const newMoons: string[] = [];

  for (let i = 0; i < totalCells; i++) {
    const dayOffset = startOffset + i;
    const date = new Date(Date.UTC(year, month0, 1 + dayOffset));
    const iso = date.toISOString().slice(0, 10);
    const weekday = (date.getUTCDay() + 6) % 7;
    const isWeekend = weekday === 5 || weekday === 6;
    const holiday = holidayMap.get(iso) ?? null;
    const inCurrentMonth = date.getUTCMonth() === month0 && date.getUTCFullYear() === year;
    const moon = getMoonPhase(date);

    days.push({
      date: iso,
      day: date.getUTCDate(),
      weekday,
      inCurrentMonth,
      isWeekend,
      isoWeek: getISOWeek(date),
      holiday,
      isNonWorking: isWeekend || (!!holiday && holiday.name.pl !== "Wielkanoc"),
      moonPhase: moon.name,
      moonIcon: moon.icon,
    });
  }

  const FULL_MOON_AGE = 14.7652944305;
  let prevAge = getMoonAge(new Date(Date.UTC(year, month0, 0, 12)));
  for (let d = 1; d <= daysInMonth; d++) {
    const currAge = getMoonAge(new Date(Date.UTC(year, month0, d, 12)));
    const iso = toISODate(year, month0, d);
    const prevIso = d - 1 >= 1 ? toISODate(year, month0, d - 1) : null;
    if (currAge < prevAge) {
      // age wrapped past 0 => new moon fell between prevAge and currAge
      const closerToPrev = 29.530588861 - prevAge < currAge;
      newMoons.push(closerToPrev && prevIso ? prevIso : iso);
    } else if (prevAge < FULL_MOON_AGE && currAge >= FULL_MOON_AGE) {
      const closerToPrev = FULL_MOON_AGE - prevAge < currAge - FULL_MOON_AGE;
      fullMoons.push(closerToPrev && prevIso ? prevIso : iso);
    }
    prevAge = currAge;
  }

  const weeks: DayInfo[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  const currentMonthDays = days.filter((d) => d.inCurrentMonth);
  const holidaysInMonth = holidays.filter((h) => {
    const [hy, hm] = h.date.split("-").map(Number);
    return hy === year && hm - 1 === month0 && h.name.pl !== "Wielkanoc";
  });
  const nonWorkingCount = currentMonthDays.filter((d) => d.isNonWorking).length;

  return {
    year,
    month: month0,
    weeks,
    holidaysInMonth,
    nonWorkingCount,
    workingDaysCount: daysInMonth - nonWorkingCount,
    weekendDaysCount: currentMonthDays.filter((d) => d.isWeekend).length,
    firstWeekday,
    daysInMonth,
    firstIsoWeek: currentMonthDays[0].isoWeek,
    lastIsoWeek: currentMonthDays[currentMonthDays.length - 1].isoWeek,
    fullMoons,
    newMoons,
  };
}

export type YearSummary = {
  year: number;
  holidaysCount: number;
  nonWorkingDaysCount: number;
  workingDaysCount: number;
  isLeap: boolean;
};

export function buildYearSummary(year: number): YearSummary {
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const daysInYear = isLeap ? 366 : 365;
  let nonWorking = 0;
  for (let m = 0; m < 12; m++) {
    const md = buildMonthData(year, m);
    nonWorking += md.nonWorkingCount;
  }
  const holidays = getPolishHolidays(year).filter((h) => h.name.pl !== "Wielkanoc");
  return {
    year,
    holidaysCount: holidays.length,
    nonWorkingDaysCount: nonWorking,
    workingDaysCount: daysInYear - nonWorking,
    isLeap,
  };
}

export { toISODate };
