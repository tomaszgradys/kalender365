import PageWithSidebar from "@/components/de/PageWithSidebar";
import Breadcrumbs from "@/components/de/Breadcrumbs";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRERENDER_YEARS, parseYear, yearRobots } from "@/lib/de/year";
import { MONTH_NAMES_DE, MONTH_SLUGS_DE } from "@/lib/de/locale";
import { BUNDESLAENDER } from "@/lib/de/bundeslaender";

export function generateStaticParams() {
  return PRERENDER_YEARS.map((y) => ({ year: String(y) }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) return {};
  return {
    title: `Kalender ${y} zum Ausdrucken – kostenlos als PDF`,
    description: `Kalender ${y} kostenlos als PDF zum Ausdrucken: Jahreskalender und Monatskalender mit Kalenderwochen und Feiertagen, auch nach Bundesland.`,
    alternates: { canonical: `/kalender-zum-ausdrucken/${y}` },
    ...yearRobots(y),
  };
}

export default async function AusdruckenPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) notFound();

  return (
    <main className="flex-1">
      <PageWithSidebar>
        <Breadcrumbs
          items={[
            { name: "Start", url: "/" },
            { name: `Kalender ${y} zum Ausdrucken`, url: `/kalender-zum-ausdrucken/${y}` },
          ]}
        />
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Kalender {y} zum Ausdrucken</h1>
        <p className="mt-2 max-w-2xl text-slate-600">Kostenlose PDF-Kalender {y} mit Kalenderwochen und Feiertagen — als Jahreskalender (Querformat) oder einzelne Monate. Optional mit den Feiertagen Ihres Bundeslandes.</p>

        <section className="mt-6">
          <h2 className="mb-3 text-xl font-bold text-navy-800">Jahreskalender {y} (PDF)</h2>
          <div className="flex flex-wrap gap-2">
            <a href={`/api/pdf/de/jahr/${y}`} className="rounded-lg bg-navy-600 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700">📄 Deutschland</a>
            {BUNDESLAENDER.map((b) => (
              <a key={b.code} href={`/api/pdf/de/jahr/${y}?land=${b.slug}`} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-navy-700 hover:border-navy-300">{b.name}</a>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-3 text-xl font-bold text-navy-800">Monatskalender {y} (PDF)</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {MONTH_NAMES_DE.map((name, m) => (
              <a key={m} href={`/api/pdf/de/${y}/${MONTH_SLUGS_DE[m]}`} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-navy-700 hover:border-navy-300 hover:shadow-sm">📄 {name}</a>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-400">Tipp: Für einen Monat mit den Feiertagen eines Bundeslandes hängen Sie <code>?land=bayern</code> an die PDF-Adresse an.</p>
        </section>
      </PageWithSidebar>
    </main>
  );
}
