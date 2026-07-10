import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/de/ogImage";
import { parseYear } from "@/lib/de/year";
import { berlinNow } from "@/lib/de/now";

export const alt = "Schulferien in Deutschland – Kalender365.pro";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const y = parseYear(year) ?? berlinNow().year;
  return renderOgImage({
    kicker: "Schulferien",
    title: `Schulferien ${y}`,
    subtitle: "Alle 16 Bundesländer im Überblick",
  });
}
