import PageWithSidebar from "@/components/de/PageWithSidebar";
import Breadcrumbs from "@/components/de/Breadcrumbs";
import Link from "next/link";
import type { Metadata } from "next";
import { berlinNow } from "@/lib/de/now";
import { MONTH_NAMES_DE } from "@/lib/de/locale";
import { allNamenstage, getNamenstage, namensIndex } from "@/lib/de/namenstage";
import SeoProse from "@/components/de/SeoProse";
import Faq from "@/components/de/Faq";
import ModuleHero from "@/components/de/ModuleHero";
import { MODULE_HERO, heroSrc } from "@/lib/de/heroes";
import { ogMeta } from "@/lib/de/ogMeta";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Namenstage – Kalender aller Namenstage im Jahr",
  description: "Namenstag heute und alle Namenstage im Jahresüberblick: Wann hat welcher Vorname Namenstag? Mit alphabetischem Namensverzeichnis nach dem Heiligenkalender.",
  alternates: { canonical: "/namenstage" },
  openGraph: ogMeta("/namenstage", { defaultImage: true }),
};

function mmdd(month0: number, day: number): string {
  return `${String(month0 + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function NamenstagePage() {
  const { year, month0, day } = berlinNow();
  const heute = getNamenstage(month0, day);
  const alle = allNamenstage();
  const index = namensIndex();

  // Nach Monat gruppieren.
  const byMonth: Record<number, typeof alle> = {};
  for (const e of alle) (byMonth[e.month0] ??= []).push(e);

  const faq = [
    {
      q: "Was ist ein Namenstag?",
      a: "Der Namenstag erinnert an den Heiligen oder die Heilige, deren Namen man trägt. Er richtet sich nach dem kirchlichen Heiligenkalender und wird vor allem im katholisch geprägten Raum (Süddeutschland, Österreich) gefeiert.",
    },
    {
      q: "Namenstag oder Geburtstag – was ist der Unterschied?",
      a: "Der Geburtstag feiert den Tag der Geburt, der Namenstag den Gedenktag des gleichnamigen Heiligen. Beide können auf unterschiedliche Tage im Jahr fallen.",
    },
    {
      q: "Hat jeder Vorname einen Namenstag?",
      a: "Nicht jeder moderne Vorname hat einen kirchlichen Gedenktag. Dieses Verzeichnis führt die bekanntesten Namenstage nach dem katholischen Heiligenkalender; ohne passenden Heiligen gibt es keinen festen Namenstag.",
    },
  ];

  return (
    <div className="flex-1">
      <PageWithSidebar>
        <Breadcrumbs
          items={[
            { name: "Start", url: "/" },
            { name: "Namenstage", url: "/namenstage" },
          ]}
        />

        <ModuleHero src={heroSrc(MODULE_HERO, "namenstage")} alt="Namenstage im Kalender" motif="kalender" uid="hero-namen" className="mb-5 h-36 w-full sm:h-44" priority />

        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Namenstage im Kalender</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Wann hat welcher Vorname Namenstag? Hier finden Sie den Namenstag heute, alle Namenstage im Jahresverlauf
          und ein alphabetisches Namensverzeichnis nach dem katholischen Heiligenkalender.
        </p>

        <div className="mt-5 rounded-2xl border border-brand-green-100 bg-brand-green-50/50 p-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-brand-green-700">📛 Namenstag heute</div>
          <div className="mt-1 text-xl font-black text-navy-800">
            {heute.length ? heute.join(", ") : "Heute ist kein bekannter Namenstag verzeichnet."}
          </div>
          <div className="text-sm text-slate-600">{day}. {MONTH_NAMES_DE[month0]} {year}</div>
          <Link href={`/namenstage/${mmdd(month0, day)}`} className="mt-2 inline-block text-xs font-medium text-navy-600 hover:underline">Details zum heutigen Namenstag →</Link>
        </div>

        {/* Alphabetisches Verzeichnis */}
        <section className="mt-8">
          <h2 className="mb-3 text-xl font-bold text-navy-800">Namensverzeichnis von A–Z</h2>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
              {index.map((n) => (
                <Link key={`${n.name}-${n.mmdd}`} href={`/namenstage/${n.mmdd}`} className="text-slate-700 hover:text-navy-600 hover:underline">
                  {n.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Jahresübersicht nach Monat */}
        <section className="mt-8">
          <h2 className="mb-3 text-xl font-bold text-navy-800">Alle Namenstage im Jahr</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {MONTH_NAMES_DE.map((mn, m0) => (
              <div key={m0} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="bg-navy-50/60 px-4 py-2 text-sm font-bold text-navy-800">{mn}</div>
                <ul className="divide-y divide-slate-100 text-sm">
                  {(byMonth[m0] ?? []).map((e) => (
                    <li key={e.mmdd}>
                      <Link href={`/namenstage/${e.mmdd}`} className="flex gap-3 px-4 py-1.5 hover:bg-navy-50/40">
                        <span className="w-8 shrink-0 text-right font-medium text-slate-500">{e.day}.</span>
                        <span className="text-slate-700">{e.names.join(", ")}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <SeoProse
          blocks={[
            {
              h2: "Namenstage in Deutschland",
              p: [
                "Der Brauch des Namenstags ist vor allem im katholischen Süden Deutschlands sowie in Österreich lebendig. Gefeiert wird der Gedenktag des Heiligen, dessen Namen man trägt – häufig mit einem kleinen Geschenk, Blumen oder einem gemeinsamen Essen.",
                "Dieses Verzeichnis orientiert sich am römisch-katholischen Heiligenkalender. Je nach Region und Bistum können einzelne Gedenktage abweichen; bei mehreren Heiligen gleichen Namens sind verschiedene Termine möglich.",
              ],
            },
          ]}
        />
        <Faq items={faq} />
      </PageWithSidebar>
    </div>
  );
}
