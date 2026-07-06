import Link from "next/link";
import type { MonthData } from "@/lib/calendar";
import type { Locale } from "@/lib/months";
import { WEEKDAY_SHORT } from "@/lib/months";

export default function CalendarGrid({
  data,
  locale,
  showMoon = true,
  dayHref,
  isBreak,
}: {
  data: MonthData;
  locale: Locale;
  showMoon?: boolean;
  dayHref?: (day: number) => string;
  /** Dzień wolny od szkoły (wakacje/ferie/przerwy) — podświetlenie bursztynowe. */
  isBreak?: (iso: string) => boolean;
}) {
  const fullMoonSet = new Set(data.fullMoons);
  const newMoonSet = new Set(data.newMoons);

  // Kolor kółka dnia: święto (rose) > wolne od szkoły (amber) > weekend > zwykły.
  const dayColor = (day: MonthData["weeks"][number][number]) => {
    if (day.holiday) return "bg-rose-100 font-semibold text-rose-700";
    if (day.inCurrentMonth && isBreak?.(day.date)) return "bg-amber-100 text-amber-800";
    if (day.isWeekend) return "text-rose-500";
    return "text-slate-700";
  };

  return (
    <table className="w-full border-collapse text-center select-none">
      <thead>
        <tr>
          <th className="w-8 py-2 text-xs font-medium text-slate-500">Tt</th>
          {WEEKDAY_SHORT[locale].map((d) => (
            <th key={d} className="py-2 text-xs font-medium text-slate-500 uppercase tracking-wide">
              {d}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.weeks.map((week, wi) => (
          <tr key={wi} className="border-t border-slate-100">
            <td className="py-3 text-xs text-slate-500">{week[0].isoWeek}</td>
            {week.map((day) => (
              <td
                key={day.date}
                className={[
                  "py-3 align-top",
                  day.inCurrentMonth ? "" : "opacity-25",
                ].join(" ")}
              >
                {day.inCurrentMonth && dayHref ? (
                  <Link
                    href={dayHref(day.day)}
                    className={`mx-auto flex h-9 w-9 flex-col items-center justify-center rounded-full text-sm transition hover:bg-navy-100 hover:text-navy-700 ${dayColor(day)}`}
                    title={day.holiday ? day.holiday.name[locale] : undefined}
                  >
                    {day.day}
                  </Link>
                ) : (
                  <div
                    className={`mx-auto flex h-9 w-9 flex-col items-center justify-center rounded-full text-sm ${dayColor(day)}`}
                    title={day.holiday ? day.holiday.name[locale] : undefined}
                  >
                    {day.day}
                  </div>
                )}
                {showMoon && (fullMoonSet.has(day.date) || newMoonSet.has(day.date)) && (
                  <div className="mt-0.5 text-[10px] leading-none">
                    {fullMoonSet.has(day.date) ? "🌕" : "🌑"}
                  </div>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
