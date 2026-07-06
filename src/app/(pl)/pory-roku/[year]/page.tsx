import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { STATIC_YEARS, isValidYear, yearRobotsMeta} from "@/lib/months";
import { getSeasons } from "@/lib/astroYear";
import CalYearShell from "@/components/CalYearShell";
import { ogType } from "@/lib/ogType";

export const dynamicParams = true;
export function generateStaticParams() {
  return STATIC_YEARS.map((year) => ({ year: String(year) }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  return {
    title: `Pory roku ${year} — daty równonocy i przesileń`,
    description: `Kiedy zaczyna się wiosna, lato, jesień i zima w ${year} roku? Dokładne daty i godziny równonocy oraz przesileń (czas astronomiczny).`,
    alternates: { canonical: `/pory-roku/${year}` },
    ...ogType("pory-roku"),
    ...yearRobotsMeta(year),
  };
}

const EMOJI: Record<string, string> = { wiosna: "🌷", lato: "☀️", jesien: "🍂", zima: "❄️" };

export default async function PoryRokuPage({ params }: { params: Promise<{ year: string }> }) {
  const { year: yp } = await params;
  const year = Number(yp);
  if (!isValidYear(year)) notFound();

  const seasons = getSeasons(year);

  return (
    <CalYearShell
      slug="pory-roku"
      label="Pory roku"
      year={year}
      title={`Pory roku ${year}`}
      subtitle="Astronomiczne początki pór roku — daty i godziny równonocy oraz przesileń (czas dla Polski)."
      gradient="from-emerald-600 to-teal-500"
    >
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {seasons.map((s) => (
          <div key={s.key} className="rounded-2xl border border-slate-200 p-5">
            <div className="text-3xl">{EMOJI[s.key]}</div>
            <h2 className="mt-2 font-semibold text-slate-800">{s.name}</h2>
            <p className="mt-1 text-sm text-slate-600">{s.date}</p>
            <p className="text-sm text-slate-500">godz. {s.time}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-slate-500">
        Podane momenty to astronomiczne początki pór roku. Kalendarzowe pory roku bywają zaokrąglane
        do pełnych dat (np. 21 marca, 22 czerwca).
      </p>
    </CalYearShell>
  );
}
