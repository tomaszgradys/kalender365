import ExcelJS from "exceljs";
import { parseYear } from "@/lib/de/year";
import { BUNDESLAENDER, stateBySlug, type StateCode } from "@/lib/de/bundeslaender";
import { monthMatrix } from "@/lib/de/calendar";
import { getAllFeiertage, getFeiertage, getNationalFeiertage } from "@/lib/de/feiertage";
import { getSchulferien, FERIEN_TYP_LABEL } from "@/lib/de/schulferien";
import { MONTH_NAMES_DE, WEEKDAY_SHORT_DE, formatShortDE, weekdayDE } from "@/lib/de/locale";

export const runtime = "nodejs";

// Editierbarer Excel-Jahresplaner + Feiertage (+ Schulferien je Bundesland).
// /api/xlsx/de/2026?land=bayern
const NAVY = "FF003890";
const WHITE = "FFFFFFFF";
const GREEN_BG = "FFDCFCE7";
const AMBER_BG = "FFFEF3C7";
const GREY_BG = "FFF1F5F9";

const STATE_NAME = new Map(BUNDESLAENDER.map((b) => [b.code, b.name] as const));

/** ISO-Tage innerhalb einer Schulferienphase des Landes (leer ohne Land). */
function ferienSet(year: number, state?: StateCode): Set<string> {
  const set = new Set<string>();
  if (!state) return set;
  const rec = getSchulferien(year, state);
  if (!rec) return set;
  for (const p of rec.periods) {
    for (let t = Date.parse(`${p.start}T00:00:00Z`); t <= Date.parse(`${p.end}T00:00:00Z`); t += 86400000) {
      set.add(new Date(t).toISOString().slice(0, 10));
    }
  }
  return set;
}

function fill(argb: string): ExcelJS.Fill {
  return { type: "pattern", pattern: "solid", fgColor: { argb } };
}

export async function GET(req: Request, { params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) return new Response("Not found", { status: 404 });

  const st = new URL(req.url).searchParams.get("land");
  const state = st ? stateBySlug(st) : null;
  const stateCode = state?.code;
  const regionLabel = state ? state.name : "Deutschland";

  const wb = new ExcelJS.Workbook();
  wb.creator = "Kalender365.pro";
  wb.created = new Date();

  // ------- Sheet 1: Jahresplaner (Tage × Monate) -------
  const plan = wb.addWorksheet(`Jahresplaner ${y}`, {
    views: [{ state: "frozen", xSplit: 1, ySplit: 1 }],
  });
  plan.getColumn(1).width = 5;
  for (let m = 0; m < 12; m++) plan.getColumn(m + 2).width = 6;

  // Kopfzeile
  const header = plan.getRow(1);
  header.getCell(1).value = "Tag";
  MONTH_NAMES_DE.forEach((name, m) => (header.getCell(m + 2).value = name));
  header.eachCell((c) => {
    c.font = { bold: true, color: { argb: WHITE } };
    c.fill = fill(NAVY);
    c.alignment = { horizontal: "center" };
  });

  // Nachschlagetabellen je Monat + Feiertagsnamen
  const months = MONTH_NAMES_DE.map((_, m) => {
    const byDay: Record<number, { weekend: boolean; holiday: boolean; iso: string }> = {};
    for (const d of monthMatrix(y, m, stateCode).flat()) if (d.day > 0) byDay[d.day] = d;
    return byDay;
  });
  const ferien = ferienSet(y, stateCode);
  const holidayName = new Map<string, string>();
  for (const h of stateCode ? getFeiertage(y, stateCode, { includePartial: false, includeSundayLegal: false }) : getNationalFeiertage(y)) {
    holidayName.set(h.date, h.name);
  }

  for (let day = 1; day <= 31; day++) {
    const row = plan.getRow(day + 1);
    const dc = row.getCell(1);
    dc.value = day;
    dc.font = { bold: true, color: { argb: "FF64748B" } };
    dc.alignment = { horizontal: "center" };
    for (let m = 0; m < 12; m++) {
      const cell = row.getCell(m + 2);
      const d = months[m][day];
      if (!d) {
        cell.fill = fill(GREY_BG);
        continue;
      }
      cell.value = WEEKDAY_SHORT_DE[weekdayIndex(d.iso)];
      cell.alignment = { horizontal: "center" };
      if (d.holiday) {
        cell.fill = fill(GREEN_BG);
        cell.font = { bold: true, color: { argb: "FF00814f" } };
        const name = holidayName.get(d.iso);
        if (name) cell.note = name;
      } else if (ferien.has(d.iso)) {
        cell.fill = fill(AMBER_BG);
        cell.font = { color: { argb: "FFb45309" } };
      } else if (d.weekend) {
        cell.fill = fill(GREY_BG);
        cell.font = { color: { argb: "FF94a3b8" } };
      }
    }
  }

  // ------- Sheet 2: Feiertage -------
  const fs = wb.addWorksheet(`Feiertage ${y}`, { views: [{ state: "frozen", ySplit: 1 }] });
  fs.columns = [
    { header: "Datum", key: "d", width: 12 },
    { header: "Wochentag", key: "wt", width: 14 },
    { header: "Feiertag", key: "n", width: 30 },
    { header: "Gilt in", key: "g", width: 60 },
  ];
  fs.getRow(1).eachCell((c) => {
    c.font = { bold: true, color: { argb: WHITE } };
    c.fill = fill(NAVY);
  });
  for (const h of getAllFeiertage(y)) {
    if (h.scope === "sunday-legal") continue;
    const gilt =
      h.scope === "national"
        ? "bundesweit"
        : h.states.map((s) => STATE_NAME.get(s) ?? s).join(", ");
    fs.addRow({
      d: formatShortDE(h.date),
      wt: weekdayDE(h.date),
      n: h.scope === "partial" ? `${h.name} (teilweise)` : h.name,
      g: gilt,
    });
  }

  // ------- Sheet 3: Schulferien (nur mit Land) -------
  const rec = stateCode ? getSchulferien(y, stateCode) : null;
  if (rec) {
    const sf = wb.addWorksheet(`Schulferien ${y}`, { views: [{ state: "frozen", ySplit: 1 }] });
    sf.columns = [
      { header: "Ferienart", key: "a", width: 18 },
      { header: "Beginn", key: "b", width: 12 },
      { header: "Ende", key: "e", width: 12 },
      { header: "Tage", key: "t", width: 8 },
    ];
    sf.getRow(1).eachCell((c) => {
      c.font = { bold: true, color: { argb: WHITE } };
      c.fill = fill(NAVY);
    });
    for (const p of rec.periods) {
      const days = Math.round((Date.parse(`${p.end}T00:00:00Z`) - Date.parse(`${p.start}T00:00:00Z`)) / 86400000) + 1;
      sf.addRow({ a: FERIEN_TYP_LABEL[p.typ], b: formatShortDE(p.start), e: formatShortDE(p.end), t: days });
    }
  }

  const buf = await wb.xlsx.writeBuffer();
  const suffix = state ? `-${state.slug}` : "";
  return new Response(buf as ArrayBuffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `inline; filename="kalender-${y}${suffix}.xlsx"`,
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      "X-Region": regionLabel,
    },
  });
}

/** Mon=0..So=6 aus ISO-Datum. */
function weekdayIndex(iso: string): number {
  const [yy, mm, dd] = iso.split("-").map(Number);
  return (new Date(Date.UTC(yy, mm - 1, dd)).getUTCDay() + 6) % 7;
}
