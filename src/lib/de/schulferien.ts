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
// The seed below is generated from schulferien.data.ts, which holds the 2026,
// 2027 and 2028 dates for all 16 Länder.
//
// NOTE: `lastVerifiedAt` is set per year (→ pages are indexable). 2026/2027 were
// verified on 2026-07-09 against the official KMK Ferienkalender PDFs
// (FER2025_26, FER2026_27, FER2027_28, Stand 09.10.2025); 2028 was added and
// verified on 2026-10-22 against FER2027_28 + FER2028_29 (Stand 09.10.2025).
// See the correction log in schulferien.data.ts. All pages additionally carry
// an "Angaben ohne Gewähr"-Hinweis. A year without an entry in YEAR_META is
// seeded but NOT verified → noindex (isSchulferienIndexable = false).

const YEAR_META: Record<number, { retrievedAt: string; verifiedAt: string; pdfs: string }> = {
  2026: { retrievedAt: "2026-07-07", verifiedAt: "2026-07-09", pdfs: "FER2025_26, FER2026_27" },
  2027: { retrievedAt: "2026-07-07", verifiedAt: "2026-07-09", pdfs: "FER2026_27, FER2027_28" },
  2028: { retrievedAt: "2026-10-22", verifiedAt: "2026-10-22", pdfs: "FER2027_28, FER2028_29" },
};

function buildSeed(): SchulferienRecord[] {
  const out: SchulferienRecord[] = [];
  for (const yearKey of Object.keys(RAW)) {
    const year = Number(yearKey);
    const byState = RAW[year];
    const ym = YEAR_META[year];
    for (const stateKey of Object.keys(byState) as StateCode[]) {
      const rows = byState[stateKey]!;
      out.push({
        year,
        state: stateKey,
        periods: expandPeriods(year, rows),
        meta: {
          source: `Kultusministerkonferenz (KMK), offizieller Ferienkalender${ym ? ` ${ym.pdfs}` : ""} (Stand 09.10.2025)`,
          sourceUrl: "https://www.kmk.org/service/ferienregelung/ferienkalender.html",
          retrievedAt: ym?.retrievedAt ?? null,
          validForSchoolYear: `Kalenderjahr ${year}`,
          lastVerifiedAt: ym?.verifiedAt ?? null,
          notes: ym
            ? "Gegen die offiziellen KMK-Ferienkalender-PDFs geprüft. Angaben ohne Gewähr; vor verbindlicher Planung offizielle Quelle prüfen."
            : "Noch nicht gegen die offiziellen KMK-Ferienkalender geprüft.",
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

/**
 * School-holiday periods of a state that overlap a given calendar month.
 * Differentiates the per-Bundesland monthly calendar pages: months without a
 * regional holiday would otherwise be textually identical across all states.
 */
export function ferienPeriodsInMonth(
  year: number,
  month0: number,
  state: StateCode,
): { typ: FerienTyp; label: string; start: string; end: string }[] {
  const rec = getSchulferien(year, state);
  if (!rec) return [];
  const mStart = Date.UTC(year, month0, 1);
  const mEnd = Date.UTC(year, month0 + 1, 0); // last day of the month
  const out: { typ: FerienTyp; label: string; start: string; end: string }[] = [];
  for (const p of rec.periods) {
    const ps = Date.parse(`${p.start}T00:00:00Z`);
    const pe = Date.parse(`${p.end}T00:00:00Z`);
    if (pe < mStart || ps > mEnd) continue; // no overlap with this month
    out.push({ typ: p.typ, label: FERIEN_TYP_LABEL[p.typ], start: p.start, end: p.end });
  }
  return out;
}
