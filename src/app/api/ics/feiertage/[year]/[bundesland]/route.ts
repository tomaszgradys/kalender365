import { parseYear } from "@/lib/de/year";
import { getFeiertage } from "@/lib/de/feiertage";
import { stateBySlug } from "@/lib/de/bundeslaender";
import { buildICS, icsResponse, type IcsEvent } from "@/lib/de/ics";

export async function GET(_req: Request, { params }: { params: Promise<{ year: string; bundesland: string }> }) {
  const { year, bundesland } = await params;
  const y = parseYear(year);
  const state = stateBySlug(bundesland);
  if (!y || !state) return new Response("Not found", { status: 404 });
  // Only work-free statutory days (exclude "partial" municipal and sunday-legal).
  const events: IcsEvent[] = getFeiertage(y, state.code, { includePartial: false, includeSundayLegal: false }).map((h) => ({
    uid: `feiertag-${state.code}-${h.slug}-${h.date}@kalender365.pro`,
    start: h.date,
    summary: h.name,
    description: `Gesetzlicher Feiertag in ${state.name}`,
  }));
  const ics = buildICS(`Feiertage ${y} ${state.name}`, events);
  return icsResponse(`feiertage-${y}-${state.slug}.ics`, ics);
}
