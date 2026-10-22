import PageWithSidebar from "@/components/de/PageWithSidebar";
import Breadcrumbs from "@/components/de/Breadcrumbs";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRERENDER_YEARS, parseYear, yearRobots } from "@/lib/de/year";
import { allWeeks } from "@/lib/de/weeks";
import { formatShortDE } from "@/lib/de/locale";
import { getNationalFeiertage } from "@/lib/de/feiertage";
import { stateByCode } from "@/lib/de/bundeslaender";
import { ferienInRange, ferienNachTyp, regionaleFeiertageInRange } from "@/lib/de/kwInfo";
import { berlinISOWeek } from "@/lib/de/now";
import SeoProse from "@/components/de/SeoProse";
import Faq from "@/components/de/Faq";
import { ogMeta } from "@/lib/de/ogMeta";

export const revalidate = 3600;

export function generateStaticParams() {
  return PRERENDER_YEARS.map((y) => ({ year: String(y) }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) return {};
  const count = allWeeks(y).length;
  return {
    title: `Kalenderwochen ${y} – alle KW von 1 bis ${count}`,
    description: `Alle Kalenderwochen ${y} nach ISO 8601: Start- und Enddatum jeder KW, Feiertage und Schulferien (Bundesländer) je Woche, aktuelle Woche hervorgehoben.`,
    alternates: { canonical: `/kalenderwochen/${y}` },
    openGraph: ogMeta(`/kalenderwochen/${y}`),
    ...yearRobots(y),
  };
}

export default async function KalenderwochenPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) notFound();

  const weeks = allWeeks(y);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const current = berlinISOWeek();

  // Feiertage und Schulferien je Woche (bundesweit + regional, Ferien je Land).
  const national = [...getNationalFeiertage(y - 1), ...getNationalFeiertage(y), ...getNationalFeiertage(y + 1)];
  const kurz = (code: string) => stateByCode(code as never).abbr ?? code;
  const TYP_KURZ: Record<string, string> = { winterferien: "Winter", osterferien: "Ostern", pfingstferien: "Pfingsten", sommerferien: "Sommer", herbstferien: "Herbst", weihnachtsferien: "Weihnachten" };
  const rows = weeks.map((w) => {
    const s = iso(w.start);
    const e = iso(w.end);
    const bund = national.filter((h) => h.date >= s && h.date <= e);
    const regional = regionaleFeiertageInRange(s, e);
    const ferien = ferienNachTyp(ferienInRange(s, e));
    return { w, s, e, bund, regional, ferien };
  });
  const wochenMitFerien = rows.filter((r) => r.ferien.length > 0).length;
  const wochenMitFeiertag = rows.filter((r) => r.bund.length > 0 || r.regional.length > 0).length;

  return (
    <div className="flex-1">
      <PageWithSidebar>
        <Breadcrumbs
          items={[
            { name: "Start", url: "/" },
            { name: `Kalenderwochen ${y}`, url: `/kalenderwochen/${y}` },
          ]}
        />
        <h1 className="text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">Kalenderwochen {y}</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Alle {weeks.length} Kalenderwochen {y} nach ISO 8601. Jede Woche beginnt am Montag; KW 1 ist die Woche,
          die den 4. Januar enthält. Die aktuelle Woche ist hervorgehoben.
        </p>

        {current.isoYear === y && (() => {
          const cw = weeks.find((w) => w.week === current.week);
          if (!cw) return null;
          return (
            <Link
              href={`/kw/${cw.week}-${y}`}
              className="mt-5 flex items-center gap-4 rounded-2xl border border-brand-green-100 bg-brand-green-50 p-4 transition hover:border-brand-green-300 sm:p-5"
            >
              <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-green-600 text-white sm:h-20 sm:w-20">
                <span className="text-[10px] font-semibold uppercase tracking-wider">KW</span>
                <span className="text-3xl font-black leading-none sm:text-4xl">{cw.week}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-green-700">Aktuelle Kalenderwoche</p>
                <p className="text-lg font-bold text-navy-800 sm:text-xl">{cw.week}. Kalenderwoche {y}</p>
                <p className="text-sm text-slate-600">{formatShortDE(iso(cw.start))} – {formatShortDE(iso(cw.end))}</p>
              </div>
            </Link>
          );
        })()}

        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-3 py-2 font-medium">KW</th>
                <th className="px-3 py-2 font-medium">Von (Mo)</th>
                <th className="px-3 py-2 font-medium">Bis (So)</th>
                <th className="px-3 py-2 font-medium">Feiertage</th>
                <th className="px-3 py-2 font-medium">Schulferien (Länder)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ w, s, e, bund, regional, ferien }) => {
                const isCurrent = current.isoYear === y && current.week === w.week;
                return (
                  <tr key={w.week} className={`border-t border-slate-100 align-top ${isCurrent ? "bg-brand-green-50" : ""}`}>
                    <td className="whitespace-nowrap px-3 py-2 font-semibold text-navy-800">
                      <Link href={`/kw/${w.week}-${y}`} className="hover:text-navy-600 hover:underline">KW {w.week}</Link>{isCurrent && <span className="ml-2 rounded-full bg-brand-green-600 px-2 py-0.5 text-[10px] font-bold text-white">aktuell</span>}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-slate-600">{formatShortDE(s)}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-slate-600">{formatShortDE(e)}</td>
                    <td className="px-3 py-2 text-slate-700">
                      {bund.map((h) => (
                        <span key={h.date} className="mr-1 inline-block rounded-full bg-brand-green-50 px-2 py-0.5 text-xs font-semibold text-brand-green-700">{h.name} ({formatShortDE(h.date).slice(0, 6)})</span>
                      ))}
                      {regional.map((h) => (
                        <span key={h.date + h.slug + h.scope} className="mr-1 inline-block rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800" title={h.note ?? undefined}>
                          {h.name} ({formatShortDE(h.date).slice(0, 6)}) · {h.states.map(kurz).join(", ")}{h.scope === "partial" ? " teilw." : ""}
                        </span>
                      ))}
                      {bund.length === 0 && regional.length === 0 && <span className="text-slate-300">–</span>}
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-700">
                      {ferien.length === 0 && <span className="text-slate-300">–</span>}
                      {ferien.map((g) => (
                        <div key={g.typ}>
                          <span className="font-semibold text-navy-800">{TYP_KURZ[g.typ] ?? g.label}:</span>{" "}
                          {g.laender.length === 16 ? "alle 16 Länder" : g.laender.map((f) => f.abbr ?? f.code).join(", ")}
                        </div>
                      ))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Feiertage: grün = bundesweit, gelb = regional (Länderkürzel; „teilw.“ = nur in Teilen des Landes). Schulferien nach KMK, Länderkürzel: BW Baden-Württemberg, BY Bayern, BE Berlin, BB Brandenburg, HB Bremen, HH Hamburg, HE Hessen, MV Mecklenburg-Vorpommern, NI Niedersachsen, NRW Nordrhein-Westfalen, RP Rheinland-Pfalz, SL Saarland, SN Sachsen, ST Sachsen-Anhalt, SH Schleswig-Holstein, TH Thüringen. Details je Woche über den KW-Link.
        </p>

        <div className="mt-6 flex flex-wrap gap-2 text-sm">
          <Link href={`/kalenderwochen/${y - 1}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">← KW {y - 1}</Link>
          <Link href={`/kalenderwochen/${y + 1}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">KW {y + 1} →</Link>
          <Link href={`/kalender/${y}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Kalender {y}</Link>
        </div>

        <SeoProse
          blocks={[
            {
              h2: `Kalenderwochen ${y} nach ISO 8601`,
              p: [
                `Das Jahr ${y} hat ${weeks.length} Kalenderwochen. In Deutschland und der EU werden Kalenderwochen nach der Norm ISO 8601 gezählt: Jede Woche beginnt am Montag und endet am Sonntag. Die erste Kalenderwoche (KW 1) ist die Woche, die den ersten Donnerstag des Jahres enthält – gleichbedeutend mit der Woche, in die der 4. Januar fällt.`,
                `Diese Regel führt dazu, dass die KW 1 manchmal bereits im Dezember des Vorjahres beginnt oder erst am 4. Januar. Die Kalenderwoche ist im Berufsalltag wichtig, weil Termine, Lieferungen und Projektpläne in Deutschland häufig über die KW statt über ein konkretes Datum kommuniziert werden.`,
                `Die Tabelle zeigt zu jeder Woche außerdem die gesetzlichen Feiertage (bundesweit und regional mit Länderkürzel) und die Schulferien der Bundesländer: ${y} fällt in ${wochenMitFeiertag} Kalenderwochen mindestens ein Feiertag, und in ${wochenMitFerien} Wochen hat mindestens ein Bundesland Schulferien – nützlich für Liefertermine, Urlaubsplanung und Personalplanung.`,
              ],
            },
            {
              h2: `Warum manche Jahre 53 Kalenderwochen haben`,
              p: [
                `Die meisten Jahre haben 52 Kalenderwochen. Ein Jahr hat dann 53 Wochen, wenn es an einem Donnerstag beginnt (oder in einem Schaltjahr an einem Mittwoch oder Donnerstag). ${weeks.length === 53 ? `${y} ist ein solches Jahr mit 53 Kalenderwochen.` : `${y} hat 52 Kalenderwochen.`} Die Tabelle oben zeigt zu jeder KW das genaue Start- und Enddatum – ideal zum Nachschlagen oder Kopieren.`,
              ],
            },
          ]}
        />
        <Faq
          items={[
            { q: `Wie viele Kalenderwochen hat ${y}?`, a: `${y} hat ${weeks.length} Kalenderwochen nach ISO 8601.` },
            { q: "Wann beginnt die erste Kalenderwoche?", a: "KW 1 ist die Woche, die den ersten Donnerstag des Jahres bzw. den 4. Januar enthält. Sie kann daher schon Ende Dezember des Vorjahres beginnen." },
            { q: "Beginnt die Kalenderwoche am Montag oder Sonntag?", a: "Nach ISO 8601 – wie in Deutschland üblich – beginnt die Kalenderwoche am Montag und endet am Sonntag. (In den USA startet die Woche am Sonntag.)" },
            { q: `Welche Kalenderwoche ist heute?`, a: `Die aktuelle Kalenderwoche wird auf dieser Seite hervorgehoben, sobald ${y} das laufende Jahr ist. Sie finden sie oben in der grün markierten Karte.` },
            { q: `In welchen Kalenderwochen ${y} sind Schulferien?`, a: `In ${wochenMitFerien} der ${weeks.length} Kalenderwochen ${y} hat mindestens ein Bundesland Schulferien; welche Länder das sind, steht in der Spalte „Schulferien (Länder)“ der Tabelle. Alle Termine je Land: Schulferien ${y}.` },
          ]}
        />
      </PageWithSidebar>
    </div>
  );
}
