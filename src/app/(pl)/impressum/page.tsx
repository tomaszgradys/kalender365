import type { Metadata } from "next";
import LegalShell from "@/components/de/LegalShell";
import { COMPANY, SITE_NAME } from "@/lib/de/site";

// TODO(legal): sobald echte Betreiberdaten in de/site.ts hinterlegt sind, das
// `noindex` unten entfernen. Solange Platzhalter aktiv sind, NICHT indexieren.
const HAS_REAL_DATA = !COMPANY.legalName.startsWith("TODO");

export const metadata: Metadata = {
  title: "Impressum",
  description: `Impressum von ${SITE_NAME} gemäß § 5 DDG.`,
  alternates: { canonical: "/impressum" },
  ...(HAS_REAL_DATA ? {} : { robots: { index: false, follow: true } }),
};

export default function ImpressumPage() {
  return (
    <LegalShell title="Impressum">
      {!HAS_REAL_DATA && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>Platzhalter.</strong> Dieses Impressum enthält noch keine echten Betreiberdaten und ist deshalb
          von der Indexierung ausgeschlossen. Vor dem öffentlichen Betrieb müssen die Angaben nach § 5 DDG ergänzt werden.
        </div>
      )}
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        {COMPANY.legalName}
        <br />
        {COMPANY.street}
        <br />
        {COMPANY.postal} {COMPANY.city}
        <br />
        {COMPANY.country}
      </p>
      <h2>Kontakt</h2>
      <p>E-Mail: {COMPANY.email}</p>
      <h2>Umsatzsteuer-Identifikationsnummer</h2>
      <p>{COMPANY.vatId}</p>
      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <p>{COMPANY.responsible}</p>
      <h2>Haftung für Inhalte</h2>
      <p>
        Die Inhalte dieser Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und
        Aktualität der Inhalte (insbesondere Feiertags-, Ferien- und Kalenderangaben) können wir jedoch keine Gewähr
        übernehmen. Angaben ohne Gewähr.
      </p>
    </LegalShell>
  );
}
