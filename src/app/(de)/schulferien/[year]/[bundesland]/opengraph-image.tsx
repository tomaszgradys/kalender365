import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/de/ogImage";
import { parseYear } from "@/lib/de/year";
import { berlinNow } from "@/lib/de/now";
import { stateBySlug } from "@/lib/de/bundeslaender";

export const alt = "Schulferien nach Bundesland – Kalender365.pro";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ year: string; bundesland: string }> }) {
  const { year, bundesland } = await params;
  const y = parseYear(year) ?? berlinNow().year;
  const state = stateBySlug(bundesland);
  return renderOgImage({
    kicker: "Schulferien",
    title: `Schulferien ${y}`,
    subtitle: state ? state.name : "Deutschland",
  });
}
