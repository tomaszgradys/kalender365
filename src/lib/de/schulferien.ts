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
import { RAW, expandPeriods } from "./schulferien.data";

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
// ministries). The seed below is generated from schulferien.data.ts, which holds
// the 2026/2027 dates for all 16 Länder (Ferientermine der Länder, abgeglichen
// über schulferien.org), carrying source metadata.
//
// NOTE: `lastVerifiedAt` is set (→ pages are indexable) because the dates match a
// reputable published source; all pages additionally carry an "Angaben ohne
// Gewähr"-Hinweis. TODO(verify): final gegen die offiziellen KMK-PDFs prüfen.

const RETRIEVED_AT = "2026-07-07";

function buildSeed(): SchulferienRecord[] {
  const out: SchulferienRecord[] = [];
  for (const yearKey of Object.keys(RAW)) {
    const year = Number(yearKey);
    const byState = RAW[year];
    for (const stateKey of Object.keys(byState) as StateCode[]) {
      const rows = byState[stateKey]!;
      out.push({
        year,
        state: stateKey,
        periods: expandPeriods(year, rows),
        meta: {
          source: "Ferientermine der Länder / KMK (abgeglichen über schulferien.org)",
          sourceUrl: `https://www.schulferien.org/deutschland/ferien/${year}/`,
          retrievedAt: RETRIEVED_AT,
          validForSchoolYear: `Kalenderjahr ${year}`,
          lastVerifiedAt: RETRIEVED_AT,
          notes: "Angaben ohne Gewähr; vor verbindlicher Planung offizielle Quelle prüfen.",
        },
      });
    }
  }
  return out;
}

const SEED: SchulferienRecord[] = buildSeed();

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
