import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/de/ogImage";
import { berlinNow } from "@/lib/de/now";
import { formatLongDE, weekdayDE } from "@/lib/de/locale";

export const alt = "Welcher Tag ist heute? Kalenderblatt des Tages – Kalender365.pro";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const pad = (n: number) => n.toString().padStart(2, "0");

export default function Image() {
  const { year, month0, day } = berlinNow();
  const iso = `${year}-${pad(month0 + 1)}-${pad(day)}`;
  return renderOgImage({
    kicker: `Heute · ${weekdayDE(iso)}`,
    title: formatLongDE(iso),
    subtitle: "Kalenderwoche, Feiertag, Mondphase & Sonnenzeiten",
  });
}
