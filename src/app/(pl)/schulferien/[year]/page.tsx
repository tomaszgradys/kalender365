import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NAV_YEARS, parseYear } from "@/lib/de/year";
import { BUNDESLAENDER } from "@/lib/de/bundeslaender";
import { getSchulferien, isSchulferienIndexable } from "@/lib/de/schulferien";
import BundeslandSelect from "@/components/de/BundeslandSelect";

export function generateStaticParams() {
  return NAV_YEARS.map((y) => ({ year: String(y) }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) return {};
  // Indexable only if at least one state has verified data for this year.
  const anyVerified = BUNDESLAENDER.some((b) => isSchulferienIndexable(y, b.code));
  return {
    title: `Schulferien ${y} in Deutschland – Ferienkalender aller Bundesländer`,
    description: `Schulferien ${y} für alle 16 Bundesländer: Winter-, Oster-, Pfingst-, Sommer-, Herbst- und Weihnachtsferien. Termine je nach Bundesland.`,
    alternates: { canonical: `/schulferien/${y}` },
    ...(anyVerified ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function SchulferienHubPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) notFound();

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-4xl px-4 py-8">
        <nav className="mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span>
          <span className="text-navy-700">Schulferien {y}</span>
        </nav>
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Schulferien {y} in Deutschland</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Die Schulferien werden von den Kultusministerien der Länder festgelegt und über die KMK koordiniert.
          Wählen Sie Ihr Bundesland für Winter-, Oster-, Pfingst-, Sommer-, Herbst- und Weihnachtsferien.
        </p>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-navy-50/40 p-4">
          <BundeslandSelect basePath={`/schulferien/${y}`} />
        </div>

        <section className="mt-6">
          <h2 className="mb-3 text-xl font-bold text-navy-800">Schulferien {y} nach Bundesland</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {BUNDESLAENDER.map((b) => {
              const has = !!getSchulferien(y, b.code);
              return (
                <Link key={b.code} href={`/schulferien/${y}/${b.slug}`} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-navy-700 hover:border-navy-300 hover:shadow-sm">
                  {b.name}
                  {!has && <span className="text-[10px] text-slate-400">folgt</span>}
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
