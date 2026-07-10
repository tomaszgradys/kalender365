import Link from "next/link";
import PageWithSidebar from "@/components/de/PageWithSidebar";
import Breadcrumbs from "@/components/de/Breadcrumbs";
import SeoProse from "@/components/de/SeoProse";
import Faq from "@/components/de/Faq";
import AusdruckenDownloads from "@/components/de/AusdruckenDownloads";
import { serializeJsonLd, faqPageLd, breadcrumbLd, type QA } from "@/lib/de/jsonLd";
import { SITE_URL } from "@/lib/de/site";
import { berlinNow } from "@/lib/de/now";

/**
 * Gemeinsame Ansicht für den Hub „/kalender-zum-ausdrucken" (aktuelles Jahr,
 * stärkstes Keyword) und die Jahresseiten „/kalender-zum-ausdrucken/[year]".
 */
export default function KalenderAusdrucken({ year, isHub = false }: { year: number; isHub?: boolean }) {
  const nowY = berlinNow().year;
  const switchYears = Array.from({ length: 6 }, (_, i) => nowY - 1 + i); // Vorjahr … +4
  const canonicalPath = isHub ? "/kalender-zum-ausdrucken" : `/kalender-zum-ausdrucken/${year}`;

  const faq: QA[] = [
    { q: "Ist der Kalender zum Ausdrucken kostenlos?", a: "Ja. Alle PDF- und Excel-Vorlagen sind kostenlos, ohne Anmeldung und ohne Wasserzeichen nutzbar. Sie können sie sofort herunterladen und auf jedem A4- oder A3-Drucker ausdrucken." },
    { q: `Welche Kalender-Vorlagen ${year} gibt es?`, a: `Zur Auswahl stehen der Jahreskalender im Quer- und Hochformat (alle 12 Monate auf einer Seite), ein Jahresplaner zum Eintragen, ein Halbjahreskalender über zwei Seiten sowie einzelne Monatskalender – jeweils mit Kalenderwochen und Feiertagen.` },
    { q: "Kann ich die Feiertage meines Bundeslandes einblenden?", a: "Ja. Wählen Sie oben Ihr Bundesland – dann enthalten alle Vorlagen die gesetzlichen Feiertage und Schulferien dieses Landes, farbig hervorgehoben." },
    { q: "Gibt es den Kalender auch als Excel-Datei?", a: "Ja. Der Jahresplaner steht zusätzlich als editierbare Excel-Datei (.xlsx) bereit – mit farbig markierten Wochenenden und Feiertagen sowie einem eigenen Tabellenblatt für die Feiertage und Schulferien." },
    { q: "In welchem Format wird gedruckt?", a: "Alle Vorlagen sind für DIN A4 optimiert (Jahreskalender und Jahresplaner im Querformat, Monats- und Halbjahreskalender im Hochformat) und lassen sich auf A3 vergrößern." },
  ];

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbLd(
        [
          { name: "Start", url: "/" },
          { name: `Kalender ${year} zum Ausdrucken`, url: canonicalPath },
        ],
        SITE_URL,
      ),
      faqPageLd(faq),
    ],
  };

  return (
    <main className="flex-1">
      <PageWithSidebar>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(ld) }} />
        <Breadcrumbs
          items={[
            { name: "Start", url: "/" },
            { name: `Kalender ${year} zum Ausdrucken`, url: canonicalPath },
          ]}
        />
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Kalender {year} zum Ausdrucken – kostenlos als PDF &amp; Excel</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Kostenlose Kalender­vorlagen {year} für Deutschland: Jahreskalender im Quer- und Hochformat, Jahresplaner,
          Halbjahres- und Monatskalender – mit Kalenderwochen und Feiertagen, optional für Ihr Bundesland. Als PDF und als
          editierbare Excel-Datei, ohne Anmeldung.
        </p>

        {/* Jahres-Umschalter */}
        <nav aria-label="Kalenderjahr wählen" className="mt-4 flex flex-wrap gap-2">
          {switchYears.map((y) => {
            const active = y === year;
            return (
              <Link
                key={y}
                href={y === nowY ? "/kalender-zum-ausdrucken" : `/kalender-zum-ausdrucken/${y}`}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
                  active ? "bg-navy-600 text-white" : "border border-slate-200 bg-white text-navy-700 hover:border-navy-300"
                }`}
              >
                {y}
              </Link>
            );
          })}
        </nav>

        <section className="mt-6">
          <AusdruckenDownloads year={year} />
        </section>

        <SeoProse
          className="mt-12"
          blocks={[
            {
              h2: `Kalender ${year} zum Ausdrucken – alle Vorlagen im Überblick`,
              p: [
                `Ob als Wandkalender, für den Ordner oder als Familienplaner am Kühlschrank: Auf dieser Seite finden Sie den kompletten Kalender ${year} kostenlos zum Ausdrucken. Jede Vorlage ist druckfertig für DIN A4 aufbereitet, enthält die Kalenderwochen nach ISO 8601 und markiert Wochenenden sowie gesetzliche Feiertage farblich. Ein Klick genügt – die PDF-Datei öffnet sich sofort und lässt sich ohne weitere Software drucken.`,
                `Der Jahreskalender bündelt alle zwölf Monate auf einer einzigen Seite – wahlweise im Querformat für die Wand oder im Hochformat für den Ordner. Wer lieber Termine direkt einträgt, nutzt den Jahresplaner: Er zeigt die Tage 1 bis 31 als Zeilen und die Monate als Spalten, sodass das ganze Jahr auf einen Blick planbar ist. Für mehr Schreibfläche sorgt der Halbjahreskalender mit je sechs großen Monatsfeldern auf zwei Seiten, und der Monatskalender liefert einen einzelnen Monat im Detail.`,
              ],
            },
            {
              h2: "Mit den Feiertagen und Schulferien Ihres Bundeslandes",
              p: [
                `Feiertage und Schulferien sind in Deutschland Ländersache. Wählen Sie darum oben einfach Ihr Bundesland aus – schon enthalten sämtliche Vorlagen die gesetzlichen Feiertage dieses Landes und heben zusätzlich die Schulferien hervor. So sehen Beschäftigte auf einen Blick ihre Brückentage und Familien die freie Zeit ihrer Kinder. Ohne Auswahl zeigt der Kalender die neun bundesweiten Feiertage, die in ganz Deutschland gelten.`,
              ],
            },
            {
              h2: "Kalender als Excel-Datei zum Bearbeiten",
              p: [
                `Neben den PDF-Vorlagen steht der Jahresplaner ${year} auch als Excel-Datei (.xlsx) bereit. Darin sind Wochenenden, Feiertage und – bei gewähltem Bundesland – die Schulferien bereits farbig markiert. Ein zweites Tabellenblatt listet alle Feiertage mit Datum und Wochentag, ein drittes die Ferientermine. Weil die Datei frei editierbar ist, können Sie Termine, Urlaub und Projekte direkt eintragen, Spalten anpassen oder eigene Spalten ergänzen.`,
              ],
            },
          ]}
        />

        <section className="mt-8">
          <h2 className="mb-2 text-xl font-bold text-navy-800">Passend dazu</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {[
              { href: `/feiertage/${year}`, label: `Feiertage ${year} nach Bundesland` },
              { href: `/schulferien/${year}`, label: `Schulferien ${year} – alle Bundesländer` },
              { href: `/brueckentage/${year}`, label: `Brückentage ${year} – Urlaub verlängern` },
              { href: `/kalenderwochen/${year}`, label: `Kalenderwochen ${year} (KW-Übersicht)` },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-navy-700 hover:border-navy-300 hover:shadow-sm">
                  {l.label} →
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <Faq items={faq} />
      </PageWithSidebar>
    </main>
  );
}
