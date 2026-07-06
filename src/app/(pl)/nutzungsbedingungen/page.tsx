import type { Metadata } from "next";
import LegalShell from "@/components/de/LegalShell";
import { SITE_NAME } from "@/lib/de/site";

export const metadata: Metadata = {
  title: "Nutzungsbedingungen",
  description: `Nutzungsbedingungen für ${SITE_NAME}.`,
  alternates: { canonical: "/nutzungsbedingungen" },
};

export default function NutzungsbedingungenPage() {
  return (
    <LegalShell title="Nutzungsbedingungen">
      <h2>1. Gegenstand</h2>
      <p>
        {SITE_NAME} stellt kostenlose, informative Kalenderinhalte bereit: Kalender, Feiertage, Schulferien,
        Brückentage, Kalenderwochen, Arbeitstage und weitere Berechnungen für Deutschland und die Bundesländer.
      </p>
      <h2>2. Keine Gewähr</h2>
      <p>
        Alle Angaben erfolgen ohne Gewähr. Insbesondere Feiertags-, Ferien- und Arbeitszeitangaben können sich ändern
        oder regional abweichen. Die Inhalte stellen keine Rechts-, Steuer- oder Arbeitsrechtsberatung dar. Für
        verbindliche Auskünfte wenden Sie sich bitte an die zuständigen Stellen.
      </p>
      <h2>3. Nutzung</h2>
      <p>
        Die Nutzung der Website ist kostenlos. Die Inhalte dürfen für den persönlichen Gebrauch verwendet und
        ausgedruckt werden. Eine systematische Übernahme der Daten in konkurrierende Angebote ist nicht gestattet.
      </p>
      <h2>4. Haftung</h2>
      <p>
        Eine Haftung für Schäden, die aus der Nutzung oder Nichtnutzbarkeit der Inhalte entstehen, ist – soweit
        gesetzlich zulässig – ausgeschlossen.
      </p>
    </LegalShell>
  );
}
