// German public holidays (gesetzliche Feiertage) provider — deterministic,
// no runtime data source. Covers all 16 Bundesländer and their regional and
// partial holidays.
//
// IMPORTANT — this is NOT the Polish holiday model. Two deliberate differences:
//  1. There is no "if a holiday falls on Saturday the employer gives a day back"
//     rule (that is Polish labour law, art. 130 KP). German Arbeitstag/Werktag
//     counting must NOT apply it — see arbeitstage.ts.
//  2. Holidays are state-scoped. A day can be a statutory work-free day in one
//     Bundesland and an ordinary working day in another.
//
// Sources of truth for the rules encoded here:
//   - Gemeinsame nationwide holidays: § fixed by all Länder uniformly.
//   - Regional holidays: the respective Feiertagsgesetze of each Land.
//   Historische Änderungen (für das Render-Fenster 2015–2035 abgebildet):
//   - Reformationstag: BB/MV/SN/ST/TH seit 1990; HB/HH/NI/SH dauerhaft seit
//     2018; 2017 einmalig in allen 16 Ländern (500 Jahre Reformation).
//   - Internationaler Frauentag: BE seit 2019 (Gesetz vom 30.01.2019, GVBl.
//     S. 22), MV seit 2023. Weltkindertag: TH seit 2019.
//   - Berlin, einmalige Feiertage: 8. Mai 2020 (75 Jahre Befreiung, Gesetz vom
//     30.01.2019), 8. Mai 2025 und 17. Juni 2028 (§ 1 Abs. 1 Nr. 11/12 FTG Bln,
//     Viertes Änderungsgesetz vom 10.07.2024, GVBl. 2024 Nr. 28 S. 460).
//   Geprüft 2026-10-22 (siehe Claude/kalender365-recovery/raport-dane-DE.md).

import type { StateCode } from "./bundeslaender";
import { STATE_CODES } from "./bundeslaender";

/** Anonymous Gregorian algorithm (Meeus/Jones/Butcher) — Easter Sunday (UTC). */
export function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}
function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Buß- und Bettag: the Wednesday before 23 November. */
export function bussUndBettag(year: number): Date {
  const d = new Date(Date.UTC(year, 10, 22)); // 22 Nov
  while (d.getUTCDay() !== 3) d.setUTCDate(d.getUTCDate() - 1); // walk back to Wednesday
  return d;
}

/**
 * scope:
 *  - "national"   → statutory work-free day in all 16 Länder.
 *  - "state"      → statutory work-free day in the listed Länder.
 *  - "partial"    → work-free only in some municipalities of the listed Land(s)
 *                   (Fronleichnam SN/TH, Mariä Himmelfahrt BY, Augsburger Friedensfest).
 *  - "sunday-legal" → legally named a holiday (e.g. Brandenburg Oster-/Pfingstsonntag)
 *                   but always falls on a Sunday, so no extra day off.
 */
export type FeiertagScope = "national" | "state" | "partial" | "sunday-legal";

export type Feiertag = {
  date: string; // YYYY-MM-DD
  name: string; // display name with umlauts
  slug: string; // ASCII slug
  scope: FeiertagScope;
  /** Länder in which this counts as a statutory (work-free) day. */
  states: StateCode[];
  movable: boolean;
  /** Explanation for partial / sunday-legal entries. */
  note?: string;
};

type Def = Omit<Feiertag, "date"> & {
  date: (y: number) => Date;
  /** First year the rule applies (inclusive). */
  sinceYear?: number;
  /** Last year the rule applies (inclusive). */
  untilYear?: number;
  /** Explicit list of years (one-off holidays). Overrides since/until. */
  onlyYears?: number[];
};

/** Reformationstag: die fünf östlichen Länder seit der Wiedervereinigung. */
const REFORMATION_EAST: StateCode[] = ["BB", "MV", "SN", "ST", "TH"];
/** Reformationstag: die vier norddeutschen Länder dauerhaft seit 2018. */
const REFORMATION_NORTH: StateCode[] = ["HB", "HH", "NI", "SH"];
/** Reformationstag 2017 (500 Jahre Reformation): einmalig in den übrigen sieben Ländern. */
const REFORMATION_2017_ONLY: StateCode[] = ["BW", "BY", "BE", "HE", "NW", "RP", "SL"];
const ALLERHEILIGEN_STATES: StateCode[] = ["BW", "BY", "NW", "RP", "SL"];
const FRONLEICHNAM_FULL: StateCode[] = ["BW", "BY", "HE", "NW", "RP", "SL"];
const DREIKOENIG_STATES: StateCode[] = ["BW", "BY", "ST"];

