import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MONTH_NAMES_DE, WEEKDAY_SHORT_DE, formatLongDE, weekdayDE } from "@/lib/de/locale";
import { monthMatrix, yearSummary } from "@/lib/de/calendar";
import { getNationalFeiertage } from "@/lib/de/feiertage";
import { BUNDESLAENDER } from "@/lib/de/bundeslaender";

const NAV_MIN = 2015;
const NAV_MAX = 2035;

export function generateStaticParams() {
  return Array.from({ length: NAV_MAX - NAV_MIN + 1 }, (_, i) => ({ year: String(NAV_MIN + i) }));
}

function parseYear(raw: string): number | null {
  if (!/^\d{4}$/.test(raw)) return null;
  const y = Number(raw);
  return y >= 1900 && y <= 2100 ? y : null;
}
const isNavigable = (y: number) => y >= NAV_MIN && y <= NAV_MAX;

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) return {};
  return {
    title: `Kalender ${y} Deutschland – Feiertage, KW & PDF`,
    description: `Jahreskalender ${y} für Deutschland mit Kalenderwochen, Feiertagen, Arbeitstagen und kostenlosen PDF-Kalendern zum Ausdrucken.`,
    alternates: { canonical: `/kalender/${y}` },
    ...(isNavigable(y) ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function KalenderJahrPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) notFound();

  const summary = yearSummary(y);
  const feiertage = getNationalFeiertage(y);

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <nav className="mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span>
          <span className="text-navy-700">Kalender {y}</span>
        </nav>

        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Kalender {y}</h1>
          {isNavigable(y) && (
            <div className="flex gap-2 text-sm">
              <Link href={`/kalender/${y - 1}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">← {y - 1}</Link>
              <Link href={`/kalender/${y + 1}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">{y + 1} →</Link>
            </div>
          )}
        </div>

        {/* STATS */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { k: "Tage", v: summary.totalDays },
            { k: "Kalenderwochen", v: summary.isoWeeks },
            { k: "Feiertage (bundesweit)", v: summary.feiertageCount },
            { k: "Wochenendtage", v: summary.weekends },
          ].map((s) => (
            <div key={s.k} className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
              <div className="text-2xl font-black text-navy-800">{s.v}</div>
              <div className="mt-0.5 text-xs text-slate-500">{s.k}</div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Feiertage und Arbeitstage zählen bundesweite Feiertage. Für ein konkretes Bundesland siehe{" "}
          <Link href={`/feiertage/${y}`} className="underline hover:text-navy-600">Feiertage {y}</Link>.
        </p>

        {/* 12 MONATE */}
        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MONTH_NAMES_DE.map((name, m) => {
            const weeks = monthMatrix(y, m);
            return (
              <div key={m} className="rounded-2xl border border-slate-200 bg-white p-4">
                <h2 className="mb-2 text-sm font-bold text-navy-700">{name} {y}</h2>
                <table className="w-full table-fixed text-center text-[12px]">
                  <thead>
                    <tr className="text-slate-400">
                      {WEEKDAY_SHORT_DE.map((w, i) => (
                        <th key={w} className={`py-1 font-medium ${i >= 5 ? "text-slate-500" : ""}`}>{w}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {weeks.map((wk, i) => (
                      <tr key={i}>
                        {wk.map((d, j) => (
                          <td key={j} className="py-0.5">
                            {d.day === 0 ? (
                              <span className="text-transparent">0</span>
                            ) : (
                              <span
                                className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${
                                  d.holiday
                                    ? "bg-brand-green-100 font-bold text-brand-green-700"
                                    : d.weekend
                                      ? "text-slate-400"
                                      : "text-navy-800"
                                }`}
                              >
                                {d.day}
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </section>

        {/* FEIERTAGE */}
        <section className="mt-10">
          <h2 className="mb-3 text-xl font-bold text-navy-800">Bundesweite Feiertage {y}</h2>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-2 font-medium">Feiertag</th>
                  <th className="px-4 py-2 font-medium">Datum</th>
                  <th className="px-4 py-2 font-medium">Wochentag</th>
                </tr>
              </thead>
              <tbody>
                {feiertage.map((h) => (
                  <tr key={h.slug} className="border-t border-slate-100">
                    <td className="px-4 py-2 font-medium text-navy-800">{h.name}</td>
                    <td className="px-4 py-2 text-slate-600">{formatLongDE(h.date)}</td>
                    <td className="px-4 py-2 text-slate-600">{weekdayDE(h.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Regionale Feiertage (z. B. Fronleichnam, Reformationstag) gelten je nach Bundesland.{" "}
            <Link href={`/feiertage/${y}`} className="font-medium text-navy-600 underline">Alle Feiertage nach Bundesland →</Link>
          </p>
        </section>

        {/* BUNDESLÄNDER */}
        <section className="mt-10">
          <h2 className="mb-3 text-xl font-bold text-navy-800">Kalender {y} nach Bundesland</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {BUNDESLAENDER.map((b) => (
              <Link key={b.code} href={`/feiertage/${y}/${b.slug}`} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-navy-700 hover:border-navy-300 hover:shadow-sm">
                {b.name}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
