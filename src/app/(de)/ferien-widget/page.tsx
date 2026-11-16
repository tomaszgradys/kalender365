import type { Metadata } from "next";
import Link from "next/link";
import PageWithSidebar from "@/components/de/PageWithSidebar";
import Breadcrumbs from "@/components/de/Breadcrumbs";
import Faq from "@/components/de/Faq";
import WidgetKonfigurator from "@/components/de/WidgetKonfigurator";
import { berlinNow } from "@/lib/de/now";
import { ogMeta } from "@/lib/de/ogMeta";
import { serializeJsonLd, faqPageLd, breadcrumbLd, type QA } from "@/lib/de/jsonLd";
import { SITE_URL } from "@/lib/de/site";

// Seite zu den einbettbaren Widgets (Schulferien + Kalenderblatt) mit Konfigurator und
// Einbau-Anleitung. Die URL /ferien-widget bleibt (seit 22.10.2026 in Sitemap und Menü).
export const metadata: Metadata = {
  title: "Kalender-Widget für die Website – Schulferien & Kalenderblatt einbetten",
  description:
    "Kostenloses Kalender-Widget für Schul-, Gemeinde- und Vereinswebsites: Schulferien Ihres Bundeslandes oder Kalenderblatt mit Datum und KW. Code kopieren, einfügen.",
  alternates: { canonical: "/ferien-widget" },
  openGraph: ogMeta("/ferien-widget", { defaultImage: true }),
};

