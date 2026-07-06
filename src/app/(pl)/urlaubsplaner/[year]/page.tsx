import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NAV_YEARS, parseYear, yearRobots } from "@/lib/de/year";
import UrlaubsplanerClient from "@/components/de/UrlaubsplanerClient";

export function generateStaticParams() {
  return NAV_YEARS.map((y) => ({ year: String(y) }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) return {};
  return {
    title: `Urlaubsplaner ${y} – Brückentage optimal nutzen`,
    description: `Urlaubsplaner ${y}: Wählen Sie Bundesland und Urlaubstage und sehen Sie sofort, wie Sie mit Brückentagen die meisten freien Tage herausholen.`,
    alternates: { canonical: `/urlaubsplaner/${y}` },
    ...yearRobots(y),
  };
}

export default async function UrlaubsplanerPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) notFound();

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <nav className="mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span>
          <span className="text-navy-700">Urlaubsplaner {y}</span>
        </nav>
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Urlaubsplaner {y}</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Holen Sie mit möglichst wenigen Urlaubstagen möglichst viele freie Tage heraus. Der Planer berücksichtigt
          die gesetzlichen Feiertage Ihres Bundeslandes und schlägt die effizientesten Brückentage vor.
        </p>
        <div className="mt-6">
          <UrlaubsplanerClient year={y} />
        </div>
      </div>
    </main>
  );
}
