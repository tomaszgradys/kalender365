import PageWithSidebar from "@/components/de/PageWithSidebar";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRERENDER_YEARS, parseYear, yearRobots } from "@/lib/de/year";
import { BUNDESLAENDER } from "@/lib/de/bundeslaender";
import { arbeitstageInYear } from "@/lib/de/arbeitstage";
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
  return {
    title: `Arbeitstage ${y} – nach Bundesland berechnen`,
    description: `Anzahl der Arbeitstage ${y} pro Bundesland bei einer 5-Tage-Woche, unter Berücksichtigung der gesetzlichen Feiertage. Mit Bundesland-Auswahl.`,
    alternates: { canonical: `/arbeitstage/${y}` },
    ...yearRobots(y),
  };
}

export default async function ArbeitstageHubPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) notFound();

  const rows = BUNDESLAENDER.map((b) => ({ b, at: arbeitstageInYear(y, b.code) })).sort((x, z) => z.at - x.at);

  return (
    <main className="flex-1">
      <PageWithSidebar>
        <nav className="mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span>
          <span className="text-navy-700">Arbeitstage {y}</span>
        </nav>
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Arbeitstage {y} in Deutschland</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          <strong>Arbeitstage</strong> = Montag bis Freitag ohne gesetzliche Feiertage des jeweiligen Bundeslandes
          (5-Tage-Woche). Nicht zu verwechseln mit <strong>Werktagen</strong> (Montag bis Samstag ohne Sonn- und Feiertage).
          Weil Feiertage Ländersache sind, unterscheidet sich die Zahl je Bundesland.
        </p>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-navy-50/40 p-4">
          <BundeslandSelect basePath={`/arbeitstage/${y}`} />
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-2 font-medium">Bundesland</th>
                <th className="px-4 py-2 font-medium">Arbeitstage {y}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ b, at }) => (
                <tr key={b.code} className="border-t border-slate-100">
                  <td className="px-4 py-2">
                    <Link href={`/arbeitstage/${y}/${b.slug}`} className="font-medium text-navy-700 hover:underline">{b.name}</Link>
                  </td>
                  <td className="px-4 py-2 font-semibold text-navy-800">{at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-slate-500">
          Details und Berechnung: <Link href="/so-berechnen-wir" className="font-medium text-navy-600 underline">So berechnen wir</Link>.
        </p>

        <SeoProse
          blocks={[
            {
              h2: `Wie viele Arbeitstage hat ${y}?`,
              p: [
                `Die Zahl der Arbeitstage ${y} unterscheidet sich je nach Bundesland, weil die gesetzlichen Feiertage Ländersache sind. Am meisten Arbeitstage hat ${y} ${rows[0].b.name} mit ${rows[0].at} Tagen, am wenigsten ${rows[rows.length - 1].b.name} mit ${rows[rows.length - 1].at} Tagen. Grundlage ist die 5-Tage-Woche (Montag bis Freitag); gesetzliche Feiertage, die auf einen Werktag fallen, werden abgezogen.`,
                `Arbeitstage sind die Basis für Gehaltsabrechnung, Urlaubsberechnung, Projektplanung und Fristen. Wählen Sie oben Ihr Bundesland, um die genaue Zahl samt Monatsaufteilung und den zugrunde liegenden Feiertagen zu sehen.`,
              ],
            },
            {
              h2: "Arbeitstage oder Werktage?",
              p: [
                `Verwechseln Sie Arbeitstage nicht mit Werktagen: Arbeitstage sind Montag bis Freitag, Werktage dagegen Montag bis Samstag. Der Samstag ist rechtlich ein Werktag, auch wenn an ihm meist nicht gearbeitet wird – das ist etwa bei gesetzlichen Fristen relevant, die in Werktagen angegeben werden. Sonntage und gesetzliche Feiertage zählen bei beiden nicht.`,
              ],
            },
          ]}
        />
        <Faq
          items={[
            { q: `Welches Bundesland hat ${y} die meisten Arbeitstage?`, a: `${rows[0].b.name} hat ${y} mit ${rows[0].at} Arbeitstagen die meisten, ${rows[rows.length - 1].b.name} mit ${rows[rows.length - 1].at} die wenigsten. Der Unterschied ergibt sich aus den regionalen Feiertagen.` },
            { q: "Wie werden die Arbeitstage berechnet?", a: "Gezählt werden alle Tage von Montag bis Freitag im Jahr, abzüglich der gesetzlichen Feiertage des jeweiligen Bundeslandes, die auf einen Werktag fallen." },
            { q: "Was ist der Unterschied zwischen Arbeitstagen und Werktagen?", a: "Arbeitstage sind Montag bis Freitag. Werktage umfassen zusätzlich den Samstag. Sonn- und Feiertage zählen bei beiden nicht." },
            { q: `Wie viele Arbeitstage hat ein einzelner Monat ${y}?`, a: `Wählen Sie Ihr Bundesland – auf der Detailseite finden Sie die Arbeitstage ${y} pro Monat. Für einen frei wählbaren Zeitraum nutzen Sie den Arbeitstage-Rechner.` },
          ]}
        />
      </PageWithSidebar>
    </main>
  );
}
