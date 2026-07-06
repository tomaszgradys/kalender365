import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { STATIC_YEARS, isValidYear, yearRobotsMeta} from "@/lib/months";
import { getTradingSundays } from "@/lib/astroYear";
import { formatISODatePL } from "@/lib/format";
import CalYearShell, { DataTable } from "@/components/CalYearShell";
import YearCalendarGrid, { type DayMark } from "@/components/YearCalendarGrid";
import { ogType } from "@/lib/ogType";

export const dynamicParams = true;
export function generateStaticParams() {
  return STATIC_YEARS.map((year) => ({ year: String(year) }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  const count = getTradingSundays(Number(year)).length;
  return {
    title: `Niedziele handlowe ${year} — pełna lista dat`,
    description: `Niedziele handlowe w ${year} roku (${count} dni): dokładne daty, kiedy zrobisz zakupy w niedzielę. Aktualna lista zgodna z ustawą o ograniczeniu handlu.`,
    alternates: { canonical: `/niedziele-handlowe/${year}` },
    ...ogType("niedziele-handlowe"),
    ...yearRobotsMeta(year),
  };
}

export default async function NiedzieleHandlowePage({ params }: { params: Promise<{ year: string }> }) {
  const { year: yp } = await params;
  const year = Number(yp);
  if (!isValidYear(year)) notFound();

  const sundays = getTradingSundays(year);
  const rows = sundays.map((d) => ({ label: formatISODatePL(d), value: "handlowa" }));

  const marks = new Map<string, DayMark>();
  for (const iso of sundays) {
    marks.set(iso, { cls: "bg-brand-green-500 font-bold text-white", title: "Niedziela handlowa" });
  }

  return (
    <CalYearShell
      slug="niedziele-handlowe"
      label="Niedziele handlowe"
      year={year}
      title={`Niedziele handlowe ${year}`}
      subtitle={`W ${year} roku wypada ${sundays.length} niedziel handlowych. To dni, w które sklepy mogą być otwarte.`}
      gradient="from-green-600 to-emerald-500"
    >
      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded bg-brand-green-500" /> niedziela handlowa
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded bg-slate-100 ring-1 ring-slate-200" /> pozostałe dni
        </span>
      </div>
      <div className="mt-3">
        <YearCalendarGrid year={year} marks={marks} />
      </div>

      <h2 className="mt-8 text-lg font-bold text-navy-800">Lista niedziel handlowych {year}</h2>
      <DataTable rows={rows} />
      {year < 2020 && (
        <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Uwaga: ograniczenie handlu w niedziele weszło w życie stopniowo w latach 2018–2020. Dla lat
          wcześniejszych powyższe daty mają charakter orientacyjny.
        </p>
      )}
      <p className="mt-4 text-sm text-slate-500">
        Zgodnie z ustawą handel w niedziele dozwolony jest m.in. w ostatnie niedziele stycznia,
        kwietnia, czerwca i sierpnia, w niedzielę przed Wielkanocą oraz w dwie niedziele przed Bożym
        Narodzeniem.
      </p>
    </CalYearShell>
  );
}
