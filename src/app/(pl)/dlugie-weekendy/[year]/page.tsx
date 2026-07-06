import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { STATIC_YEARS, isValidYear, yearRobotsMeta} from "@/lib/months";
import { getLongWeekends, getBridgeDays } from "@/lib/workdays";
import { formatISOFullPL, formatISODatePL } from "@/lib/format";
import CalYearShell from "@/components/CalYearShell";
import { ogType } from "@/lib/ogType";

export const dynamicParams = true;
export function generateStaticParams() {
  return STATIC_YEARS.map((year) => ({ year: String(year) }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  const lw = getLongWeekends(Number(year)).length;
  return {
    title: `Długie weekendy ${year} — wykaz i dni do wzięcia`,
    description: `Długie weekendy ${year} w Polsce (${lw}) oraz dni do wzięcia (mostki), dzięki którym zyskasz najwięcej wolnego przy minimalnym urlopie.`,
    alternates: { canonical: `/dlugie-weekendy/${year}` },
    ...ogType("dlugie-weekendy"),
    ...yearRobotsMeta(year),
  };
}

export default async function LongWeekendsPage({ params }: { params: Promise<{ year: string }> }) {
  const { year: yp } = await params;
  const year = Number(yp);
  if (!isValidYear(year)) notFound();

  const weekends = getLongWeekends(year);
  const bridges = getBridgeDays(year).sort((a, b) => b.blockLength / b.vacationDays - a.blockLength / a.vacationDays);

  return (
    <CalYearShell
      slug="dlugie-weekendy"
      label="Długie weekendy"
      year={year}
      title={`Długie weekendy ${year}`}
      subtitle={`W ${year} roku wypada ${weekends.length} długich weekendów. Poniżej także „dni do wzięcia" — mostki, które maksymalizują wolne przy minimalnym urlopie.`}
      gradient="from-navy-600 to-navy-800"
    >
      <Link
        href={`/planer-urlopu/${year}`}
        className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-green-100 bg-brand-green-50 p-4 transition hover:border-brand-green-300"
      >
        <span className="text-sm text-slate-700">
          <strong className="text-navy-800">🏖️ Planer urlopu {year}</strong> — podaj liczbę dni urlopu, a my
          ułożymy najlepszy plan wolnego (z wydrukiem PDF).
        </span>
        <span className="shrink-0 rounded-full bg-brand-green-600 px-4 py-2 text-sm font-semibold text-white">Zaplanuj urlop →</span>
      </Link>

      <div className="mt-4">
        <a href={`/api/ics/dlugie-weekendy/${year}`} className="inline-flex items-center gap-1 rounded-lg border border-brand-green-200 bg-brand-green-50 px-3 py-1.5 text-sm font-medium text-brand-green-700 hover:bg-brand-green-100">
          📅 Dodaj długie weekendy {year} do kalendarza (.ics)
        </a>
      </div>

      <section className="mt-6">
        <h2 className="mb-3 text-lg font-bold text-navy-800">Długie weekendy (≥3 dni wolne)</h2>
        <div className="space-y-2">
          {weekends.map((w) => (
            <div key={w.start} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <span className="text-sm text-slate-700">
                {formatISODatePL(w.start)} – {formatISODatePL(w.end)}
              </span>
              <span className="rounded-full bg-brand-green-50 px-3 py-1 text-sm font-semibold text-brand-green-700">
                {w.length} dni wolnego
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-1 text-lg font-bold text-navy-800">Dni do wzięcia (mostki)</h2>
        <p className="mb-3 text-sm text-slate-500">Weź urlop w te dni robocze, aby połączyć wolne w długi blok.</p>
        <div className="space-y-2">
          {bridges.map((b) => (
            <div key={b.bridge.join()} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm text-slate-700">
                  Urlop: <strong>{b.bridge.map((d) => formatISOFullPL(d)).join(", ")}</strong>
                </span>
                <span className="rounded-full bg-navy-50 px-3 py-1 text-sm font-semibold text-navy-700">
                  {b.vacationDays} dzień urlopu → {b.blockLength} dni wolnego
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Wolne od {formatISODatePL(b.from)} do {formatISODatePL(b.to)}.
              </p>
            </div>
          ))}
        </div>
      </section>
    </CalYearShell>
  );
}
