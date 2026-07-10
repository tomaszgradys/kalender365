import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/de/ogImage";

// Standard-OG-/Twitter-Bild für Seiten OHNE seiteneigene openGraph-Felder.
// Dynamisch generiert (kein externes Asset → CSP-konform). Seiten, die eigene
// openGraph-Daten setzen (siehe ogMeta), liefern das Standardbild explizit über
// /og-standard mit, da openGraph in Next NICHT tief zusammengeführt wird.

export const alt = "Kalender365.pro – Kalender, Feiertage, Schulferien & PDF für Deutschland";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  return renderOgImage({
    title: "Kalender, Feiertage & Schulferien",
    subtitle: "Brückentage · Kalenderwochen · Mondphasen · PDF zum Ausdrucken",
  });
}
