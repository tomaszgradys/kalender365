import Link from "next/link";
import { formatLongDE, weekdayDE } from "@/lib/de/locale";
import { BUNDESLAENDER, type Bundesland } from "@/lib/de/bundeslaender";
import { getFerienByTyp, isSchulferienIndexable, FERIEN_TYP_LABEL, type FerienTyp } from "@/lib/de/schulferien";
import PageWithSidebar from "@/components/de/PageWithSidebar";

function inclusiveDays(startISO: string, endISO: string): number {
  const a = new Date(startISO + "T00:00:00Z").getTime();
  const b = new Date(endISO + "T00:00:00Z").getTime();
  return Math.round((b - a) / 86400000) + 1;
}

/** SEO page for one Ferien type in one Bundesland (e.g. Sommerferien Bayern). */
export default function FerienTypView({ year, state, typ }: { year: number; state: Bundesland; typ: FerienTyp }) {
  const label = FERIEN_TYP_LABEL[typ];
  const period = getFerienByTyp(year, state.code, typ);
  const verified = isSchulferienIndexable(year, state.code);

  const faq = period
    ? [
        {
          q: `Wann sind ${label} ${year} in ${state.name}?`,
          a: `Die ${label} ${year} in ${state.name} sind vom ${formatLongDE(period.start)} bis zum ${formatLongDE(period.end)}${period.start !== period.end ? ` (${inclusiveDays(period.start, period.end)} Tage inkl. Wochenenden)` : ""}.`,
        },
        { q: "Woher stammen die Ferientermine?", a: "Die Termine stammen aus den offiziellen Angaben der Länder (KMK / Kultusministerien). Angaben ohne Gewähr." },
      ]
    : [];
  const faqLd = period && {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <main className="flex-1">
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      <PageWithSidebar>
        <nav className="mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span>
          <Link href={`/schulferien/${year}`} className="hover:text-navy-600">Schulferien {year}</Link> <span className="mx-1">/</span>
          <Link href={`/schulferien/${year}/${state.slug}`} className="hover:text-navy-600">{state.name}</Link> <span className="mx-1">/</span>
          <span className="text-navy-700">{label}</span>
        </nav>
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">{label} {year} in {state.name}</h1>

        {period ? (
          <>
            {!verified && (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <strong>Vorläufige Angaben, ohne Gewähr.</strong> Termine werden noch gegen die offizielle Quelle geprüft.
              </div>
            )}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-lg text-navy-900">
                <strong>{formatLongDE(period.start)}</strong>
                {period.start !== period.end && <> bis <strong>{formatLongDE(period.end)}</strong></>}
              </p>
              {period.start !== period.end && (
                <p className="mt-1 text-sm text-slate-500">
                  {inclusiveDays(period.start, period.end)} Tage · {weekdayDE(period.start)} bis {weekdayDE(period.end)}
                </p>
              )}
              {period.note && <p className="mt-2 text-sm text-slate-500">{period.note}</p>}
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <a href={`/api/ics/schulferien/${year}/${state.slug}`} className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">📅 Alle Ferien als ICS</a>
              <Link href={`/schulferien/${year}/${state.slug}`} className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Alle Schulferien {state.name}</Link>
              <Link href={`/kalender/${year}/${state.slug}`} className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Kalender {state.name}</Link>
            </div>
          </>
        ) : (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
            <p>Für {state.name} sind {year} keine gesonderten {label} hinterlegt. Manche Bundesländer haben diese Ferien nicht oder legen dafür nur bewegliche Ferientage fest.</p>
            <Link href={`/schulferien/${year}/${state.slug}`} className="mt-3 inline-block font-medium text-navy-600 underline">Alle Schulferien {year} in {state.name} →</Link>
          </div>
        )}

        {faq.length > 0 && (
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
        )}

        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">{label} in anderen Bundesländern</h2>
          <div className="flex flex-wrap gap-2">
            {BUNDESLAENDER.filter((b) => b.code !== state.code).map((b) => (
              <Link key={b.code} href={`/${typDir(typ)}/${year}/${b.slug}`} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:border-navy-300 hover:text-navy-600">{b.name}</Link>
            ))}
          </div>
        </section>
      </PageWithSidebar>
    </main>
  );
}

// Map FerienTyp → URL segment.
export function typDir(typ: FerienTyp): string {
  return typ;
}
