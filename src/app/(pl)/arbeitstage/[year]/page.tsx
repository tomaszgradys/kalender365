import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NAV_YEARS, parseYear, yearRobots } from "@/lib/de/year";
import { BUNDESLAENDER } from "@/lib/de/bundeslaender";
import { arbeitstageInYear } from "@/lib/de/arbeitstage";
import BundeslandSelect from "@/components/de/BundeslandSelect";

export function generateStaticParams() {
  return NAV_YEARS.map((y) => ({ year: String(y) }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) return {};
  return {
    title: `Arbeitstage ${y} – nach Bundesland berechnen`,
    description: `Anzahl der Arbeitstage ${y} pro Bundesland bei einer 5-Tage-Woche, unter Berücksichtigung der gesetzlichen Feiertage. Mit Bundesland-Auswahl.`,
    alternates: { canonical: `/arbeitstage/${y}` },
    ...yearRobots(y),
  };
}

export default async function ArbeitstageHubPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) notFound();

  const rows = BUNDESLAENDER.map((b) => ({ b, at: arbeitstageInYear(y, b.code) })).sort((x, z) => z.at - x.at);

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-4xl px-4 py-8">
        <nav className="mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span>
          <span className="text-navy-700">Arbeitstage {y}</span>
        </nav>
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Arbeitstage {y} in Deutschland</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          <strong>Arbeitstage</strong> = Montag bis Freitag ohne gesetzliche Feiertage des jeweiligen Bundeslandes
          (5-Tage-Woche). Nicht zu verwechseln mit <strong>Werktagen</strong> (Montag bis Samstag ohne Sonn- und Feiertage).
          Weil Feiertage Ländersache sind, unterscheidet sich die Zahl je Bundesland.
        </p>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-navy-50/40 p-4">
          <BundeslandSelect basePath={`/arbeitstage/${y}`} />
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-2 font-medium">Bundesland</th>
                <th className="px-4 py-2 font-medium">Arbeitstage {y}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ b, at }) => (
                <tr key={b.code} className="border-t border-slate-100">
                  <td className="px-4 py-2">
                    <Link href={`/arbeitstage/${y}/${b.slug}`} className="font-medium text-navy-700 hover:underline">{b.name}</Link>
                  </td>
                  <td className="px-4 py-2 font-semibold text-navy-800">{at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-slate-500">
          Details und Berechnung: <Link href="/so-berechnen-wir" className="font-medium text-navy-600 underline">So berechnen wir</Link>.
        </p>
      </div>
    </main>
  );
}
