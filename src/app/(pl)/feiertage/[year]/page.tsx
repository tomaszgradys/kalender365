import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatLongDE, weekdayDE } from "@/lib/de/locale";
import { getAllFeiertage, getNationalFeiertage } from "@/lib/de/feiertage";
import { BUNDESLAENDER } from "@/lib/de/bundeslaender";
import BundeslandSelect from "@/components/de/BundeslandSelect";

const NAV_MIN = 2015;
const NAV_MAX = 2035;

export function generateStaticParams() {
  return Array.from({ length: NAV_MAX - NAV_MIN + 1 }, (_, i) => ({ year: String(NAV_MIN + i) }));
}
function parseYear(raw: string): number | null {
  if (!/^\d{4}$/.test(raw)) return null;
  const y = Number(raw);
  return y >= 1900 && y <= 2100 ? y : null;
}
const isNavigable = (y: number) => y >= NAV_MIN && y <= NAV_MAX;

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) return {};
  return {
    title: `Feiertage ${y} Deutschland – alle gesetzlichen Feiertage`,
    description: `Alle gesetzlichen Feiertage ${y} in Deutschland mit Datum, Wochentag und Bundesland. Bundesweite und regionale Feiertage im Überblick, mit Bundesland-Auswahl.`,
    alternates: { canonical: `/feiertage/${y}` },
    ...(isNavigable(y) ? {} : { robots: { index: false, follow: true } }),
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
  const regional = getAllFeiertage(y).filter((h) => h.scope !== "national");

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

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <main className="flex-1">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <nav className="mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span>
          <span className="text-navy-700">Feiertage {y}</span>
        </nav>

        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Feiertage {y} in Deutschland</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Bundesweit gelten {national.length} gesetzliche Feiertage einheitlich in allen 16 Bundesländern.
          Wählen Sie Ihr Bundesland, um regionale Feiertage und Brückentage zu sehen.
        </p>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-navy-50/40 p-4">
          <BundeslandSelect basePath={`/feiertage/${y}`} />
        </div>

        {/* NATIONAL */}
        <section className="mt-8">
          <h2 className="mb-3 text-xl font-bold text-navy-800">Bundesweite Feiertage</h2>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
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
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
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

        {/* FAQ */}
        <section className="mt-10">
          <h2 className="mb-3 text-xl font-bold text-navy-800">Häufige Fragen</h2>
          <div className="space-y-3">
            {faq.map((f) => (
              <details key={f.q} className="rounded-2xl border border-slate-200 bg-white p-4">
                <summary className="cursor-pointer font-semibold text-navy-800">{f.q}</summary>
                <p className="mt-2 text-sm text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
