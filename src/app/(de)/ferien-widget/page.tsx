import type { Metadata } from "next";
import Link from "next/link";
import PageWithSidebar from "@/components/de/PageWithSidebar";
import Breadcrumbs from "@/components/de/Breadcrumbs";
import SeoProse from "@/components/de/SeoProse";
import Faq from "@/components/de/Faq";
import WidgetKonfigurator from "@/components/de/WidgetKonfigurator";
import { berlinNow } from "@/lib/de/now";
import { ogMeta } from "@/lib/de/ogMeta";

export const metadata: Metadata = {
  title: "Ferien-Widget für Schulwebsites – Schulferien & Feiertage einbetten",
  description:
    "Kostenloses Widget mit den nächsten Schulferien und Feiertagen Ihres Bundeslandes für Schul-, Eltern- und Vereinswebsites: Bundesland wählen, Code kopieren, einfügen. Aktualisiert sich selbst, ohne Cookies.",
  alternates: { canonical: "/ferien-widget" },
  openGraph: ogMeta("/ferien-widget", { defaultImage: true }),
};

export default function FerienWidgetPage() {
  const y = berlinNow().year;
  return (
    <div className="flex-1">
      <PageWithSidebar>
        <Breadcrumbs items={[{ name: "Start", url: "/" }, { name: "Ferien-Widget", url: "/ferien-widget" }]} />
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Ferien-Widget für Ihre Website</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Zeigen Sie die nächsten Schulferien und Feiertage Ihres Bundeslandes direkt auf Ihrer Schul-, Kita-, Eltern- oder
          Vereinswebsite – kostenlos, ohne Anmeldung und ohne Cookies. Bundesland wählen, Code kopieren, einfügen. Die Termine
          stammen aus den Ferienregelungen der Länder (KMK) und werden automatisch aktuell gehalten.
        </p>
        <div className="mt-6">
          <WidgetKonfigurator year={y} />
        </div>

        <SeoProse
          className="mt-12"
          blocks={[
            {
              h2: "Was das Widget zeigt",
              p: [
                `Das Widget listet die nächsten Schulferien Ihres Bundeslandes – laufende Ferien werden markiert – und auf Wunsch die nächsten gesetzlichen Feiertage. Die Daten reichen über den Jahreswechsel hinaus, sobald die Termine des Folgejahres veröffentlicht sind; für ${y + 1} und ${y + 2} liegen die Ferienkalender aller 16 Länder bereits vor. Alternativ lässt sich das Widget auf ein festes Jahr einstellen, etwa für eine Jahresübersicht im Elternbereich.`,
                "Technisch ist das Widget eine kleine, eigenständige Seite, die per iframe eingebunden wird. Sie lädt keine Skripte von Drittanbietern, setzt keine Cookies und überträgt keine Daten Ihrer Besucherinnen und Besucher – Datenschutz-Hinweise auf Ihrer Seite sind daher nicht nötig. Ein dezenter Quellenhinweis verlinkt auf die vollständige Ferienübersicht.",
              ],
            },
            {
              h2: "Für wen es gedacht ist",
              p: [
                "Für Schulen und Kitas, die Ferientermine ohne Pflegeaufwand anzeigen möchten, für Elternbeiräte und Fördervereine, für Sportvereine und Musikschulen mit ferienabhängigen Trainingszeiten sowie für Betriebe, die die Ferien ihres Standorts im Intranet zeigen. Wer die Termine lieber im eigenen Kalender hat: Jede Ferienseite bietet außerdem eine ICS-Datei zum Abonnieren.",
              ],
            },
          ]}
        />
        <Faq
          items={[
            { q: "Kostet das Widget etwas?", a: "Nein. Das Widget ist kostenlos, es ist keine Registrierung nötig." },
            { q: "Muss ich auf kalender365.pro verlinken?", a: "Nein, das ist keine Bedingung. Das Widget enthält lediglich einen kleinen Quellenhinweis mit Link auf die vollständige Ferienübersicht." },
            { q: "Woher stammen die Termine?", a: "Aus den offiziellen Ferienregelungen der Länder (Kultusministerkonferenz). Bewegliche Ferientage, die Schulen selbst festlegen, sind nicht enthalten." },
            { q: "Setzt das Widget Cookies oder lädt es Tracker?", a: "Nein. Es werden weder Cookies gesetzt noch Skripte Dritter geladen; es werden keine Daten Ihrer Besucher übertragen." },
            { q: "Kann ich Höhe und Breite anpassen?", a: "Ja. Ändern Sie im Code die Attribute width und height. Das Widget ist bis 520 Pixel Breite optimiert und passt sich schmaleren Spalten an." },
          ]}
        />
        <p className="mt-6 text-sm text-slate-500">
          Siehe auch: <Link href={`/schulferien/${y}`} className="underline">Schulferien {y}</Link> · <Link href={`/schulferien/${y + 1}`} className="underline">Schulferien {y + 1}</Link> · <Link href="/stundenplan" className="underline">Stundenplan-Generator</Link>
        </p>
      </PageWithSidebar>
    </div>
  );
}
