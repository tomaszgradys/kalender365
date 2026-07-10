import { renderOgImage } from "@/lib/de/ogImage";

// Stabile URL für das Standard-OG-Bild (/og-standard). Wird als Default in den
// Layout-Metadaten (openGraph.images) gesetzt, damit JEDE Seite ein garantiertes
// Markenbild hat — auch Seiten, die eigene openGraph-Felder (z. B. og:url) setzen
// und dadurch das vererbte Datei-basierte Bild verlieren würden. Seiten mit
// eigenem opengraph-image im Segment überschreiben diesen Default.
export const dynamic = "force-static";

export function GET() {
  return renderOgImage({
    title: "Kalender, Feiertage & Schulferien",
    subtitle: "Brückentage · Kalenderwochen · Mondphasen · PDF zum Ausdrucken",
  });
}
