import { getLongWeekends } from "@/lib/workdays";
import { buildIcs, icsResponse } from "@/lib/ics";

export const runtime = "nodejs";

// Plik iCal z długimi weekendami danego roku (każdy jako wydarzenie wielodniowe).
export async function GET(_req: Request, { params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const y = Number(year);
  if (!Number.isInteger(y) || y < 1900 || y > 2100) return new Response("Not found", { status: 404 });

  const lw = getLongWeekends(y);
  const events = lw.map((w, i) => ({
    uid: `dlugi-weekend-${y}-${i}@kalendarz.pro`,
    start: w.start,
    end: w.end,
    summary: `Długi weekend (${w.length} dni wolnego)`,
    category: "Długi weekend",
  }));
  return icsResponse(`dlugie-weekendy-${y}.ics`, buildIcs(`Długie weekendy ${y}`, events));
}
