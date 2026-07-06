import type { Metadata } from "next";
import LegalShell from "@/components/de/LegalShell";
import { COMPANY, SITE_NAME } from "@/lib/de/site";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: `Datenschutzerklärung von ${SITE_NAME} gemäß DSGVO.`,
  alternates: { canonical: "/datenschutz" },
};

export default function DatenschutzPage() {
  return (
    <LegalShell title="Datenschutzerklärung">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <strong>Hinweis:</strong> Diese Datenschutzerklärung ist eine allgemeine Vorlage. Sie muss vor dem öffentlichen
        Betrieb an die tatsächlich eingesetzten Dienste (Hosting, Analyse, Werbung) und den verantwortlichen Betreiber
        angepasst werden.
      </div>
      <h2>1. Verantwortlicher</h2>
      <p>
        Verantwortlich für die Datenverarbeitung auf dieser Website ist der im <a href="/impressum">Impressum</a>
        {" "}genannte Betreiber ({COMPANY.legalName}). Kontakt: {COMPANY.email}.
      </p>
      <h2>2. Grundsatz</h2>
      <p>
        {SITE_NAME} ist ein informativer Kalenderdienst. Alle Berechnungen (Feiertage, Kalenderwochen, Arbeitstage,
        Brückentage) erfolgen ohne Benutzerkonto und ohne Erhebung personenbezogener Daten. Eine Anmeldung ist nicht
        erforderlich.
      </p>
      <h2>3. Hosting und Server-Logs</h2>
      <p>
        Beim Aufruf der Seiten werden durch den Hosting-Anbieter technisch notwendige Daten (z. B. IP-Adresse,
        Zeitpunkt, aufgerufene URL) verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
        Interesse an einem sicheren, stabilen Betrieb).
      </p>
      <h2>4. Lokale Speicherung (localStorage)</h2>
      <p>
        Zur Verbesserung der Bedienung speichern wir Ihre zuletzt gewählte Auswahl (z. B. Ihr Bundesland) lokal in
        Ihrem Browser. Diese Daten verlassen Ihr Gerät nicht und werden nicht an uns übertragen.
      </p>
      <h2>5. Ihre Rechte</h2>
      <p>
        Sie haben nach der DSGVO das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
        Datenübertragbarkeit und Widerspruch sowie ein Beschwerderecht bei einer Aufsichtsbehörde.
      </p>
      <h2>6. Cookies</h2>
      <p>
        Einzelheiten zu eingesetzten Cookies finden Sie in den <a href="/cookies">Cookie-Einstellungen</a>.
      </p>
    </LegalShell>
  );
}
