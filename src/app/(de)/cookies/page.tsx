import type { Metadata } from "next";
import LegalShell from "@/components/de/LegalShell";
import { SITE_NAME } from "@/lib/de/site";
import { ogMeta } from "@/lib/de/ogMeta";

export const metadata: Metadata = {
  title: "Cookies & Einstellungen",
  description: `Informationen zu Cookies und lokaler Speicherung bei ${SITE_NAME}.`,
  alternates: { canonical: "/cookies" },
  openGraph: ogMeta("/cookies", { defaultImage: true }),
};

export default function CookiesPage() {
  return (
    <LegalShell title="Cookies & Einstellungen">
      <p>
        {SITE_NAME} kommt ohne Tracking-Cookies aus. Für den Betrieb notwendige Funktionen nutzen ausschließlich
        lokale Speicherung (localStorage) in Ihrem Browser, etwa um Ihr zuletzt gewähltes Bundesland zu merken.
        Diese Daten werden nicht an uns übertragen.
      </p>
      <h2>Welche Speicherung nutzen wir?</h2>
      <ul>
        <li><strong>kalender365.bundesland</strong> (localStorage): merkt Ihr zuletzt gewähltes Bundesland.</li>
      </ul>
      <h2>Werbung und Analyse</h2>
      <p>
        Sollten künftig Analyse- oder Werbedienste eingesetzt werden, werden diese hier aufgeführt und – soweit
        erforderlich – nur nach Ihrer Einwilligung geladen. Diese Seite wird dann um ein Einwilligungsbanner ergänzt.
      </p>
      <h2>Speicherung löschen</h2>
      <p>Sie können die lokale Speicherung jederzeit über die Einstellungen Ihres Browsers löschen.</p>
    </LegalShell>
  );
}
