import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { STATIC_YEARS, isValidYear, yearRobotsMeta } from "@/lib/months";
import { getFerie } from "@/lib/school";
import { wojSlug } from "@/lib/vacationPlanner";
import CalYearShell from "@/components/CalYearShell";
import { ogType } from "@/lib/ogType";

export const dynamicParams = true;
export function generateStaticParams() {
  return STATIC_YEARS.map((year) => ({ year: String(year) }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  return {
    title: `Ferie zimowe ${year} — kalendarz ferii, terminy w województwach`,
    description: `Kalendarz ferii zimowych ${year}: terminy dla wszystkich województw. Sprawdź, kiedy zaczynają się i kończą ferie w Twoim regionie.`,
    alternates: { canonical: `/ferie-zimowe/${year}` },
    ...ogType("ferie-zimowe"),
    ...yearRobotsMeta(year),
  };
}

export default async function FeriePage({ params }: { params: Promise<{ year: string }> }) {
  const { year: yp } = await params;
  const year = Number(yp);
  if (!isValidYear(year)) notFound();

  const ferie = getFerie(year);

  return (
    <CalYearShell
      slug="ferie-zimowe"
      label="Ferie zimowe"
      year={year}
      title={`Ferie zimowe ${year}`}
      subtitle="Terminy ferii zimowych w podziale na województwa. Ferie trwają dwa tygodnie w czterech turach."
      gradient="from-sky-600 to-cyan-400"
    >
      {ferie ? (
        <div className="mt-6 space-y-3">
          {ferie.map((t, i) => (
            <div key={t.dates} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-700">
                  {i + 1}
                </span>
                <span className="font-semibold text-slate-800">{t.dates}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {t.regions.map((r) => (
                  <Link
                    key={r}
                    href={`/ferie-zimowe/${year}/${wojSlug(r)}`}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 transition hover:bg-sky-100 hover:text-sky-700"
                  >
                    {r}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Terminy ferii zimowych {year} są ustalane przez Ministerstwo Edukacji Narodowej i ogłaszane
          co roku w podziale na województwa. Dane dla tego roku nie są jeszcze dostępne w serwisie.
        </p>
      )}
    </CalYearShell>
  );
}
