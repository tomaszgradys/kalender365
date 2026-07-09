// Besondere Tage & Anlässe — wichtige deutsche Termine, die KEINE gesetzlichen
// Feiertage sind, aber stark gesucht und kulturell fest verankert sind:
// Karneval/Fasching, Muttertag, Vatertag, Advent, Nikolaus, Halloween,
// Erntedank, Silvester u. a.
//
// Alles ist deterministisch (fixe Daten oder Oster-/Regel-basiert), keine
// externe Datenquelle. Bewusst getrennt von feiertage.ts, weil diese Tage
// arbeitsrechtlich KEINE Feiertage sind — sie reduzieren keine Arbeitstage.

import { easterSunday } from "./feiertage";
import type { EventMotif } from "@/components/de/EventArt";

export type AnlassKategorie = "karneval" | "familie" | "advent" | "brauchtum" | "kirchlich" | "saison";

export type BesondererTag = {
  slug: string;
  name: string;
  emoji: string;
  motif: EventMotif;
  kategorie: AnlassKategorie;
  /** Kurzer Hinweis auf regionale Bedeutung, z. B. "vor allem im Rheinland". */
  regionNote?: string;
  /** Datum eines Jahres (UTC-Mitternacht). */
  date: (y: number) => Date;
  /** Nur für Zeiträume (z. B. Oktoberfest): Enddatum. */
  endDate?: (y: number) => Date;
  movable: boolean;
  /** Erklärung der Datumsregel — erscheint auf der Detailseite. */
  rule: string;
  /** Einleitung (1–2 Sätze, wird als Lead und in der Meta-Description genutzt). */
  intro: string;
  /** Brauchtum / Bedeutung (Fließtext-Absätze). */
  brauchtum: string[];
  /** Optionale evergreen-FAQ zusätzlich zu den automatisch erzeugten Fragen. */
  faqExtra?: { q: string; a: string }[];
  /** Slugs verwandter Anlässe für die Querverlinkung. */
  related: string[];
};

/* ------------------------------------------------------------------ */
/* Datums-Helfer                                                       */
/* ------------------------------------------------------------------ */

function d(y: number, m0: number, day: number): Date {
  return new Date(Date.UTC(y, m0, day));
}
function addDays(date: Date, n: number): Date {
  const r = new Date(date);
  r.setUTCDate(r.getUTCDate() + n);
  return r;
}
/** n-ter Wochentag eines Monats (weekday: 0=So … 6=Sa). */
function nthWeekday(y: number, m0: number, weekday: number, n: number): Date {
  const first = d(y, m0, 1);
  const shift = (weekday - first.getUTCDay() + 7) % 7;
  return d(y, m0, 1 + shift + (n - 1) * 7);
}
/** Letzter Sonntag am oder vor dem gegebenen Datum. */
function sundayOnOrBefore(date: Date): Date {
  const r = new Date(date);
  r.setUTCDate(r.getUTCDate() - r.getUTCDay());
  return r;
}
/** Erster Samstag am oder nach dem gegebenen Tag im Monat. */
function saturdayOnOrAfter(y: number, m0: number, day: number): Date {
  const start = d(y, m0, day);
  const shift = (6 - start.getUTCDay() + 7) % 7;
  return addDays(start, shift);
}

// 4. Advent = letzter Sonntag am/vor dem 24. Dezember.
function vierterAdvent(y: number): Date {
  return sundayOnOrBefore(d(y, 11, 24));
}
function ersterAdvent(y: number): Date {
  return addDays(vierterAdvent(y), -21);
}
// Oktoberfest-Ende: erster Sonntag im Oktober; fällt er auf den 1./2., wird bis
// zum 3. Oktober (Tag der Deutschen Einheit) verlängert.
function oktoberfestEnde(y: number): Date {
  const firstSun = nthWeekday(y, 9, 0, 1);
  return firstSun.getUTCDate() < 3 ? d(y, 9, 3) : firstSun;
}

/* ------------------------------------------------------------------ */
/* Datenbasis                                                          */
/* ------------------------------------------------------------------ */

