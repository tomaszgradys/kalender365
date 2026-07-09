import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRERENDER_YEARS, parseYear, yearRobots } from "@/lib/de/year";
import MoonPhasesView from "@/components/de/MoonPhasesView";

export function generateStaticParams() {
  return PRERENDER_YEARS.map((y) => ({ year: String(y) }));
}
export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) return {};
  return {
    title: `Mondphasen ${y} – Vollmond, Neumond & Uhrzeiten`,
    description: `Alle Mondphasen ${y} mit genauen Uhrzeiten (Europe/Berlin): Neumond, Erstes Viertel, Vollmond, Letztes Viertel – inkl. Sternzeichen und Blue Moon.`,
    alternates: { canonical: `/mondphasen/${y}` },
    ...yearRobots(y),
  };
}
export default async function MondphasenPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) notFound();
  return (
    <main className="flex-1">
      <MoonPhasesView year={y} title={`Mondphasen ${y}`} intro={`Alle Mondphasen ${y} mit genauer Uhrzeit für Deutschland, Sternzeichen des Mondes und Blue-Moon-Kennzeichnung.`} />
    </main>
  );
}
