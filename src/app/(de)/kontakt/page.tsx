import type { Metadata } from "next";
import LegalShell from "@/components/de/LegalShell";
import { COMPANY, SITE_NAME } from "@/lib/de/site";
import { ogMeta } from "@/lib/de/ogMeta";

export const metadata: Metadata = {
  title: "Kontakt",
  description: `Kontakt zu ${SITE_NAME}.`,
  alternates: { canonical: "/kontakt" },
  openGraph: ogMeta("/kontakt", { defaultImage: true }),
};

export default function KontaktPage() {
  return (
    <LegalShell title="Kontakt">
      <p>
        Fragen, Fehler in den Daten oder Verbesserungsvorschläge? Wir freuen uns über Ihre Nachricht.
      </p>
      <h2>E-Mail</h2>
      <p>
        <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
      </p>
      <p>
        Hinweise auf falsche Feiertags- oder Ferientermine helfen uns besonders – bitte nennen Sie dabei Bundesland
        und Jahr.
      </p>
    </LegalShell>
  );
}