const DEFS: Def[] = [
  // ---- Nationwide fixed ----
  { name: "Neujahr", slug: "neujahr", scope: "national", states: STATE_CODES, movable: false, date: (y) => new Date(Date.UTC(y, 0, 1)) },
  { name: "Tag der Arbeit", slug: "tag-der-arbeit", scope: "national", states: STATE_CODES, movable: false, date: (y) => new Date(Date.UTC(y, 4, 1)) },
  { name: "Tag der Deutschen Einheit", slug: "tag-der-deutschen-einheit", scope: "national", states: STATE_CODES, movable: false, date: (y) => new Date(Date.UTC(y, 9, 3)) },
  { name: "1. Weihnachtsfeiertag", slug: "1-weihnachtsfeiertag", scope: "national", states: STATE_CODES, movable: false, date: (y) => new Date(Date.UTC(y, 11, 25)) },
  { name: "2. Weihnachtsfeiertag", slug: "2-weihnachtsfeiertag", scope: "national", states: STATE_CODES, movable: false, date: (y) => new Date(Date.UTC(y, 11, 26)) },

  // ---- Nationwide movable (Easter-based) ----
  { name: "Karfreitag", slug: "karfreitag", scope: "national", states: STATE_CODES, movable: true, date: (y) => addDays(easterSunday(y), -2) },
  { name: "Ostermontag", slug: "ostermontag", scope: "national", states: STATE_CODES, movable: true, date: (y) => addDays(easterSunday(y), 1) },
  { name: "Christi Himmelfahrt", slug: "christi-himmelfahrt", scope: "national", states: STATE_CODES, movable: true, date: (y) => addDays(easterSunday(y), 39) },
  { name: "Pfingstmontag", slug: "pfingstmontag", scope: "national", states: STATE_CODES, movable: true, date: (y) => addDays(easterSunday(y), 50) },

  // ---- Regional fixed ----
  { name: "Heilige Drei Könige", slug: "heilige-drei-koenige", scope: "state", states: DREIKOENIG_STATES, movable: false, date: (y) => new Date(Date.UTC(y, 0, 6)) },
  { name: "Internationaler Frauentag", slug: "internationaler-frauentag", scope: "state", states: ["BE"], sinceYear: 2019, movable: false, date: (y) => new Date(Date.UTC(y, 2, 8)) },
  { name: "Internationaler Frauentag", slug: "internationaler-frauentag", scope: "state", states: ["MV"], sinceYear: 2023, movable: false, date: (y) => new Date(Date.UTC(y, 2, 8)) },
  { name: "Mariä Himmelfahrt", slug: "mariae-himmelfahrt", scope: "state", states: ["SL"], movable: false, date: (y) => new Date(Date.UTC(y, 7, 15)) },
  { name: "Mariä Himmelfahrt", slug: "mariae-himmelfahrt", scope: "partial", states: ["BY"], movable: false, note: "Nur in überwiegend katholischen Gemeinden Bayerns gesetzlicher Feiertag.", date: (y) => new Date(Date.UTC(y, 7, 15)) },
  { name: "Weltkindertag", slug: "weltkindertag", scope: "state", states: ["TH"], sinceYear: 2019, movable: false, date: (y) => new Date(Date.UTC(y, 8, 20)) },
  { name: "Reformationstag", slug: "reformationstag", scope: "state", states: REFORMATION_EAST, movable: false, date: (y) => new Date(Date.UTC(y, 9, 31)) },
  { name: "Reformationstag", slug: "reformationstag", scope: "state", states: REFORMATION_NORTH, sinceYear: 2018, movable: false, date: (y) => new Date(Date.UTC(y, 9, 31)) },
  { name: "Reformationstag", slug: "reformationstag", scope: "state", states: REFORMATION_2017_ONLY, onlyYears: [2017], movable: false, note: "2017 einmalig bundesweit gesetzlicher Feiertag (500 Jahre Reformation).", date: (y) => new Date(Date.UTC(y, 9, 31)) },
  { name: "Allerheiligen", slug: "allerheiligen", scope: "state", states: ALLERHEILIGEN_STATES, movable: false, date: (y) => new Date(Date.UTC(y, 10, 1)) },

  // ---- Regional movable ----
  { name: "Fronleichnam", slug: "fronleichnam", scope: "state", states: FRONLEICHNAM_FULL, movable: true, date: (y) => addDays(easterSunday(y), 60) },
  { name: "Fronleichnam", slug: "fronleichnam", scope: "partial", states: ["SN", "TH"], movable: true, note: "Nur in einzelnen (überwiegend katholischen) Gemeinden Sachsens und Thüringens.", date: (y) => addDays(easterSunday(y), 60) },
  { name: "Buß- und Bettag", slug: "buss-und-bettag", scope: "state", states: ["SN"], movable: true, note: "Gesetzlicher Feiertag nur in Sachsen. In Bayern schulfrei, aber kein Feiertag.", date: (y) => bussUndBettag(y) },

  // ---- Einmalige Feiertage (Berlin) ----
  { name: "Tag der Befreiung (75. Jahrestag)", slug: "tag-der-befreiung-2020", scope: "state", states: ["BE"], onlyYears: [2020], movable: false, note: "Einmaliger gesetzlicher Feiertag nur in Berlin (Gesetz vom 30. Januar 2019, GVBl. S. 22).", date: (y) => new Date(Date.UTC(y, 4, 8)) },
  { name: "Tag der Befreiung (80. Jahrestag)", slug: "tag-der-befreiung-2025", scope: "state", states: ["BE"], onlyYears: [2025], movable: false, note: "Einmaliger gesetzlicher Feiertag nur in Berlin (§ 1 Abs. 1 Nr. 11 FTG Berlin, Gesetz vom 10. Juli 2024, GVBl. S. 460).", date: (y) => new Date(Date.UTC(y, 4, 8)) },
  { name: "75. Jahrestag des Volksaufstandes vom 17. Juni 1953", slug: "jahrestag-17-juni-1953", scope: "state", states: ["BE"], onlyYears: [2028], movable: false, note: "Einmaliger gesetzlicher Feiertag nur in Berlin (§ 1 Abs. 1 Nr. 12 FTG Berlin, Gesetz vom 10. Juli 2024, GVBl. S. 460). Fällt auf einen Samstag.", date: (y) => new Date(Date.UTC(y, 5, 17)) },

  // ---- Partial / municipal ----
  { name: "Augsburger Friedensfest", slug: "augsburger-friedensfest", scope: "partial", states: ["BY"], movable: false, note: "Gesetzlicher Feiertag nur im Stadtgebiet Augsburg.", date: (y) => new Date(Date.UTC(y, 7, 8)) },

  // ---- Sunday-legal (Brandenburg) ----
  { name: "Ostersonntag", slug: "ostersonntag", scope: "sunday-legal", states: ["BB"], movable: true, note: "In Brandenburg gesetzlicher Feiertag — fällt jedoch immer auf einen Sonntag.", date: (y) => easterSunday(y) },
  { name: "Pfingstsonntag", slug: "pfingstsonntag", scope: "sunday-legal", states: ["BB"], movable: true, note: "In Brandenburg gesetzlicher Feiertag — fällt jedoch immer auf einen Sonntag.", date: (y) => addDays(easterSunday(y), 49) },
];

