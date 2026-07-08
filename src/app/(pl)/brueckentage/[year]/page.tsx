import PageWithSidebar from "@/components/de/PageWithSidebar";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NAV_YEARS, parseYear, yearRobots } from "@/lib/de/year";
import { BUNDESLAENDER } from "@/lib/de/bundeslaender";
import BundeslandSelect from "@/components/de/BundeslandSelect";

export function generateStaticParams() {
  return NAV_YEARS.map((y) => ({ year: String(y) }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) return {};
  return {
    title: `Brückentage ${y} – Urlaub clever planen`,
    description: `Die besten Brückentage ${y} in Deutschland: mit wenigen Urlaubstagen lange Wochenenden planen. Mit Bundesland-Auswahl.`,
    alternates: { canonical: `/brueckentage/${y}` },
    ...yearRobots(y),
  };
}

export default async function BrueckentageHubPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) notFound();

  return (
    <main className="flex-1">
      <PageWithSidebar>
        <nav className="mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span>
          <span className="text-navy-700">Brückentage {y}</span>
        </nav>
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Brückentage {y}</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Brückentage sind Arbeitstage zwischen einem Feiertag und dem Wochenende. Wer sie als Urlaub nimmt,
          verwandelt wenige Urlaubstage in lange freie Blöcke. Da Feiertage je nach Bundesland verschieden sind,
          wählen Sie zuerst Ihr Bundesland.
        </p>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-navy-50/40 p-4">
          <BundeslandSelect basePath={`/brueckentage/${y}`} />
        </div>

        <section className="mt-8">
          <h2 className="mb-3 text-xl font-bold text-navy-800">Brückentage {y} nach Bundesland</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {BUNDESLAENDER.map((b) => (
              <Link key={b.code} href={`/brueckentage/${y}/${b.slug}`} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-navy-700 hover:border-navy-300 hover:shadow-sm">
                {b.name}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 flex flex-wrap gap-2 text-sm">
          <Link href={`/feiertage/${y}`} className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Feiertage {y}</Link>
          <Link href={`/urlaubsplaner/${y}`} className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Urlaubsplaner {y}</Link>
          <Link href={`/kalender/${y}`} className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Kalender {y}</Link>
        </section>
      </PageWithSidebar>
    </main>
  );
}
