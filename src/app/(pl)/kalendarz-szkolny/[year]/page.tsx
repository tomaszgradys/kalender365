import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { STATIC_YEARS, isValidYear, yearRobotsMeta} from "@/lib/months";
import { getSchoolYear, getFerie, schoolYearStart, schoolYearEnd } from "@/lib/school";
import { getPolishHolidays, easterSunday } from "@/lib/holidays";
import CalYearShell, { DataTable } from "@/components/CalYearShell";
import YearCalendarGrid, { type DayMark } from "@/components/YearCalendarGrid";
import { ogType } from "@/lib/ogType";

function isoOf(d: Date) {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}
// Zaznacza zakres dat [startIso..endIso] danym stylem (bez nadpisywania już ustawionych).
function markRange(marks: Map<string, DayMark>, startIso: string, endIso: string, mark: DayMark) {
  const d = new Date(`${startIso}T00:00:00Z`);
  const end = new Date(`${endIso}T00:00:00Z`);
  while (d.getTime() <= end.getTime()) {
    const iso = isoOf(d);
    if (!marks.has(iso)) marks.set(iso, mark);
    d.setUTCDate(d.getUTCDate() + 1);
  }
}

export const dynamicParams = true;
export function generateStaticParams() {
  return STATIC_YEARS.map((year) => ({ year: String(year) }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  const y = Number(year);
  return {
    title: `Kalendarz szkolny ${y}/${y + 1} — ferie i terminy`,
    description: `Kalendarz roku szkolnego ${y}/${y + 1}: rozpoczęcie zajęć, przerwy świąteczne, ferie zimowe i zakończenie roku szkolnego. Wszystkie ważne terminy.`,
    alternates: { canonical: `/kalendarz-szkolny/${y}` },
    ...ogType("kalendarz-szkolny"),
    ...yearRobotsMeta(y),
  };
}

export default async function SchoolPage({ params }: { params: Promise<{ year: string }> }) {
  const { year: yp } = await params;
  const year = Number(yp);
  if (!isValidYear(year)) notFound();

  const milestones = getSchoolYear(year);
  const ferie = getFerie(year + 1);

  // Zaznaczenia na kalendarzu roku szkolnego (wrzesień year → sierpień year+1).
  const marks = new Map<string, DayMark>();
  const green = "bg-brand-green-500 font-bold text-white";
  const amber = "bg-amber-200 font-semibold text-amber-800";
  const red = "bg-rose-100 font-semibold text-rose-600";

  // Start i koniec roku szkolnego (najważniejsze — mają pierwszeństwo).
  marks.set(schoolYearStart(year), { cls: green, title: "Rozpoczęcie roku szkolnego" });
  marks.set(schoolYearEnd(year + 1), { cls: green, title: "Zakończenie roku szkolnego" });

  // Przerwy świąteczne (wolne od zajęć).
  markRange(marks, `${year}-12-23`, `${year + 1}-01-01`, { cls: amber, title: "Zimowa przerwa świąteczna" });
  const easter = easterSunday(year + 1);
  const springStart = new Date(easter); springStart.setUTCDate(easter.getUTCDate() - 3);
  const springEnd = new Date(easter); springEnd.setUTCDate(easter.getUTCDate() + 1);
  markRange(marks, isoOf(springStart), isoOf(springEnd), { cls: amber, title: "Wiosenna przerwa świąteczna" });

  // Święta ustawowo wolne w obu latach (czerwone) — nie nadpisują przerw ani startu/końca.
  for (const h of [...getPolishHolidays(year), ...getPolishHolidays(year + 1)]) {
    if (!marks.has(h.date)) marks.set(h.date, { cls: red, title: h.name.pl });
  }

  return (
    <CalYearShell
      slug="kalendarz-szkolny"
      label="Kalendarz szkolny"
      year={year}
      title={`Kalendarz szkolny ${year}/${year + 1}`}
      subtitle={`Najważniejsze terminy roku szkolnego ${year}/${year + 1}: rozpoczęcie, przerwy świąteczne, ferie i zakończenie zajęć.`}
      gradient="from-navy-600 to-navy-800"
    >
      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded bg-brand-green-500" /> rozpoczęcie / zakończenie roku</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded bg-amber-200" /> przerwy świąteczne (wolne)</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded bg-rose-100 ring-1 ring-rose-200" /> święta i dni wolne</span>
      </div>
      <div className="mt-3">
        <YearCalendarGrid year={year} marks={marks} startMonth={8} showYear />
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Kalendarz obejmuje rok szkolny {year}/{year + 1} (wrzesień–sierpień). Ferie zimowe zależą od
        województwa — dokładne terminy poniżej.
      </p>

      <h2 className="mt-8 text-lg font-bold text-navy-800">Najważniejsze terminy</h2>
      <DataTable rows={milestones.map((m) => ({ label: m.label + (m.note ? ` (${m.note})` : ""), value: m.value }))} />

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold text-slate-800">Ferie zimowe {year + 1}</h2>
        {ferie ? (
          <div className="space-y-2">
            {ferie.map((t) => (
              <div key={t.dates} className="rounded-2xl border border-slate-200 p-4">
                <div className="font-semibold text-slate-800">{t.dates}</div>
                <div className="mt-1 text-sm text-slate-500">{t.regions.join(", ")}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Dokładne terminy ferii zimowych {year + 1} ustala Ministerstwo Edukacji i są ogłaszane co
            roku w podziale na województwa.
          </p>
        )}
      </section>

      <section className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-brand-green-100 bg-brand-green-50 p-5">
        <div>
          <h2 className="text-lg font-bold text-navy-800">Stwórz własny plan lekcji</h2>
          <p className="mt-1 text-sm text-slate-600">
            Ułóż plan lekcji z przedmiotami, salami i kolorami, dodaj własne zdjęcie i pobierz PDF.
          </p>
        </div>
        <Link
          href="/plan-lekcji"
          className="rounded-full bg-brand-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-green-700"
        >
          Otwórz generator planu lekcji →
        </Link>
      </section>
    </CalYearShell>
  );
}
