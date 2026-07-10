import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/de/ogImage";
import { getSternzeichen } from "@/lib/de/sternzeichen";

export const alt = "Sternzeichen – Datum, Element & Eigenschaften – Kalender365.pro";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const z = getSternzeichen(slug);
  return renderOgImage({
    kicker: "Sternzeichen",
    title: z ? z.name : "Sternzeichen",
    subtitle: z ? `${z.zeitraum} · Element ${z.element}` : "Daten, Elemente & Eigenschaften",
  });
}
