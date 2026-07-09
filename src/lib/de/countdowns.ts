// "Wie viele Tage bis …" — countdown targets. Each resolves the next occurrence
// from a given reference date. Deterministic; times are Berlin midnight (approx).

import { easterSunday } from "./feiertage";
import { getSeasonDate } from "./astroYear";
import { getBesondererTag } from "./besondereTage";

const TZ = "Europe/Berlin";

/** Datum-Resolver eines besonderen Tages (z. B. Muttertag) für Countdowns. */
function anlass(slug: string): (year: number) => Date {
  const e = getBesondererTag(slug);
  if (!e) throw new Error(`Unbekannter Anlass: ${slug}`);
  return e.date;
}

/** Epoch ms of local (Berlin) midnight for a calendar date. */
export function berlinMidnight(year: number, month0: number, day: number): number {
  const asUTC = Date.UTC(year, month0, day);
  const off = (() => {
    const d = new Date(Date.UTC(year, month0, day, 12));
    const u = new Date(d.toLocaleString("en-US", { timeZone: "UTC" }));
    const t = new Date(d.toLocaleString("en-US", { timeZone: TZ }));
    return (t.getTime() - u.getTime()) / 60000;
  })();
  return asUTC - off * 60000;
}

export type CountdownEvent = {
  slug: string;
  title: string; // "Weihnachten"
  emoji: string;
  // resolve the next occurrence date (>= today) as {year, month0, day}
  resolve: (now: Date) => { year: number; month0: number; day: number };
  /** 1–2 Sätze: was ist der Tag, worauf zählt man herunter. Für SEO-Text/Intent. */
  about: string;
  /** true = bewegliches Datum (jedes Jahr anders), false = festes Kalenderdatum. */
  beweglich: boolean;
  /** Kurzform des festen Datums, z. B. "24. Dezember" (nur bei festem Datum). */
  fixesDatum?: string;
};

function nextFixed(month0: number, day: number) {
  return (now: Date) => {
    const y = now.getUTCFullYear();
    const thisYear = Date.UTC(y, month0, day);
    const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const year = thisYear >= todayUTC ? y : y + 1;
    return { year, month0, day };
  };
}

function fromDate(compute: (year: number) => Date) {
  return (now: Date) => {
    const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    let y = now.getUTCFullYear();
    let d = compute(y);
    if (Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) < todayUTC) d = compute(++y);
    return { year: d.getUTCFullYear(), month0: d.getUTCMonth(), day: d.getUTCDate() };
  };
}

