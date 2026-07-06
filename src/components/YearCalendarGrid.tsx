import { buildMonthData } from "@/lib/calendar";
import { MONTH_NAMES, WEEKDAY_SHORT } from "@/lib/months";

// Roczny kalendarz 12 miesięcy w układzie jak w planerze urlopu, ale bez interakcji.
// Zamiast „bajerów" po prostu wyróżnia wskazane dni (mapa marks: iso -> styl/symbol).

export type DayMark = { cls?: string; symbol?: string; title?: string };

export default function YearCalendarGrid({
  year,
  marks,
  weekendMuted = true,
  startMonth = 0,
  showYear = false,
}: {
  year: number;
  marks: Map<string, DayMark>;
  weekendMuted?: boolean;
  // Miesiąc startowy (0–11). Domyślnie styczeń. Dla kalendarza szkolnego = 8 (wrzesień),
  // wtedy siatka przechodzi płynnie w rok następny.
  startMonth?: number;
  // Pokaż rok obok nazwy miesiąca (przydatne, gdy siatka obejmuje dwa lata).
  showYear?: boolean;
}) {
  const months = Array.from({ length: 12 }, (_, i) => {
    const abs = startMonth + i;
    const y = year + Math.floor(abs / 12);
    const m = ((abs % 12) + 12) % 12;
    return { md: buildMonthData(y, m), m, y };
  });
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {months.map(({ md, m, y }) => (
        <div key={`${y}-${m}`} className="rounded-2xl border border-slate-200 bg-white p-3">
          <h3 className="mb-1 text-sm font-semibold text-navy-800">
            {MONTH_NAMES.pl[m]}{showYear ? ` ${y}` : ""}
          </h3>
          <table className="w-full table-fixed border-collapse text-center">
            <thead>
              <tr>
                {WEEKDAY_SHORT.pl.map((d, i) => (
                  <th key={i} className="pb-1 text-[10px] font-normal text-slate-400">{d[0]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {md.weeks.map((week, wi) => (
                <tr key={wi}>
                  {week.map((day) => {
                    if (!day.inCurrentMonth) return <td key={day.date} className="p-px" />;
                    const mk = marks.get(day.date);
                    let cls = "text-slate-700";
                    if (mk?.cls) cls = mk.cls;
                    else if (weekendMuted && day.isWeekend) cls = "text-slate-400";
                    return (
                      <td key={day.date} className="p-px">
                        <div
                          title={mk?.title ?? day.date}
                          className={`flex aspect-square w-full flex-col items-center justify-center gap-px rounded-md leading-none ${cls}`}
                        >
                          {mk?.symbol && <span className="text-[15px] leading-none">{mk.symbol}</span>}
                          <span className={mk?.symbol ? "text-[9px]" : "text-[11px]"}>{day.day}</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