export const BESONDERE_TAGE: BesondererTag[] = [
  // ---------------- Karneval / Fasching ----------------
  {
    slug: "weiberfastnacht",
    name: "Weiberfastnacht",
    emoji: "🎭",
    motif: "karneval",
    kategorie: "karneval",
    regionNote: "vor allem im Rheinland",
    movable: true,
    date: (y) => addDays(easterSunday(y), -52),
    rule: "Der Donnerstag vor Aschermittwoch, also 52 Tage vor Ostersonntag.",
    intro:
      "Weiberfastnacht (Altweiber) läutet am „schmutzigen Donnerstag“ den Straßenkarneval ein — traditionell übernehmen die Frauen das Regiment und schneiden den Männern die Krawatte ab.",
    brauchtum: [
      "Weiberfastnacht markiert im Rheinland und in Teilen Süddeutschlands den Beginn des Straßenkarnevals. In Köln, Düsseldorf, Bonn und Aachen stürmen Jecken die Rathäuser, ab dem Vormittag wird auf den Straßen und in den Büros gefeiert.",
      "Der bekannteste Brauch: Frauen schneiden Männern symbolisch die Krawatte ab — als Zeichen der (an diesem Tag) umgekehrten Machtverhältnisse. Vielerorts ist ab dem Nachmittag arbeitsfrei geregelt, ein gesetzlicher Feiertag ist Weiberfastnacht jedoch nicht.",
    ],
    related: ["rosenmontag", "fastnachtsdienstag", "aschermittwoch"],
  },
  {
    slug: "rosenmontag",
    name: "Rosenmontag",
    emoji: "🎉",
    motif: "karneval",
    kategorie: "karneval",
    regionNote: "Hochburgen: Köln, Düsseldorf, Mainz",
    movable: true,
    date: (y) => addDays(easterSunday(y), -48),
    rule: "Der Montag vor Aschermittwoch, also 48 Tage vor Ostersonntag.",
    intro:
      "Der Rosenmontag ist der Höhepunkt des rheinischen Karnevals: Millionen Zuschauer säumen die Straßen, wenn die großen Rosenmontagszüge mit Motivwagen, Musik und „Kamelle“ durch die Städte ziehen.",
    brauchtum: [
      "Der Rosenmontagszug ist das Herzstück der „fünften Jahreszeit“. In Köln, Düsseldorf und Mainz sind die Umzüge kilometerlang, politische Motivwagen kommentieren pointiert das Zeitgeschehen, und aus den Wagen fliegen Kamelle (Süßigkeiten) und Sträußchen ins Publikum.",
      "Rosenmontag ist kein gesetzlicher Feiertag. In den Karnevalshochburgen geben aber viele Betriebe, Schulen und Behörden frei — geregelt über Betriebsvereinbarungen, nicht über ein Feiertagsgesetz.",
    ],
    faqExtra: [
      {
        q: "Ist Rosenmontag ein gesetzlicher Feiertag?",
        a: "Nein. Rosenmontag ist in keinem Bundesland ein gesetzlicher Feiertag. In den Karnevalshochburgen ist er faktisch oft arbeitsfrei, das regelt aber der Arbeitgeber, nicht das Gesetz.",
      },
    ],
    related: ["weiberfastnacht", "fastnachtsdienstag", "aschermittwoch"],
  },
  {
    slug: "fastnachtsdienstag",
    name: "Fastnachtsdienstag",
    emoji: "🤡",
    motif: "karneval",
    kategorie: "karneval",
    regionNote: "auch Faschingsdienstag / Veilchendienstag",
    movable: true,
    date: (y) => addDays(easterSunday(y), -47),
    rule: "Der Dienstag vor Aschermittwoch, also 47 Tage vor Ostersonntag.",
    intro:
      "Der Fastnachtsdienstag (Faschingsdienstag) ist der letzte Tag vor der Fastenzeit — der große Kehraus des Karnevals, bevor am Aschermittwoch alles vorbei ist.",
    brauchtum: [
      "Am Fastnachtsdienstag wird noch einmal ausgelassen gefeiert, in Süddeutschland unter dem Namen Faschingsdienstag, in Teilen der Schweiz und am Rhein auch Veilchendienstag. Vielerorts finden Kinderumzüge und das Verbrennen der „Fastnacht“-Strohpuppe („Nubbelverbrennung“ in Köln) statt.",
      "In der Nacht zum Aschermittwoch endet die närrische Zeit traditionell um Mitternacht — dann beginnt die 40-tägige Fastenzeit bis Ostern.",
    ],
    related: ["weiberfastnacht", "rosenmontag", "aschermittwoch"],
  },
  {
    slug: "aschermittwoch",
    name: "Aschermittwoch",
    emoji: "✝️",
    motif: "asche",
    kategorie: "kirchlich",
    movable: true,
    date: (y) => addDays(easterSunday(y), -46),
    rule: "46 Tage vor Ostersonntag — der Mittwoch nach Fastnachtsdienstag.",
    intro:
      "Mit dem Aschermittwoch endet der Karneval und die 40-tägige Fastenzeit beginnt. In der katholischen Kirche empfangen die Gläubigen das Aschenkreuz als Zeichen der Buße und Vergänglichkeit.",
    brauchtum: [
      "„Am Aschermittwoch ist alles vorbei“ — der Tag beendet die Karnevalszeit. In der katholischen und teils evangelischen Tradition beginnt die Fastenzeit (Passionszeit), die 40 Tage (ohne Sonntage) bis Ostern dauert.",
      "Beim Gottesdienst zeichnet der Priester den Gläubigen mit gesegneter Asche ein Kreuz auf die Stirn. Traditionell wird an diesem Tag kein Fleisch gegessen; verbreitet ist das „Fischessen“ am Aschermittwoch.",
    ],
    related: ["rosenmontag", "fastnachtsdienstag"],
  },

  // ---------------- Familie & Beziehung ----------------
  {
    slug: "valentinstag",
    name: "Valentinstag",
    emoji: "❤️",
    motif: "herz",
    kategorie: "familie",
    movable: false,
    date: (y) => d(y, 1, 14),
    rule: "Jedes Jahr am 14. Februar.",
    intro:
      "Der Valentinstag am 14. Februar gilt als Tag der Liebenden. Verschenkt werden vor allem Blumen — allen voran rote Rosen —, Pralinen und kleine Aufmerksamkeiten.",
    brauchtum: [
      "Der Valentinstag geht auf den heiligen Valentin zurück und etablierte sich in Deutschland nach dem Zweiten Weltkrieg als Tag der Liebenden. Rote Rosen stehen für die Liebe, Blumenläden und Floristen haben an diesem Tag Hochsaison.",
      "Der Valentinstag ist kein Feiertag, aber einer der umsatzstärksten Anlässe für Blumen, Süßwaren und Restaurants. Beliebt sind auch persönliche Karten und gemeinsame Verabredungen zum Essen.",
    ],
    related: ["muttertag", "silvester"],
  },
  {
    slug: "weltfrauentag",
    name: "Internationaler Frauentag",
    emoji: "♀️",
    motif: "frauentag",
    kategorie: "brauchtum",
    regionNote: "gesetzlicher Feiertag in Berlin und Mecklenburg-Vorpommern",
    movable: false,
    date: (y) => d(y, 2, 8),
    rule: "Jedes Jahr am 8. März.",
    intro:
      "Der Internationale Frauentag am 8. März steht weltweit für die Rechte von Frauen und die Gleichstellung der Geschlechter. In Berlin und Mecklenburg-Vorpommern ist er sogar gesetzlicher Feiertag.",
    brauchtum: [
      "Der Frauentag entstand Anfang des 20. Jahrhunderts aus der Arbeiterinnen- und Frauenbewegung. Heute erinnern Demonstrationen, Aktionen und Veranstaltungen an erreichte Rechte und noch offene Gleichstellungsfragen.",
      "In Berlin ist der 8. März seit 2019, in Mecklenburg-Vorpommern seit 2023 ein gesetzlicher Feiertag. Im übrigen Bundesgebiet ist es ein normaler Arbeitstag mit vielen öffentlichen Aktionen.",
    ],
    related: ["muttertag"],
  },
  {
    slug: "muttertag",
    name: "Muttertag",
    emoji: "💐",
    motif: "blumen",
    kategorie: "familie",
    movable: true,
    date: (y) => nthWeekday(y, 4, 0, 2),
    rule: "Der zweite Sonntag im Mai.",
    intro:
      "Am Muttertag, dem zweiten Sonntag im Mai, danken Kinder ihren Müttern mit Blumen, selbst Gebasteltem und gemeinsamer Zeit. Es ist einer der wichtigsten Blumentage des Jahres.",
    brauchtum: [
      "Der Muttertag wird in Deutschland seit den 1920er-Jahren begangen und fällt stets auf den zweiten Sonntag im Mai. Typisch sind Blumensträuße, Frühstück ans Bett, gebastelte Geschenke der Kinder und ein gemeinsames Essen.",
      "Weil der Muttertag ein Sonntag ist, spielt Arbeitsrecht keine Rolle. Für Floristen, Konditoreien und Restaurants gehört er zu den umsatzstärksten Tagen des Jahres.",
    ],
    faqExtra: [
      {
        q: "Fällt Muttertag immer auf denselben Tag?",
        a: "Nein. Der Muttertag ist beweglich und fällt immer auf den zweiten Sonntag im Mai, das Datum wechselt also jedes Jahr.",
      },
    ],
    related: ["vatertag", "valentinstag", "weltfrauentag"],
  },
  {
    slug: "vatertag",
    name: "Vatertag",
    emoji: "🍺",
    motif: "vatertag",
    kategorie: "familie",
    regionNote: "auch Männertag / Herrentag",
    movable: true,
    date: (y) => addDays(easterSunday(y), 39),
    rule: "Immer an Christi Himmelfahrt — 39 Tage nach Ostersonntag (ein Donnerstag).",
    intro:
      "Der Vatertag fällt in Deutschland stets auf Christi Himmelfahrt. Als Männertag oder Herrentag ist er für Ausflüge mit dem Bollerwagen, Wandern und geselliges Beisammensein bekannt.",
    brauchtum: [
      "Anders als in vielen Ländern liegt der deutsche Vatertag nicht im Juni, sondern immer auf Christi Himmelfahrt — einem gesetzlichen Feiertag, sodass Vatertag stets arbeitsfrei ist. Verbreitet sind Herrenpartien mit Bollerwagen, Wanderungen und Radtouren.",
      "Neben der geselligen Tradition rückt zunehmend auch der familiäre Charakter in den Vordergrund: gemeinsame Ausflüge und Zeit mit den Kindern. Als Feiertag ist ausschließlich Christi Himmelfahrt geschützt, nicht der „Vatertag“ als solcher.",
    ],
    faqExtra: [
      {
        q: "Ist Vatertag ein Feiertag?",
        a: "Der Vatertag selbst ist kein eigener Feiertag, fällt aber immer auf Christi Himmelfahrt — und dieser Tag ist bundesweit ein gesetzlicher Feiertag. Damit ist Vatertag faktisch immer arbeitsfrei.",
      },
    ],
    related: ["muttertag"],
  },

  // ---------------- Brauchtum & Saison ----------------
  {
    slug: "walpurgisnacht",
    name: "Walpurgisnacht",
    emoji: "🔥",
    motif: "feuer",
    kategorie: "brauchtum",
    regionNote: "besonders im Harz (Brocken)",
    movable: false,
    date: (y) => d(y, 3, 30),
    rule: "In der Nacht vom 30. April auf den 1. Mai.",
    intro:
      "In der Walpurgisnacht zum 1. Mai wird der Winter mit Feuern und Festen ausgetrieben. Im Harz gilt der Brocken als sagenumwobener Treffpunkt der Hexen — heute ein großes Volksfest.",
    brauchtum: [
      "Die Walpurgisnacht verbindet vorchristliche Frühlingsbräuche mit der Legende des Hexentanzes auf dem Brocken, literarisch verewigt in Goethes „Faust“. Vielerorts gibt es Tanz in den Mai, Maifeuer und Kostümfeste.",
      "Am darauffolgenden 1. Mai (Tag der Arbeit) ist es ein gesetzlicher Feiertag — die Walpurgisnacht selbst ist es nicht, prägt aber vor allem im Harz das Brauchtum stark.",
    ],
    related: ["halloween"],
  },
  {
    slug: "halloween",
    name: "Halloween",
    emoji: "🎃",
    motif: "kuerbis",
    kategorie: "brauchtum",
    movable: false,
    date: (y) => d(y, 9, 31),
    rule: "Jedes Jahr am 31. Oktober, dem Vorabend von Allerheiligen.",
    intro:
      "Halloween am 31. Oktober hat sich auch in Deutschland etabliert: ausgehöhlte Kürbisse, gruselige Kostüme und „Süßes oder Saures“ ziehender Kinder gehören dazu.",
    brauchtum: [
      "Halloween geht auf das keltische Fest Samhain und den Vorabend von Allerheiligen zurück. In Deutschland verbreitete es sich seit den 1990er-Jahren vor allem als Kostüm- und Kinderfest mit Kürbislaternen (Jack-o’-Lantern).",
      "Am 31. Oktober fällt Halloween auf denselben Tag wie der Reformationstag, der in mehreren Bundesländern gesetzlicher Feiertag ist — Halloween selbst ist kein Feiertag.",
    ],
    related: ["walpurgisnacht", "martinstag"],
  },
  {
    slug: "erntedankfest",
    name: "Erntedankfest",
    emoji: "🌾",
    motif: "erntedank",
    kategorie: "kirchlich",
    movable: true,
    date: (y) => nthWeekday(y, 9, 0, 1),
    rule: "Meist der erste Sonntag im Oktober (regional abweichend).",
    intro:
      "Zum Erntedankfest danken die Kirchengemeinden für die eingebrachte Ernte. Altäre werden mit Früchten, Getreide und Erntekronen geschmückt.",
    brauchtum: [
      "Das Erntedankfest wird in Deutschland überwiegend am ersten Sonntag im Oktober gefeiert; der genaue Termin kann je nach Gemeinde und Region abweichen. Kirchen schmücken den Altarraum mit Feldfrüchten, Brot und der Erntekrone.",
      "Neben dem kirchlichen Dank für Nahrung und Natur gibt es vielerorts Erntedankumzüge, Märkte und Feste. Ein gesetzlicher Feiertag ist das Erntedankfest nicht.",
    ],
    related: ["martinstag"],
  },
  {
    slug: "oktoberfest",
    name: "Oktoberfest",
    emoji: "🍺",
    motif: "oktoberfest",
    kategorie: "brauchtum",
    regionNote: "München (Theresienwiese)",
    movable: true,
    date: (y) => saturdayOnOrAfter(y, 8, 16),
    endDate: (y) => oktoberfestEnde(y),
    rule: "Beginn traditionell am Samstag nach dem 15. September, Ende am ersten Sonntag im Oktober (bzw. 3. Oktober).",
    intro:
      "Das Münchner Oktoberfest auf der Theresienwiese ist das größte Volksfest der Welt. Es beginnt Mitte September mit dem Anstich („O’zapft is!“) und dauert gut zwei Wochen.",
    brauchtum: [
      "Das erste Oktoberfest fand 1810 anlässlich der Hochzeit des bayerischen Kronprinzen Ludwig statt. Heute kommen jährlich rund sechs Millionen Besucher zu Festzelten, Fahrgeschäften, Blasmusik und Tracht (Dirndl und Lederhose).",
      "Der Termin ist traditionell geregelt: Anstich am Samstag nach dem 15. September, Ende am ersten Sonntag im Oktober — fällt dieser auf den 1. oder 2., wird bis zum 3. Oktober verlängert. Die hier angezeigten Daten folgen dieser Regel und können in Einzeljahren minimal abweichen.",
    ],
    related: ["erntedankfest"],
  },
  {
    slug: "martinstag",
    name: "Martinstag (St. Martin)",
    emoji: "🏮",
    motif: "laterne",
    kategorie: "brauchtum",
    movable: false,
    date: (y) => d(y, 10, 11),
    rule: "Jedes Jahr am 11. November.",
    intro:
      "Am Martinstag ziehen Kinder mit selbst gebastelten Laternen durch die Straßen und singen Martinslieder. Erinnert wird an den heiligen Martin von Tours, der seinen Mantel mit einem Bettler teilte.",
    brauchtum: [
      "Der Martinsumzug mit Laternen, oft angeführt von einem St. Martin auf dem Pferd, gehört zu den beliebtesten Bräuchen im Herbst. Am Ende steht häufig ein Martinsfeuer; gegessen werden Weckmänner und die Martinsgans.",
      "Der 11. November markiert zugleich den Beginn der Karnevalssession um 11:11 Uhr in den Hochburgen — zwei Traditionen an einem Tag. Ein gesetzlicher Feiertag ist der Martinstag nicht.",
    ],
    related: ["nikolaus", "erntedankfest"],
  },
  {
    slug: "volkstrauertag",
    name: "Volkstrauertag",
    emoji: "🕊️",
    motif: "kerze",
    kategorie: "kirchlich",
    movable: true,
    date: (y) => addDays(ersterAdvent(y), -14),
    rule: "Zwei Sonntage vor dem ersten Advent.",
    intro:
      "Der Volkstrauertag ist ein staatlicher Gedenktag für die Opfer von Krieg und Gewaltherrschaft. Er ist ein „stiller Tag“ mit gesetzlich geschütztem Charakter.",
    brauchtum: [
      "Am Volkstrauertag wird bundesweit der Toten beider Weltkriege und der Opfer von Gewalt und Verfolgung gedacht. Im Bundestag findet eine zentrale Gedenkstunde statt, an Ehrenmalen werden Kränze niedergelegt.",
      "Der Tag zählt zu den „stillen Tagen“: In vielen Bundesländern gelten Einschränkungen für laute Veranstaltungen. Ein arbeitsfreier gesetzlicher Feiertag ist er nicht.",
    ],
    related: ["totensonntag"],
  },
  {
    slug: "totensonntag",
    name: "Totensonntag (Ewigkeitssonntag)",
    emoji: "🕯️",
    motif: "kerze",
    kategorie: "kirchlich",
    movable: true,
    date: (y) => addDays(ersterAdvent(y), -7),
    rule: "Der letzte Sonntag vor dem ersten Advent.",
    intro:
      "Am Totensonntag gedenkt die evangelische Kirche der Verstorbenen des vergangenen Jahres. Als Ewigkeitssonntag beschließt er das Kirchenjahr.",
    brauchtum: [
      "Der Totensonntag ist der letzte Sonntag des evangelischen Kirchenjahres. Angehörige besuchen die Gräber, schmücken sie und zünden Kerzen an; in den Gottesdiensten werden die Namen der Verstorbenen verlesen.",
      "Wie der Volkstrauertag ist der Totensonntag ein „stiller Tag“ mit landesrechtlichen Einschränkungen für öffentliche Veranstaltungen, aber kein arbeitsfreier Feiertag.",
    ],
    related: ["volkstrauertag", "erster-advent"],
  },

  // ---------------- Advent & Weihnachtszeit ----------------
  {
    slug: "erster-advent",
    name: "1. Advent",
    emoji: "🕯️",
    motif: "advent1",
    kategorie: "advent",
    movable: true,
    date: (y) => ersterAdvent(y),
    rule: "Der vierte Sonntag vor dem 1. Weihnachtsfeiertag.",
    intro:
      "Mit dem 1. Advent beginnt die Adventszeit und das neue Kirchenjahr. Am Adventskranz wird die erste von vier Kerzen entzündet.",
    brauchtum: [
      "Der 1. Advent eröffnet die vierwöchige Vorweihnachtszeit. Auf dem Adventskranz brennt die erste Kerze, vielerorts öffnen die Weihnachtsmärkte, und Kinder starten in den Adventskalender.",
      "Die Adventssonntage sind kirchlich Sonntage der Erwartung. Der Adventskranz mit vier Kerzen geht auf den Hamburger Theologen Johann Hinrich Wichern (19. Jahrhundert) zurück.",
    ],
    related: ["zweiter-advent", "nikolaus", "heiligabend"],
  },
  {
    slug: "zweiter-advent",
    name: "2. Advent",
    emoji: "🕯️",
    motif: "advent2",
    kategorie: "advent",
    movable: true,
    date: (y) => addDays(ersterAdvent(y), 7),
    rule: "Der dritte Sonntag vor dem 1. Weihnachtsfeiertag.",
    intro:
      "Am 2. Advent brennt die zweite Kerze am Adventskranz. Die Weihnachtsmärkte sind in vollem Gange und die Vorfreude auf das Fest wächst.",
    brauchtum: [
      "Der 2. Advent ist einer der Höhepunkte der Weihnachtsmarkt-Saison. Zuhause wird die zweite Kerze entzündet, gebacken (Plätzchen, Stollen) und dekoriert.",
      "Die vier Adventskerzen stehen sinnbildlich für das wachsende Licht bis Weihnachten — mit jeder Woche wird eine weitere entzündet.",
    ],
    related: ["erster-advent", "dritter-advent", "nikolaus"],
  },
  {
    slug: "dritter-advent",
    name: "3. Advent",
    emoji: "🕯️",
    motif: "advent3",
    kategorie: "advent",
    movable: true,
    date: (y) => addDays(ersterAdvent(y), 14),
    rule: "Der zweite Sonntag vor dem 1. Weihnachtsfeiertag.",
    intro:
      "Am 3. Advent leuchten bereits drei Kerzen am Adventskranz. Weihnachten rückt spürbar näher.",
    brauchtum: [
      "Am 3. Advent wird die dritte Kerze entzündet. Viele Familien nutzen das Wochenende für Weihnachtseinkäufe, Plätzchenbacken und Besuche auf dem Weihnachtsmarkt.",
      "In der katholischen Tradition ist dieser Sonntag als „Gaudete“ (Freuet euch) bekannt — die Vorfreude auf das Fest tritt in den Vordergrund.",
    ],
    related: ["zweiter-advent", "vierter-advent", "heiligabend"],
  },
  {
    slug: "vierter-advent",
    name: "4. Advent",
    emoji: "🕯️",
    motif: "advent4",
    kategorie: "advent",
    movable: true,
    date: (y) => vierterAdvent(y),
    rule: "Der letzte Sonntag vor Heiligabend.",
    intro:
      "Am 4. Advent brennen alle vier Kerzen am Adventskranz — Weihnachten steht unmittelbar bevor.",
    brauchtum: [
      "Der 4. Advent ist der letzte Sonntag vor Heiligabend. Die letzten Vorbereitungen werden getroffen: Geschenke besorgt, der Weihnachtsbaum gekauft und das Festessen geplant.",
      "Fällt der 4. Advent auf den 24. Dezember, verschmelzen Adventssonntag und Heiligabend zu einem Tag — das kommt nur selten vor.",
    ],
    related: ["dritter-advent", "heiligabend", "nikolaus"],
  },
  {
    slug: "nikolaus",
    name: "Nikolaustag",
    emoji: "🎅",
    motif: "nikolaus",
    kategorie: "brauchtum",
    movable: false,
    date: (y) => d(y, 11, 6),
    rule: "Jedes Jahr am 6. Dezember.",
    intro:
      "Am Nikolaustag stellen Kinder ihre geputzten Stiefel vor die Tür — über Nacht füllt der Nikolaus sie mit Süßigkeiten, Nüssen und Mandarinen.",
    brauchtum: [
      "Der Nikolaustag erinnert an den heiligen Nikolaus von Myra, den Schutzpatron der Kinder. Am Abend des 5. Dezember werden Stiefel geputzt und vor die Tür gestellt; am Morgen des 6. sind sie gefüllt.",
      "Vielerorts kommt der Nikolaus persönlich — mit Bischofsmütze, Stab und einem goldenen Buch, in dem gute und weniger gute Taten verzeichnet sind. Begleiter wie Knecht Ruprecht sind regional verbreitet.",
    ],
    related: ["heiligabend", "erster-advent", "martinstag"],
  },
  {
    slug: "heiligabend",
    name: "Heiligabend",
    emoji: "🎄",
    motif: "tannenbaum",
    kategorie: "familie",
    movable: false,
    date: (y) => d(y, 11, 24),
    rule: "Jedes Jahr am 24. Dezember.",
    intro:
      "Heiligabend am 24. Dezember ist in Deutschland der emotionale Höhepunkt des Weihnachtsfestes: Bescherung unter dem geschmückten Christbaum, Festessen und Kirchgang.",
    brauchtum: [
      "Am Heiligabend findet in Deutschland traditionell die Bescherung statt — anders als in vielen anderen Ländern schon am Abend des 24., nicht erst am Morgen des 25. Beliebt sind Christmetten und Krippenspiele in den Kirchen.",
      "Heiligabend ist kein gesetzlicher Feiertag, gilt aber vielerorts ab mittags als arbeitsfrei (per Tarif- oder Arbeitsvertrag). Der Einzelhandel schließt früher. Die eigentlichen Feiertage sind der 1. und 2. Weihnachtsfeiertag (25./26. Dezember).",
    ],
    faqExtra: [
      {
        q: "Ist Heiligabend ein gesetzlicher Feiertag?",
        a: "Nein. Der 24. Dezember ist kein gesetzlicher Feiertag. Viele Arbeitgeber geben aber ab mittags oder ganztägig frei. Gesetzliche Feiertage sind erst der 1. und 2. Weihnachtsfeiertag.",
      },
    ],
    related: ["nikolaus", "vierter-advent", "silvester"],
  },
  {
    slug: "silvester",
    name: "Silvester",
    emoji: "🎆",
    motif: "feuerwerk",
    kategorie: "brauchtum",
    movable: false,
    date: (y) => d(y, 11, 31),
    rule: "Jedes Jahr am 31. Dezember, dem letzten Tag des Jahres.",
    intro:
      "An Silvester verabschiedet Deutschland das alte Jahr mit Feuerwerk, Bleigießen (heute Wachsgießen), Sekt und guten Vorsätzen fürs neue Jahr.",
    brauchtum: [
      "Der Name geht auf Papst Silvester I. zurück, dessen Gedenktag der 31. Dezember ist. Um Mitternacht wird mit Feuerwerk, Böllern und Sekt ins neue Jahr gefeiert; „Dinner for One“ und der Countdown gehören für viele dazu.",
      "Silvester ist kein gesetzlicher Feiertag; vielerorts wird ab mittags frei gegeben. Der folgende 1. Januar (Neujahr) ist dagegen bundesweiter gesetzlicher Feiertag.",
    ],
    related: ["heiligabend", "valentinstag"],
  },
];

