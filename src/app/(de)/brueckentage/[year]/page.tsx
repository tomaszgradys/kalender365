import PageWithSidebar from "@/components/de/PageWithSidebar";
import Breadcrumbs from "@/components/de/Breadcrumbs";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRERENDER_YEARS, parseYear, yearRobots } from "@/lib/de/year";
import { BUNDESLAENDER } from "@/lib/de/bundeslaender";
import BundeslandSelect from "@/components/de/BundeslandSelect";
import SeoProse from "@/components/de/SeoProse";
import Faq from "@/components/de/Faq";
import ShareButtons from "@/components/de/ShareButtons";
import { ogMeta } from "@/lib/de/ogMeta";
import { getBrueckentageBundesweit, getLangeWochenendenBundesweit, feiertageAmWochenende } from "@/lib/de/brueckentageBundesweit";
import { formatLongDE, weekdayDE } from "@/lib/de/locale";
import { stateByCode, type StateCode } from "@/lib/de/bundeslaender";

export function generateStaticParams() {
  return PRERENDER_YEARS.map((y) => ({ year: String(y) }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) return {};
  return {
    title: `Brückentage ${y} – Urlaub clever planen`,
    description: `Die besten Brückentage ${y} in Deutschland als Tabelle: Urlaubstage, freie Tage und Zeitraum – bundesweit und je Bundesland, plus lange Wochenenden ohne Urlaub und Feiertage am Wochenende.`,
    alternates: { canonical: `/brueckentage/${y}` },
    openGraph: ogMeta(`/brueckentage/${y}`),
    ...yearRobots(y),
  };
}

export default async function BrueckentageHubPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) notFound();

  const alle = getBrueckentageBundesweit(y);
  const bundesweit = alle.filter((b) => b.bundesweit);
  const regional = alle.filter((b) => !b.bundesweit).slice(0, 8);
  const langeWE = getLangeWochenendenBundesweit(y).filter((w) => w.bundesweit);
  const amWE = feiertageAmWochenende(y);
  const laender = (codes: StateCode[]) => codes.map((c) => stateByCode(c).abbr ?? stateByCode(c).name).join(", ");
  const best = bundesweit[0];

  return (
    <div className="flex-1">
      <PageWithSidebar>
        <Breadcrumbs
          items={[
            { name: "Start", url: "/" },
            { name: `Brückentage ${y}`, url: `/brueckentage/${y}` },
          ]}
        />
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Brückentage {y}</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Brückentage sind Arbeitstage zwischen einem Feiertag und dem Wochenende. Wer sie als Urlaub nimmt,
          verwandelt wenige Urlaubstage in lange freie Blöcke. Da Feiertage je nach Bundesland verschieden sind,
          wählen Sie zuerst Ihr Bundesland.
        </p>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-navy-50/40 p-4">
          <BundeslandSelect basePath={`/brueckentage/${y}`} />
        </div>

        <section className="mt-8">
          <h2 className="mb-1 text-xl font-bold text-navy-800">Die besten Brückentage {y} – bundesweit</h2>
          <p className="mb-3 text-sm text-slate-600">
            Diese Kombinationen gelten in allen 16 Bundesländern (bundesweite Feiertage), sortiert nach Effizienz: freie Tage je Urlaubstag.
            {best && ` Bester Deal: ${best.urlaubstage} Urlaubstag${best.urlaubstage > 1 ? "e" : ""} → ${best.freieTage} freie Tage am Stück (${formatLongDE(best.von)} bis ${formatLongDE(best.bis)}).`}
          </p>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr><th className="px-3 py-2">Freier Zeitraum</th><th className="px-3 py-2">Urlaub nehmen</th><th className="px-3 py-2 text-right">Urlaubstage</th><th className="px-3 py-2 text-right">Freie Tage</th></tr>
              </thead>
              <tbody>
                {bundesweit.map((b) => (
                  <tr key={b.von + b.urlaub.join()} className="border-t border-slate-100">
                    <td className="px-3 py-2 font-medium text-navy-800">{weekdayDE(b.von)}, {formatLongDE(b.von)} – {weekdayDE(b.bis)}, {formatLongDE(b.bis)}</td>
                    <td className="px-3 py-2 text-slate-600">{b.urlaub.map((d) => formatLongDE(d)).join(", ")}</td>
                    <td className="px-3 py-2 text-right">{b.urlaubstage}</td>
                    <td className="px-3 py-2 text-right font-bold text-brand-green-700">{b.freieTage}</td>
                  </tr>
                ))}
                {bundesweit.length === 0 && <tr><td className="px-3 py-3 text-slate-500" colSpan={4}>Für {y} gibt es keine bundesweit identischen Brückentage – siehe die Länderübersichten.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        {regional.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-1 text-xl font-bold text-navy-800">Regionale Brückentage {y}</h2>
            <p className="mb-3 text-sm text-slate-600">Zusätzliche Brücken durch regionale Feiertage (z. B. Fronleichnam, Reformationstag, Allerheiligen) – nur in den genannten Ländern.</p>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr><th className="px-3 py-2">Freier Zeitraum</th><th className="px-3 py-2">Urlaub nehmen</th><th className="px-3 py-2 text-right">Urlaubstage</th><th className="px-3 py-2 text-right">Freie Tage</th><th className="px-3 py-2">Gilt in</th></tr>
                </thead>
                <tbody>
                  {regional.map((b) => (
                    <tr key={b.von + b.urlaub.join()} className="border-t border-slate-100">
                      <td className="px-3 py-2 font-medium text-navy-800">{formatLongDE(b.von)} – {formatLongDE(b.bis)}</td>
                      <td className="px-3 py-2 text-slate-600">{b.urlaub.map((d) => formatLongDE(d)).join(", ")}</td>
                      <td className="px-3 py-2 text-right">{b.urlaubstage}</td>
                      <td className="px-3 py-2 text-right font-bold text-brand-green-700">{b.freieTage}</td>
                      <td className="px-3 py-2 text-xs text-slate-600">{laender(b.states)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="mb-2 text-xl font-bold text-navy-800">Lange Wochenenden {y} ohne Urlaub</h2>
            <ul className="space-y-1.5 text-sm text-slate-700">
              {langeWE.map((w) => (
                <li key={w.start} className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <span className="font-semibold text-navy-800">{w.length} Tage:</span> {weekdayDE(w.start)}, {formatLongDE(w.start)} – {weekdayDE(w.end)}, {formatLongDE(w.end)}
                </li>
              ))}
              {langeWE.length === 0 && <li className="text-slate-500">Keine bundesweit einheitlichen langen Wochenenden {y}.</li>}
            </ul>
          </div>
          <div>
            <h2 className="mb-2 text-xl font-bold text-navy-800">Feiertage am Wochenende {y}</h2>
            <p className="mb-2 text-sm text-slate-600">{amWE.length} der 9 bundesweiten Feiertage {amWE.length === 1 ? "fällt" : "fallen"} {y} auf ein Wochenende – in Deutschland gibt es dafür keinen Ersatztag.</p>
            <ul className="space-y-1.5 text-sm text-slate-700">
              {amWE.map((h) => (
                <li key={h.date} className="rounded-xl border border-slate-200 bg-white px-3 py-2"><span className="font-semibold text-navy-800">{h.name}</span> – {weekdayDE(h.date)}, {formatLongDE(h.date)}</li>
              ))}
              {amWE.length === 0 && <li className="text-slate-500">{y} fällt kein bundesweiter Feiertag auf ein Wochenende.</li>}
            </ul>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-3 text-xl font-bold text-navy-800">Brückentage {y} nach Bundesland</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {BUNDESLAENDER.map((b) => (
              <Link key={b.code} href={`/brueckentage/${y}/${b.slug}`} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-navy-700 hover:border-navy-300 hover:shadow-sm">
                {b.name}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 flex flex-wrap gap-2 text-sm">
          <Link href={`/feiertage/${y}`} className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Feiertage {y}</Link>
          <Link href={`/urlaubsplaner/${y}`} className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Urlaubsplaner {y}</Link>
          <Link href={`/kalender/${y}`} className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Kalender {y}</Link>
        </section>

        <SeoProse
          blocks={[
            {
              h2: `Was sind Brückentage?`,
              p: [
                `Als Brückentag bezeichnet man einen Arbeitstag, der zwischen einem gesetzlichen Feiertag und dem Wochenende liegt – etwa den Freitag nach Christi Himmelfahrt (das ist immer ein Donnerstag). Nimmt man diesen einen Tag Urlaub, entsteht ein langes Wochenende von vier zusammenhängenden freien Tagen. Brückentage sind damit der effizienteste Weg, aus wenig Urlaub viel Freizeit zu machen.`,
                `Weil die Feiertage in Deutschland Ländersache sind, unterscheiden sich auch die besten Brückentage ${y} je nach Bundesland. Fronleichnam, Allerheiligen oder der Reformationstag gelten nur in bestimmten Ländern – wählen Sie deshalb oben Ihr Bundesland für die passende Übersicht.`,
              ],
            },
            {
              h2: `Brückentage ${y} clever nutzen`,
              p: [
                `Besonders ergiebig sind Feiertage, die auf einen Dienstag oder Donnerstag fallen: Mit einem einzigen Brückentag (Montag bzw. Freitag) verbinden Sie Feiertag und Wochenende zu vier freien Tagen. Rund um Ostern, Christi Himmelfahrt und Pfingsten lassen sich mit wenigen Urlaubstagen sogar Blöcke von neun oder mehr Tagen planen.`,
                `Nutzen Sie zusätzlich den Urlaubsplaner ${y}, um Ihre verfügbaren Urlaubstage optimal über das Jahr zu verteilen, und behalten Sie die Feiertage Ihres Bundeslandes im Blick.`,
              ],
            },
          ]}
        />
        <Faq
          items={[
            { q: "Was ist ein Brückentag?", a: "Ein Brückentag ist ein einzelner Arbeitstag zwischen einem Feiertag und dem Wochenende. Nimmt man ihn als Urlaub, entsteht ein langes freies Wochenende." },
            { q: `Warum sind die Brückentage ${y} je nach Bundesland verschieden?`, a: "Weil die gesetzlichen Feiertage in Deutschland von den Bundesländern festgelegt werden. Regionale Feiertage wie Fronleichnam oder der Reformationstag gelten nur in bestimmten Ländern und ergeben dort zusätzliche Brückentage." },
            { q: "Habe ich Anspruch auf freie Brückentage?", a: "Nein, ein Brückentag ist ein normaler Arbeitstag. Sie müssen ihn als regulären Urlaubstag beantragen – manche Betriebe schließen an Brückentagen aber freiwillig." },
            { q: `Wie plane ich meinen Urlaub ${y} am besten?`, a: `Legen Sie Urlaubstage gezielt auf Brückentage rund um Feiertage, die auf Dienstag oder Donnerstag fallen. Der Urlaubsplaner ${y} berechnet die effizientesten Kombinationen automatisch.` },
          ]}
        />
        <ShareButtons title={`Brückentage ${y} in Deutschland`} />
      </PageWithSidebar>
    </div>
  );
}
