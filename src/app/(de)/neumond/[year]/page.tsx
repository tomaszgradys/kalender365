import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRERENDER_YEARS, parseYear, yearRobots } from "@/lib/de/year";
import MoonPhasesView from "@/components/de/MoonPhasesView";
import { ogMeta } from "@/lib/de/ogMeta";

export function generateStaticParams() {
  return PRERENDER_YEARS.map((y) => ({ year: String(y) }));
}
export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) return {};
  return {
    title: `Neumond ${y} – alle Neumond-Termine mit Uhrzeit`,
    description: `Alle Neumond-Termine ${y} mit genauer Uhrzeit (Europe/Berlin) und Sternzeichen. Ideal für Garten, Fasten und Neuanfänge.`,
    alternates: { canonical: `/neumond/${y}` },
    openGraph: ogMeta(`/neumond/${y}`),
    ...yearRobots(y),
  };
}
export default async function NeumondPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) notFound();
  return (
    <div className="flex-1">
      <MoonPhasesView year={y} only="new" title={`Neumond ${y}`} intro={`Alle Neumond-Termine ${y} mit genauer Uhrzeit und Sternzeichen des Mondes.`} />
    </div>
  );
}
