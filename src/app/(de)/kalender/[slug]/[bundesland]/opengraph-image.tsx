import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/de/ogImage";
import { parseKalenderSlug } from "@/lib/de/calendar";
import { MONTH_NAMES_DE } from "@/lib/de/locale";
import { stateBySlug } from "@/lib/de/bundeslaender";
import { berlinNow } from "@/lib/de/now";

export const alt = "Kalender nach Bundesland – Feiertage & Schulferien – Kalender365.pro";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string; bundesland: string }> }) {
  const { slug, bundesland } = await params;
  const p = parseKalenderSlug(slug);
  const state = stateBySlug(bundesland);
  const title =
    p == null
      ? `Kalender ${berlinNow().year}`
      : p.kind === "year"
        ? `Kalender ${p.year}`
        : `${MONTH_NAMES_DE[p.month0]} ${p.year}`;
  return renderOgImage({
    kicker: "Kalender",
    title,
    subtitle: state ? `${state.name} · Feiertage & Schulferien` : "Feiertage & Schulferien",
  });
}