/* ------------------------------------------------------------------ */
/* Zugriff & Helfer                                                    */
/* ------------------------------------------------------------------ */

const BY_SLUG = new Map(BESONDERE_TAGE.map((e) => [e.slug, e]));

export function getBesondererTag(slug: string): BesondererTag | null {
  return BY_SLUG.get(slug) ?? null;
}

export type BesondererTagInstance = BesondererTag & {
  iso: string;
  endIso: string | null;
};

function iso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Ein konkretes Jahr aufgelöst, nach Datum sortiert. */
export function getBesondereTage(year: number): BesondererTagInstance[] {
  return BESONDERE_TAGE.map((e) => ({
    ...e,
    iso: iso(e.date(year)),
    endIso: e.endDate ? iso(e.endDate(year)) : null,
  })).sort((a, b) => a.iso.localeCompare(b.iso) || a.name.localeCompare(b.name));
}

/** Anlässe an einem bestimmten Datum (für das Kalenderblatt). */
export function getAnlaesseAmTag(year: number, isoDate: string): BesondererTagInstance[] {
  return getBesondereTage(year).filter(
    (e) => e.iso === isoDate || (e.endIso !== null && isoDate >= e.iso && isoDate <= e.endIso),
  );
}

export const ANLASS_KATEGORIE_LABEL: Record<AnlassKategorie, string> = {
  karneval: "Karneval & Fasching",
  familie: "Familie & Feste",
  advent: "Advent & Weihnachtszeit",
  brauchtum: "Brauchtum & Saison",
  kirchlich: "Kirchliche & stille Tage",
  saison: "Jahreszeiten",
};
