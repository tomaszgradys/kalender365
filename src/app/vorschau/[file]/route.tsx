import { ImageResponse } from "next/og";
import { SITE_URL } from "@/lib/de/site";
import { parseYear } from "@/lib/de/year";
import { monthView, yearSummary } from "@/lib/de/calendar";
import { getNationalFeiertage } from "@/lib/de/feiertage";
import { MONTH_NAMES_DE, WEEKDAY_SHORT_DE } from "@/lib/de/locale";

// Vorschaubild des Jahreskalenders zum Ausdrucken als PNG (16.11.2026). Bei Suchen wie
// „Kalender 2027 zum Ausdrucken" zeigen Suchmaschinen einen großen Bilder-Block; die
// Druckseiten hatten bisher nur Inline-SVG-Skizzen, kein indexierbares Bild.
// Pfad /vorschau/ (nicht /api/, das ist in robots.txt gesperrt):
//   /vorschau/kalender-2027-zum-ausdrucken.png — A4 Hochformat (1240×1754), bundesweite Feiertage, KW.

const NAVY = "#003890";
const GREEN = "#16a34a";
const RED = "#dc2626";
const GREY = "#64748b";

let fontCache: Promise<ArrayBuffer[]> | null = null;
function fonts() {
  fontCache ??= Promise.all(
    ["DejaVuSans-Bold.ttf", "DejaVuSans.ttf"].map((f) => fetch(`${SITE_URL}/fonts/${f}`).then((r) => r.arrayBuffer())),
  );
  return fontCache;
}

function tagMonat(iso: string): string {
  const [, m, d] = iso.split("-").map(Number);
  return `${d}. ${MONTH_NAMES_DE[m - 1]}`;
}

function SmallMonth({ year, month0 }: { year: number; month0: number }) {
  const weeks = monthView(year, month0);
  const W = 44;
  return (
    <div style={{ display: "flex", flexDirection: "column", width: 40 + 7 * W, marginBottom: 32 }}>
      <div style={{ display: "flex", fontSize: 25, fontWeight: 700, color: NAVY, marginBottom: 6 }}>{MONTH_NAMES_DE[month0]}</div>
      <div style={{ display: "flex", borderBottom: "2px solid #cbd5e1" }}>
        <div style={{ display: "flex", width: 40, height: 26, alignItems: "center", fontSize: 13, color: "#94a3b8" }}>KW</div>
        {WEEKDAY_SHORT_DE.map((h, i) => (
          <div key={h} style={{ display: "flex", width: W, height: 26, alignItems: "center", justifyContent: "center", fontSize: 15, color: i === 6 ? RED : GREY }}>
            {h}
          </div>
        ))}
      </div>
      {weeks.map((week, wi) => (
        <div key={wi} style={{ display: "flex" }}>
          <div style={{ display: "flex", width: 40, height: 36, alignItems: "center", fontSize: 14, color: "#94a3b8" }}>{week.kw}</div>
          {week.days.map((d, di) => (
            <div
              key={di}
              style={{
                display: "flex",
                width: W,
                height: 36,
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: d.holiday ? 700 : 400,
                color: d.holiday || d.weekday === 6 ? RED : d.weekday === 5 ? GREY : "#1e293b",
              }}
            >
              {d.day ? d.day : ""}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function YearSheet({ year }: { year: number }) {
  const feiertage = getNationalFeiertage(year);
  const summary = yearSummary(year);
  const half = Math.ceil(feiertage.length / 2);
  const cols = [feiertage.slice(0, half), feiertage.slice(half)];
  const rows = [0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => r * 3 + c));
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: "white", fontFamily: "DejaVu", padding: "56px 62px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div style={{ display: "flex", fontSize: 80, fontWeight: 700, color: NAVY, lineHeight: 1 }}>Kalender {year}</div>
        <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: NAVY }}>
          Kalender365<span style={{ color: GREEN }}>.pro</span>
        </div>
      </div>
      <div style={{ display: "flex", marginTop: 14, fontSize: 23, color: GREY }}>
        Deutschland · {feiertage.length} bundesweite Feiertage · {summary.isoWeeks} Kalenderwochen
      </div>
      <div style={{ display: "flex", marginTop: 18, marginBottom: 26, height: 6, width: 120, background: GREEN, borderRadius: 3 }} />
      {rows.map((row, ri) => (
        <div key={ri} style={{ display: "flex", justifyContent: "space-between" }}>
          {row.map((m) => (
            <SmallMonth key={m} year={year} month0={m} />
          ))}
        </div>
      ))}
      <div style={{ display: "flex", flexDirection: "column", marginTop: 6, borderTop: "2px solid #cbd5e1", paddingTop: 16 }}>
        <div style={{ display: "flex", fontSize: 21, fontWeight: 700, color: NAVY, marginBottom: 8 }}>Gesetzliche Feiertage {year} (bundesweit)</div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {cols.map((col, ci) => (
            <div key={ci} style={{ display: "flex", flexDirection: "column", width: 548 }}>
              {col.map((h) => (
                <div key={h.date} style={{ display: "flex", fontSize: 17, color: "#1e293b", lineHeight: 1.6 }}>
                  <div style={{ display: "flex", color: RED, fontWeight: 700, width: 210 }}>
                    {tagMonat(h.date)} ({WEEKDAY_SHORT_DE[(new Date(`${h.date}T00:00:00Z`).getUTCDay() + 6) % 7]})
                  </div>
                  <div style={{ display: "flex" }}>{h.name}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const m = decodeURIComponent(file).match(/^kalender-(\d{4})-zum-ausdrucken\.png$/);
  const year = m ? parseYear(m[1]) : null;
  if (!year) return new Response("Not found", { status: 404 });
  const [bold, regular] = await fonts();
  return new ImageResponse(<YearSheet year={year} />, {
    width: 1240,
    height: 1754,
    headers: { "Cache-Control": "public, max-age=86400, s-maxage=2592000, stale-while-revalidate=86400" },
    fonts: [
      { name: "DejaVu", data: bold, weight: 700, style: "normal" },
      { name: "DejaVu", data: regular, weight: 400, style: "normal" },
    ],
  });
}
