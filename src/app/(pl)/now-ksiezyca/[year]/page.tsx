import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { STATIC_YEARS, isValidYear, yearRobotsMeta} from "@/lib/months";
import { getMoonPhaseInstants } from "@/lib/moonPhases";
import { formatISOFullPL } from "@/lib/format";
import CalYearShell, { DataTable } from "@/components/CalYearShell";
import { ogType } from "@/lib/ogType";

export const dynamicParams = true;
export function generateStaticParams() {
  return STATIC_YEARS.map((year) => ({ year: String(year) }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  const n = getMoonPhaseInstants(Number(year)).filter((p) => p.type === "new").length;
  return {
    title: `Nów księżyca ${year} — daty i godziny wszystkich nowi`,
    description: `Kalendarz nowiu księżyca ${year}: ${n} nowi w roku z dokładną datą, godziną (czas dla Polski) i znakiem zodiaku Księżyca. Sprawdź, kiedy wypada najbliższy nów.`,
    alternates: { canonical: `/now-ksiezyca/${year}` },
    ...ogType("now-ksiezyca"),
    ...yearRobotsMeta(year),
  };
}

export default async function NowPage({ params }: { params: Promise<{ year: string }> }) {
  const { year: yp } = await params;
  const year = Number(yp);
  if (!isValidYear(year)) notFound();
  const news = getMoonPhaseInstants(year).filter((p) => p.type === "new");

  return (
    <CalYearShell
      slug="now-ksiezyca"
      label="Nów księżyca"
      year={year}
      title={`Nów księżyca ${year}`}
      subtitle={`W ${year} roku wystąpi ${news.length} nowi księżyca. Poniżej data, dokładna godzina (czas dla Polski) i znak zodiaku Księżyca dla każdego nowiu.`}
      gradient="from-navy-800 to-navy-900"
    >
      <DataTable
        rows={news.map((p) => ({
          label: `🌑 ${p.label}`,
          value: `${formatISOFullPL(p.date)}, ${p.time} · ${p.zodiacSymbol} ${p.zodiacSign}`,
        }))}
      />
      <p className="mt-4 text-sm text-slate-500">
        Nów to moment, gdy Księżyc znajduje się między Ziemią a Słońcem i jest niewidoczny na niebie — to
        początek cyklu księżycowego i najlepszy czas na obserwacje słabych obiektów nieba. Godziny liczymy
        algorytmem Meeusa (~1 min) w czasie urzędowym dla Polski.
      </p>
    </CalYearShell>
  );
}
