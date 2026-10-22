// Zusatzinformationen für eine Kalenderwoche (Datumsbereich Mo–So):
// Schulferien je Bundesland, regionale Feiertage, Mondphasen und Sonnenzeiten.
// Grund: die /kw/-Seiten sind die am häufigsten von KI-Assistenten (Copilot)
// zitierten Seiten des Angebots – sie sollen echte, prüfbare Fakten liefern
// statt nur sieben Datumszeilen.
import { BUNDESLAENDER, type StateCode } from "./bundeslaender";
import { getSchulferien, FERIEN_TYP_LABEL, type FerienTyp } from "./schulferien";
import { getAllFeiertage, type Feiertag } from "./feiertage";
import { getMoonPhaseInstants, type MoonPhaseInstant } from "./moonPhases";
import { getSunTimes, DEFAULT_LOCATION, type SunTimes } from "./sun";

export type FerienInWoche = {
  code: StateCode;
  name: string;
  abbr?: string;
  typ: FerienTyp;
  label: string;
  start: string;
  end: string;
};

function yearsOf(startISO: string, endISO: string): number[] {
  const a = Number(startISO.slice(0, 4));
  const b = Number(endISO.slice(0, 4));
  return a === b ? [a] : [a, b];
}

/** Schulferien aller Länder, die den Bereich [start, end] (inklusive) berühren. */
export function ferienInRange(startISO: string, endISO: string): FerienInWoche[] {
  const out: FerienInWoche[] = [];
  const seen = new Set<string>();
  for (const land of BUNDESLAENDER) {
    for (const y of yearsOf(startISO, endISO)) {
      const rec = getSchulferien(y, land.code);
      if (!rec) continue;
      for (const p of rec.periods) {
        if (p.end < startISO || p.start > endISO) continue;
        const k = `${land.code}|${p.typ}|${p.start}`;
        if (seen.has(k)) continue;
        seen.add(k);
        out.push({ code: land.code, name: land.name, abbr: land.abbr, typ: p.typ, label: FERIEN_TYP_LABEL[p.typ], start: p.start, end: p.end });
      }
    }
  }
  return out;
}

/** Ferien nach Typ gruppiert: Typ → Länder (für kompakte Darstellung). */
export function ferienNachTyp(list: FerienInWoche[]): { typ: FerienTyp; label: string; laender: FerienInWoche[] }[] {
  const map = new Map<FerienTyp, FerienInWoche[]>();
  for (const f of list) map.set(f.typ, [...(map.get(f.typ) ?? []), f]);
  return [...map.entries()].map(([typ, laender]) => ({ typ, label: FERIEN_TYP_LABEL[typ], laender }));
}

/** Regionale (nicht bundesweite) gesetzliche Feiertage im Bereich – ohne reine Sonntagsfeiertage. */
export function regionaleFeiertageInRange(startISO: string, endISO: string): Feiertag[] {
  const out: Feiertag[] = [];
  const seen = new Set<string>();
  for (const y of yearsOf(startISO, endISO)) {
    for (const h of getAllFeiertage(y)) {
      if (h.scope === "national" || h.scope === "sunday-legal") continue;
      if (h.date < startISO || h.date > endISO) continue;
      const k = `${h.date}|${h.slug}|${h.scope}`;
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(h);
    }
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

/** Mondphasen (Neumond, Viertel, Vollmond) im Bereich. */
export function mondphasenInRange(startISO: string, endISO: string): MoonPhaseInstant[] {
  const out: MoonPhaseInstant[] = [];
  for (const y of yearsOf(startISO, endISO)) {
    for (const m of getMoonPhaseInstants(y)) if (m.date >= startISO && m.date <= endISO) out.push(m);
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

export type SonneWoche = { ort: string; montag: SunTimes; sonntag: SunTimes; deltaMinuten: number };

/** Sonnenauf-/-untergang am Montag und Sonntag der Woche (Referenzort Berlin). */
export function sonneInWoche(startISO: string, endISO: string): SonneWoche {
  const s = startISO.split("-").map(Number);
  const e = endISO.split("-").map(Number);
  const montag = getSunTimes(s[0], s[1] - 1, s[2]);
  const sonntag = getSunTimes(e[0], e[1] - 1, e[2]);
  return { ort: DEFAULT_LOCATION.name, montag, sonntag, deltaMinuten: sonntag.dayLengthMinutes - montag.dayLengthMinutes };
}
