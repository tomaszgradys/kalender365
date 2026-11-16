import { stateBySlug } from "@/lib/de/bundeslaender";
import { getFeiertage, getNationalFeiertage } from "@/lib/de/feiertage";
import { getNamenstage } from "@/lib/de/namenstage";
import { MONTH_NAMES_DE, weekdayDE } from "@/lib/de/locale";
import { berlinNow, isoWeekOf } from "@/lib/de/now";
import { SITE_URL } from "@/lib/de/site";

// Einbettbares Kalenderblatt: /widget/heute[?land=bayern]
// Heutiges Datum mit Wochentag, Kalenderwoche, Tag des Jahres, Namenstag und dem nächsten
// gesetzlichen Feiertag (bundesweit oder für das gewählte Bundesland). Stündlich neu gerendert.
export const revalidate = 3600;

const NAVY = "#003890";
const GREEN = "#16a34a";
const RED = "#b91c1c";

const daysBetween = (a: string, b: string) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000);
function tagMonat(iso: string) {
  const [, m, d] = iso.split("-").map(Number);
  return `${d}. ${MONTH_NAMES_DE[m - 1]}`;
}

export default async function HeuteWidget({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const state = typeof sp.land === "string" ? stateBySlug(sp.land) : undefined;
  const now = berlinNow();
  const today = `${now.year}-${String(now.month0 + 1).padStart(2, "0")}-${String(now.day).padStart(2, "0")}`;
  const kw = isoWeekOf(now.year, now.month0, now.day).week;
  const dayOfYear = daysBetween(`${now.year}-01-01`, today) + 1;
  const daysInYear = daysBetween(`${now.year}-01-01`, `${now.year}-12-31`) + 1;
  const namen = getNamenstage(now.month0, now.day);

  const list = [now.year, now.year + 1]
    .flatMap((y) => (state ? getFeiertage(y, state.code, { includePartial: false, includeSundayLegal: false }) : getNationalFeiertage(y)))
    .sort((a, b) => a.date.localeCompare(b.date));
  const todayHoliday = list.find((h) => h.date === today);
  const next = list.find((h) => h.date > today);
  const n = next ? daysBetween(today, next.date) : 0;
  const isSunday = new Date(`${today}T00:00:00Z`).getUTCDay() === 0;

  const row: React.CSSProperties = { padding: "7px 0", borderTop: "1px solid #e2e8f0" };
  const label: React.CSSProperties = { display: "block", fontSize: 11, color: "#475569", letterSpacing: 0.2 };
  return (
    <div style={{ padding: 8, maxWidth: 340, margin: "0 auto" }}>
      <div style={{ border: "1px solid #cbd5e1", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
        <div style={{ background: NAVY, color: "#fff", textAlign: "center", padding: "7px 8px", fontWeight: 700, fontSize: 15 }}>{weekdayDE(today)}</div>
        <div style={{ textAlign: "center", padding: "6px 8px 10px" }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, color: todayHoliday || isSunday ? RED : NAVY }}>{now.day}</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>
            {MONTH_NAMES_DE[now.month0]} {now.year}
          </div>
          {todayHoliday && <div style={{ marginTop: 2, fontSize: 13, fontWeight: 700, color: RED }}>{todayHoliday.name}</div>}
        </div>
        <div style={{ padding: "0 14px 6px" }}>
          <div style={row}>
            <span style={label}>Kalenderwoche und Tag des Jahres</span>
            <strong>KW {kw}</strong>, Tag {dayOfYear} von {daysInYear}
          </div>
          {namen.length > 0 && (
            <div style={row}>
              <span style={label}>Namenstag</span>
              {namen.slice(0, 5).join(", ")}
            </div>
          )}
          {next && (
            <div style={row}>
              <span style={label}>Nächster Feiertag {state ? `in ${state.name}` : "(bundesweit)"}</span>
              {weekdayDE(next.date)}, {tagMonat(next.date)}: {next.name} ({n === 1 ? "morgen" : `in ${n} Tagen`})
            </div>
          )}
        </div>
        <div style={{ borderTop: "1px solid #e2e8f0", padding: "6px 14px", textAlign: "right", fontSize: 12 }}>
          <a href={`${SITE_URL}/heute`} target="_blank" rel="noopener" style={{ color: NAVY, fontWeight: 700, textDecoration: "none" }}>
            Kalender365<span style={{ color: GREEN }}>.pro</span>
          </a>
        </div>
      </div>
    </div>
  );
}
