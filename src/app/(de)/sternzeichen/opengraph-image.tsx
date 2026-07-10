import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/de/ogImage";

export const alt = "Die 12 Sternzeichen – Daten, Elemente & Eigenschaften – Kalender365.pro";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    kicker: "Sternzeichen",
    title: "Die 12 Sternzeichen",
    subtitle: "Daten, Elemente, Planeten & Eigenschaften",
  });
}
