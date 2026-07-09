import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NAV_YEARS, parseYear, yearRobots } from "@/lib/de/year";
import MoonPhasesView from "@/components/de/MoonPhasesView";

export function generateStaticParams() {
  return NAV_YEARS.map((y) => ({ year: String(y) }));
}
export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) return {};
  return {
    title: `Vollmond ${y} – alle Vollmond-Termine mit Uhrzeit`,
    description: `Alle Vollmond-Termine ${y} mit genauer Uhrzeit (Europe/Berlin), Sternzeichen und Blue Moon. Übersichtlich als Tabelle.`,
    alternates: { canonical: `/vollmond/${y}` },
    ...yearRobots(y),
  };
}
export default async function VollmondPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) notFound();
  return (
    <main className="flex-1">
      <MoonPhasesView year={y} only="full" title={`Vollmond ${y}`} intro={`Alle Vollmond-Termine ${y} mit genauer Uhrzeit, Sternzeichen und Blue-Moon-Kennzeichnung.`} />
    </main>
  );
}
