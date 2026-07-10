import type { Metadata } from "next";
import LegalShell from "@/components/de/LegalShell";
import { COMPANY, SITE_NAME } from "@/lib/de/site";
import { ogMeta } from "@/lib/de/ogMeta";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: `Datenschutzerklärung von ${SITE_NAME} gemäß DSGVO.`,
  alternates: { canonical: "/datenschutz" },
  openGraph: ogMeta("/datenschutz", { defaultImage: true }),
};

export default function DatenschutzPage() {
  return (
    <LegalShell title="Datenschutzerklärung">
      <h2>1. Verantwortlicher</h2>
      <p>
        Verantwortlich im Sinne der DSGVO ist:
        <br />
        {COMPANY.legalName}, {COMPANY.street}, {COMPANY.postal} {COMPANY.city}, {COMPANY.country}
        <br />
        E-Mail: {COMPANY.email} · Telefon: {COMPANY.phone}
        <br />
        Weitere Angaben finden Sie im <a href="/impressum">Impressum</a>.
      </p>
      <h2>2. Grundsatz</h2>
      <p>
        {SITE_NAME} ist ein informativer Kalenderdienst. Alle Berechnungen (Feiertage, Kalenderwochen, Arbeitstage,
        Brückentage) erfolgen ohne Benutzerkonto und ohne Erhebung personenbezogener Daten. Eine Anmeldung ist nicht
        erforderlich.
      </p>
      <h2>3. Hosting und Server-Logs</h2>
      <p>
        Diese Website wird bei der Vercel Inc. (340 S Lemon Ave #4133, Walnut, CA 91789, USA) gehostet. Beim Aufruf der
        Seiten werden technisch notwendige Server-Logs (z. B. IP-Adresse, Zeitpunkt, aufgerufene URL, User-Agent)
        verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem sicheren, stabilen
        Betrieb). Eine Übermittlung in die USA erfolgt auf Grundlage des EU-US Data Privacy Framework (DPF) sowie
        ergänzender Standardvertragsklauseln (SCC) gemäß Art. 46 DSGVO.
      </p>
      <h2>4. Lokale Speicherung (localStorage)</h2>
      <p>
        Zur Verbesserung der Bedienung speichern wir Ihre zuletzt gewählte Auswahl (z. B. Ihr Bundesland) lokal in
        Ihrem Browser. Diese Daten verlassen Ihr Gerät nicht und werden nicht an uns übertragen.
      </p>
      <h2>5. Kontaktaufnahme per E-Mail</h2>
      <p>
        Wenn Sie uns per E-Mail kontaktieren, verarbeiten wir Ihre Angaben (E-Mail-Adresse, Inhalt der Nachricht)
        ausschließlich zur Bearbeitung Ihrer Anfrage. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
        Interesse an der Beantwortung von Anfragen), bei vertragsbezogenen Anliegen Art. 6 Abs. 1 lit. b DSGVO. Wir
        löschen diese Daten, sobald Ihre Anfrage abschließend geklärt ist und keine gesetzlichen
        Aufbewahrungspflichten entgegenstehen. Ein Kontaktformular betreiben wir nicht; es werden keine Daten über
        die Website an uns übermittelt.
      </p>
      <h2>6. Ihre Rechte</h2>
      <p>
        Sie haben nach der DSGVO das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
        Datenübertragbarkeit und Widerspruch sowie ein Beschwerderecht bei einer Aufsichtsbehörde.
      </p>
      <h2>7. Cookies</h2>
      <p>
        Einzelheiten zu eingesetzten Cookies finden Sie in den <a href="/cookies">Cookie-Einstellungen</a>.
      </p>
    </LegalShell>
  );
}
