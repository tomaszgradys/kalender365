import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRERENDER_YEARS, parseYear, yearRobots } from "@/lib/de/year";
import { berlinNow } from "@/lib/de/now";
import KalenderAusdrucken from "@/components/de/KalenderAusdrucken";

export function generateStaticParams() {
  return PRERENDER_YEARS.map((y) => ({ year: String(y) }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) return {};
  // Das aktuelle Jahr wird vom Hub /kalender-zum-ausdrucken abgedeckt → dorthin
  // kanonisieren, damit keine Dublette entsteht.
  const isCurrent = y === berlinNow().year;
  return {
    title: `Kalender ${y} zum Ausdrucken – kostenlos als PDF & Excel`,
    description: `Kalender ${y} kostenlos als PDF und Excel zum Ausdrucken: Jahreskalender (Quer- & Hochformat), Jahresplaner, Halbjahres- und Monatskalender mit Kalenderwochen und Feiertagen, auch nach Bundesland.`,
    alternates: { canonical: isCurrent ? "/kalender-zum-ausdrucken" : `/kalender-zum-ausdrucken/${y}` },
    ...yearRobots(y),
  };
}

export default async function AusdruckenYearPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) notFound();
  return <KalenderAusdrucken year={y} />;
}
