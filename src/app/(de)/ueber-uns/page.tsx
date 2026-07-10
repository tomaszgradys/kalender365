import type { Metadata } from "next";
import Link from "next/link";
import LegalShell from "@/components/de/LegalShell";
import { serializeJsonLd } from "@/lib/de/jsonLd";
import { SITE_URL, SITE_NAME, COMPANY } from "@/lib/de/site";

export const metadata: Metadata = {
  title: "Über uns – Redaktion, Daten und Quellen",
  description:
    "Wer hinter Kalender365.pro steht, wie wir Feiertage, Schulferien und astronomische Daten ermitteln und aus welchen offiziellen Quellen sie stammen.",
  alternates: { canonical: "/ueber-uns" },
};

const ld = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: `Über ${SITE_NAME}`,
  url: `${SITE_URL}/ueber-uns`,
  inLanguage: "de-DE",
  mainEntity: { "@id": `${SITE_URL}/#organization` },
  publisher: { "@id": `${SITE_URL}/#organization` },
  lastReviewed: "2026-07-10",
};

export default function UeberUnsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(ld) }} />
      <LegalShell title="Über uns">
        <p>
          <strong>{SITE_NAME}</strong> ist ein kostenloser Kalender-Dienst für Deutschland. Wir bündeln an einem Ort,
          was den Alltag strukturiert: Jahres-, Monats- und Druckkalender, gesetzliche Feiertage, Schulferien,
          Brückentage, Kalenderwochen, Arbeitstage sowie astronomische Daten wie Mondphasen, Sonnenauf- und -untergang
          und den Beginn der Jahreszeiten – für alle 16 Bundesländer, ohne Anmeldung und ohne Kosten.
        </p>

        <h2>Redaktion und Verantwortung</h2>
        <p>
          Betreiber und inhaltlich verantwortlich ist die {COMPANY.legalName} (verantwortlich im Sinne des §&nbsp;18
          Abs.&nbsp;2 MStV: {COMPANY.responsible}). Die vollständigen Anbieterangaben finden Sie im{" "}
          <Link href="/impressum">Impressum</Link>, Hinweise zum Datenschutz in der{" "}
          <Link href="/datenschutz">Datenschutzerklärung</Link>. Fragen, Hinweise und Korrekturen erreichen uns über die{" "}
          <Link href="/kontakt">Kontaktseite</Link> oder per E-Mail an{" "}
          <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
        </p>

        <h2>Wie wir arbeiten</h2>
        <p>
          Wir legen Wert auf nachvollziehbare, überprüfbare Daten. Termine werden – soweit möglich – nicht abgetippt,
          sondern nach den amtlichen Regeln <strong>deterministisch berechnet</strong> und gegen offizielle Quellen
          geprüft. Die genauen Rechenverfahren (etwa die Osterformel für bewegliche Feiertage oder die
          Kalenderwochen nach ISO&nbsp;8601) legen wir transparent auf der Seite{" "}
          <Link href="/so-berechnen-wir">So berechnen wir</Link> offen.
        </p>
        <ul>
          <li><strong>Berechnen statt raten:</strong> Feiertage, Kalenderwochen, Arbeits- und Brückentage sowie Mondphasen entstehen algorithmisch nach festen, dokumentierten Regeln.</li>
          <li><strong>Gegen amtliche Quellen prüfen:</strong> Nicht berechenbare Angaben – vor allem die Schulferien – gleichen wir mit den offiziellen Veröffentlichungen ab.</li>
          <li><strong>Landesrecht beachten:</strong> Feiertage und Ferien sind Ländersache; jede Übersicht lässt sich nach Bundesland filtern.</li>
          <li><strong>Ehrlich mit Unsicherheit:</strong> Alle Angaben erfolgen ohne Gewähr. Für rechtsverbindliche Planung gilt immer die amtliche Quelle.</li>
        </ul>

        <h2>Unsere Datenquellen</h2>
        <ul>
          <li>
            <strong>Gesetzliche Feiertage:</strong> die Feiertagsgesetze der 16 Bundesländer; die beweglichen Feiertage
            werden über die Gaußsche Osterformel aus dem Osterdatum abgeleitet.
          </li>
          <li>
            <strong>Schulferien:</strong> die offiziellen Ferienkalender der{" "}
            <a href="https://www.kmk.org/service/ferienregelung/ferienkalender.html" target="_blank" rel="noopener noreferrer">
              Kultusministerkonferenz (KMK)
            </a>{" "}
            sowie der Kultusministerien der Länder. Zuletzt vollständig gegen die amtlichen KMK-PDFs geprüft am 9.&nbsp;Juli&nbsp;2026.
          </li>
          <li>
            <strong>Kalenderwochen:</strong> Norm{" "}
            <a href="https://www.iso.org/iso-8601-date-and-time-format.html" target="_blank" rel="noopener noreferrer">ISO&nbsp;8601</a>{" "}
            (Woche 1 enthält den ersten Donnerstag des Jahres, Wochenbeginn Montag).
          </li>
          <li>
            <strong>Mondphasen, Sonnenauf-/-untergang, Jahreszeiten:</strong> astronomische Standardalgorithmen (u.&nbsp;a.
            nach Jean Meeus, &bdquo;Astronomical Algorithms&ldquo;).
          </li>
          <li>
            <strong>Zeitzone:</strong> IANA-Zeitzone <code>Europe/Berlin</code> inklusive der gesetzlichen
            Sommer-/Winterzeit-Umstellung.
          </li>
        </ul>

        <h2>Aktualität und Korrekturen</h2>
        <p>
          Berechnete Inhalte gelten für vergangene wie künftige Jahre gleichermaßen. Amtlich festgelegte Termine –
          insbesondere Schulferien – aktualisieren wir, sobald neue offizielle Ferienregelungen vorliegen. Sollte Ihnen
          dennoch ein Fehler auffallen, freuen wir uns über einen kurzen Hinweis über die{" "}
          <Link href="/kontakt">Kontaktseite</Link> – wir prüfen und korrigieren zeitnah.
        </p>
        <p className="text-sm text-slate-500">Zuletzt überprüft: 10.&nbsp;Juli&nbsp;2026.</p>
      </LegalShell>
    </>
  );
}