export default function FerienWidgetPage() {
  const y = berlinNow().year;
  const faq: QA[] = [
    { q: "Kostet das Kalender-Widget etwas?", a: "Nein. Beide Widgets sind kostenlos, eine Registrierung ist nicht nötig. Einzige Bedingung ist der kurze Quellenhinweis mit Link auf Kalender365.pro, der Teil des Einbettungscodes ist." },
    { q: "Wie binde ich einen Kalender in meine Website ein?", a: "Widget auswählen, Code kopieren und dort einfügen, wo Ihr System eigenen HTML-Code annimmt. In WordPress ist das der Block „Individuelles HTML“, in TYPO3 das Inhaltselement „Reines HTML“, in Google Sites der Befehl Einfügen, dann Einbetten." },
    { q: "Aktualisiert sich das Widget von selbst?", a: "Ja. Datum, Kalenderwoche, Ferien und Feiertage werden automatisch aktuell gehalten, auch über den Jahreswechsel. Nach dem Einbau müssen Sie nichts mehr pflegen." },
    { q: "Woher stammen die Ferientermine?", a: "Aus den offiziellen Ferienregelungen der Länder (Kultusministerkonferenz). Bewegliche Ferientage, die Schulen selbst festlegen, sind nicht enthalten." },
    { q: "Setzt das Widget Cookies oder lädt es Tracker?", a: "Nein. Das Widget setzt keine Cookies, lädt keine Skripte von Drittanbietern und erstellt keine Besucherprofile. Wie bei jedem eingebetteten Inhalt ruft der Browser das Widget von unserem Server ab; dabei wird technisch bedingt die IP-Adresse übertragen." },
    { q: "Kann ich Höhe und Breite anpassen?", a: "Ja. Ändern Sie im Code die Attribute width und height sowie den Wert max-width. Das Widget passt sich schmaleren Spalten an." },
    { q: "Was tun, wenn das Widget nach dem Einfügen nicht erscheint?", a: "Meist hat der Editor den Rahmen beim Speichern entfernt. Fügen Sie den Code im HTML-Modus ein, nicht in ein normales Textfeld. Hilft das nicht, muss die Administration das Element iframe im Editor erlauben." },
  ];
  const ld = {
    "@context": "https://schema.org",
    "@graph": [breadcrumbLd([{ name: "Start", url: "/" }, { name: "Kalender-Widget", url: "/ferien-widget" }], SITE_URL), faqPageLd(faq)],
  };
  const h2 = "mt-10 text-xl font-bold text-navy-800";
  const h3 = "mt-5 font-bold text-navy-800";
  const p = "mt-2 max-w-3xl text-slate-700";
  const a = "font-medium text-navy-700 underline hover:text-navy-900";
  return (
    <div className="flex-1">
      <PageWithSidebar>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(ld) }} />
        <Breadcrumbs items={[{ name: "Start", url: "/" }, { name: "Kalender-Widget", url: "/ferien-widget" }]} />
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Kalender-Widget für Ihre Website</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Zeigen Sie die nächsten Schulferien Ihres Bundeslandes oder ein Kalenderblatt mit Datum, Kalenderwoche und
          nächstem Feiertag direkt auf Ihrer Website – kostenlos und ohne Anmeldung. Widget wählen, Code kopieren,
          einfügen. Die Inhalte halten sich danach von selbst aktuell.
        </p>
        <div className="mt-6">
          <WidgetKonfigurator year={y} />
        </div>

        <h2 className={h2} id="anleitung">So binden Sie das Widget ein</h2>
        <p className={p}>
          Das Widget ist fertiger HTML-Code. Er gehört dorthin, wo Ihr System eigenen Code annimmt, nicht in ein
          normales Textfeld. Der Einbau dauert wenige Minuten.
        </p>
        <ol className="mt-3 max-w-3xl list-decimal space-y-1.5 pl-6 text-slate-700">
          <li>Oben das Widget wählen und auf „Code kopieren“ klicken.</li>
          <li>Die Seite oder Seitenleiste öffnen, in der der Kalender erscheinen soll.</li>
          <li>Ein Element für eigenen HTML-Code hinzufügen, den Code einfügen und speichern.</li>
          <li>Die Seite in einem neuen Tab öffnen und prüfen, ob das Widget die aktuellen Daten zeigt.</li>
        </ol>

        <h3 className={h3}>WordPress</h3>
        <p className={p}>
          Fügen Sie im Block-Editor den Block „Individuelles HTML“ hinzu und setzen Sie den Code ein. Soll der
          Kalender in der Seitenleiste oder im Footer stehen, wählen Sie unter Design den Punkt Widgets und nutzen
          dort denselben Block. Bei WordPress.com entfernen die günstigen Tarife Rahmen aus dem Code; dort brauchen
          Sie einen höheren Tarif oder eine eigene WordPress-Installation.
        </p>

        <h3 className={h3}>TYPO3</h3>
        <p className={p}>
          Legen Sie auf der gewünschten Seite ein neues Inhaltselement vom Typ „Reines HTML“ an. Sie finden es unter
          den speziellen Elementen. Code einfügen, speichern, Cache der Seite leeren.
        </p>

        <h3 className={h3}>Joomla</h3>
        <p className={p}>
          Erstellen Sie ein neues Modul für eigene Inhalte (englisch „Custom“) und weisen Sie ihm eine Position zu,
          etwa die Seitenleiste. Schalten Sie den Editor in die Code-Ansicht, fügen Sie den Code ein und speichern
          Sie. Verschwindet der Rahmen nach dem Speichern, hat der Editor ihn herausgefiltert. Die Administration
          kann das in der Konfiguration bei den Textfiltern und in den Einstellungen des Editors ändern.
        </p>

        <h3 className={h3}>Google Sites</h3>
        <p className={p}>
          Wählen Sie im Bearbeitungsmodus Einfügen, dann Einbetten, und wechseln Sie zum Reiter für eingebetteten
          Code. Code einfügen, bestätigen und zum Schluss den Rahmen so groß ziehen, dass das ganze Widget sichtbar
          ist.
        </p>

        <h3 className={h3}>Anderes System oder Baukasten</h3>
        <p className={p}>
          Die meisten Systeme haben ein Element namens „HTML“, „Code“ oder „Einbetten“. Finden Sie keines, schicken
          Sie den Code an die Person, die Ihre Website betreut. Ein Satz genügt: „Bitte diesen HTML-Code in die
          Seitenleiste einfügen.“
        </p>

        <h2 className={h2} id="inhalt">Was die Widgets zeigen</h2>
        <h3 className={h3}>Schulferien</h3>
        <p className={p}>
          Das Widget listet die nächsten Schulferien Ihres Bundeslandes, laufende Ferien werden markiert, und auf
          Wunsch die nächsten gesetzlichen Feiertage. Die Daten reichen über den Jahreswechsel hinaus; für {y + 1}{" "}
          und {y + 2} liegen die Ferienkalender aller 16 Länder bereits vor. Alternativ lässt sich das Widget auf ein
          festes Jahr einstellen, etwa für eine Jahresübersicht im Elternbereich. Die vollständigen Übersichten:{" "}
          <Link href={`/schulferien/${y}`} className={a}>Schulferien {y}</Link> und{" "}
          <Link href={`/schulferien/${y + 1}`} className={a}>Schulferien {y + 1}</Link>.
        </p>
        <h3 className={h3}>Kalenderblatt</h3>
        <p className={p}>
          Das Kalenderblatt zeigt das heutige Datum mit Wochentag, die Kalenderwoche, den Tag des Jahres und den
          Namenstag. Darunter steht der nächste gesetzliche Feiertag mit der Zahl der Tage bis dahin, bundesweit oder
          für Ihr Bundesland. Mehr dazu auf den Seiten{" "}
          <Link href="/heute" className={a}>Welcher Tag ist heute?</Link>,{" "}
          <Link href={`/kalenderwochen/${y}`} className={a}>Kalenderwochen {y}</Link> und{" "}
          <Link href={`/feiertage/${y}`} className={a}>Feiertage {y}</Link>.
        </p>

        <h2 className={h2} id="zielgruppe">Für wen es gedacht ist</h2>
        <p className={p}>
          Für Schulen und Kitas, die Ferientermine ohne Pflegeaufwand anzeigen möchten, für Elternbeiräte und
          Fördervereine, für Sportvereine und Musikschulen mit ferienabhängigen Trainingszeiten. Das Kalenderblatt
          passt auf die Startseite einer Gemeinde, einer Pfarrei oder ins Intranet eines Betriebs. Wer die Termine
          lieber im eigenen Kalender hat: Jede Ferienseite bietet außerdem eine ICS-Datei zum Abonnieren.
        </p>

        <h2 className={h2} id="datenschutz">Datenschutz und Barrierefreiheit</h2>
        <p className={p}>
          Technisch ist jedes Widget eine kleine, eigenständige Seite, die per iframe eingebunden wird. Sie setzt
          keine Cookies, lädt keine Skripte von Drittanbietern und erstellt keine Besucherprofile. Wie bei jedem
          eingebetteten Inhalt ruft der Browser Ihrer Besucherinnen und Besucher das Widget von unserem Server ab;
          dabei wird technisch bedingt die IP-Adresse übertragen. Ob Sie das in Ihrer Datenschutzerklärung erwähnen,
          klären Sie bitte mit Ihrer oder Ihrem Datenschutzbeauftragten. Der Inhalt ist echter Text und kein Bild,
          Screenreader können ihn also vorlesen, und der Rahmen trägt einen eigenen Titel.
        </p>

        <h2 className={h2} id="nutzung">Nutzungsbedingungen</h2>
        <p className={p}>
          Die Widgets sind kostenlos und ohne Begrenzung der Aufrufe nutzbar. Wir bitten nur darum, den
          Quellenhinweis „Kalender: Kalender365.pro“ mit Link stehen zu lassen, der Teil des Codes ist. So bleibt das
          Angebot kostenlos und werbefrei. Schriftgröße und Farbe des Hinweises dürfen Sie an Ihre Seite anpassen.
        </p>

        <Faq items={faq} />
        <p className="mt-6 text-sm text-slate-500">
          Siehe auch: <Link href={`/kalender-zum-ausdrucken`} className="underline">Kalender zum Ausdrucken</Link> · <Link href="/stundenplan" className="underline">Stundenplan-Generator</Link>
        </p>
      </PageWithSidebar>
    </div>
  );
}
