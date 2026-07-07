import { parseYear } from "@/lib/de/year";
import { getFeiertage } from "@/lib/de/feiertage";
import { stateBySlug } from "@/lib/de/bundeslaender";
import { weekdayDE, formatShortDE } from "@/lib/de/locale";
import { buildCSV, csvResponse } from "@/lib/de/csv";

export async function GET(_req: Request, { params }: { params: Promise<{ year: string; bundesland: string }> }) {
  const { year, bundesland } = await params;
  const y = parseYear(year);
  const state = stateBySlug(bundesland);
  if (!y || !state) return new Response("Not found", { status: 404 });
  const rows = getFeiertage(y, state.code, { includePartial: true, includeSundayLegal: false }).map((h) => [
    h.name,
    formatShortDE(h.date),
    weekdayDE(h.date),
    h.scope === "partial" ? "teilweise/regional" : h.scope === "national" ? "bundesweit" : "Landesfeiertag",
  ]);
  const csv = buildCSV(["Feiertag", "Datum", "Wochentag", "Art"], rows);
  return csvResponse(`feiertage-${y}-${state.slug}.csv`, csv);
}
