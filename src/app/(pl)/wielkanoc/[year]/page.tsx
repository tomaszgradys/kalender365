import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { STATIC_YEARS, isValidYear, yearRobotsMeta} from "@/lib/months";
import { getMovableFeasts, easterSunday } from "@/lib/holidays";
import { formatISOFullPL, formatISODatePL } from "@/lib/format";
import CalYearShell, { DataTable } from "@/components/CalYearShell";
import { ogType } from "@/lib/ogType";

export const dynamicParams = true;
export function generateStaticParams() {
  return STATIC_YEARS.map((year) => ({ year: String(year) }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  const easter = easterSunday(Number(year)).toISOString().slice(0, 10);
  return {
    title: `Wielkanoc ${year} — kiedy wypada? Data i święta ruchome`,
    description: `Wielkanoc ${year} wypada ${formatISODatePL(easter)}. Sprawdź daty tłustego czwartku, środy popielcowej, Bożego Ciała i pozostałych świąt ruchomych.`,
    alternates: { canonical: `/wielkanoc/${year}` },
    ...ogType("wielkanoc"),
    ...yearRobotsMeta(year),
  };
}

export default async function WielkanocPage({ params }: { params: Promise<{ year: string }> }) {
  const { year: yp } = await params;
  const year = Number(yp);
  if (!isValidYear(year)) notFound();

  const feasts = getMovableFeasts(year);
  const easter = easterSunday(year).toISOString().slice(0, 10);
  const rows = feasts.map((f) => ({
    label: f.name,
    value: formatISOFullPL(f.date),
    highlight: f.name.startsWith("Wielkanoc"),
  }));

  return (
    <CalYearShell
      slug="wielkanoc"
      label="Wielkanoc"
      year={year}
      title={`Wielkanoc ${year}`}
      subtitle={`W ${year} roku Niedziela Wielkanocna wypada ${formatISODatePL(easter)}. Poniżej wszystkie święta ruchome zależne od daty Wielkanocy.`}
      gradient="from-amber-500 to-yellow-400"
    >
      <DataTable rows={rows} />
      <p className="mt-4 text-sm text-slate-500">
        Data Wielkanocy wyznaczana jest jako pierwsza niedziela po pierwszej wiosennej pełni księżyca
        i może przypadać między 22 marca a 25 kwietnia.
      </p>
    </CalYearShell>
  );
}
