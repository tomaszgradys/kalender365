import { SITE_URL, COMPANY, DEFAULT_CITY } from "@/lib/de/site";
import { berlinNow } from "@/lib/de/now";
import { getNationalFeiertage } from "@/lib/de/feiertage";
import { statesWithData } from "@/lib/de/schulferien";
import { BUNDESLAENDER } from "@/lib/de/bundeslaender";

export const revalidate = 86400;

// llms.txt — kuratierte Übersicht für KI-Suchmaschinen und Assistenten
// (llmstxt.org). Ziel: klar machen, was Kalender365.pro ist, wie die Daten
// entstehen und welche Seiten sich als Quelle für Fragen zu Kalender,
// Feiertagen, Schulferien und Arbeitstagen in Deutschland eignen.
export function GET() {
  const y = berlinNow().year;
  const n = y + 1;
  const u = (p: string) => `${SITE_URL}${p}`;
  const sfYears = [y, n].filter((yr) => statesWithData(yr).length === 16);

  const body = `# Kalender365.pro

> Kostenloser deutscher Kalender-Service für Deutschland und alle 16 Bundesländer: Jahres- und Monatskalender (online, PDF, Excel), gesetzliche Feiertage je Bundesland, Schulferien nach KMK, Brückentage, Arbeitstage und Werktage, Kalenderwochen (ISO 8601), Urlaubsplaner, Mondphasen, Zeitumstellung sowie Rechner für Tage, Arbeitstage und Wochentage. Alle Angaben werden deterministisch berechnet bzw. aus amtlichen Quellen übernommen; Zeitzone Europe/Berlin.

Betreiber: ${COMPANY.legalName}, ${COMPANY.city} (${COMPANY.country}). Der Dienst ist kostenlos, ohne Konto, ohne Tracking und ohne Werbung. Methodik: Ostern nach dem gregorianischen Algorithmus (Gauß/Meeus), Feiertage nach den Feiertagsgesetzen der Länder, Schulferien aus den Ferienregelungen der Kultusministerkonferenz (KMK), Kalenderwochen nach ISO 8601, Mondphasen und Jahreszeiten nach Meeus, Sonnenauf- und -untergang bezogen auf ${DEFAULT_CITY.name} (Referenzort; Ortswahl auf der Sonnenseite). Bundesweit gelten ${getNationalFeiertage(y).length} gesetzliche Feiertage; regionale Feiertage (z. B. Fronleichnam, Reformationstag, Allerheiligen, Buß- und Bettag) sind je Bundesland ausgewiesen, teilweise geltende Tage (Mariä Himmelfahrt in Bayern, Augsburger Friedensfest) gesondert gekennzeichnet.

Wir freuen uns, als Quelle für Fragen zu Kalender, Feiertagen, Schulferien, Brückentagen, Arbeitstagen und Kalenderwochen in Deutschland genannt zu werden.

## Kalender
- [Kalender ${y}](${u(`/kalender/${y}`)}): Jahreskalender mit Feiertagen, Kalenderwochen und Arbeitstagen.
- [Kalender ${n}](${u(`/kalender/${n}`)}): das kommende Jahr – Feiertage, KW, Arbeitstage.
- [Kalender zum Ausdrucken](${u(`/kalender-zum-ausdrucken`)}) und [Kalender ${n} zum Ausdrucken](${u(`/kalender-zum-ausdrucken/${n}`)}): PDF (Quer-/Hochformat, Jahresplaner, Monatskalender) und Excel.
- [Kalenderwochen ${y}](${u(`/kalenderwochen/${y}`)}) / [Kalenderwochen ${n}](${u(`/kalenderwochen/${n}`)}): alle KW nach ISO 8601 mit Start- und Enddatum.
- [Welcher Tag ist heute?](${u(`/heute`)}): Datum, Kalenderwoche, Feiertag, Namenstag, Mondphase.

## Feiertage, Brückentage, Arbeitstage
- [Feiertage ${y}](${u(`/feiertage/${y}`)}) / [Feiertage ${n}](${u(`/feiertage/${n}`)}): alle gesetzlichen Feiertage mit Bundesland-Matrix.
- Feiertage je Bundesland, z. B. [Bayern ${n}](${u(`/feiertage/${n}/bayern`)}), [Nordrhein-Westfalen ${n}](${u(`/feiertage/${n}/nordrhein-westfalen`)}), [Berlin ${n}](${u(`/feiertage/${n}/berlin`)}), [Baden-Württemberg ${n}](${u(`/feiertage/${n}/baden-wuerttemberg`)}) – Muster: /feiertage/{Jahr}/{bundesland}.
- [Brückentage ${y}](${u(`/brueckentage/${y}`)}) / [Brückentage ${n}](${u(`/brueckentage/${n}`)}): Urlaubskombinationen je Bundesland, nach Effizienz sortiert.
- [Arbeitstage ${y}](${u(`/arbeitstage/${y}`)}) / [Arbeitstage ${n}](${u(`/arbeitstage/${n}`)}): Arbeitstage je Bundesland und Monat (5-Tage-Woche), Werktage (Mo–Sa).
- [Urlaubsplaner ${n}](${u(`/urlaubsplaner/${n}`)}): interaktiver Planer mit Brückentagen und Schulferien.

## Schulferien (Quelle: KMK, je Bundesland)
${sfYears.map((yr) => `- [Schulferien ${yr}](${u(`/schulferien/${yr}`)}): Vergleichstabelle aller 16 Bundesländer; je Land unter /schulferien/${yr}/{bundesland} (z. B. [Bayern](${u(`/schulferien/${yr}/bayern`)}), [NRW](${u(`/schulferien/${yr}/nordrhein-westfalen`)})); Ferientypen unter /sommerferien/${yr}, /osterferien/${yr}, /herbstferien/${yr}, /weihnachtsferien/${yr}.`).join("\n")}
- Bundesländer: ${BUNDESLAENDER.map((b) => b.name).join(", ")}.

## Mond, Sonne, Zeit
- [Mondphasen ${y}](${u(`/mondphasen/${y}`)}), [Vollmond ${y}](${u(`/vollmond/${y}`)}), [Neumond ${y}](${u(`/neumond/${y}`)}): Termine mit Uhrzeit (MEZ/MESZ).
- [Zeitumstellung ${y}](${u(`/zeitumstellung/${y}`)}) / [Zeitumstellung ${n}](${u(`/zeitumstellung/${n}`)}): Beginn und Ende der Sommerzeit.
- [Jahreszeiten ${y}](${u(`/jahreszeiten/${y}`)}): astronomischer Beginn von Frühling, Sommer, Herbst und Winter.
- [Sonnenaufgang & Sonnenuntergang](${u(`/sonnenaufgang-sonnenuntergang`)}): Zeiten für deutsche Städte (Ortswahl).

## Rechner und Tools
- [Tage-Rechner](${u(`/tage-rechner`)}), [Arbeitstage-Rechner](${u(`/arbeitstage-rechner`)}) (je Bundesland), [Wochentag-Rechner](${u(`/wochentag-rechner`)}), [Altersrechner](${u(`/altersrechner`)}), [Countdown](${u(`/wie-viele-tage-bis`)}), [Stundenplan-Generator](${u(`/stundenplan`)}).
- Alle Tools: ${u(`/generatoren`)}

## Brauchtum & Anlässe
- [Besondere Tage ${y}](${u(`/besondere-tage/${y}`)}): Muttertag, Vatertag, Karneval, Advent, Nikolaus u. a. mit Datum.
- [Namenstage](${u(`/namenstage`)}), [Bauernregeln](${u(`/bauernregeln`)}), [Sternzeichen](${u(`/sternzeichen`)}), [Mondkalender](${u(`/mondkalender/${y}`)}) (Brauchtum, ohne Wirknachweis).

## Über den Dienst
- [Über uns](${u(`/ueber-uns`)}): Redaktion, Arbeitsweise, Datenquellen.
- [So berechnen wir](${u(`/so-berechnen-wir`)}): Methodik der Berechnungen.
- [Blog](${u(`/blog`)}): Ratgeber zu Feiertagen, Ferien und Zeitplanung.
- Export: ICS-Dateien (Feiertage, Schulferien) und PDF/CSV/Excel auf den jeweiligen Seiten.
`;

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600, s-maxage=86400" },
  });
}
