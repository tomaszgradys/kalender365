import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { STATIC_YEARS, isValidYear, MONTH_NAMES, yearRobotsMeta} from "@/lib/months";
import { getMoonPhaseInstants, type MoonPhaseInstant } from "@/lib/moonPhases";
import { formatISOFullPL } from "@/lib/format";
import CalYearShell from "@/components/CalYearShell";
import YearCalendarGrid, { type DayMark } from "@/components/YearCalendarGrid";
import { ogType } from "@/lib/ogType";

export const dynamicParams = true;
export function generateStaticParams() {
  return STATIC_YEARS.map((year) => ({ year: String(year) }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  return {
    title: `Fazy księżyca ${year} — nów, pełnia i kwadry (godziny)`,
    description: `Kalendarz faz księżyca ${year}: dokładne daty i godziny nowiu, pierwszej kwadry, pełni i ostatniej kwadry (czas dla Polski) wraz ze znakiem zodiaku Księżyca.`,
    alternates: { canonical: `/fazy-ksiezyca/${year}` },
    ...ogType("fazy-ksiezyca"),
    ...yearRobotsMeta(year),
  };
}

export default async function FazyKsiezycaPage({ params }: { params: Promise<{ year: string }> }) {
  const { year: yp } = await params;
  const year = Number(yp);
  if (!isValidYear(year)) notFound();

  const phases = getMoonPhaseInstants(year);
  const byMonth: Record<number, MoonPhaseInstant[]> = {};
  for (const p of phases) {
    const m = Number(p.date.split("-")[1]) - 1;
    (byMonth[m] ??= []).push(p);
  }
  const fullCount = phases.filter((p) => p.type === "full").length;

  const marks = new Map<string, DayMark>();
  for (const p of phases) {
    const cls =
      p.type === "full"
        ? "bg-amber-100 font-semibold text-amber-800"
        : p.type === "new"
          ? "bg-slate-200 font-semibold text-slate-700"
          : "bg-navy-50 font-semibold text-navy-700";
    marks.set(p.date, { cls, symbol: p.icon, title: p.label });
  }

  return (
    <CalYearShell
      slug="fazy-ksiezyca"
      label="Fazy księżyca"
      year={year}
      title={`Fazy księżyca ${year}`}
      subtitle={`W ${year} roku wystąpi ${fullCount} pełni. Poniżej wszystkie główne fazy księżyca miesiąc po miesiącu — z dokładną godziną (czas dla Polski) i znakiem zodiaku Księżyca.`}
      gradient="from-navy-700 to-navy-900"
    >
      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1.5"><span className="text-sm">🌑</span> Nów</span>
        <span className="inline-flex items-center gap-1.5"><span className="text-sm">🌓</span> Pierwsza kwadra</span>
        <span className="inline-flex items-center gap-1.5"><span className="text-sm">🌕</span> Pełnia</span>
        <span className="inline-flex items-center gap-1.5"><span className="text-sm">🌗</span> Ostatnia kwadra</span>
      </div>
      <div className="mt-3">
        <YearCalendarGrid year={year} marks={marks} />
      </div>

      <h2 className="mt-8 text-lg font-bold text-navy-800">Fazy miesiąc po miesiącu</h2>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Array.from({ length: 12 }, (_, m) => (
          <div key={m} className="rounded-2xl border border-slate-200 p-4">
            <h3 className="mb-2 text-sm font-semibold text-slate-800">{MONTH_NAMES.pl[m]}</h3>
            <ul className="space-y-1.5 text-sm text-slate-600">
              {(byMonth[m] ?? []).map((p) => (
                <li key={`${p.date}-${p.type}`} className="flex items-center gap-2">
                  <span className="text-base">{p.icon}</span>
                  <span className="w-24 shrink-0 text-slate-500">{p.label}</span>
                  <span className="font-mono text-slate-700">{p.date.split("-").reverse().join(".")} {p.time}</span>
                  <span className="ml-auto flex items-center gap-1 text-xs text-slate-500" title={`Księżyc w znaku: ${p.zodiacSign}`}>
                    {p.zodiacSymbol} {p.zodiacSign}
                  </span>
                  {p.blueMoon && (
                    <span className="rounded-full bg-navy-600 px-1.5 py-0.5 text-[10px] font-semibold text-white" title="Druga pełnia w tym miesiącu">
                      Blue Moon
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-slate-500">
        🌑 Nów · 🌓 Pierwsza kwadra · 🌕 Pełnia · 🌗 Ostatnia kwadra. Godziny obliczamy algorytmem Meeusa
        (dokładność ~1 min) i podajemy w czasie urzędowym dla Polski, z uwzględnieniem czasu letniego i
        zimowego. „Blue Moon" to druga pełnia w tym samym miesiącu kalendarzowym.
      </p>
      <p className="sr-only">
        {phases.map((p) => `${p.label}: ${formatISOFullPL(p.date)}, godz. ${p.time}, Księżyc w znaku ${p.zodiacSign}. `).join("")}
      </p>
    </CalYearShell>
  );
}
