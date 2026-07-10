import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/de/ogImage";

// Standard-OG-/Twitter-Bild für alle deutschen Seiten ohne eigenes Vorschaubild.
// Dynamisch generiert (kein externes Asset → CSP-konform). Einzelseiten
// (Feiertage, Schulferien, Blog …) überschreiben dies über ein eigenes
// opengraph-image im jeweiligen Segment bzw. openGraph.images.

export const alt = "Kalender365.pro – Kalender, Feiertage, Schulferien & PDF für Deutschland";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  return renderOgImage({
    title: "Kalender, Feiertage & Schulferien",
    subtitle: "Brückentage · Kalenderwochen · Mondphasen · PDF zum Ausdrucken",
  });
}
