import { parseYear } from "@/lib/de/year";
import { getNationalFeiertage } from "@/lib/de/feiertage";
import { buildICS, icsResponse, type IcsEvent } from "@/lib/de/ics";

export async function GET(_req: Request, { params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) return new Response("Not found", { status: 404 });
  const events: IcsEvent[] = getNationalFeiertage(y).map((h) => ({
    uid: `feiertag-${h.slug}-${h.date}@kalender365.pro`,
    start: h.date,
    summary: h.name,
    description: "Bundesweiter gesetzlicher Feiertag",
  }));
  const ics = buildICS(`Feiertage ${y} Deutschland`, events);
  return icsResponse(`feiertage-${y}-deutschland.ics`, ics);
}
