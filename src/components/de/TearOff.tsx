import { MONTH_NAMES_DE, WEEKDAY_NAMES_DE } from "@/lib/de/locale";
import { isoWeekOf } from "@/lib/de/now";
import { getSunTimes } from "@/lib/de/sun";
import { getMoonrise, getMoonPhaseDE } from "@/lib/de/moon";
import { getZodiacDE } from "@/lib/de/zodiac";
import { getNamenstage } from "@/lib/de/namenstage";
import { getBauernregel } from "@/lib/de/bauernregeln";
import { getAllFeiertage } from "@/lib/de/feiertage";
import TearOffClient, { type DayData } from "@/components/de/TearOffClient";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

// Nationwide holidays only — the homepage card can't know the visitor's Bundesland.
function nationalHolidayName(year: number, iso: string): string | null {
  const h = getAllFeiertage(year).find((x) => x.date === iso && x.scope === "national");
  return h ? h.name : null;
}

function computeDay(d: Date): DayData {
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth();
  const day = d.getUTCDate();
  const weekdayIdx = (d.getUTCDay() + 6) % 7; // Mon=0
  const isSunday = weekdayIdx === 6;

  const doy = Math.floor((Date.UTC(y, m, day) - Date.UTC(y, 0, 1)) / 86400000) + 1;
  const isLeap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  const remaining = (isLeap ? 366 : 365) - doy;
  const { week } = isoWeekOf(y, m, day);

  const iso = `${y}-${pad(m + 1)}-${pad(day)}`;
  const holiday = nationalHolidayName(y, iso);
  const sun = getSunTimes(y, m, day);
  const moon = getMoonPhaseDE(new Date(Date.UTC(y, m, day, 12)));
  const zodiac = getZodiacDE(m, day);

  return {
    day,
    monthIndex: m,
    year: y,
    weekdayName: WEEKDAY_NAMES_DE[weekdayIdx],
    monthName: MONTH_NAMES_DE[m],
    doy,
    remaining,
    week,
    isRed: isSunday || !!holiday,
    sunrise: sun.sunrise,
    sunset: sun.sunset,
    moonrise: getMoonrise(y, m, day),
    moonIcon: moon.icon,
    moonPhase: moon.label,
    zodiacSymbol: zodiac.symbol,
    zodiacName: zodiac.name,
    names: getNamenstage(m, day),
    proverb: getBauernregel(m, day),
    holiday,
    href: `/kalenderblatt/${iso}`,
  };
}

/** Daily tear-off calendar card. Precomputes a window of days so the corner can
 *  "tear off" forward/back with the same animation as the PL original. */
export default function TearOff({ year, monthIndex, day }: { year: number; monthIndex: number; day: number }) {
  const base = new Date(Date.UTC(year, monthIndex, day));
  const BACK = 14;
  const FWD = 14;
  const days: DayData[] = [];
  for (let i = -BACK; i <= FWD; i++) {
    const d = new Date(base);
    d.setUTCDate(base.getUTCDate() + i);
    days.push(computeDay(d));
  }
  return <TearOffClient days={days} startIndex={BACK} />;
}
