import type { Metadata } from "next";
import LegalShell from "@/components/de/LegalShell";
import { ogMeta } from "@/lib/de/ogMeta";

export const metadata: Metadata = {
  title: "So berechnen wir",
  description:
    "Methodik hinter Kalender365: Wie wir Feiertage, Ostern, Kalenderwochen, Arbeitstage, Brückentage und Schulferien berechnen.",
  alternates: { canonical: "/so-berechnen-wir" },
  openGraph: ogMeta("/so-berechnen-wir", { defaultImage: true }),
};

export default function SoBerechnenWirPage() {
  return (
    <LegalShell title="So berechnen wir">
      <p>
        Alle Angaben werden deterministisch berechnet – ohne KI zur Laufzeit. Die Verfahren sind nachvollziehbar und
        für jedes Jahr reproduzierbar.
      </p>
      <h2>Ostern und bewegliche Feiertage</h2>
      <p>
        Der Ostersonntag wird mit dem anonymen gregorianischen Algorithmus (Gauß / Meeus–Jones–Butcher) bestimmt.
        Karfreitag, Ostermontag, Christi Himmelfahrt, Pfingstmontag und Fronleichnam ergeben sich als feste Abstände
        zum Ostersonntag.
      </p>
      <h2>Gesetzliche Feiertage</h2>
      <p>
        Bundesweite Feiertage gelten in allen 16 Ländern. Regionale Feiertage folgen den Feiertagsgesetzen der
        einzelnen Bundesländer (z. B. Fronleichnam, Reformationstag, Allerheiligen). Teilweise geltende Tage
        (z. B. Mariä Himmelfahrt in Bayern, Augsburger Friedensfest) sind gesondert gekennzeichnet. Der Buß- und
        Bettag ist der Mittwoch vor dem 23. November.
      </p>
      <h2>Kalenderwochen</h2>
      <p>
        Kalenderwochen folgen ISO 8601: Die Woche beginnt am Montag, und KW 1 ist die Woche, die den 4. Januar
        enthält. Ein Jahr hat 52 oder 53 Kalenderwochen.
      </p>
      <h2>Arbeitstage und Werktage</h2>
      <p>
        <strong>Arbeitstage</strong> zählen Montag bis Freitag ohne gesetzliche Feiertage des gewählten Bundeslandes
        (5-Tage-Woche). <strong>Werktage</strong> zählen Montag bis Samstag ohne Sonn- und Feiertage. Es gibt in
        Deutschland keinen generellen Ersatzanspruch, wenn ein Feiertag auf ein Wochenende fällt.
      </p>
      <h2>Brückentage</h2>
      <p>
        Als Brückentag gilt ein Arbeitstag zwischen einem Feiertag und dem Wochenende. Wir bewerten jede Brücke nach
        Effizienz (freie Tage je Urlaubstag) und sortieren die Vorschläge entsprechend.
      </p>
      <h2>Schulferien</h2>
      <p>
        Schulferien werden nicht berechnet, sondern aus offiziellen Quellen (KMK und die Kultusministerien der Länder)
        übernommen und geprüft. Ein Ferienkalender wird erst dann indexiert, wenn die Termine vollständig und
        verifiziert vorliegen.
      </p>
      <h2>Zeitzone</h2>
      <p>
        „Heute“ und die aktuelle Kalenderwoche werden in der Zeitzone Europe/Berlin (MEZ/MESZ) bestimmt.
      </p>
    </LegalShell>
  );
}
