import PageWithSidebar from "@/components/de/PageWithSidebar";
import Breadcrumbs from "@/components/de/Breadcrumbs";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRERENDER_YEARS, parseYear, yearRobots } from "@/lib/de/year";
import { MONTH_NAMES_DE } from "@/lib/de/locale";
import { arbeitstageInYear, werktageInYear, workingDaysByMonth } from "@/lib/de/arbeitstage";
import { BUNDESLAENDER, stateBySlug, STATE_SLUGS } from "@/lib/de/bundeslaender";

export function generateStaticParams() {
  return PRERENDER_YEARS.flatMap((y) => STATE_SLUGS.map((slug) => ({ year: String(y), bundesland: slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string; bundesland: string }> }): Promise<Metadata> {
  const { year, bundesland } = await params;
  const y = parseYear(year);
  const state = stateBySlug(bundesland);
  if (!y || !state) return {};
  return {
    title: `Arbeitstage ${y} ${state.name} – pro Monat & Jahr`,
    description: `Arbeitstage ${y} in ${state.name}: Anzahl pro Monat und im Jahr bei einer 5-Tage-Woche, inklusive gesetzlicher Feiertage. Auch Werktage.`,
    alternates: { canonical: `/arbeitstage/${y}/${state.slug}` },
    ...yearRobots(y),
  };
}

export default async function ArbeitstageStatePage({ params }: { params: Promise<{ year: string; bundesland: string }> }) {
  const { year, bundesland } = await params;
  const y = parseYear(year);
  const state = stateBySlug(bundesland);
  if (!y || !state) notFound();

  const perMonth = workingDaysByMonth(y, state.code, "5");
  const total = arbeitstageInYear(y, state.code);
  const werktage = werktageInYear(y, state.code);
  const totalFreie = perMonth.reduce((s, m) => s + m.freie, 0);

  return (
    <main className="flex-1">
      <PageWithSidebar>
        <Breadcrumbs
          items={[
            { name: "Start", url: "/" },
            { name: `Arbeitstage ${y}`, url: `/arbeitstage/${y}` },
            { name: state.name, url: `/arbeitstage/${y}/${state.slug}` },
          ]}
        />
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Arbeitstage {y} in {state.name}</h1>
        <p className="mt-2 text-slate-600">
          {state.name} hat {y} bei einer 5-Tage-Woche <strong>{total} Arbeitstage</strong> und
          <strong> {werktage} Werktage</strong> (Mo–Sa ohne Sonn- und Feiertage).
        </p>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-2 font-medium">Monat</th>
                <th className="px-4 py-2 font-medium">Arbeitstage</th>
                <th className="px-4 py-2 font-medium">Freie Tage</th>
              </tr>
            </thead>
            <tbody>
              {perMonth.map((m) => (
                <tr key={m.month0} className="border-t border-slate-100">
                  <td className="px-4 py-2 font-medium text-navy-800">{MONTH_NAMES_DE[m.month0]}</td>
                  <td className="px-4 py-2 text-slate-700">{m.arbeitstage}</td>
                  <td className="px-4 py-2 text-slate-500">{m.freie}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-slate-200 bg-slate-50 font-bold">
                <td className="px-4 py-2 text-navy-800">Gesamt {y}</td>
                <td className="px-4 py-2 text-navy-800">{total}</td>
                <td className="px-4 py-2 text-slate-500">{totalFreie}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <section className="mt-8 flex flex-wrap gap-2 text-sm">
          <Link href={`/feiertage/${y}/${state.slug}`} className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Feiertage {state.name}</Link>
          <Link href={`/brueckentage/${y}/${state.slug}`} className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Brückentage {state.name}</Link>
          <Link href="/arbeitstage-rechner" className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Arbeitstage-Rechner</Link>
        </section>

        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Anderes Bundesland</h2>
          <div className="flex flex-wrap gap-2">
            {BUNDESLAENDER.filter((b) => b.code !== state.code).map((b) => (
              <Link key={b.code} href={`/arbeitstage/${y}/${b.slug}`} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:border-navy-300 hover:text-navy-600">{b.name}</Link>
            ))}
          </div>
        </section>
      </PageWithSidebar>
    </main>
  );
}
