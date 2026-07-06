// Schulferien (school holidays) per Bundesland.
//
// Unlike Polish "ferie zimowe", German school holidays are a full per-Land
// system spanning several types across a school year. Dates are set by each
// Land's Kultusministerium and coordinated via the KMK. We do NOT compute them —
// they must be seeded from official sources and verified before indexing.
//
// SEO gate (brief rule #6): a (year, state) page is only indexable when its
// data is complete AND verified (`lastVerifiedAt` set). Everything else renders
// as noindex / informational.

import type { StateCode } from "./bundeslaender";

export type FerienTyp =
  | "winterferien"
  | "osterferien"
  | "pfingstferien"
  | "sommerferien"
  | "herbstferien"
  | "weihnachtsferien";

export const FERIEN_TYP_LABEL: Record<FerienTyp, string> = {
  winterferien: "Winterferien",
  osterferien: "Osterferien",
  pfingstferien: "Pfingstferien",
  sommerferien: "Sommerferien",
  herbstferien: "Herbstferien",
  weihnachtsferien: "Weihnachtsferien",
};

/** A single holiday period. `start`/`end` are inclusive ISO dates. */
export type FerienPeriod = {
  typ: FerienTyp;
  start: string; // YYYY-MM-DD
  end: string; // YYYY-MM-DD (inclusive)
  note?: string;
};

/** Provenance metadata required for every seeded (year, state) record. */
export type FerienMeta = {
  source: string; // e.g. "KMK" or "Bayerisches Staatsministerium für Unterricht und Kultus"
  sourceUrl: string;
  retrievedAt: string | null; // ISO date the data was fetched
  validForSchoolYear: string; // e.g. "2025/2026"
  lastVerifiedAt: string | null; // ISO date a human verified it; null = NOT verified → noindex
  notes?: string;
};

export type SchulferienRecord = {
  year: number; // calendar year the periods fall in
  state: StateCode;
  periods: FerienPeriod[];
  /** Optional informational field for bewegliche Ferientage (set locally by schools). */
  beweglicheFerientage?: string[]; // ISO dates, may be empty/unknown
  meta: FerienMeta;
};

// --------------------------------------------------------------------------
// SEED DATA
// --------------------------------------------------------------------------
// TODO(data): Populate all 16 Bundesländer for 2026 and 2027 from official
// sources (KMK: https://www.kmk.org/service/ferien.html and the respective Land
// ministries). Every record MUST carry source metadata and be human-verified
// (set `lastVerifiedAt`) before it is allowed to be indexed.
//
// The single entry below is an UNVERIFIED EXAMPLE demonstrating the shape. Its
// `lastVerifiedAt` is null on purpose, so isSchulferienIndexable() returns false
// and the page will be served noindex until a human confirms the dates.

const SEED: SchulferienRecord[] = [
  {
    year: 2026,
    state: "BY",
    periods: [
      { typ: "winterferien", start: "2026-02-16", end: "2026-02-20", note: "Frühjahrs-/Winterferien" },
      { typ: "osterferien", start: "2026-03-30", end: "2026-04-10" },
      { typ: "pfingstferien", start: "2026-05-25", end: "2026-06-05" },
      { typ: "sommerferien", start: "2026-08-03", end: "2026-09-14" },
      { typ: "herbstferien", start: "2026-11-02", end: "2026-11-06" },
      { typ: "weihnachtsferien", start: "2026-12-24", end: "2027-01-08" },
    ],
    meta: {
      source: "Bayerisches Staatsministerium für Unterricht und Kultus",
      sourceUrl: "https://www.km.bayern.de/ferientermine",
      retrievedAt: null,
      validForSchoolYear: "2025/2026 & 2026/2027",
      lastVerifiedAt: null, // ← UNVERIFIED example. Verify before indexing.
      notes: "BEISPIELDATEN — vor Veröffentlichung gegen offizielle Quelle prüfen.",
    },
  },
];

const KEY = (year: number, state: StateCode) => `${year}:${state}`;
const INDEX = new Map(SEED.map((r) => [KEY(r.year, r.state), r]));

export function getSchulferien(year: number, state: StateCode): SchulferienRecord | null {
  return INDEX.get(KEY(year, state)) ?? null;
}

/** A (year, state) record is indexable only when seeded AND human-verified. */
export function isSchulferienIndexable(year: number, state: StateCode): boolean {
  const r = getSchulferien(year, state);
  return !!r && !!r.meta.lastVerifiedAt && r.periods.length > 0;
}

/** All states that have (any) seeded data for a year — for building index pages. */
export function statesWithData(year: number): StateCode[] {
  return SEED.filter((r) => r.year === year).map((r) => r.state);
}

/** Get a single Ferien type for a state/year, or null if that type doesn't exist there. */
export function getFerienByTyp(year: number, state: StateCode, typ: FerienTyp): FerienPeriod | null {
  const r = getSchulferien(year, state);
  return r?.periods.find((p) => p.typ === typ) ?? null;
}
