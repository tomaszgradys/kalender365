import { getNonWorkingHolidays } from "@/lib/holidays";

export const runtime = "nodejs";

// Plik iCal (.ics) z dniami ustawowo wolnymi — do importu w Google/Apple/Outlook Calendar.
// Wydarzenia całodniowe (DTEND = następny dzień, wg specyfikacji iCalendar).
function nextDay(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}
function esc(s: string): string {
  return s.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");
}

export async function GET(_req: Request, { params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const y = Number(year);
  if (!Number.isInteger(y) || y < 1900 || y > 2100) {
    return new Response("Not found", { status: 404 });
  }

  const holidays = getNonWorkingHolidays(y);
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//kalendarz.pro//Dni wolne od pracy//PL",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:Dni wolne od pracy ${y} (Polska)`,
    "X-WR-TIMEZONE:Europe/Warsaw",
  ];
  for (const h of holidays) {
    const start = h.date.replace(/-/g, "");
    lines.push(
      "BEGIN:VEVENT",
      `UID:${h.date}-dni-wolne@kalendarz.pro`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${start}`,
      `DTEND;VALUE=DATE:${nextDay(h.date)}`,
      `SUMMARY:${esc(h.name.pl)}`,
      "TRANSP:TRANSPARENT",
      "CATEGORIES:Dzień wolny od pracy",
      "END:VEVENT"
    );
  }
  lines.push("END:VCALENDAR");

  return new Response(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="dni-wolne-${y}.ics"`,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
