// iCalendar (.ics) generator for all-day events (Feiertage, Schulferien).
// RFC 5545: all-day events use DTSTART;VALUE=DATE and an EXCLUSIVE DTEND.

export type IcsEvent = {
  uid: string;
  start: string; // YYYY-MM-DD (inclusive)
  end?: string; // YYYY-MM-DD (inclusive); defaults to a single day
  summary: string;
  description?: string;
};

function compact(isoDate: string): string {
  return isoDate.replaceAll("-", "");
}
function addOneDay(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + 1));
  return dt.toISOString().slice(0, 10);
}
function esc(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}
function fold(line: string): string {
  // RFC 5545 line folding at 75 octets (approximate by chars — fine for ASCII/Latin).
  if (line.length <= 75) return line;
  const parts: string[] = [];
  let s = line;
  while (s.length > 75) {
    parts.push(s.slice(0, 75));
    s = " " + s.slice(75);
  }
  parts.push(s);
  return parts.join("\r\n");
}

export function buildICS(calName: string, events: IcsEvent[]): string {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Kalender365.pro//DE//",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${esc(calName)}`,
  ];
  for (const e of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.uid}`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${compact(e.start)}`,
      `DTEND;VALUE=DATE:${compact(addOneDay(e.end ?? e.start))}`,
      fold(`SUMMARY:${esc(e.summary)}`),
      ...(e.description ? [fold(`DESCRIPTION:${esc(e.description)}`)] : []),
      "TRANSP:TRANSPARENT",
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}

export function icsResponse(filename: string, body: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      // s-maxage → Vercel Edge/CDN puffert die Funktionsantwort (Kostenschutz).
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
