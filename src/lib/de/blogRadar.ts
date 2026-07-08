// Radar of upcoming German calendar anchors. Feeds the autoblog (blogGen.ts) a
// factual list of what is imminent so it can pick topics that land "on point" —
// a recurring event that is a few days to a few weeks out. Everything here is
// deterministic (Feiertage, Schulferien, Astronomie); no prose is generated.

import { getAllFeiertage } from "./feiertage";
import { getSchulferien, statesWithData, FERIEN_TYP_LABEL } from "./schulferien";
import { getSeasons, getDSTChanges } from "./astroYear";
import { getMoonPhaseInstants } from "./moonPhases";
import { stateByCode, type StateCode } from "./bundeslaender";
import { berlinNow } from "./now";
import { formatLongDE, weekdayDE } from "./locale";

export type RadarEvent = {
  date: string; // YYYY-MM-DD
  daysAway: number; // 0 = heute, positiv = in Zukunft
  kind: "feiertag" | "ferien" | "astro" | "mond";
  label: string; // human-readable German
};

// How far ahead to look. ~7 weeks so a post can be published comfortably before
// an event (e.g. Zeitumstellung, Ferienbeginn) while it is still search-relevant.
const WINDOW_DAYS = 50;

function todayIso(): string {
  const { year, month0, day } = berlinNow();
  return `${year}-${String(month0 + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function daysAway(iso: string, from: string): number {
  const a = Date.parse(`${iso}T00:00:00Z`);
  const b = Date.parse(`${from}T00:00:00Z`);
  return Math.round((a - b) / 86_400_000);
}

function stateNames(codes: readonly StateCode[]): string {
  if (codes.length >= 12) return "bundesweit";
  return codes.map((c) => stateByCode(c).name).join(", ");
}

/** All upcoming anchors within the window, sorted by date. */
export function getRadar(from = todayIso()): RadarEvent[] {
  const year = Number(from.slice(0, 4));
  const years = [year, year + 1]; // Fenster kann den Jahreswechsel überschreiten
  const inWindow = (iso: string) => {
    const d = daysAway(iso, from);
    return d >= 0 && d <= WINDOW_DAYS;
  };
  const events: RadarEvent[] = [];

  // --- Feiertage ---
  for (const y of years) {
    for (const f of getAllFeiertage(y)) {
      if (!inWindow(f.date)) continue;
      const where =
        f.scope === "national"
          ? "bundesweit"
          : f.scope === "partial"
            ? `regional (${stateNames(f.states)})`
            : stateNames(f.states);
      events.push({
        date: f.date,
        daysAway: daysAway(f.date, from),
        kind: "feiertag",
        label: `Feiertag „${f.name}" am ${formatLongDE(f.date)} (${weekdayDE(f.date)}) — ${where}`,
      });
    }
  }

  // --- Schulferien: Beginn/Ende je Bundesland, gruppiert nach Datum+Typ ---
  type FerienGroup = { date: string; typ: string; boundary: "beginnen" | "enden"; states: string[] };
  const ferien = new Map<string, FerienGroup>();
  const addFerien = (date: string, typ: string, boundary: FerienGroup["boundary"], state: string) => {
    const key = `${date}|${typ}|${boundary}`;
    let g = ferien.get(key);
    if (!g) ferien.set(key, (g = { date, typ, boundary, states: [] }));
    g.states.push(state);
  };
  for (const y of years) {
    for (const code of statesWithData(y)) {
      const rec = getSchulferien(y, code);
      if (!rec) continue;
      const name = stateByCode(code).name;
      for (const p of rec.periods) {
        const typLabel = FERIEN_TYP_LABEL[p.typ] ?? p.typ;
        if (inWindow(p.start)) addFerien(p.start, typLabel, "beginnen", name);
        // Ende nur zeigen, wenn die Ferien gerade laufen (Start liegt in der Vergangenheit).
        if (inWindow(p.end) && daysAway(p.start, from) < 0) addFerien(p.end, typLabel, "enden", name);
      }
    }
  }
  for (const g of ferien.values()) {
    events.push({
      date: g.date,
      daysAway: daysAway(g.date, from),
      kind: "ferien",
      label: `${g.typ} ${g.boundary} am ${formatLongDE(g.date)} in: ${g.states.join(", ")}`,
    });
  }

  // --- Astronomie: Jahreszeitenwechsel + Zeitumstellung ---
  for (const y of years) {
    for (const s of getSeasons(y)) {
      if (inWindow(s.date)) {
        events.push({
          date: s.date,
          daysAway: daysAway(s.date, from),
          kind: "astro",
          label: `Astronomischer Beginn: ${s.name} am ${formatLongDE(s.date)}`,
        });
      }
    }
    for (const d of getDSTChanges(y)) {
      if (inWindow(d.date)) {
        events.push({
          date: d.date,
          daysAway: daysAway(d.date, from),
          kind: "astro",
          label: `Zeitumstellung: ${d.label} am ${formatLongDE(d.date)}`,
        });
      }
    }
  }

  // --- Mond: nächster Voll- und Neumond im Fenster ---
  for (const type of ["full", "new"] as const) {
    for (const y of years) {
      const next = getMoonPhaseInstants(y).find((m) => m.type === type && inWindow(m.date));
      if (next) {
        events.push({
          date: next.date,
          daysAway: daysAway(next.date, from),
          kind: "mond",
          label: `${next.label} am ${formatLongDE(next.date)} (${next.zodiacSign})`,
        });
        break;
      }
    }
  }

  return events.sort((a, b) => a.date.localeCompare(b.date));
}

/** Compact bullet list of the radar for the LLM prompt. */
export function radarForPrompt(from = todayIso()): string {
  const rows = getRadar(from).slice(0, 18);
  if (rows.length === 0) return "(keine markanten Termine im Fenster — wähle ein starkes, dauerhaft gesuchtes Evergreen-Thema)";
  return rows.map((e) => `- in ${e.daysAway} Tag(en): ${e.label}`).join("\n");
}
