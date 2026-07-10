import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/de/ogImage";
import { parseKalenderSlug } from "@/lib/de/calendar";
import { MONTH_NAMES_DE } from "@/lib/de/locale";
import { berlinNow } from "@/lib/de/now";

export const alt = "Kalender Deutschland – Feiertage, Kalenderwochen & PDF – Kalender365.pro";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = parseKalenderSlug(slug);
  const title =
    p == null
      ? `Kalender ${berlinNow().year}`
      : p.kind === "year"
        ? `Kalender ${p.year}`
        : `${MONTH_NAMES_DE[p.month0]} ${p.year}`;
  return renderOgImage({
    kicker: "Kalender",
    title,
    subtitle: "Feiertage, Kalenderwochen, Arbeitstage & PDF",
  });
}
