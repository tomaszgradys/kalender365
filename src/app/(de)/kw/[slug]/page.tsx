import PageWithSidebar from "@/components/de/PageWithSidebar";
import Breadcrumbs from "@/components/de/Breadcrumbs";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isNavigableYear, isIndexableYear } from "@/lib/de/year";
import { getISOWeekRange, isoWeeksInYear, isValidWeek } from "@/lib/de/weeks";
import { MONTH_NAMES_DE, MONTH_SLUGS_DE, WEEKDAY_NAMES_DE, formatLongDE, formatShortDE } from "@/lib/de/locale";
import { stateByCode } from "@/lib/de/bundeslaender";
import { ferienInRange, ferienNachTyp, regionaleFeiertageInRange, mondphasenInRange, sonneInWoche } from "@/lib/de/kwInfo";
import { getNationalFeiertage } from "@/lib/de/feiertage";
import { berlinISOWeek } from "@/lib/de/now";
import SeoProse from "@/components/de/SeoProse";
import Faq from "@/components/de/Faq";
import { ogMeta } from "@/lib/de/ogMeta";

// Prerender the current and next year's weeks; older/future weeks via ISR.
export function generateStaticParams() {
  const nowY = new Date().getUTCFullYear();
  const params: { slug: string }[] = [];
  for (const y of [nowY, nowY + 1]) {
    for (let w = 1; w <= isoWeeksInYear(y); w++) params.push({ slug: `${w}-${y}` });
  }
  return params;
}

