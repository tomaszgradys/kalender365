import type { Metadata } from "next";
import LegalShell from "@/components/de/LegalShell";
import { COMPANY, SITE_NAME } from "@/lib/de/site";
import { ogMeta } from "@/lib/de/ogMeta";

// TODO(legal): sobald echte Betreiberdaten in de/site.ts hinterlegt sind, das
// `noindex` unten entfernen. Solange Platzhalter aktiv sind, NICHT indexieren.
const HAS_REAL_DATA = !COMPANY.legalName.startsWith("TODO");

export const metadata: Metadata = {
  title: "Impressum",
  description: `Impressum von ${SITE_NAME} gemäß § 5 DDG.`,
  alternates: { canonical: "/impressum" },
  openGraph: ogMeta("/impressum", { defaultImage: true }),
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
      <h2>Vertreten durch</h2>
      <p>{COMPANY.responsible}</p>
      <h2>Register</h2>
      <p>
        {COMPANY.register}
        <br />
        REGON: {COMPANY.regon}
      </p>
      <h2>Kontakt</h2>
      <p>
        Telefon: {COMPANY.phone}
        <br />
        E-Mail: {COMPANY.email}
      </p>
      <h2>Umsatzsteuer-Identifikationsnummer</h2>
      <p>USt-IdNr. gemäß § 27a UStG: {COMPANY.vatId}</p>
      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <p>
        {COMPANY.responsible}
        <br />
        {COMPANY.street}, {COMPANY.postal} {COMPANY.city}, {COMPANY.country}
      </p>
      <h2>EU-Streitschlichtung</h2>
      <p>
        Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
        <a href="https://ec.europa.eu/consumers/odr/" rel="noopener nofollow">
          https://ec.europa.eu/consumers/odr/
        </a>
        . Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor einer
        Verbraucherschlichtungsstelle teilzunehmen.
      </p>
      <h2>Haftung für Inhalte</h2>
      <p>
        Die Inhalte dieser Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und
        Aktualität der Inhalte (insbesondere Feiertags-, Ferien- und Kalenderangaben) können wir jedoch keine Gewähr
        übernehmen. Angaben ohne Gewähr.
      </p>
    </LegalShell>
  );
}
