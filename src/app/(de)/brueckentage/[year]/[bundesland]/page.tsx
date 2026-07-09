import PageWithSidebar from "@/components/de/PageWithSidebar";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRERENDER_YEARS, parseYear, yearRobots } from "@/lib/de/year";
import { formatLongDE } from "@/lib/de/locale";
import { getBrueckentage, getLangeWochenenden } from "@/lib/de/brueckentage";
import { BUNDESLAENDER, stateBySlug, STATE_SLUGS } from "@/lib/de/bundeslaender";
import SeoProse from "@/components/de/SeoProse";
import Faq from "@/components/de/Faq";

export function generateStaticParams() {
  return PRERENDER_YEARS.flatMap((y) => STATE_SLUGS.map((slug) => ({ year: String(y), bundesland: slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string; bundesland: string }> }): Promise<Metadata> {
  const { year, bundesland } = await params;
  const y = parseYear(year);
  const state = stateBySlug(bundesland);
  if (!y || !state) return {};
  return {
    title: `Brückentage ${y} ${state.name} – Urlaub clever planen`,
    description: `Die besten Brückentage ${y} in ${state.name}: mit wenigen Urlaubstagen lange Wochenenden. Alle Termine mit Feiertagen und Empfehlung nach Effizienz.`,
    alternates: { canonical: `/brueckentage/${y}/${state.slug}` },
    ...yearRobots(y),
  };
}

export default async function BrueckentageStatePage({ params }: { params: Promise<{ year: string; bundesland: string }> }) {
  const { year, bundesland } = await params;
  const y = parseYear(year);
  const state = stateBySlug(bundesland);
  if (!y || !state) notFound();

  const bridges = getBrueckentage(y, state.code);
  const langeWE = getLangeWochenenden(y, state.code);

  return (
    <main className="flex-1">
      <PageWithSidebar>
        <nav className="mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span>
          <Link href={`/brueckentage/${y}`} className="hover:text-navy-600">Brückentage {y}</Link> <span className="mx-1">/</span>
          <span className="text-navy-700">{state.name}</span>
        </nav>
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Brückentage {y} in {state.name}</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Sortiert nach Effizienz (freie Tage je Urlaubstag). Die Termine berücksichtigen die gesetzlichen
          Feiertage in {state.name}. Angaben sind Planungshilfen, keine Rechtsberatung.
        </p>

        <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {bridges.map((b, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-brand-green-50 px-2 py-0.5 text-xs font-bold text-brand-green-700">{b.freieTage} freie Tage</span>
                <span className="text-xs text-slate-400">{b.urlaubstage} Urlaubstag{b.urlaubstage > 1 ? "e" : ""}</span>
              </div>
              <div className="mt-2 text-sm font-semibold text-navy-800">{formatLongDE(b.von)} – {formatLongDE(b.bis)}</div>
              <div className="mt-1 text-xs text-slate-500">Urlaub nehmen: {b.urlaub.map((d) => formatLongDE(d)).join(", ")}</div>
            </div>
          ))}
          {bridges.length === 0 && <p className="text-sm text-slate-500">Für {y} wurden keine klassischen Brückentage gefunden.</p>}
        </section>

        <section className="mt-8">
          <h2 className="mb-3 text-xl font-bold text-navy-800">Lange Wochenenden {y} (ohne Urlaub)</h2>
          <div className="flex flex-wrap gap-2">
            {langeWE.map((w, i) => (
              <span key={i} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700">
                {formatLongDE(w.start)} – {formatLongDE(w.end)} <span className="text-slate-400">({w.length} Tage)</span>
              </span>
            ))}
          </div>
        </section>

        <section className="mt-8 flex flex-wrap gap-2 text-sm">
          <Link href={`/feiertage/${y}/${state.slug}`} className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Feiertage {state.name}</Link>
          <Link href={`/urlaubsplaner/${y}`} className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Urlaubsplaner {y}</Link>
          <Link href={`/arbeitstage/${y}/${state.slug}`} className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Arbeitstage {state.name}</Link>
        </section>

        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Anderes Bundesland</h2>
          <div className="flex flex-wrap gap-2">
            {BUNDESLAENDER.filter((b) => b.code !== state.code).map((b) => (
              <Link key={b.code} href={`/brueckentage/${y}/${b.slug}`} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:border-navy-300 hover:text-navy-600">{b.name}</Link>
            ))}
          </div>
        </section>

        <SeoProse
          blocks={[
            {
              h2: `Brückentage ${y} in ${state.name} optimal nutzen`,
              p: [
                `Brückentage sind einzelne Arbeitstage zwischen einem Feiertag und dem Wochenende. Weil die Feiertage in ${state.name} vom Landesrecht abhängen, sind auch die besten Brückentage ${y} landesspezifisch. ${bridges[0] ? `Der effizienteste Vorschlag: mit ${bridges[0].urlaubstage} Urlaubstag${bridges[0].urlaubstage > 1 ? "en" : ""} rund um den ${formatLongDE(bridges[0].von)} erhalten Sie ${bridges[0].freieTage} freie Tage am Stück.` : ""} Die Liste oben ist nach Effizienz sortiert – also nach freien Tagen je eingesetztem Urlaubstag.`,
                `Am meisten bringen Feiertage, die auf einen Dienstag oder Donnerstag fallen: Hier genügt ein einziger Brückentag für ein verlängertes Wochenende. Rund um Ostern, Christi Himmelfahrt und Pfingsten lassen sich mit wenigen Urlaubstagen sogar besonders lange Blöcke planen.`,
              ],
            },
            {
              h2: `Lange Wochenenden ${y} ganz ohne Urlaub`,
              p: [
                `Manche Feiertage ${y} in ${state.name} fallen so, dass bereits ohne Urlaubstag ein langes Wochenende entsteht – etwa wenn ein Feiertag auf einen Freitag oder Montag fällt. Diese Termine finden Sie oben unter „Lange Wochenenden“. Für die genaue Urlaubsverteilung über das ganze Jahr hilft zusätzlich der Urlaubsplaner ${y}.`,
              ],
            },
          ]}
        />
        <Faq
          items={[
            ...(bridges[0] ? [{ q: `Welcher Brückentag lohnt sich ${y} in ${state.name} am meisten?`, a: `Am effizientesten ist der Zeitraum um den ${formatLongDE(bridges[0].von)}: ${bridges[0].urlaubstage} Urlaubstag${bridges[0].urlaubstage > 1 ? "e" : ""} ergeben ${bridges[0].freieTage} freie Tage.` }] : []),
            { q: `Warum sind die Brückentage in ${state.name} anders als in anderen Ländern?`, a: `Weil regionale Feiertage wie Fronleichnam, Allerheiligen oder der Reformationstag nur in bestimmten Bundesländern gelten. Dadurch entstehen in ${state.name} eigene Brückentag-Möglichkeiten.` },
            { q: "Habe ich Anspruch auf freie Brückentage?", a: "Nein, ein Brückentag ist ein regulärer Arbeitstag und muss als Urlaub beantragt werden. Manche Betriebe schließen an Brückentagen aber freiwillig." },
          ]}
        />
      </PageWithSidebar>
    </main>
  );
}
