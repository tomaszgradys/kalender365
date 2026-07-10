import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/de/ogImage";
import { getISOWeekRange, isValidWeek } from "@/lib/de/weeks";
import { formatShortDE } from "@/lib/de/locale";

export const alt = "Kalenderwoche – Datum & Wochentage – Kalender365.pro";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const isoDay = (d: Date) => d.toISOString().slice(0, 10);

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = /^(\d{1,2})-(\d{4})$/.exec(slug);
  const week = m ? Number(m[1]) : 0;
  const yr = m ? Number(m[2]) : 0;
  const valid = m && yr >= 1900 && yr <= 2100 && isValidWeek(yr, week);
  const subtitle = valid
    ? (() => {
        const r = getISOWeekRange(yr, week);
        return `${formatShortDE(isoDay(r.start))} – ${formatShortDE(isoDay(r.end))}`;
      })()
    : "Datum & Wochentage nach ISO 8601";
  return renderOgImage({
    kicker: "Kalenderwoche",
    title: valid ? `KW ${week} · ${yr}` : "Kalenderwoche",
    subtitle,
  });
}
