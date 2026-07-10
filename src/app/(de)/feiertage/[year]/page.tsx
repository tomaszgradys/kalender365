import PageWithSidebar from "@/components/de/PageWithSidebar";
import Breadcrumbs from "@/components/de/Breadcrumbs";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatLongDE, weekdayDE } from "@/lib/de/locale";
import { getAllFeiertage, getNationalFeiertage } from "@/lib/de/feiertage";
import { BUNDESLAENDER } from "@/lib/de/bundeslaender";
import BundeslandSelect from "@/components/de/BundeslandSelect";
import SeoProse from "@/components/de/SeoProse";
import Faq from "@/components/de/Faq";
import ShareButtons from "@/components/de/ShareButtons";
import { PRERENDER_YEARS, parseYear, isIndexableYear } from "@/lib/de/year";
import { ogMeta } from "@/lib/de/ogMeta";

export function generateStaticParams() {
  return PRERENDER_YEARS.map((y) => ({ year: String(y) }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) return {};
  return {
    title: `Feiertage ${y} Deutschland – alle gesetzlichen Feiertage`,
    description: `Alle gesetzlichen Feiertage ${y} in Deutschland mit Datum, Wochentag und Bundesland. Bundesweite und regionale Feiertage im Überblick, mit Bundesland-Auswahl.`,
    alternates: { canonical: `/feiertage/${y}` },
    openGraph: ogMeta(`/feiertage/${y}`),
    ...(isIndexableYear(y) ? {} : { robots: { index: false, follow: true } }),
  };
}

const SCOPE_LABEL: Record<string, string> = {
  national: "bundesweit",
  state: "einzelne Länder",
  partial: "teilweise (regional)",
  "sunday-legal": "Sonntag",
};

export default async function FeiertagePage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) notFound();

  const national = getNationalFeiertage(y);
  const all = getAllFeiertage(y);
  const regional = all.filter((h) => h.scope !== "national");

  // Matrix „welcher Feiertag gilt wo": Einträge gleichen Datums/Namens (z. B.
  // Fronleichnam voll + teilweise) zu einer Zeile zusammenführen; pro Land
  // „voll" (gesetzlich) oder „teilweise" (regional/konfessionsabhängig).
  const matrixMap = new Map<string, { date: string; name: string; note?: string; full: Set<string>; partial: Set<string> }>();
  for (const h of all) {
    if (h.scope === "sunday-legal") continue;
    const key = `${h.date}|${h.name}`;
    let row = matrixMap.get(key);
    if (!row) {
      row = { date: h.date, name: h.name, note: h.note, full: new Set(), partial: new Set() };
      matrixMap.set(key, row);
    }
    const target = h.scope === "partial" ? row.partial : row.full;
    for (const s of h.states) target.add(s);
  }
  const matrixRows = [...matrixMap.values()].sort((a, b) => a.date.localeCompare(b.date));
  const dm = (iso: string) => `${iso.slice(8)}.${iso.slice(5, 7)}.`;

  const faq = [
    {
      q: `Wie viele gesetzliche Feiertage gibt es ${y} in Deutschland?`,
      a: `Bundesweit gelten 9 gesetzliche Feiertage einheitlich in allen 16 Bundesländern. Je nach Bundesland kommen regionale Feiertage hinzu, sodass ein Land auf mehr Feiertage kommt.`,
    },
    {
      q: "Welche Feiertage gelten bundesweit?",
      a: "Neujahr, Karfreitag, Ostermontag, Tag der Arbeit, Christi Himmelfahrt, Pfingstmontag, Tag der Deutschen Einheit sowie der 1. und 2. Weihnachtsfeiertag.",
    },
    {
      q: "Warum unterscheiden sich Feiertage je nach Bundesland?",
      a: "Feiertage sind in Deutschland Ländersache. Jedes Bundesland legt seine gesetzlichen Feiertage über sein eigenes Feiertagsgesetz fest — deshalb gelten Tage wie Fronleichnam oder der Reformationstag nur in bestimmten Ländern.",
    },
    {
      q: "Ist Fronleichnam überall ein Feiertag?",
      a: "Nein. Fronleichnam ist gesetzlicher Feiertag in Baden-Württemberg, Bayern, Hessen, Nordrhein-Westfalen, Rheinland-Pfalz und im Saarland. In Sachsen und Thüringen gilt er nur in einzelnen (überwiegend katholischen) Gemeinden.",
    },
    {
      q: "Ist der Reformationstag überall ein Feiertag?",
      a: "Nein. Der Reformationstag (31. Oktober) ist gesetzlicher Feiertag in Brandenburg, Bremen, Hamburg, Mecklenburg-Vorpommern, Niedersachsen, Sachsen, Sachsen-Anhalt, Schleswig-Holstein und Thüringen.",
    },
    {
      q: "Was gilt, wenn ein Feiertag auf ein Wochenende fällt?",
      a: "In Deutschland gibt es keinen gesetzlichen Anspruch auf einen Ersatztag, wenn ein Feiertag auf ein Wochenende fällt. Ob ein Ausgleich gewährt wird, hängt vom Arbeits- oder Tarifvertrag ab.",
    },
  ];

  return (
    <div className="flex-1">
      <PageWithSidebar>
        <Breadcrumbs
          items={[
            { name: "Start", url: "/" },
            { name: `Feiertage ${y}`, url: `/feiertage/${y}` },
          ]}
        />

        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Feiertage {y} in Deutschland</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Bundesweit gelten {national.length} gesetzliche Feiertage einheitlich in allen 16 Bundesländern.
          Wählen Sie Ihr Bundesland, um regionale Feiertage und Brückentage zu sehen.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-navy-50/40 p-4">
          <BundeslandSelect basePath={`/feiertage/${y}`} />
          <a href={`/api/ics/feiertage/${y}`} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">📅 ICS (bundesweit)</a>
        </div>

        {/* NATIONAL */}
        <section className="mt-8">
          <h2 className="mb-3 text-xl font-bold text-navy-800">Bundesweite Feiertage</h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full min-w-[430px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-2 font-medium">Feiertag</th>
                  <th className="px-4 py-2 font-medium">Datum</th>
                  <th className="px-4 py-2 font-medium">Wochentag</th>
                </tr>
              </thead>
              <tbody>
                {national.map((h) => (
                  <tr key={h.slug} className="border-t border-slate-100">
                    <td className="px-4 py-2 font-medium text-navy-800">{h.name}</td>
                    <td className="px-4 py-2 text-slate-600">{formatLongDE(h.date)}</td>
                    <td className="px-4 py-2 text-slate-600">{weekdayDE(h.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* REGIONAL */}
        <section className="mt-8">
          <h2 className="mb-3 text-xl font-bold text-navy-800">Regionale Feiertage {y}</h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-2 font-medium">Feiertag</th>
                  <th className="px-4 py-2 font-medium">Datum</th>
                  <th className="px-4 py-2 font-medium">Gilt in</th>
                  <th className="px-4 py-2 font-medium">Art</th>
                </tr>
              </thead>
              <tbody>
                {regional.map((h, i) => (
                  <tr key={`${h.slug}-${i}`} className="border-t border-slate-100 align-top">
                    <td className="px-4 py-2 font-medium text-navy-800">
                      {h.name}
                      {h.note && <span className="block text-xs font-normal text-slate-500">{h.note}</span>}
                    </td>
                    <td className="px-4 py-2 text-slate-600 whitespace-nowrap">{formatLongDE(h.date)}</td>
                    <td className="px-4 py-2 text-slate-600">{h.states.join(", ")}</td>
                    <td className="px-4 py-2 text-slate-500">{SCOPE_LABEL[h.scope] ?? h.scope}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-slate-400">Abkürzungen: BW Baden-Württemberg, BY Bayern, BE Berlin, BB Brandenburg, HB Bremen, HH Hamburg, HE Hessen, MV Mecklenburg-Vorpommern, NI Niedersachsen, NW Nordrhein-Westfalen, RP Rheinland-Pfalz, SL Saarland, SN Sachsen, ST Sachsen-Anhalt, SH Schleswig-Holstein, TH Thüringen.</p>
        </section>

        {/* MATRIX: welcher Feiertag gilt wo */}
        <section className="mt-8">
          <h2 className="mb-1 text-xl font-bold text-navy-800">Welcher Feiertag gilt in welchem Bundesland?</h2>
          <p className="mb-3 max-w-3xl text-sm text-slate-600">
            Alle gesetzlichen Feiertage {y} im direkten Vergleich der 16 Bundesländer.
            <span className="ml-1 whitespace-nowrap">✓ = gesetzlicher Feiertag,</span>{" "}
            <span className="whitespace-nowrap">◑ = nur regional/teilweise,</span>{" "}
            <span className="whitespace-nowrap">· = kein Feiertag.</span>
          </p>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full min-w-[820px] border-collapse text-sm">
              <thead>
                <tr className="bg-navy-50 text-navy-700">
                  <th scope="col" className="sticky left-0 z-10 bg-navy-50 px-3 py-2 text-left font-semibold">Feiertag</th>
                  {BUNDESLAENDER.map((b) => (
                    <th key={b.code} scope="col" className="px-2 py-2 text-center font-semibold" title={b.name}>
                      <abbr title={b.name} className="no-underline">{b.code}</abbr>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrixRows.map((r) => (
                  <tr key={`${r.date}-${r.name}`} className="border-t border-slate-100 odd:bg-white even:bg-slate-50/60">
                    <th scope="row" className="sticky left-0 z-10 whitespace-nowrap bg-inherit px-3 py-2 text-left font-medium text-navy-800">
                      {r.name} <span className="font-normal text-slate-400">{dm(r.date)}</span>
                    </th>
                    {BUNDESLAENDER.map((b) => {
                      const full = r.full.has(b.code);
                      const partial = r.partial.has(b.code);
                      return (
                        <td
                          key={b.code}
                          className={`px-2 py-2 text-center ${full ? "bg-brand-green-50 font-bold text-brand-green-700" : partial ? "bg-amber-50 font-semibold text-amber-700" : "text-slate-300"}`}
                          title={full ? `${r.name}: gesetzlicher Feiertag in ${b.name}` : partial ? `${r.name}: nur regional/teilweise in ${b.name}` : `${r.name}: kein Feiertag in ${b.name}`}
                        >
                          {full ? "✓" : partial ? "◑" : "·"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            ◑ betrifft v. a. Fronleichnam (nur einzelne, überwiegend katholische Gemeinden in Sachsen und Thüringen) und
            Mariä Himmelfahrt (in Bayern nur in überwiegend katholischen Gemeinden). Kürzel: BW Baden-Württemberg,
            BY Bayern, BE Berlin, BB Brandenburg, HB Bremen, HH Hamburg, HE Hessen, MV Mecklenburg-Vorpommern,
            NI Niedersachsen, NW Nordrhein-Westfalen, RP Rheinland-Pfalz, SL Saarland, SN Sachsen, ST Sachsen-Anhalt,
            SH Schleswig-Holstein, TH Thüringen. Angaben ohne Gewähr.
          </p>
        </section>

        {/* BESONDERE TAGE */}
        <section className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-brand-green-100 bg-brand-green-50/40 p-4">
          <p className="text-sm text-slate-600">
            <strong className="text-navy-800">Keine gesetzlichen Feiertage, aber wichtig:</strong> Muttertag, Vatertag,
            Karneval, Advent &amp; Co.
          </p>
          <Link href={`/besondere-tage/${y}`} className="rounded-lg bg-navy-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-navy-700">
            ✨ Besondere Tage {y}
          </Link>
        </section>

        {/* BUNDESLÄNDER LINKS */}
        <section className="mt-8">
          <h2 className="mb-3 text-xl font-bold text-navy-800">Feiertage nach Bundesland</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {BUNDESLAENDER.map((b) => (
              <Link key={b.code} href={`/feiertage/${y}/${b.slug}`} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-navy-700 hover:border-navy-300 hover:shadow-sm">
                Feiertage {b.name}
              </Link>
            ))}
          </div>
        </section>

        <SeoProse
          blocks={[
            {
              h2: `Gesetzliche Feiertage ${y} in Deutschland`,
              p: [
                `${y} gibt es in Deutschland neun bundesweite gesetzliche Feiertage, die in allen 16 Bundesländern einheitlich gelten: Neujahr, Karfreitag, Ostermontag, Tag der Arbeit, Christi Himmelfahrt, Pfingstmontag, Tag der Deutschen Einheit sowie der 1. und 2. Weihnachtsfeiertag. Alle weiteren Feiertage sind Ländersache und unterscheiden sich von Bundesland zu Bundesland.`,
                `Bayern hat mit bis zu 13 gesetzlichen Feiertagen die meisten, während Länder wie Berlin, Hamburg oder Niedersachsen auf weniger kommen. Ob Heilige Drei Könige, Fronleichnam, Mariä Himmelfahrt, Reformationstag oder Allerheiligen gilt, hängt vom jeweiligen Landesrecht ab – wählen Sie oben Ihr Bundesland für die genaue Übersicht.`,
              ],
            },
            {
              h2: `Feiertage ${y} für die Urlaubsplanung nutzen`,
              p: [
                `Für lange Wochenenden sind vor allem Feiertage interessant, die auf einen Dienstag oder Donnerstag fallen – hier genügt ein einzelner Brückentag. Fällt ein gesetzlicher Feiertag hingegen auf ein Wochenende, gibt es in Deutschland keinen Anspruch auf einen Ersatztag. Alle Termine ${y} lassen sich als ICS-Datei herunterladen und in den digitalen Kalender importieren.`,
              ],
            },
          ]}
        />
        <Faq items={faq} />
        <ShareButtons title={`Feiertage ${y} in Deutschland`} />
      </PageWithSidebar>
    </div>
  );
}
