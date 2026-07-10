import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/de/ogImage";
import { parseMonthYearSlugDE, MONTH_NAMES_DE } from "@/lib/de/locale";
import { berlinNow } from "@/lib/de/now";

export const alt = "Mondkalender – Aussaattage & Gärtnern nach dem Mond – Kalender365.pro";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Titel kurz halten (Monatsname ohne „Mondkalender"-Präfix → kein Umbruch).
  let title = `Mondkalender ${berlinNow().year}`;
  if (/^\d{4}$/.test(slug)) {
    title = `Mondkalender ${slug}`;
  } else {
    const p = parseMonthYearSlugDE(slug);
    if (p) title = `${MONTH_NAMES_DE[p.monthIndex]} ${p.year}`;
  }
  return renderOgImage({
    kicker: "Mondkalender",
    title,
    subtitle: "Aussaattage & Gärtnern nach dem Mond",
  });
}
