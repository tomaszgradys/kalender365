import PageWithSidebar from "@/components/de/PageWithSidebar";
import Breadcrumbs from "@/components/de/Breadcrumbs";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRERENDER_YEARS, parseYear } from "@/lib/de/year";
import { BUNDESLAENDER } from "@/lib/de/bundeslaender";
import { getSchulferien, isSchulferienIndexable } from "@/lib/de/schulferien";
import BundeslandSelect from "@/components/de/BundeslandSelect";
import SeoProse from "@/components/de/SeoProse";
import Faq from "@/components/de/Faq";

export function generateStaticParams() {
  return PRERENDER_YEARS.map((y) => ({ year: String(y) }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) return {};
  // Indexable only if at least one state has verified data for this year.
  const anyVerified = BUNDESLAENDER.some((b) => isSchulferienIndexable(y, b.code));
  return {
    title: `Schulferien ${y} in Deutschland – Ferienkalender aller Bundesländer`,
    description: `Schulferien ${y} für alle 16 Bundesländer: Winter-, Oster-, Pfingst-, Sommer-, Herbst- und Weihnachtsferien. Termine je nach Bundesland.`,
    alternates: { canonical: `/schulferien/${y}` },
    ...(anyVerified ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function SchulferienHubPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) notFound();

  return (
    <main className="flex-1">
      <PageWithSidebar>
        <Breadcrumbs
          items={[
            { name: "Start", url: "/" },
            { name: `Schulferien ${y}`, url: `/schulferien/${y}` },
          ]}
        />
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Schulferien {y} in Deutschland</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Die Schulferien werden von den Kultusministerien der Länder festgelegt und über die KMK koordiniert.
          Wählen Sie Ihr Bundesland für Winter-, Oster-, Pfingst-, Sommer-, Herbst- und Weihnachtsferien.
        </p>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-navy-50/40 p-4">
          <BundeslandSelect basePath={`/schulferien/${y}`} />
        </div>

        <section className="mt-6">
          <h2 className="mb-3 text-xl font-bold text-navy-800">Schulferien {y} nach Bundesland</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {BUNDESLAENDER.map((b) => {
              const has = !!getSchulferien(y, b.code);
              return (
                <Link key={b.code} href={`/schulferien/${y}/${b.slug}`} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-navy-700 hover:border-navy-300 hover:shadow-sm">
                  {b.name}
                  {!has && <span className="text-[10px] text-slate-400">folgt</span>}
                </Link>
              );
            })}
          </div>
        </section>

        <SeoProse
          blocks={[
            {
              h2: "Wie sind die Schulferien in Deutschland geregelt?",
              p: [
                `Schulferien sind in Deutschland Ländersache: Jedes der 16 Bundesländer legt seine Ferientermine selbst fest. Damit nicht alle Familien gleichzeitig in den Urlaub starten, koordiniert die Kultusministerkonferenz (KMK) vor allem die Sommerferien und staffelt sie über mehrere Wochen. Deshalb beginnen die Sommerferien ${y} in Nordrhein-Westfalen zu einem anderen Zeitpunkt als etwa in Bayern oder Baden-Württemberg.`,
                `Aus diesem Grund gibt es keinen bundeseinheitlichen Ferienkalender – die genauen Termine finden Sie immer über die Auswahl Ihres Bundeslandes oben.`,
              ],
            },
            {
              h2: `Die Ferienarten im Schuljahr`,
              p: [
                `Über das Jahr verteilt gibt es in den meisten Ländern sechs Ferienabschnitte: Winterferien (Ende Januar/Februar), Osterferien bzw. Frühjahrsferien, Pfingstferien, die langen Sommerferien (rund sechs Wochen), Herbstferien und die Weihnachtsferien zum Jahreswechsel. Nicht jedes Bundesland kennt alle Arten – manche fassen etwa Pfingstferien zu einzelnen beweglichen Ferientagen zusammen.`,
              ],
            },
            {
              h2: `Ferientermine ${y} verlässlich planen`,
              p: [
                `Alle Termine auf dieser Seite stammen aus den offiziellen Angaben der Kultusministerien und der KMK. Bewegliche Ferientage, die einzelne Schulen zusätzlich frei geben, sind dabei nicht enthalten, da sie lokal festgelegt werden. Jede Ferienübersicht lässt sich als ICS-Datei herunterladen und direkt in Google Kalender, Outlook oder Apple Kalender importieren.`,
              ],
            },
          ]}
        />
        <Faq
          items={[
            { q: `Warum sind die Schulferien ${y} in jedem Bundesland anders?`, a: "Ferientermine sind Ländersache. Die KMK staffelt insbesondere die Sommerferien bewusst über mehrere Wochen, um den Reiseverkehr zu entzerren – deshalb unterscheiden sich die Termine je nach Bundesland." },
            { q: "Wie lange dauern die Sommerferien in Deutschland?", a: "Die Sommerferien dauern in allen Bundesländern etwa sechs Wochen. Der genaue Beginn verschiebt sich je nach Land zwischen Mitte Juni und Ende Juli." },
            { q: "Wer legt die Schulferien fest?", a: "Die Kultusministerien der einzelnen Bundesländer legen die Ferien fest; die Sommerferien werden zusätzlich über die Kultusministerkonferenz (KMK) länderübergreifend koordiniert." },
            { q: "Sind bewegliche Ferientage hier enthalten?", a: "Nein. Bewegliche Ferientage werden von den einzelnen Schulen bzw. Schulaufsichten vergeben und sind nicht Teil der landesweiten Ferientermine." },
          ]}
        />
      </PageWithSidebar>
    </main>
  );
}
