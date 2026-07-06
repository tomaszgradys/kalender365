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
  const n = getMoonPhaseInstants(Number(year)).filter((p) => p.type === "full").length;
  return {
    title: `Pełnia księżyca ${year} — daty i godziny wszystkich pełni`,
    description: `Kalendarz pełni księżyca ${year}: ${n} pełni w roku z dokładną datą, godziną (czas dla Polski) i znakiem zodiaku Księżyca. Sprawdź, kiedy wypada najbliższa pełnia.`,
    alternates: { canonical: `/pelnia-ksiezyca/${year}` },
    ...ogType("pelnia-ksiezyca"),
    ...yearRobotsMeta(year),
  };
}

export default async function PelniaPage({ params }: { params: Promise<{ year: string }> }) {
  const { year: yp } = await params;
  const year = Number(yp);
  if (!isValidYear(year)) notFound();
  const fulls = getMoonPhaseInstants(year).filter((p) => p.type === "full");

  return (
    <CalYearShell
      slug="pelnia-ksiezyca"
      label="Pełnia księżyca"
      year={year}
      title={`Pełnia księżyca ${year}`}
      subtitle={`W ${year} roku wystąpi ${fulls.length} pełni księżyca. Poniżej data, dokładna godzina (czas dla Polski) i znak zodiaku Księżyca dla każdej pełni.`}
      gradient="from-navy-700 to-navy-900"
    >
      <DataTable
        rows={fulls.map((p) => ({
          label: `🌕 ${p.label}${p.blueMoon ? " · Blue Moon" : ""}`,
          value: `${formatISOFullPL(p.date)}, ${p.time} · ${p.zodiacSymbol} ${p.zodiacSign}`,
        }))}
      />
      <p className="mt-4 text-sm text-slate-500">
        Pełnia to moment, gdy cała widoczna z Ziemi tarcza Księżyca jest oświetlona (Księżyc jest po
        przeciwnej stronie nieba niż Słońce). Godziny liczymy algorytmem Meeusa (~1 min) w czasie urzędowym
        dla Polski. „Blue Moon" to druga pełnia w tym samym miesiącu kalendarzowym.
      </p>
    </CalYearShell>
  );
}
