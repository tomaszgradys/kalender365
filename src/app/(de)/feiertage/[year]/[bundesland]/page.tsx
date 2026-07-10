import PageWithSidebar from "@/components/de/PageWithSidebar";
import Breadcrumbs from "@/components/de/Breadcrumbs";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatLongDE, weekdayDE } from "@/lib/de/locale";
import { getFeiertage } from "@/lib/de/feiertage";
import { getBrueckentage } from "@/lib/de/brueckentage";
import { arbeitstageInYear } from "@/lib/de/arbeitstage";
import { BUNDESLAENDER, stateBySlug, STATE_SLUGS } from "@/lib/de/bundeslaender";
import SeoProse from "@/components/de/SeoProse";
import Faq from "@/components/de/Faq";
import ShareButtons from "@/components/de/ShareButtons";
import type { QA } from "@/lib/de/jsonLd";
import { PRERENDER_YEARS, parseYear, isIndexableYear } from "@/lib/de/year";
import { ogMeta } from "@/lib/de/ogMeta";

export function generateStaticParams() {
  return PRERENDER_YEARS.flatMap((y) => STATE_SLUGS.map((slug) => ({ year: String(y), bundesland: slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string; bundesland: string }> }): Promise<Metadata> {
  const { year, bundesland } = await params;
  const y = parseYear(year);
  const state = stateBySlug(bundesland);
  if (!y || !state) return {};
  return {
    title: `Feiertage ${y} ${state.name} – gesetzliche Feiertage & Brückentage`,
    description: `Alle gesetzlichen Feiertage ${y} in ${state.name} mit Datum, Wochentag, Brückentagen und Arbeitstagen. Kalender zum Ausdrucken.`,
    alternates: { canonical: `/feiertage/${y}/${state.slug}` },
    openGraph: ogMeta(`/feiertage/${y}/${state.slug}`),
    ...(isIndexableYear(y) ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function FeiertageStatePage({ params }: { params: Promise<{ year: string; bundesland: string }> }) {
  const { year, bundesland } = await params;
  const y = parseYear(year);
  const state = stateBySlug(bundesland);
  if (!y || !state) notFound();

  const holidays = getFeiertage(y, state.code, { includePartial: true, includeSundayLegal: false });
  const workFree = holidays.filter((h) => h.scope !== "partial");
  const partial = holidays.filter((h) => h.scope === "partial");
  const bridges = getBrueckentage(y, state.code).slice(0, 6);
  const arbeitstage = arbeitstageInYear(y, state.code);

  const isWeekend = (iso: string) => [0, 6].includes(new Date(iso + "T00:00:00Z").getUTCDay());
  const weekendCount = workFree.filter((h) => isWeekend(h.date)).length;
  const bestBridge = bridges[0];

  const faq: QA[] = [
    {
      q: `Wie viele gesetzliche Feiertage gibt es ${y} in ${state.name}?`,
      a: `In ${state.name} gibt es ${y} insgesamt ${workFree.length} gesetzliche Feiertage${partial.length ? ` (zzgl. ${partial.length} regional/teilweise geltende Tage)` : ""}.`,
    },
    {
      q: `Wie viele Arbeitstage hat ${y} in ${state.name}?`,
      a: `${y} hat in ${state.name} ${arbeitstage} Arbeitstage bei einer 5-Tage-Woche (Montag–Freitag ohne gesetzliche Feiertage des Landes).`,
    },
    {
      q: `Wie viele Feiertage fallen ${y} in ${state.name} auf ein Wochenende?`,
      a: weekendCount ? `${y} fallen ${weekendCount} der gesetzlichen Feiertage in ${state.name} auf ein Wochenende. In Deutschland gibt es dafür keinen gesetzlichen Ersatztag.` : `${y} fällt keiner der gesetzlichen Feiertage in ${state.name} auf ein Wochenende – ein gutes Jahr für lange Wochenenden.`,
    },
    ...(bestBridge
      ? [{
          q: `Welcher Brückentag lohnt sich ${y} in ${state.name} am meisten?`,
          a: `Besonders effizient: mit ${bestBridge.urlaubstage} Urlaubstag${bestBridge.urlaubstage > 1 ? "en" : ""} rund um den ${formatLongDE(bestBridge.von)} erhalten Sie ${bestBridge.freieTage} freie Tage am Stück.`,
        }]
      : []),
    {
      q: `Bekomme ich einen Ersatztag, wenn ein Feiertag auf ein Wochenende fällt?`,
      a: `Nein. In Deutschland gibt es keinen gesetzlichen Anspruch auf einen Ausgleichstag, wenn ein Feiertag auf einen Samstag oder Sonntag fällt. Ob ein Ausgleich gewährt wird, richtet sich nach Arbeits- oder Tarifvertrag.`,
    },
  ];

  return (
    <div className="flex-1">
      <PageWithSidebar>
        <Breadcrumbs
          items={[
            { name: "Start", url: "/" },
            { name: `Feiertage ${y}`, url: `/feiertage/${y}` },
            { name: state.name, url: `/feiertage/${y}/${state.slug}` },
          ]}
        />

        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Feiertage {y} in {state.name}</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          {state.name} hat {y} insgesamt <strong>{workFree.length} gesetzliche Feiertage</strong>. Bei einer 5-Tage-Woche
          ergeben sich <strong>{arbeitstage} Arbeitstage</strong>. Unten finden Sie alle Termine, Brückentage und Verweise.
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <a href={`/api/ics/feiertage/${y}/${state.slug}`} className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">📅 ICS-Kalender</a>
          <a href={`/api/csv/feiertage/${y}/${state.slug}`} className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">⬇ CSV</a>
          <Link href={`/kalender/${y}/${state.slug}`} className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">🖨 Kalender {state.name}</Link>
        </div>

        {/* HOLIDAYS */}
        <section className="mt-6">
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
                {workFree.map((h) => (
                  <tr key={h.slug} className="border-t border-slate-100">
                    <td className="px-4 py-2 font-medium text-navy-800">{h.name}</td>
                    <td className="px-4 py-2 text-slate-600 whitespace-nowrap">{formatLongDE(h.date)}</td>
                    <td className="px-4 py-2 text-slate-600">{weekdayDE(h.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {partial.length > 0 && (
            <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm">
              <h2 className="font-semibold text-amber-800">Regional / teilweise geltende Tage</h2>
              <ul className="mt-2 space-y-1 text-amber-900">
                {partial.map((h) => (
                  <li key={h.slug}>
                    <strong>{h.name}</strong> ({formatLongDE(h.date)}) — {h.note}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* BRÜCKENTAGE */}
        <section className="mt-8">
          <h2 className="mb-3 text-xl font-bold text-navy-800">Brückentage {y} in {state.name}</h2>
          <p className="mb-3 text-sm text-slate-500">Mit wenigen Urlaubstagen viele freie Tage — die besten Brückentage (Vorschläge, keine Rechtsberatung).</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {bridges.map((b, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-sm text-slate-500">{formatLongDE(b.von)} – {formatLongDE(b.bis)}</div>
                <div className="mt-1 text-lg font-black text-navy-800">
                  {b.urlaubstage} Urlaubstag{b.urlaubstage > 1 ? "e" : ""} → {b.freieTage} freie Tage
                </div>
                <div className="mt-1 text-xs text-brand-green-700">Urlaub nehmen: {b.urlaub.map((d) => formatLongDE(d)).join(", ")}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CROSS LINKS */}
        <section className="mt-8 flex flex-wrap gap-2 text-sm">
          <Link href={`/kalender/${y}`} className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Kalender {y}</Link>
          <Link href={`/schulferien/${y}/${state.slug}`} className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Schulferien {state.name}</Link>
          <Link href={`/brueckentage/${y}/${state.slug}`} className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Alle Brückentage {state.name}</Link>
          <Link href={`/feiertage/${y}`} className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Feiertage Deutschland</Link>
        </section>

        {/* OTHER STATES */}
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Anderes Bundesland</h2>
          <div className="flex flex-wrap gap-2">
            {BUNDESLAENDER.filter((b) => b.code !== state.code).map((b) => (
              <Link key={b.code} href={`/feiertage/${y}/${b.slug}`} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:border-navy-300 hover:text-navy-600">
                {b.name}
              </Link>
            ))}
          </div>
        </section>

        <SeoProse
          blocks={[
            {
              h2: `Gesetzliche Feiertage ${y} in ${state.name}`,
              p: [
                `${state.name} hat ${y} insgesamt ${workFree.length} gesetzliche Feiertage. Neun davon gelten bundesweit einheitlich: Neujahr, Karfreitag, Ostermontag, Tag der Arbeit, Christi Himmelfahrt, Pfingstmontag, Tag der Deutschen Einheit sowie der 1. und 2. Weihnachtsfeiertag. ${workFree.length > 9 ? `Hinzu kommen die in ${state.name} zusätzlich gesetzlich geregelten Feiertage – die vollständige Liste mit Datum und Wochentag finden Sie in der Tabelle oben.` : `Über diese neun bundesweiten Tage hinaus gibt es in ${state.name} keine weiteren gesetzlichen Feiertage.`}${partial.length ? ` Zusätzlich gelten ${partial.length} nur regional oder teilweise anerkannte Tage.` : ""}`,
                `An gesetzlichen Feiertagen ruht in ${state.name} grundsätzlich die Arbeit, und es gelten besondere Regeln etwa für Ladenöffnung und das Sonn- und Feiertagsgesetz. Bei einer 5-Tage-Woche ergeben sich ${y} in ${state.name} ${arbeitstage} Arbeitstage.`,
              ],
            },
            {
              h2: `Brückentage und lange Wochenenden ${y}`,
              p: [
                `Mit den passenden Brückentagen lässt sich aus wenigen Urlaubstagen viel Freizeit machen. ${bestBridge ? `Der ergiebigste Vorschlag für ${state.name}: rund um den ${formatLongDE(bestBridge.von)} verwandeln ${bestBridge.urlaubstage} Urlaubstag${bestBridge.urlaubstage > 1 ? "e" : ""} in ${bestBridge.freieTage} freie Tage.` : ""} Eine vollständige Übersicht bietet die Brückentage-Seite; alle Feiertage lassen sich zudem als ICS- oder CSV-Datei herunterladen und in Google Kalender, Outlook oder Apple Kalender importieren.`,
              ],
            },
          ]}
        />
        <Faq items={faq} />
        <ShareButtons title={`Feiertage ${y} in ${state.name}`} />
      </PageWithSidebar>
    </div>
  );
}
