// Mondkalender / Aussaatkalender — Gärtnern nach dem Mond.
//
// Nach überlieferten Mondkalender-Regeln (u. a. Maria Thun) ordnet man jeden
// Tag anhand des Tierkreiszeichens, in dem der Mond steht, einem der vier
// „Pflanzentage" zu:
//   Feuer  (Widder, Löwe, Schütze)      → Fruchttage  (Frucht/Samen)
//   Erde   (Stier, Jungfrau, Steinbock) → Wurzeltage  (Wurzelgemüse)
//   Luft   (Zwillinge, Waage, Wassermann) → Blütentage (Blühpflanzen)
//   Wasser (Krebs, Skorpion, Fische)    → Blatttage   (Blattgemüse)
//
// Dazu kommt die Mondphase (zunehmend/abnehmend). Alles ist deterministisch
// aus der Astronomie (moon.ts) berechnet. WICHTIG: Es handelt sich um
// überliefertes Brauchtum ohne wissenschaftlichen Wirknachweis — auf den Seiten
// entsprechend gekennzeichnet.

import { moonEclipticLongitudeDeg, getMoonTrend } from "./moon";
import { MONTH_NAMES_DE, MONTH_SLUGS_DE } from "./locale";

export type MondTag = "Frucht" | "Wurzel" | "Blüte" | "Blatt";
export type MondElement = "Feuer" | "Erde" | "Luft" | "Wasser";

type SignInfo = { name: string; symbol: string; element: MondElement; tag: MondTag };

const SIGNS: SignInfo[] = [
  { name: "Widder", symbol: "♈", element: "Feuer", tag: "Frucht" },
  { name: "Stier", symbol: "♉", element: "Erde", tag: "Wurzel" },
  { name: "Zwillinge", symbol: "♊", element: "Luft", tag: "Blüte" },
  { name: "Krebs", symbol: "♋", element: "Wasser", tag: "Blatt" },
  { name: "Löwe", symbol: "♌", element: "Feuer", tag: "Frucht" },
  { name: "Jungfrau", symbol: "♍", element: "Erde", tag: "Wurzel" },
  { name: "Waage", symbol: "♎", element: "Luft", tag: "Blüte" },
  { name: "Skorpion", symbol: "♏", element: "Wasser", tag: "Blatt" },
  { name: "Schütze", symbol: "♐", element: "Feuer", tag: "Frucht" },
  { name: "Steinbock", symbol: "♑", element: "Erde", tag: "Wurzel" },
  { name: "Wassermann", symbol: "♒", element: "Luft", tag: "Blüte" },
  { name: "Fische", symbol: "♓", element: "Wasser", tag: "Blatt" },
];

export const TAG_INFO: Record<MondTag, { element: MondElement; farbe: string; kurz: string; beispiele: string }> = {
  Frucht: { element: "Feuer", farbe: "#f59e0b", kurz: "Frucht- und Samengemüse", beispiele: "Tomaten, Bohnen, Erbsen, Kürbis, Getreide" },
  Wurzel: { element: "Erde", farbe: "#00b978", kurz: "Wurzelgemüse", beispiele: "Karotten, Kartoffeln, Radieschen, Zwiebeln" },
  Blüte: { element: "Luft", farbe: "#7f9fe0", kurz: "Blüh- und Blütenpflanzen", beispiele: "Blumen, Brokkoli, Blumenkohl, Rosen" },
  Blatt: { element: "Wasser", farbe: "#0649a8", kurz: "Blattgemüse", beispiele: "Salat, Spinat, Kohl, Kräuter, Rasen" },
};

/** Julianisches Datum für ~12 Uhr mittags (Berlin ≈ UTC+1) eines Kalendertags. */
function jdNoon(year: number, month0: number, day: number): number {
  return 2440587.5 + Date.UTC(year, month0, day, 11) / 86400000;
}

/** Tierkreiszeichen des Mondes an einem Tag (Mittag). */
export function moonSignForDay(year: number, month0: number, day: number): SignInfo {
  const lon = moonEclipticLongitudeDeg(jdNoon(year, month0, day));
  return SIGNS[Math.floor(lon / 30) % 12];
}

export type MondTagInfo = {
  iso: string;
  day: number;
  weekdayIdx: number; // Mo=0
  sign: SignInfo;
  trend: -1 | 0 | 1; // abnehmend / neutral / zunehmend
  trendLabel: string;
};

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export function trendLabel(t: -1 | 0 | 1): string {
  return t > 0 ? "zunehmend" : t < 0 ? "abnehmend" : "Voll-/Neumond";
}

/** Alle Tage eines Monats mit Mondzeichen, Pflanzentag und Phase. */
export function getMondmonat(year: number, month0: number): MondTagInfo[] {
  const dim = new Date(Date.UTC(year, month0 + 1, 0)).getUTCDate();
  const out: MondTagInfo[] = [];
  for (let day = 1; day <= dim; day++) {
    const trend = getMoonTrend(new Date(Date.UTC(year, month0, day, 11)));
    out.push({
      iso: `${year}-${pad(month0 + 1)}-${pad(day)}`,
      day,
      weekdayIdx: (new Date(Date.UTC(year, month0, day)).getUTCDay() + 6) % 7,
      sign: moonSignForDay(year, month0, day),
      trend,
      trendLabel: trendLabel(trend),
    });
  }
  return out;
}

/** Wieviele Tage jedes Typs im Monat (für die Monatsübersicht). */
export function countTage(days: MondTagInfo[]): Record<MondTag, number> {
  const c: Record<MondTag, number> = { Frucht: 0, Wurzel: 0, Blüte: 0, Blatt: 0 };
  for (const d of days) c[d.sign.tag]++;
  return c;
}

export const MONTH_SLUGS = MONTH_SLUGS_DE;
export const MONTH_NAMES = MONTH_NAMES_DE;

/** "mai-2026" → { month0, year } (nur gültige Monate). */
export function parseMonthSlug(slug: string): { month0: number; year: number } | null {
  const m = /^([a-zäöü]+)-(\d{4})$/.exec(slug);
  if (!m) return null;
  const month0 = MONTH_SLUGS_DE.indexOf(m[1]);
  const year = Number(m[2]);
  if (month0 === -1) return null;
  return { month0, year };
}

export const AKTIVITAET: Record<MondTag, string> = {
  Frucht: "Gute Tage zum Säen, Pflanzen und Ernten von Frucht- und Samengemüse (Tomaten, Bohnen, Getreide).",
  Wurzel: "Gute Tage rund um Wurzelgemüse: säen, pflanzen und ernten von Möhren, Kartoffeln, Radieschen & Co.",
  Blüte: "Gute Tage für Blüh- und Blütenpflanzen — Blumen setzen, Brokkoli und Blumenkohl, Rosen schneiden.",
  Blatt: "Gute Tage für Blattgemüse und Kräuter: Salat, Spinat, Kohl säen und pflanzen, Rasen mähen.",
};
