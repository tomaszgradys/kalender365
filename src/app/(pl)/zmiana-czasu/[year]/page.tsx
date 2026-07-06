import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { STATIC_YEARS, isValidYear, yearRobotsMeta} from "@/lib/months";
import { getDSTChanges } from "@/lib/astroYear";
import CalYearShell from "@/components/CalYearShell";
import { ogType } from "@/lib/ogType";

export const dynamicParams = true;
export function generateStaticParams() {
  return STATIC_YEARS.map((year) => ({ year: String(year) }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  const [spring, autumn] = getDSTChanges(Number(year));
  return {
    title: `Zmiana czasu ${year} — kiedy przestawiamy zegarki?`,
    description: `Zmiana czasu w ${year}: na letni ${spring.date}, na zimowy ${autumn.date}. Sprawdź, w którą stronę przestawić zegarki i o której godzinie.`,
    alternates: { canonical: `/zmiana-czasu/${year}` },
    ...ogType("zmiana-czasu"),
    ...yearRobotsMeta(year),
  };
}

export default async function ZmianaCzasuPage({ params }: { params: Promise<{ year: string }> }) {
  const { year: yp } = await params;
  const year = Number(yp);
  if (!isValidYear(year)) notFound();

  const changes = getDSTChanges(year);

  return (
    <CalYearShell
      slug="zmiana-czasu"
      label="Zmiana czasu"
      year={year}
      title={`Zmiana czasu ${year}`}
      subtitle="Terminy zmiany czasu na letni i zimowy w Polsce oraz w Unii Europejskiej."
      gradient="from-navy-600 to-navy-800"
    >
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {changes.map((c) => (
          <div key={c.label} className="rounded-2xl border border-slate-200 p-5">
            <div className="text-3xl">{c.label.includes("letni") ? "⏰" : "🕐"}</div>
            <h2 className="mt-2 font-semibold text-slate-800">{c.label}</h2>
            <p className="mt-1 text-lg font-semibold text-navy-600">{c.date}</p>
            <p className="mt-1 text-sm text-slate-500">{c.detail}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-slate-500">
        Zmiana czasu następuje w ostatnią niedzielę marca (czas letni) i ostatnią niedzielę
        października (czas zimowy) — zgodnie z regułą obowiązującą w UE.
      </p>
    </CalYearShell>
  );
}
