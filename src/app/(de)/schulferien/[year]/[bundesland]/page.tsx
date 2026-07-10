import PageWithSidebar from "@/components/de/PageWithSidebar";
import Breadcrumbs from "@/components/de/Breadcrumbs";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRERENDER_YEARS, parseYear } from "@/lib/de/year";
import { formatLongDE } from "@/lib/de/locale";
import { BUNDESLAENDER, stateBySlug, STATE_SLUGS } from "@/lib/de/bundeslaender";
import { getSchulferien, isSchulferienIndexable, FERIEN_TYP_LABEL } from "@/lib/de/schulferien";
import SeoProse from "@/components/de/SeoProse";
import Faq from "@/components/de/Faq";

function inclDays(startISO: string, endISO: string): number {
  return Math.round((Date.parse(endISO + "T00:00:00Z") - Date.parse(startISO + "T00:00:00Z")) / 86400000) + 1;
}

export function generateStaticParams() {
  return PRERENDER_YEARS.flatMap((y) => STATE_SLUGS.map((slug) => ({ year: String(y), bundesland: slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string; bundesland: string }> }): Promise<Metadata> {
  const { year, bundesland } = await params;
  const y = parseYear(year);
  const state = stateBySlug(bundesland);
  if (!y || !state) return {};
  const indexable = isSchulferienIndexable(y, state.code);
  return {
    title: `Schulferien ${y} ${state.name} – Ferienkalender`,
    description: `Alle Schulferien ${y} in ${state.name}: Winter-, Oster-, Pfingst-, Sommer-, Herbst- und Weihnachtsferien mit genauen Terminen.`,
    alternates: { canonical: `/schulferien/${y}/${state.slug}` },
    ...(indexable ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function SchulferienStatePage({ params }: { params: Promise<{ year: string; bundesland: string }> }) {
  const { year, bundesland } = await params;
  const y = parseYear(year);
  const state = stateBySlug(bundesland);
  if (!y || !state) notFound();

  const record = getSchulferien(y, state.code);
  const verified = isSchulferienIndexable(y, state.code);

  return (
    <div className="flex-1">
      <PageWithSidebar>
        <Breadcrumbs
          items={[
            { name: "Start", url: "/" },
            { name: `Schulferien ${y}`, url: `/schulferien/${y}` },
            { name: state.name, url: `/schulferien/${y}/${state.slug}` },
          ]}
        />
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Schulferien {y} in {state.name}</h1>

        {!record && (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
            <p>Die Ferientermine für {state.name} {y} werden derzeit anhand offizieller Quellen (KMK, Kultusministerium)
            geprüft und in Kürze ergänzt.</p>
            <Link href={`/feiertage/${y}/${state.slug}`} className="mt-3 inline-block font-medium text-navy-600 underline">
              Bis dahin: Feiertage {state.name} {y} →
            </Link>
          </div>
        )}

        {record && (
          <>
            {!verified && (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <strong>Vorläufige Angaben, ohne Gewähr.</strong> Diese Termine werden noch gegen die offizielle
                Quelle ({record.meta.source}) geprüft.
              </div>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <a href={`/api/ics/schulferien/${y}/${state.slug}`} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">📅 Ferien als ICS-Kalender</a>
              {(["sommerferien", "osterferien", "herbstferien", "weihnachtsferien"] as const).map((t) => (
                <Link key={t} href={`/${t}/${y}/${state.slug}`} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-navy-700 hover:border-navy-300">{FERIEN_TYP_LABEL[t]}</Link>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {record.periods.map((p) => (
                <div key={p.typ} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <h2 className="text-sm font-bold text-navy-700">{FERIEN_TYP_LABEL[p.typ]}</h2>
                  <p className="mt-1 text-navy-900">{formatLongDE(p.start)} – {formatLongDE(p.end)}</p>
                  {p.note && <p className="mt-1 text-xs text-slate-500">{p.note}</p>}
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-400">
              Quelle: {record.meta.source}
              {record.meta.sourceUrl && (
                <> · <a href={record.meta.sourceUrl} rel="nofollow noopener" target="_blank" className="underline">offizielle Ferientermine</a></>
              )}
              {" "}· Schuljahr {record.meta.validForSchoolYear}
            </p>

            {(() => {
              const sommer = record.periods.find((p) => p.typ === "sommerferien");
              const totalDays = record.periods.reduce((n, p) => n + inclDays(p.start, p.end), 0);
              return (
                <>
                  <SeoProse
                    blocks={[
                      {
                        h2: `Schulferien ${y} in ${state.name} im Überblick`,
                        p: [
                          `Für das Bundesland ${state.name} sind ${y} ${record.periods.length} Ferienabschnitte hinterlegt – zusammen rund ${totalDays} Ferientage (inklusive der dazwischenliegenden Wochenenden). ${sommer ? `Der längste und wichtigste Abschnitt sind die Sommerferien vom ${formatLongDE(sommer.start)} bis ${formatLongDE(sommer.end)}.` : ""} Die Termine werden vom zuständigen Kultusministerium festgelegt und über die KMK mit den anderen Ländern abgestimmt.`,
                          `Die Übersicht oben zeigt alle Ferien mit Start- und Enddatum. Für einzelne Ferienarten gibt es zusätzlich eigene Detailseiten, und alle Termine lassen sich als ICS-Datei in Ihren Kalender übernehmen.`,
                        ],
                      },
                      {
                        h2: `Ferien und Urlaub in ${state.name} planen`,
                        p: [
                          `Wer den Familienurlaub um die Schulferien herum plant, sollte auch die gesetzlichen Feiertage und Brückentage in ${state.name} im Blick behalten – so lassen sich einzelne Urlaubstage optimal mit Ferien und freien Tagen kombinieren. Beachten Sie außerdem, dass einige Schulen zusätzliche bewegliche Ferientage vergeben, die hier nicht enthalten sind.`,
                        ],
                      },
                    ]}
                  />
                  <Faq
                    items={[
                      ...(sommer ? [{ q: `Wann sind die Sommerferien ${y} in ${state.name}?`, a: `Die Sommerferien ${y} in ${state.name} dauern vom ${formatLongDE(sommer.start)} bis ${formatLongDE(sommer.end)} (${inclDays(sommer.start, sommer.end)} Tage inkl. Wochenenden).` }] : []),
                      { q: `Wie viele Ferienabschnitte gibt es ${y} in ${state.name}?`, a: `${y} sind in ${state.name} ${record.periods.length} Ferienabschnitte hinterlegt: ${record.periods.map((p) => FERIEN_TYP_LABEL[p.typ]).join(", ")}.` },
                      { q: "Sind die Termine offiziell?", a: `Die Termine stammen aus offiziellen Angaben (${record.meta.source}) und gelten für das Schuljahr ${record.meta.validForSchoolYear}. Angaben ohne Gewähr; bewegliche Ferientage einzelner Schulen sind nicht enthalten.` },
                      { q: `Kann ich die Schulferien ${state.name} in meinen Kalender importieren?`, a: `Ja. Über den Button „Ferien als ICS-Kalender“ laden Sie alle Termine herunter und importieren sie in Google Kalender, Outlook oder Apple Kalender.` },
                    ]}
                  />
                </>
              );
            })()}
          </>
        )}

        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Anderes Bundesland</h2>
          <div className="flex flex-wrap gap-2">
            {BUNDESLAENDER.filter((b) => b.code !== state.code).map((b) => (
              <Link key={b.code} href={`/schulferien/${y}/${b.slug}`} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:border-navy-300 hover:text-navy-600">{b.name}</Link>
            ))}
          </div>
        </section>
      </PageWithSidebar>
    </div>
  );
}
