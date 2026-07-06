import { MONTH_NAMES, WEEKDAY_NAMES } from "@/lib/months";
import { getISOWeek, getMoonPhase } from "@/lib/calendar";
import { getNameDays } from "@/lib/nameDays";
import { getProverb, dayOfYear } from "@/lib/observances";
import { getSunTimes, getMoonTimes } from "@/lib/astro";
import { getPolishHolidays } from "@/lib/holidays";
import { MOON_PHASE_PL, getZodiac } from "@/lib/dayInfo";
import { url } from "@/lib/urls";
import TearOffCalendarClient, { type DayData } from "@/components/TearOffCalendarClient";

// Liczy dane jednej kartki (jeden dzień) — wszystko serializowalne dla klienta.
function computeDay(d: Date): DayData {
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth();
  const day = d.getUTCDate();
  const weekdayIdx = (d.getUTCDay() + 6) % 7;
  const isSunday = weekdayIdx === 6;

  const doy = dayOfYear(y, m, day);
  const isLeap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  const remaining = (isLeap ? 366 : 365) - doy;
  const week = getISOWeek(d);

  const names = getNameDays(m, day);
  const proverb = getProverb(m, day);
  const sun = getSunTimes(y, m, day);
  const moon = getMoonTimes(y, m, day);
  const moonPhase = getMoonPhase(new Date(Date.UTC(y, m, day, 12)));
  const zodiac = getZodiac(m, day);
  const iso = `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const holiday = getPolishHolidays(y).find((h) => h.date === iso);

  return {
    day,
    monthIndex: m,
    year: y,
    weekdayName: WEEKDAY_NAMES.pl[weekdayIdx],
    monthName: MONTH_NAMES.pl[m],
    doy,
    remaining,
    week,
    isRed: isSunday || !!holiday,
    sunrise: sun.sunrise,
    sunset: sun.sunset,
    moonrise: moon.moonrise,
    moonIcon: moonPhase.icon,
    moonPhase: MOON_PHASE_PL[moonPhase.name],
    zodiacSymbol: zodiac.symbol,
    zodiacName: zodiac.name,
    names,
    proverb,
    holiday: holiday ? holiday.name.pl : null,
    href: url.day(y, m, day),
  };
}

// Kartka z kalendarza odrywanego (zdzierak). Liczymy kolejne dni, aby po kliknięciu
// zagiętego rogu można było „zrywać" kartki do przodu z ładną animacją.
export default function TearOffCalendar({
  year,
  monthIndex,
  day,
}: {
  year: number;
  monthIndex: number;
  day: number;
}) {
  const base = new Date(Date.UTC(year, monthIndex, day));
  const BACK = 14;
  const FWD = 14;
  const days: DayData[] = [];
  for (let i = -BACK; i <= FWD; i++) {
    const d = new Date(base);
    d.setUTCDate(base.getUTCDate() + i);
    days.push(computeDay(d));
  }
  // startIndex wskazuje na „dzisiaj" (po BACK dniach wstecz).
  return <TearOffCalendarClient days={days} startIndex={BACK} />;
}