function isActive(def: Def, year: number): boolean {
  if (def.onlyYears) return def.onlyYears.includes(year);
  if (def.sinceYear !== undefined && year < def.sinceYear) return false;
  if (def.untilYear !== undefined && year > def.untilYear) return false;
  return true;
}

/**
 * All German holidays for a year, each with the list of states in which it is a
 * statutory work-free day. Entries with the same name/date (e.g. the "SL full"
 * and "BY partial" Mariä Himmelfahrt) are kept separate because their scope and
 * note differ. Sorted by date.
 */
export function getAllFeiertage(year: number): Feiertag[] {
  return DEFS.filter((def) => isActive(def, year))
    .map((def) => {
      const { date, sinceYear: _s, untilYear: _u, onlyYears: _o, ...rest } = def;
      void _s;
      void _u;
      void _o;
      return { ...rest, date: iso(date(year)) };
    })
    .sort((a, b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name));
}

/**
 * Holidays that apply to a specific Bundesland. `includePartial` controls
 * whether "partial" (municipal / confession-dependent) days are listed —
 * default true so state pages can surface them with their note.
 */
export function getFeiertage(
  year: number,
  state: StateCode,
  opts: { includePartial?: boolean; includeSundayLegal?: boolean } = {},
): Feiertag[] {
  const { includePartial = true, includeSundayLegal = true } = opts;
  return getAllFeiertage(year).filter((h) => {
    if (!h.states.includes(state)) return false;
    if (h.scope === "partial" && !includePartial) return false;
    if (h.scope === "sunday-legal" && !includeSundayLegal) return false;
    return true;
  });
}

/** The nine nationwide holidays (for the "Deutschland" default view). */
export function getNationalFeiertage(year: number): Feiertag[] {
  return getAllFeiertage(year).filter((h) => h.scope === "national");
}

/**
 * Dates (YYYY-MM-DD) that are statutory work-free in the given state — used by
 * Arbeitstage / Brückentage. Excludes "partial" (uncertain municipal) and
 * "sunday-legal" days (the latter fall on Sundays and never reduce Arbeitstage).
 */
export function workFreeHolidaySet(year: number, state: StateCode): Set<string> {
  const set = new Set<string>();
  for (const h of getAllFeiertage(year)) {
    if (h.scope === "national" || (h.scope === "state" && h.states.includes(state))) {
      set.add(h.date);
    }
  }
  return set;
}