function parseSlug(slug: string): { week: number; year: number } | null {
  const m = /^(\d{1,2})-(\d{4})$/.exec(slug);
  if (!m) return null;
  const week = Number(m[1]);
  const year = Number(m[2]);
  if (year < 1900 || year > 2100 || !isValidWeek(year, week)) return null;
  return { week, year };
}

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = parseSlug(slug);
  if (!p) return {};
  const r = getISOWeekRange(p.year, p.week);
  return {
    title: `KW ${p.week} ${p.year} – Datum, Wochentage & Kalenderwoche`,
    description: `Kalenderwoche ${p.week} ${p.year}: von Montag, ${formatShortDE(iso(r.start))} bis Sonntag, ${formatShortDE(iso(r.end))}. Alle Wochentage mit Datum, Feiertagen und Kalenderblatt â€“ KW ${p.week} nach ISO 8601.`,
    alternates: { canonical: `/kw/${p.week}-${p.year}` },
    openGraph: ogMeta(`/kw/${p.week}-${p.year}`),
    ...(isIndexableYear(p.year) ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function KwPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = parseSlug(slug);
  if (!p) notFound();
  const { year, week } = p;
  const r = getISOWeekRange(year, week);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(r.start);
    d.setUTCDate(r.start.getUTCDate() + i);
    return d;
  });
  const startMonth = MONTH_NAMES_DE[r.start.getUTCMonth()];
  const endMonth = MONTH_NAMES_DE[r.end.getUTCMonth()];
  const spanText = startMonth === endMonth ? `${startMonth} ${r.end.getUTCFullYear()}` : `${startMonth}/${endMonth}`;

  const holidaysThisWeek = getNationalFeiertage(year)
    .concat(getNationalFeiertage(r.end.getUTCFullYear()))
    .filter((h, i, arr) => arr.findIndex((x) => x.date === h.date) === i)
    .filter((h) => h.date >= iso(r.start) && h.date <= iso(r.end));

  // Zusatzfakten der Woche (Ferien je Land, regionale Feiertage, Mond, Sonne).
  const wStart = iso(r.start);
  const wEnd = iso(r.end);
  const regional = regionaleFeiertageInRange(wStart, wEnd);
  const ferien = ferienInRange(wStart, wEnd);
  const ferienGruppen = ferienNachTyp(ferien);
  const mond = mondphasenInRange(wStart, wEnd);
  const sonne = sonneInWoche(wStart, wEnd);
  const landKurz = (codes: string[]) => codes.map((c) => stateByCode(c as never).abbr ?? stateByCode(c as never).name).join(", ");
  const ferienLaender = (list: typeof ferien) => list.map((f) => `${f.abbr ?? f.name} (bis ${formatShortDE(f.end)})`).join(", ");
  const monatSlug = `${MONTH_SLUGS_DE[r.start.getUTCMonth()]}-${r.start.getUTCFullYear()}`;
  const vollmond = mond.find((m) => m.type === "full");

  const cur = berlinISOWeek();
  const isCurrent = cur.isoYear === year && cur.week === week;
  const totalWeeks = isoWeeksInYear(year);
  const prev = week > 1 ? { w: week - 1, y: year } : { w: isoWeeksInYear(year - 1), y: year - 1 };
  const next = week < totalWeeks ? { w: week + 1, y: year } : { w: 1, y: year + 1 };

  return (
    <div className="flex-1">
      <PageWithSidebar>
        <Breadcrumbs
          items={[
            { name: "Start", url: "/" },
            { name: `Kalenderwochen ${year}`, url: `/kalenderwochen/${year}` },
            { name: `KW ${week}`, url: `/kw/${week}-${year}` },
          ]}
        />

        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">KW {week} {year}{isCurrent && <span className="ml-2 rounded-full bg-brand-green-600 px-2 py-0.5 align-middle text-xs font-bold text-white">aktuelle Woche</span>}</h1>
          {/* Vor-/Zurück nur innerhalb des indexierbaren Fensters verlinken —
              sonst leiten wir Crawler in noindex-Randwochen (Crawl-Budget). */}
          <div className="flex gap-2 text-sm">
            {isNavigableYear(prev.y) && (
              <Link href={`/kw/${prev.w}-${prev.y}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">← KW {prev.w}</Link>
            )}
            {isNavigableYear(next.y) && (
              <Link href={`/kw/${next.w}-${next.y}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">KW {next.w} →</Link>
            )}
          </div>
        </div>
        <p className="mt-2 text-slate-600">
          Die Kalenderwoche {week} ({spanText}) geht von <strong>{formatLongDE(iso(r.start))}</strong> bis <strong>{formatLongDE(iso(r.end))}</strong> (ISO 8601, Montag bis Sonntag).
        </p>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <tbody>
              {days.map((d, i) => {
                const isoD = iso(d);
                const holiday = holidaysThisWeek.find((h) => h.date === isoD);
                const weekend = i >= 5;
                return (
                  <tr key={i} className={`border-t border-slate-100 first:border-t-0 ${weekend ? "bg-slate-50/60" : ""}`}>
                    <td className="px-4 py-2 font-medium text-navy-800">{WEEKDAY_NAMES_DE[i]}</td>
                    <td className="px-4 py-2 text-slate-600">{formatShortDE(isoD)}</td>
                    <td className="px-4 py-2 text-right">
                      {holiday && <span className="rounded-full bg-brand-green-50 px-2 py-0.5 text-xs font-semibold text-brand-green-700">{holiday.name}</span>}
                      {regional.filter((h) => h.date === isoD).map((h) => (
                        <span key={h.slug + h.scope} className="ml-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800" title={h.note ?? undefined}>
                          {h.name} · {landKurz(h.states)}{h.scope === "partial" ? " (teilweise)" : ""}
                        </span>
                      ))}
                      {mond.filter((m) => m.date === isoD).map((m) => (
                        <span key={m.date + m.type} className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">{m.icon} {m.label} {m.time} Uhr</span>
                      ))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-slate-500">
          <Link href={`/kalenderwochen/${year}`} className="font-medium text-navy-600 underline">Alle Kalenderwochen {year} →</Link>
          {" · "}
          <Link href={`/kalender/${monatSlug}`} className="font-medium text-navy-600 underline">Monatskalender {startMonth} {r.start.getUTCFullYear()} →</Link>
        </p>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="mb-2 text-xl font-bold text-navy-800">Schulferien in der KW {week}</h2>
            {ferienGruppen.length === 0 ? (
              <p className="text-sm text-slate-600">In der KW {week} {year} hat kein Bundesland Schulferien.</p>
            ) : (
              <ul className="space-y-1.5 text-sm text-slate-700">
                {ferienGruppen.map((g) => (
                  <li key={g.typ} className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                    <span className="font-semibold text-navy-800">{g.label}:</span> {ferienLaender(g.laender)}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-2 text-xs text-slate-500">Quelle: Ferienregelungen der Länder (KMK). <Link href={`/schulferien/${r.start.getUTCFullYear()}`} className="underline">Alle Schulferien {r.start.getUTCFullYear()}</Link></p>
          </div>
          <div>
            <h2 className="mb-2 text-xl font-bold text-navy-800">Mond &amp; Sonne in der KW {week}</h2>
            <ul className="space-y-1.5 text-sm text-slate-700">
              {mond.map((m) => (
                <li key={m.date + m.type} className="rounded-xl border border-slate-200 bg-white px-3 py-2">{m.icon} <span className="font-semibold text-navy-800">{m.label}</span> am {formatLongDE(m.date)} um {m.time} Uhr (MEZ/MESZ){m.zodiacSign ? `, Mond im ${m.zodiacSign}` : ""}</li>
              ))}
              {mond.length === 0 && <li className="text-slate-600">Keine Hauptmondphase (Neumond, Viertel, Vollmond) in dieser Woche.</li>}
              <li className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                ☀️ Sonne in {sonne.ort}: Montag {sonne.montag.sunrise ?? "–"}–{sonne.montag.sunset ?? "–"} Uhr ({sonne.montag.dayLengthText}), Sonntag {sonne.sonntag.sunrise ?? "–"}–{sonne.sonntag.sunset ?? "–"} Uhr ({sonne.sonntag.dayLengthText}); Tageslänge {sonne.deltaMinuten >= 0 ? "+" : "−"}{Math.abs(sonne.deltaMinuten)} Min. im Wochenverlauf.
              </li>
            </ul>
            <p className="mt-2 text-xs text-slate-500">Sonnenzeiten gelten für {sonne.ort}; andere Orte: <Link href="/sonnenaufgang-sonnenuntergang" className="underline">Sonnenaufgang &amp; Sonnenuntergang</Link>.</p>
          </div>
        </section>

        <SeoProse
          blocks={[
            {
              h2: `Kalenderwoche ${week} ${year} im Detail`,
              p: [
                `Die ${week}. Kalenderwoche ${year} beginnt am Montag, den ${formatLongDE(iso(r.start))}, und endet am Sonntag, den ${formatLongDE(iso(r.end))}. Sie liegt im ${spanText} und ist nach der Norm ISO 8601 nummeriert, die in Deutschland und der EU gilt: Die Woche beginnt am Montag, und KW 1 ist die Woche mit dem ersten Donnerstag des Jahres.${holidaysThisWeek.length ? ` In dieser Woche liegt ein bundesweiter Feiertag: ${holidaysThisWeek.map((h) => `${h.name} (${formatShortDE(h.date)})`).join(", ")}.` : " In dieser Woche liegt kein bundesweiter Feiertag."}`,
                `Kalenderwochen werden im Berufsalltag häufig zur Terminabsprache genutzt – etwa „Lieferung in KW ${week}“. Die Tabelle oben zeigt jeden Wochentag mit Datum, sodass Sie die KW ${week} ${year} schnell einem konkreten Datum zuordnen können.`,
                `${regional.length ? `Regionale Feiertage in dieser Woche: ${regional.map((h) => `${h.name} am ${formatShortDE(h.date)} (${landKurz(h.states)}${h.scope === "partial" ? ", nur teilweise" : ""})`).join("; ")}. ` : "Regionale Feiertage gibt es in dieser Woche nicht. "}${ferienGruppen.length ? `Schulferien haben in der KW ${week}: ${ferienGruppen.map((g) => `${g.label} in ${g.laender.map((f) => f.abbr ?? f.name).join(", ")}`).join("; ")}.` : `Schulferien hat in der KW ${week} ${year} kein Bundesland.`}${vollmond ? ` Vollmond ist am ${formatLongDE(vollmond.date)} um ${vollmond.time} Uhr.` : ""}`,
              ],
            },
          ]}
        />
        <Faq
          items={[
            { q: `Von wann bis wann geht die KW ${week} ${year}?`, a: `Die Kalenderwoche ${week} ${year} geht von Montag, ${formatLongDE(iso(r.start))}, bis Sonntag, ${formatLongDE(iso(r.end))}.` },
            { q: `In welchem Monat liegt die KW ${week} ${year}?`, a: `Die KW ${week} ${year} liegt im ${spanText}.` },
            { q: "Beginnt die Kalenderwoche am Montag?", a: "Ja. Nach ISO 8601 – der in Deutschland gültigen Norm – beginnt jede Kalenderwoche am Montag und endet am Sonntag." },
            { q: `Welche Bundesländer haben in der KW ${week} ${year} Schulferien?`, a: ferienGruppen.length ? ferienGruppen.map((g) => `${g.label}: ${g.laender.map((f) => `${f.name} (${formatShortDE(f.start)}–${formatShortDE(f.end)})`).join(", ")}`).join(". ") + "." : `In der KW ${week} ${year} hat kein Bundesland Schulferien.` },
            { q: `Gibt es in der KW ${week} ${year} einen Feiertag?`, a: `${holidaysThisWeek.length ? `Bundesweit: ${holidaysThisWeek.map((h) => `${h.name} am ${formatLongDE(h.date)}`).join(", ")}.` : "Bundesweit gibt es in dieser Woche keinen gesetzlichen Feiertag."}${regional.length ? ` Regional: ${regional.map((h) => `${h.name} am ${formatShortDE(h.date)} in ${landKurz(h.states)}`).join("; ")}.` : ""}` },
            ...(vollmond ? [{ q: `Wann ist Vollmond in der KW ${week} ${year}?`, a: `Vollmond ist am ${formatLongDE(vollmond.date)} um ${vollmond.time} Uhr (MEZ/MESZ).` }] : []),
          ]}
        />
      </PageWithSidebar>
    </div>
  );
}
