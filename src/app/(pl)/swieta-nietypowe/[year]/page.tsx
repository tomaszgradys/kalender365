import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { STATIC_YEARS, isValidYear, MONTH_NAMES, yearRobotsMeta} from "@/lib/months";
import { getUnusualHolidays } from "@/lib/observances";
import { daysInMonth } from "@/lib/dayInfo";
import { url } from "@/lib/urls";
import CalYearShell from "@/components/CalYearShell";
import { ogType } from "@/lib/ogType";

export const dynamicParams = true;
export function generateStaticParams() {
  return STATIC_YEARS.map((year) => ({ year: String(year) }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  return {
    title: `Święta nietypowe ${year} — kalendarz nietypowych świąt`,
    description: `Nietypowe i wesołe święta w ${year} roku — Dzień Kota, Dzień Pizzy, Dzień Uśmiechu i wiele innych. Sprawdź, co świętujemy każdego dnia.`,
    alternates: { canonical: `/swieta-nietypowe/${year}` },
    ...ogType("swieta-nietypowe"),
    ...yearRobotsMeta(year),
  };
}

export default async function SwietaNietypowePage({ params }: { params: Promise<{ year: string }> }) {
  const { year: yp } = await params;
  const year = Number(yp);
  if (!isValidYear(year)) notFound();

  const months = Array.from({ length: 12 }, (_, m) => {
    const items: { day: number; names: string[] }[] = [];
    for (let d = 1; d <= daysInMonth(year, m); d++) {
      const names = getUnusualHolidays(m, d);
      if (names.length) items.push({ day: d, names });
    }
    return { m, items };
  });

  return (
    <CalYearShell
      slug="swieta-nietypowe"
      label="Święta nietypowe"
      year={year}
      title={`Święta nietypowe ${year}`}
      subtitle="Nietypowe, wesołe i międzynarodowe święta na każdy miesiąc. Kliknij dzień, aby zobaczyć kartkę z kalendarza."
      gradient="from-pink-600 to-fuchsia-500"
    >
      <div className="mt-6 space-y-6">
        {months.map(({ m, items }) => (
          <div key={m}>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">{MONTH_NAMES.pl[m]}</h2>
            <ul className="space-y-1.5 text-sm">
              {items.map(({ day, names }) => (
                <li key={day} className="flex gap-3">
                  <Link
                    href={url.day(year, m, day)}
                    className="w-10 shrink-0 font-mono text-navy-600 hover:underline"
                  >
                    {day}.{String(m + 1).padStart(2, "0")}
                  </Link>
                  <span className="text-slate-700">{names.join(" · ")}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </CalYearShell>
  );
}
