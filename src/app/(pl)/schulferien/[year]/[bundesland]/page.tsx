import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NAV_YEARS, parseYear } from "@/lib/de/year";
import { formatLongDE } from "@/lib/de/locale";
import { BUNDESLAENDER, stateBySlug, STATE_SLUGS } from "@/lib/de/bundeslaender";
import { getSchulferien, isSchulferienIndexable, FERIEN_TYP_LABEL } from "@/lib/de/schulferien";

export function generateStaticParams() {
  return NAV_YEARS.flatMap((y) => STATE_SLUGS.map((slug) => ({ year: String(y), bundesland: slug })));
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
    <main className="flex-1">
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        <nav className="mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span>
          <Link href={`/schulferien/${y}`} className="hover:text-navy-600">Schulferien {y}</Link> <span className="mx-1">/</span>
          <span className="text-navy-700">{state.name}</span>
        </nav>
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
      </div>
    </main>
  );
}
