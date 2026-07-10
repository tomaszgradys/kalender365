import PageWithSidebar from "@/components/de/PageWithSidebar";
import Breadcrumbs from "@/components/de/Breadcrumbs";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRERENDER_YEARS, parseYear, yearRobots } from "@/lib/de/year";
import { getSeasons } from "@/lib/de/astroYear";
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
    title: `Jahreszeiten ${y} – Frühling, Sommer, Herbst & Winter`,
    description: `Astronomischer Beginn der Jahreszeiten ${y}: Frühlingsanfang, Sommeranfang, Herbstanfang und Winteranfang mit genauem Datum und Uhrzeit.`,
    alternates: { canonical: `/jahreszeiten/${y}` },
    ...yearRobots(y),
  };
}
const ICON: Record<string, string> = { fruehling: "🌱", sommer: "☀️", herbst: "🍂", winter: "❄️" };
export default async function JahreszeitenPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) notFound();
  const seasons = getSeasons(y);
  return (
    <div className="flex-1">
      <PageWithSidebar>
        <Breadcrumbs
          items={[
            { name: "Start", url: "/" },
            { name: `Jahreszeiten ${y}`, url: `/jahreszeiten/${y}` },
          ]}
        />
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Jahreszeiten {y}</h1>
        <p className="mt-2 text-slate-600">Astronomischer Beginn der vier Jahreszeiten {y} — mit genauer Uhrzeit (Europe/Berlin). Berechnung nach Meeus.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {seasons.map((s) => (
            <div key={s.key} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-3xl">{ICON[s.key]}</div>
              <h2 className="mt-1 text-lg font-bold text-navy-800">{s.name}</h2>
              <p className="mt-1 font-semibold text-brand-green-700">{s.date}</p>
              <p className="text-sm text-slate-500">um {s.time} Uhr</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-2 text-sm">
          <Link href={`/jahreszeiten/${y - 1}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">← {y - 1}</Link>
          <Link href={`/jahreszeiten/${y + 1}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">{y + 1} →</Link>
          <Link href={`/zeitumstellung/${y}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Zeitumstellung {y}</Link>
        </div>

        <SeoProse
          blocks={[
            {
              h2: `Wann beginnen die Jahreszeiten ${y}?`,
              p: [
                `Die astronomischen Jahreszeiten ${y} beginnen mit den Tag-und-Nacht-Gleichen (Äquinoktien) und den Sonnenwenden (Solstitien). Der Frühling startet zur Frühlings-Tagundnachtgleiche im März, der Sommer zur Sommersonnenwende im Juni (dem längsten Tag), der Herbst zur Herbst-Tagundnachtgleiche im September und der Winter zur Wintersonnenwende im Dezember (dem kürzesten Tag). Alle Zeitpunkte oben sind nach dem Algorithmus von Jean Meeus berechnet und in mitteleuropäischer Zeit (Europe/Berlin) angegeben.`,
              ],
            },
            {
              h2: `Astronomische und meteorologische Jahreszeiten`,
              p: [
                `Neben den astronomischen gibt es die meteorologischen Jahreszeiten, die Meteorologen zur einfacheren Auswertung von Klimadaten nutzen. Sie beginnen jeweils am Monatsersten: Frühling am 1. März, Sommer am 1. Juni, Herbst am 1. September und Winter am 1. Dezember. Deshalb ist der „Sommeranfang“ je nach Definition der 1. Juni (meteorologisch) oder rund der 21. Juni (astronomisch).`,
              ],
            },
          ]}
        />
        <Faq
          items={[
            { q: `Wann ist Frühlingsanfang ${y}?`, a: `Der astronomische Frühling beginnt ${y} am ${seasons.find((s) => s.key === "fruehling")?.date} um ${seasons.find((s) => s.key === "fruehling")?.time} Uhr (Europe/Berlin). Meteorologisch beginnt der Frühling bereits am 1. März.` },
            { q: `Wann ist Sommeranfang ${y}?`, a: `Der astronomische Sommer beginnt ${y} zur Sommersonnenwende am ${seasons.find((s) => s.key === "sommer")?.date} um ${seasons.find((s) => s.key === "sommer")?.time} Uhr – das ist der längste Tag des Jahres.` },
            { q: "Was ist der Unterschied zwischen astronomischen und meteorologischen Jahreszeiten?", a: "Astronomische Jahreszeiten richten sich nach dem Stand der Sonne (Tagundnachtgleichen und Sonnenwenden) und beginnen um den 20./21. des Monats. Meteorologische Jahreszeiten beginnen aus praktischen Gründen jeweils am Monatsersten." },
            { q: "Warum verschiebt sich der Jahreszeitenbeginn jedes Jahr um Stunden?", a: "Ein Sonnenjahr dauert etwa 365,24 Tage. Weil unser Kalender nur 365 Tage hat (mit Schaltjahr-Korrektur), verschiebt sich der exakte Zeitpunkt der Tagundnachtgleichen und Sonnenwenden von Jahr zu Jahr um einige Stunden." },
          ]}
        />
      </PageWithSidebar>
    </div>
  );
}
