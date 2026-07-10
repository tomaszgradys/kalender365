import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/de/ogImage";
import { getCountdown } from "@/lib/de/countdowns";

export const alt = "Countdown – wie viele Tage noch? – Kalender365.pro";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ event: string }> }) {
  const { event } = await params;
  const c = getCountdown(event);
  // Kurzen Titel (Event-Name) groß, damit auch lange Namen nicht umbrechen.
  return renderOgImage({
    kicker: "Countdown",
    title: c ? c.title : "Wie viele Tage noch?",
    subtitle: "Wie viele Tage, Stunden & Minuten noch bleiben",
  });
}
