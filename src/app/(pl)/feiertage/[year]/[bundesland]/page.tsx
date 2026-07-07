import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatLongDE, weekdayDE } from "@/lib/de/locale";
import { getFeiertage } from "@/lib/de/feiertage";
import { getBrueckentage } from "@/lib/de/brueckentage";
import { arbeitstageInYear } from "@/lib/de/arbeitstage";
import { BUNDESLAENDER, stateBySlug, STATE_SLUGS } from "@/lib/de/bundeslaender";

const NAV_MIN = 2015;
const NAV_MAX = 2035;

export function generateStaticParams() {
  const years = Array.from({ length: NAV_MAX - NAV_MIN + 1 }, (_, i) => NAV_MIN + i);
  return years.flatMap((y) => STATE_SLUGS.map((slug) => ({ year: String(y), bundesland: slug })));
}
function parseYear(raw: string): number | null {
  if (!/^\d{4}$/.test(raw)) return null;
  const y = Number(raw);
  return y >= 1900 && y <= 2100 ? y : null;
}
const isNavigable = (y: number) => y >= NAV_MIN && y <= NAV_MAX;

export async function generateMetadata({ params }: { params: Promise<{ year: string; bundesland: string }> }): Promise<Metadata> {
  const { year, bundesland } = await params;
  const y = parseYear(year);
  const state = stateBySlug(bundesland);
  if (!y || !state) return {};
  return {
    title: `Feiertage ${y} ${state.name} – gesetzliche Feiertage & Brückentage`,
    description: `Alle gesetzlichen Feiertage ${y} in ${state.name} mit Datum, Wochentag, Brückentagen und Arbeitstagen. Kalender zum Ausdrucken.`,
    alternates: { canonical: `/feiertage/${y}/${state.slug}` },
    ...(isNavigable(y) ? {} : { robots: { index: false, follow: true } }),
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

  const faq = [
    {
      q: `Wie viele gesetzliche Feiertage gibt es ${y} in ${state.name}?`,
      a: `In ${state.name} gibt es ${y} insgesamt ${workFree.length} gesetzliche Feiertage${partial.length ? ` (zzgl. ${partial.length} regional/teilweise geltende Tage)` : ""}.`,
    },
    {
      q: `Wie viele Arbeitstage hat ${y} in ${state.name}?`,
      a: `${y} hat in ${state.name} ${arbeitstage} Arbeitstage bei einer 5-Tage-Woche (Montag–Freitag ohne gesetzliche Feiertage des Landes).`,
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
          <Link href={`/feiertage/${y}`} className="hover:text-navy-600">Feiertage {y}</Link> <span className="mx-1">/</span>
          <span className="text-navy-700">{state.name}</span>
        </nav>

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