export const COUNTDOWNS: CountdownEvent[] = [
  { slug: "weihnachten", title: "Weihnachten", emoji: "🎄", resolve: nextFixed(11, 24), beweglich: false, fixesDatum: "24. Dezember", about: "Heiligabend am 24. Dezember läutet das Weihnachtsfest ein, gefolgt vom 1. und 2. Weihnachtsfeiertag (25. und 26. Dezember). Beide Feiertage sind bundesweit gesetzlich, Heiligabend selbst ist ein normaler Werktag – vielerorts aber ab mittags frei." },
  { slug: "silvester", title: "Silvester", emoji: "🎆", resolve: nextFixed(11, 31), beweglich: false, fixesDatum: "31. Dezember", about: "Silvester am 31. Dezember ist der letzte Tag des Jahres. Er ist kein gesetzlicher Feiertag, wird aber traditionell mit Feuerwerk und dem Countdown zum Jahreswechsel begangen." },
  { slug: "neujahr", title: "Neujahr", emoji: "🥂", resolve: nextFixed(0, 1), beweglich: false, fixesDatum: "1. Januar", about: "Neujahr am 1. Januar ist der erste Tag des neuen Jahres und bundesweit ein gesetzlicher Feiertag." },
  { slug: "ostern", title: "Ostern", emoji: "🐣", resolve: fromDate((y) => easterSunday(y)), beweglich: true, about: "Ostern ist ein bewegliches Fest: Ostersonntag fällt auf den ersten Sonntag nach dem ersten Frühlingsvollmond, frühestens auf den 22. März, spätestens auf den 25. April. Karfreitag und Ostermontag sind bundesweite gesetzliche Feiertage." },
  { slug: "nikolaus", title: "Nikolaus", emoji: "🎅", resolve: nextFixed(11, 6), beweglich: false, fixesDatum: "6. Dezember", about: "Der Nikolaustag am 6. Dezember erinnert an den heiligen Nikolaus von Myra. Er ist kein gesetzlicher Feiertag; traditionell werden am Vorabend die Stiefel gefüllt." },
  { slug: "halloween", title: "Halloween", emoji: "🎃", resolve: nextFixed(9, 31), beweglich: false, fixesDatum: "31. Oktober", about: "Halloween wird jedes Jahr am 31. Oktober gefeiert, dem Vorabend von Allerheiligen. Es ist kein gesetzlicher Feiertag – am selben Tag ist in mehreren Bundesländern der Reformationstag." },
  { slug: "valentinstag", title: "Valentinstag", emoji: "❤️", resolve: nextFixed(1, 14), beweglich: false, fixesDatum: "14. Februar", about: "Der Valentinstag am 14. Februar gilt als Tag der Liebenden. Er ist kein gesetzlicher Feiertag, wird aber traditionell mit Blumen und kleinen Geschenken begangen." },
  { slug: "muttertag", title: "Muttertag", emoji: "💐", resolve: fromDate(anlass("muttertag")), beweglich: true, about: "Der Muttertag ist beweglich und fällt in Deutschland immer auf den zweiten Sonntag im Mai. Er ist kein gesetzlicher Feiertag." },
  { slug: "vatertag", title: "Vatertag", emoji: "🍺", resolve: fromDate(anlass("vatertag")), beweglich: true, about: "Der Vatertag wird in Deutschland an Christi Himmelfahrt gefeiert – 39 Tage nach Ostersonntag und damit jedes Jahr an einem Donnerstag. Christi Himmelfahrt ist ein bundesweiter gesetzlicher Feiertag." },
  { slug: "rosenmontag", title: "Rosenmontag", emoji: "🎉", resolve: fromDate(anlass("rosenmontag")), beweglich: true, about: "Der Rosenmontag ist der Höhepunkt des Straßenkarnevals, 48 Tage vor Ostersonntag. Er ist kein gesetzlicher Feiertag, in den Karnevalshochburgen aber vielerorts arbeitsfrei." },
  { slug: "weiberfastnacht", title: "Weiberfastnacht", emoji: "🎭", resolve: fromDate(anlass("weiberfastnacht")), beweglich: true, about: "Weiberfastnacht (Altweiber) eröffnet den Straßenkarneval am Donnerstag vor Rosenmontag, also 52 Tage vor Ostern. Ein gesetzlicher Feiertag ist der Tag nicht." },
  { slug: "aschermittwoch", title: "Aschermittwoch", emoji: "✝️", resolve: fromDate(anlass("aschermittwoch")), beweglich: true, about: "Aschermittwoch beendet den Karneval und beginnt die 40-tägige Fastenzeit vor Ostern. Er liegt 46 Tage vor Ostersonntag und ist kein gesetzlicher Feiertag." },
  { slug: "erster-advent", title: "1. Advent", emoji: "🕯️", resolve: fromDate(anlass("erster-advent")), beweglich: true, about: "Der 1. Advent ist der vierte Sonntag vor dem 25. Dezember und markiert den Beginn der Adventszeit und des Kirchenjahres. Ein gesetzlicher Feiertag ist er nicht." },
  { slug: "sommeranfang", title: "Sommeranfang", emoji: "☀️", resolve: fromDate((y) => getSeasonDate(y, 1)), beweglich: true, about: "Der kalendarische (astronomische) Sommeranfang fällt auf die Sommersonnenwende – den längsten Tag des Jahres, meist am 20. oder 21. Juni. Der meteorologische Sommer beginnt dagegen fix am 1. Juni." },
];

export function getCountdown(slug: string): CountdownEvent | null {
  return COUNTDOWNS.find((c) => c.slug === slug) ?? null;
}
