// Registry of the 16 German federal states (Bundesländer).
// Single source of truth for slugs (ASCII, no umlauts), display names (with
// umlauts), ISO 3166-2:DE codes and the common NRW abbreviation.
//
// Slug rule: ASCII only, umlauts transliterated (ä→ae, ö→oe, ü→ue, ß→ss).
// Used in routes like /feiertage/2026/baden-wuerttemberg.

export type StateCode =
  | "BW" | "BY" | "BE" | "BB" | "HB" | "HH" | "HE" | "MV"
  | "NI" | "NW" | "RP" | "SL" | "SN" | "ST" | "SH" | "TH";

export type Bundesland = {
  code: StateCode;
  /** Display name with correct umlauts, e.g. "Baden-Württemberg". */
  name: string;
  /** ASCII route slug, e.g. "baden-wuerttemberg". */
  slug: string;
  /** Optional colloquial abbreviation shown in UI, e.g. "NRW". */
  abbr?: string;
};

export const BUNDESLAENDER: Bundesland[] = [
  { code: "BW", name: "Baden-Württemberg", slug: "baden-wuerttemberg" },
  { code: "BY", name: "Bayern", slug: "bayern" },
  { code: "BE", name: "Berlin", slug: "berlin" },
  { code: "BB", name: "Brandenburg", slug: "brandenburg" },
  { code: "HB", name: "Bremen", slug: "bremen" },
  { code: "HH", name: "Hamburg", slug: "hamburg" },
  { code: "HE", name: "Hessen", slug: "hessen" },
  { code: "MV", name: "Mecklenburg-Vorpommern", slug: "mecklenburg-vorpommern" },
  { code: "NI", name: "Niedersachsen", slug: "niedersachsen" },
  { code: "NW", name: "Nordrhein-Westfalen", slug: "nordrhein-westfalen", abbr: "NRW" },
  { code: "RP", name: "Rheinland-Pfalz", slug: "rheinland-pfalz" },
  { code: "SL", name: "Saarland", slug: "saarland" },
  { code: "SN", name: "Sachsen", slug: "sachsen" },
  { code: "ST", name: "Sachsen-Anhalt", slug: "sachsen-anhalt" },
  { code: "SH", name: "Schleswig-Holstein", slug: "schleswig-holstein" },
  { code: "TH", name: "Thüringen", slug: "thueringen" },
];

const BY_SLUG = new Map(BUNDESLAENDER.map((b) => [b.slug, b]));
const BY_CODE = new Map(BUNDESLAENDER.map((b) => [b.code, b]));

export function stateBySlug(slug: string): Bundesland | null {
  return BY_SLUG.get(slug) ?? null;
}

export function stateByCode(code: StateCode): Bundesland {
  const b = BY_CODE.get(code);
  if (!b) throw new Error(`Unknown state code: ${code}`);
  return b;
}

export const STATE_SLUGS: string[] = BUNDESLAENDER.map((b) => b.slug);
export const STATE_CODES: StateCode[] = BUNDESLAENDER.map((b) => b.code);
