import { ferieForRegion, wojFromSlug } from "@/lib/vacationPlanner";
import { buildIcs, icsResponse } from "@/lib/ics";

export const runtime = "nodejs";

// Plik iCal z terminem ferii zimowych dla danego województwa.
export async function GET(_req: Request, { params }: { params: Promise<{ year: string; wojewodztwo: string }> }) {
  const { year, wojewodztwo } = await params;
  const y = Number(year);
  const woj = wojFromSlug(wojewodztwo);
  if (!Number.isInteger(y) || !woj) return new Response("Not found", { status: 404 });
  const f = ferieForRegion(woj, y);
  if (!f) return new Response("Not found", { status: 404 });

  const ics = buildIcs(`Ferie zimowe ${y} (${woj})`, [
    { uid: `ferie-${y}-${wojewodztwo}@kalendarz.pro`, start: f.start, end: f.end, summary: `Ferie zimowe ${y} — ${woj}`, category: "Ferie zimowe" },
  ]);
  return icsResponse(`ferie-zimowe-${y}-${wojewodztwo}.ics`, ics);
}
