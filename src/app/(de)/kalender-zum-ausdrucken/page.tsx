import type { Metadata } from "next";
import KalenderAusdrucken from "@/components/de/KalenderAusdrucken";
import { berlinNow } from "@/lib/de/now";
import { ogMeta } from "@/lib/de/ogMeta";

// Hub für das stärkste Keyword „Kalender zum Ausdrucken" – zeigt das aktuelle
// Jahr, kanonisch ohne Jahreszahl. Muss revalidieren (Jahreswechsel).
export const revalidate = 3600;

export function generateMetadata(): Metadata {
  const y = berlinNow().year;
  return {
    title: `Kalender ${y} zum Ausdrucken – PDF & Excel, Hoch- & Querformat, kostenlos`,
    description: `Kalender ${y} kostenlos zum Ausdrucken: Jahreskalender, Jahresplaner, Halbjahres- und Monatskalender als PDF und Excel – mit Feiertagen und Kalenderwochen je Bundesland.`,
    alternates: { canonical: "/kalender-zum-ausdrucken" },
    openGraph: ogMeta("/kalender-zum-ausdrucken", { defaultImage: true }),
  };
}

export default function Page() {
  return <KalenderAusdrucken year={berlinNow().year} isHub />;
}
