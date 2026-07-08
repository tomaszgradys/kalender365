import PageWithSidebar from "@/components/de/PageWithSidebar";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NAV_YEARS, parseYear, yearRobots } from "@/lib/de/year";
import { allWeeks } from "@/lib/de/weeks";
import { formatShortDE } from "@/lib/de/locale";
import { berlinISOWeek } from "@/lib/de/now";

export const revalidate = 3600;

export function generateStaticParams() {
  return NAV_YEARS.map((y) => ({ year: String(y) }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) return {};
  const count = allWeeks(y).length;
  return {
    title: `Kalenderwochen ${y} – alle KW von 1 bis ${count}`,
    description: `Alle Kalenderwochen ${y} nach ISO 8601: Start- und Enddatum jeder KW, aktuelle Woche und Tabelle zum Kopieren.`,
    alternates: { canonical: `/kalenderwochen/${y}` },
    ...yearRobots(y),
  };
}

export default async function KalenderwochenPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) notFound();

  const weeks = allWeeks(y);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const current = berlinISOWeek();

  return (
    <main className="flex-1">
      <PageWithSidebar>
        <nav className="mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span>
          <span className="text-navy-700">Kalenderwochen {y}</span>
        </nav>
        <h1 className="text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">Kalenderwochen {y}</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Alle {weeks.length} Kalenderwochen {y} nach ISO 8601. Jede Woche beginnt am Montag; KW 1 ist die Woche,
          die den 4. Januar enthält. Die aktuelle Woche ist hervorgehoben.
        </p>

        {current.isoYear === y && (() => {
          const cw = weeks.find((w) => w.week === current.week);
          if (!cw) return null;
          return (
            <Link
              href={`/kw/${cw.week}-${y}`}
              className="mt-5 flex items-center gap-4 rounded-2xl border border-brand-green-100 bg-brand-green-50 p-4 transition hover:border-brand-green-300 sm:p-5"
            >
              <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-green-600 text-white sm:h-20 sm:w-20">
                <span className="text-[10px] font-semibold uppercase tracking-wider">KW</span>
                <span className="text-3xl font-black leading-none sm:text-4xl">{cw.week}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-green-700">Aktuelle Kalenderwoche</p>
                <p className="text-lg font-bold text-navy-800 sm:text-xl">{cw.week}. Kalenderwoche {y}</p>
                <p className="text-sm text-slate-600">{formatShortDE(iso(cw.start))} – {formatShortDE(iso(cw.end))}</p>
              </div>
            </Link>
          );
        })()}

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-2 font-medium">KW</th>
                <th className="px-4 py-2 font-medium">Von (Mo)</th>
                <th className="px-4 py-2 font-medium">Bis (So)</th>
              </tr>
            </thead>
            <tbody>
              {weeks.map((w) => {
                const isCurrent = current.isoYear === y && current.week === w.week;
                return (
                  <tr key={w.week} className={`border-t border-slate-100 ${isCurrent ? "bg-brand-green-50" : ""}`}>
                    <td className="px-4 py-2 font-semibold text-navy-800">
                      <Link href={`/kw/${w.week}-${y}`} className="hover:text-navy-600 hover:underline">KW {w.week}</Link>{isCurrent && <span className="ml-2 rounded-full bg-brand-green-600 px-2 py-0.5 text-[10px] font-bold text-white">aktuell</span>}
                    </td>
                    <td className="px-4 py-2 text-slate-600">{formatShortDE(iso(w.start))}</td>
                    <td className="px-4 py-2 text-slate-600">{formatShortDE(iso(w.end))}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 text-sm">
          <Link href={`/kalenderwochen/${y - 1}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">← KW {y - 1}</Link>
          <Link href={`/kalenderwochen/${y + 1}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">KW {y + 1} →</Link>
          <Link href={`/kalender/${y}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Kalender {y}</Link>
        </div>
      </PageWithSidebar>
    </main>
  );
}
