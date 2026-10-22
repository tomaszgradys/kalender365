// Bundesweite Sicht auf Brückentage: dieselben Vorschläge wie je Bundesland,
// aber über alle 16 Länder zusammengeführt. Ein Vorschlag, der in allen Ländern
// gilt, ist „bundesweit"; sonst werden die Länder genannt, in denen er gilt
// (z. B. Fronleichnam-Brücke nur in BW, BY, HE, NW, RP, SL).
import { BUNDESLAENDER, type StateCode } from "./bundeslaender";
import { getBrueckentage, getLangeWochenenden, type Brueckentag, type LongWeekend } from "./brueckentage";
import { getNationalFeiertage, type Feiertag } from "./feiertage";

export type BrueckentagBundesweit = Brueckentag & {
  /** Länder, in denen der Vorschlag identisch gilt. */
  states: StateCode[];
  bundesweit: boolean;
};

const key = (b: { von: string; bis: string; urlaub: string[] }) => `${b.von}|${b.bis}|${b.urlaub.join(",")}`;

export function getBrueckentageBundesweit(year: number): BrueckentagBundesweit[] {
  const map = new Map<string, BrueckentagBundesweit>();
  for (const land of BUNDESLAENDER) {
    for (const b of getBrueckentage(year, land.code)) {
      const k = key(b);
      const e = map.get(k);
      if (e) e.states.push(land.code);
      else map.set(k, { ...b, states: [land.code], bundesweit: false });
    }
  }
  const out = [...map.values()].map((b) => ({ ...b, bundesweit: b.states.length === BUNDESLAENDER.length }));
  // Reihenfolge: bundesweit zuerst, dann Effizienz, dann Datum.
  out.sort((a, b) => Number(b.bundesweit) - Number(a.bundesweit) || b.effizienz - a.effizienz || b.freieTage - a.freieTage || a.von.localeCompare(b.von));
  return out;
}

export type LongWeekendBundesweit = LongWeekend & { states: StateCode[]; bundesweit: boolean };

export function getLangeWochenendenBundesweit(year: number): LongWeekendBundesweit[] {
  const map = new Map<string, LongWeekendBundesweit>();
  for (const land of BUNDESLAENDER) {
    for (const w of getLangeWochenenden(year, land.code)) {
      const k = `${w.start}|${w.end}`;
      const e = map.get(k);
      if (e) e.states.push(land.code);
      else map.set(k, { ...w, states: [land.code], bundesweit: false });
    }
  }
  return [...map.values()]
    .map((w) => ({ ...w, bundesweit: w.states.length === BUNDESLAENDER.length }))
    .sort((a, b) => a.start.localeCompare(b.start));
}

/** Bundesweite Feiertage, die auf Samstag oder Sonntag fallen (kein Ersatztag in Deutschland). */
export function feiertageAmWochenende(year: number): Feiertag[] {
  return getNationalFeiertage(year).filter((h) => {
    const dow = new Date(`${h.date}T00:00:00Z`).getUTCDay();
    return dow === 0 || dow === 6;
  });
}
