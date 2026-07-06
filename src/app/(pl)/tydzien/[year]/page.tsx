import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { STATIC_YEARS, isValidYear, isNavigableYear, yearRobotsMeta } from "@/lib/months";
import { getISOWeekRange, isoWeeksInYear, formatDateShort, formatDatePL } from "@/lib/weeks";
import { warsawISOWeek } from "@/lib/now";
import PageWithSidebar from "@/components/PageWithSidebar";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import FaqSection from "@/components/FaqSection";
import TableExport from "@/components/TableExport";

export const dynamicParams = true;
export function generateStaticParams() {
  return STATIC_YEARS.map((year) => ({ year: String(year) }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  const y = Number(year);
  return {
    title: `Numery tygodni ${y} — tabela tygodni kalendarzowych ISO`,
    description: `Wszystkie tygodnie ${y} roku z datami od poniedziałku do niedzieli. Sprawdź, który to tydzień i pobierz tabelę tygodni do Excela.`,
    alternates: { canonical: `/tydzien/${y}` },
    ...yearRobotsMeta(y),
  };
}

export default async function WeeksYearPage({ params }: { params: Promise<{ year: string }> }) {
  const { year: yp } = await params;
  const year = Number(yp);
  if (!isValidYear(year)) notFound();

  const count = isoWeeksInYear(year);
  const now = warsawISOWeek();
  const weeks = Array.from({ length: count }, (_, i) => {
    const w = i + 1;
    const r = getISOWeekRange(year, w);
    return { w, start: r.start, end: r.end, current: now.isoYear === year && now.week === w };
  });

  const rows = weeks.map((x) => [String(x.w), formatDatePL(x.start), formatDatePL(x.end)]);
  const prev = year - 1;
  const next = year + 1;

  const faq = [
    {
      q: `Ile tygodni ma ${year} rok?`,
      a: `${year} rok ma ${count} tygodni kalendarzowych według normy ISO 8601. Tydzień zaczyna się w poniedziałek i kończy w niedzielę.`,
    },
    {
      q: `Jak sprawdzić, który to tydzień?`,
      a: `Znajdź dzisiejszą datę w tabeli — wiersz z zakresem obejmującym dziś to bieżący tydzień (jest podświetlony). Numer tygodnia przydaje się w pracy, logistyce i planowaniu.`,
    },
    {
      q: `Od czego zależy pierwszy tydzień roku?`,
      a: `Pierwszym tygodniem ISO jest ten, który zawiera pierwszy czwartek stycznia (obejmuje co najmniej 4 dni nowego roku). Dlatego czasem 1 stycznia należy jeszcze do ostatniego tygodnia poprzedniego roku.`,
    },
  ];

  return (
    <PageWithSidebar>
      <BreadcrumbJsonLd
        items={[
          { name: "Kalendarz.pro", path: "/" },
          { name: "Numery tygodni", path: `/tydzien/${year}` },
          { name: String(year), path: `/tydzien/${year}` },
        ]}
      />
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-navy-600">Kalendarz.pro</Link> / Numery tygodni / {year}
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">Numery tygodni {year}</h1>
        <div className="flex items-center gap-2 text-sm">
          {isNavigableYear(prev) && (
            <Link href={`/tydzien/${prev}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-600 hover:border-navy-300 hover:text-navy-600">← {prev}</Link>
          )}
          {isNavigableYear(next) && (
            <Link href={`/tydzien/${next}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-600 hover:border-navy-300 hover:text-navy-600">{next} →</Link>
          )}
        </div>
      </div>

      <p className="mt-3 max-w-2xl text-slate-600">
        {year} rok ma {count} tygodni kalendarzowych (ISO 8601). Poniżej pełna tabela — od poniedziałku do
        niedzieli. Bieżący tydzień jest podświetlony. Tabelę możesz skopiować lub pobrać do Excela.
      </p>

      {now.isoYear === year && (() => {
        const cw = weeks.find((x) => x.current);
        if (!cw) return null;
        return (
          <div className="mt-5 flex items-center gap-4 rounded-2xl border border-brand-green-100 bg-brand-green-50 p-4 sm:p-5">
            <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-green-600 text-white sm:h-20 sm:w-20">
              <span className="text-[10px] font-semibold uppercase tracking-wider">tydzień</span>
              <span className="text-3xl font-black leading-none sm:text-4xl">{cw.w}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-green-700">Teraz trwa</p>
              <p className="text-lg font-bold text-navy-800 sm:text-xl">{cw.w}. tydzień {year}</p>
              <p className="text-sm text-slate-600">{formatDatePL(cw.start)} – {formatDatePL(cw.end)}</p>
            </div>
          </div>
        );
      })()}

      <div className="mt-5">
        <TableExport headers={["Tydzień", "Od (poniedziałek)", "Do (niedziela)"]} rows={rows} filename={`numery-tygodni-${year}`} />
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-navy-50 text-left text-navy-800">
              <th className="px-4 py-2.5 font-semibold">Tydzień</th>
              <th className="px-4 py-2.5 font-semibold">Od (poniedziałek)</th>
              <th className="px-4 py-2.5 font-semibold">Do (niedziela)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {weeks.map((x) => (
              <tr key={x.w} className={x.current ? "bg-brand-green-50" : ""}>
                <td className="px-4 py-2.5 font-semibold">
                  <Link href={`/tydzien/${year}/${x.w}`} className={x.current ? "text-brand-green-700" : "text-navy-700 hover:text-brand-green-600"}>
                    {x.w}{x.current ? " · teraz" : ""}
                  </Link>
                </td>
                <td className="px-4 py-2.5 text-slate-600">{formatDateShort(x.start)}</td>
                <td className="px-4 py-2.5 text-slate-600">{formatDateShort(x.end)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <FaqSection items={faq} />

      <div className="mt-10 flex items-center justify-between">
        {isNavigableYear(prev) ? (
          <Link href={`/tydzien/${prev}`} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:border-navy-300 hover:text-navy-600">← Tygodnie {prev}</Link>
        ) : <span />}
        {isNavigableYear(next) ? (
          <Link href={`/tydzien/${next}`} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:border-navy-300 hover:text-navy-600">Tygodnie {next} →</Link>
        ) : <span />}
      </div>
    </PageWithSidebar>
  );
}
