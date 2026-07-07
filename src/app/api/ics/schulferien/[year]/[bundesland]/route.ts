import { parseYear } from "@/lib/de/year";
import { stateBySlug } from "@/lib/de/bundeslaender";
import { getSchulferien, FERIEN_TYP_LABEL } from "@/lib/de/schulferien";
import { buildICS, icsResponse, type IcsEvent } from "@/lib/de/ics";

export async function GET(_req: Request, { params }: { params: Promise<{ year: string; bundesland: string }> }) {
  const { year, bundesland } = await params;
  const y = parseYear(year);
  const state = stateBySlug(bundesland);
  if (!y || !state) return new Response("Not found", { status: 404 });
  const record = getSchulferien(y, state.code);
  if (!record) return new Response("Keine Ferientermine hinterlegt", { status: 404 });
  const events: IcsEvent[] = record.periods.map((p) => ({
    uid: `schulferien-${state.code}-${p.typ}-${p.start}@kalender365.pro`,
    start: p.start,
    end: p.end,
    summary: `${FERIEN_TYP_LABEL[p.typ]} ${state.name}`,
    description: `Schulferien in ${state.name} (Quelle: ${record.meta.source})`,
  }));
  const ics = buildICS(`Schulferien ${y} ${state.name}`, events);
  return icsResponse(`schulferien-${y}-${state.slug}.ics`, ics);
}
