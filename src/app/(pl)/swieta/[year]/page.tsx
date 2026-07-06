import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { STATIC_YEARS, isValidYear, yearRobotsMeta} from "@/lib/months";
import { getPolishHolidays } from "@/lib/holidays";
import { formatISOFullPL } from "@/lib/format";
import CalYearShell, { DataTable } from "@/components/CalYearShell";
import { ogType } from "@/lib/ogType";

export const dynamicParams = true;
export function generateStaticParams() {
  return STATIC_YEARS.map((year) => ({ year: String(year) }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  return {
    title: `Kalendarz świąt ${year} — wszystkie święta i dni wolne`,
    description: `Wszystkie święta w ${year} roku: państwowe, kościelne i ruchome wraz z datami i dniami tygodnia. Sprawdź, które są ustawowo wolne od pracy.`,
    alternates: { canonical: `/swieta/${year}` },
    ...ogType("swieta"),
    ...yearRobotsMeta(year),
  };
}

export default async function SwietaPage({ params }: { params: Promise<{ year: string }> }) {
  const { year: yp } = await params;
  const year = Number(yp);
  if (!isValidYear(year)) notFound();

  const holidays = getPolishHolidays(year);
  const rows = holidays.map((h) => ({
    label: h.name.pl,
    value: formatISOFullPL(h.date),
  }));

  return (
    <CalYearShell
      slug="swieta"
      label="Kalendarz świąt"
      year={year}
      title={`Kalendarz świąt ${year}`}
      subtitle="Święta państwowe, kościelne i ruchome wraz z datami. Pogrubione są dni ustawowo wolne od pracy."
      gradient="from-rose-600 to-orange-500"
    >
      <DataTable rows={rows} />
      <p className="mt-4 text-sm text-slate-500">
        Wszystkie wymienione święta (poza samą Niedzielą Wielkanocną, która i tak wypada w niedzielę)
        są dniami ustawowo wolnymi od pracy w Polsce.
      </p>
    </CalYearShell>
  );
}
