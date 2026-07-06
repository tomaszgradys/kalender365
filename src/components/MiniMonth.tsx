import Link from "next/link";
import type { MonthData } from "@/lib/calendar";
import type { Locale } from "@/lib/months";
import { MONTH_NAMES, WEEKDAY_SHORT } from "@/lib/months";

export default function MiniMonth({
  data,
  locale,
  href,
  monthName,
  isBreak,
}: {
  data: MonthData;
  locale: Locale;
  href: string;
  monthName?: string;
  /** Dzień wolny od szkoły (wakacje / przerwy) — podświetlany bursztynowo. */
  isBreak?: (iso: string) => boolean;
}) {
  const label = monthName ?? MONTH_NAMES[locale][data.month];
  return (
    <Link
      href={href}
      className="block rounded-xl border border-slate-200 p-4 transition hover:border-navy-300 hover:shadow-sm"
    >
      <h3 className="mb-2 text-sm font-semibold text-slate-800">{label}</h3>
      <table className="w-full border-collapse text-center">
        <thead>
          <tr>
            {WEEKDAY_SHORT[locale].map((d) => (
              <th key={d} className="text-[10px] font-normal text-slate-500">
                {d[0]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((day) => {
                const brk = day.inCurrentMonth && !day.holiday && isBreak?.(day.date);
                return (
                  <td key={day.date} className="p-0">
                    <span
                      className={[
                        "block py-0.5 text-xs",
                        brk ? "rounded bg-amber-100" : "",
                        !day.inCurrentMonth
                          ? "text-slate-200"
                          : day.holiday
                            ? "font-semibold text-rose-600"
                            : day.isWeekend
                              ? "text-rose-400"
                              : "text-slate-600",
                      ].join(" ")}
                    >
                      {day.day}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </Link>
  );
}
