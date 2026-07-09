// Shared year helpers for programmatic routes.
//
// Zwei getrennte Fenster:
//  • NAV  (weit, 2015–2035): Seiten existieren, liefern 200 und sind für Nutzer
//    navigierbar (Vor-/Zurück). Wird prerendert. Ausserhalb dieses Fensters gibt
//    es die Seiten weiterhin (parseYear bis 1900–2100), aber ohne Vorrang.
//  • INDEX (eng, dynamisch: aktuelles Jahr −1 … +5): NUR diese Jahre sind
//    indexierbar und in der Sitemap. Jahre mit realer Suchnachfrage. So bleibt
//    das Crawl-Budget auf die relevanten Jahrgänge konzentriert; ältere/fernere
//    Jahre sind noindex,follow (crawlbar, aber nicht indexiert).

import { berlinNow } from "./now";

export const NAV_MIN = 2015; // gerendertes / navigierbares Fenster
export const NAV_MAX = 2035;

export const NAV_YEARS = Array.from({ length: NAV_MAX - NAV_MIN + 1 }, (_, i) => NAV_MIN + i);

export const INDEX_BACK = 1; // Jahre in die Vergangenheit
export const INDEX_FWD = 5; // Jahre in die Zukunft

export function parseYear(raw: string): number | null {
  if (!/^\d{4}$/.test(raw)) return null;
  const y = Number(raw);
  return y >= 1900 && y <= 2100 ? y : null;
}

export const isNavigableYear = (y: number) => y >= NAV_MIN && y <= NAV_MAX;

/** Enges Indexierungs-/Sitemap-Fenster relativ zum aktuellen Jahr. */
export const isIndexableYear = (y: number, now: number = berlinNow().year) =>
  y >= now - INDEX_BACK && y <= now + INDEX_FWD;

/** Alle aktuell indexierbaren Jahre (für Sitemap-Generierung). */
export function indexableYears(now: number = berlinNow().year): number[] {
  const out: number[] = [];
  for (let y = now - INDEX_BACK; y <= now + INDEX_FWD; y++) out.push(y);
  return out;
}

/**
 * Prerender-Fenster = Index-Fenster. Nur diese Jahrgänge werden zur Build-Zeit
 * statisch erzeugt; ältere/fernere Jahre rendern on-demand (dynamicParams) —
 * sie existieren weiterhin (200, noindex,follow), belegen aber keinen Build-
 * Umfang. Weil on-demand zur Laufzeit gerendert wird, ist deren robots-Meta
 * immer relativ zum tatsächlichen Jahr korrekt (selbstkorrigierend).
 * Zur Build-Zeit ausgewertet.
 */
export const PRERENDER_YEARS = indexableYears();

/** robots meta for programmatic year pages: noindex outside the index window. */
export function yearRobots(y: number) {
  return isIndexableYear(y) ? {} : { robots: { index: false, follow: true } };
}
