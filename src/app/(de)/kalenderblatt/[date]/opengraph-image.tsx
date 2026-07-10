import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/de/ogImage";
import { formatLongDE, weekdayDE } from "@/lib/de/locale";

export const alt = "Kalenderblatt des Tages – Kalender365.pro";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const valid = /^\d{4}-\d{2}-\d{2}$/.test(date);
  return renderOgImage({
    kicker: valid ? weekdayDE(date) : "Kalenderblatt",
    title: valid ? formatLongDE(date) : "Kalenderblatt",
    subtitle: "Kalenderwoche, Feiertag, Mondphase & Sonnenzeiten",
  });
}
