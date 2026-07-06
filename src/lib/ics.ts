// Budowanie plików iCalendar (.ics) — wydarzenia całodniowe (DTEND = następny dzień).
export type IcsEvent = { uid: string; start: string; end: string; summary: string; category?: string };

function ymd(iso: string): string {
  return iso.replace(/-/g, "");
}
function nextDay(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return ymd(d.toISOString().slice(0, 10));
}
function esc(s: string): string {
  return s.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");
}

export function buildIcs(calName: string, events: IcsEvent[]): string {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//kalendarz.pro//PL",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${esc(calName)}`,
    "X-WR-TIMEZONE:Europe/Warsaw",
  ];
  for (const e of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.uid}`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${ymd(e.start)}`,
      `DTEND;VALUE=DATE:${nextDay(e.end)}`,
      `SUMMARY:${esc(e.summary)}`,
      "TRANSP:TRANSPARENT"
    );
    if (e.category) lines.push(`CATEGORIES:${esc(e.category)}`);
    lines.push("END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function icsResponse(filename: string, body: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
