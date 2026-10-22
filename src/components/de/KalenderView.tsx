import Link from "next/link";
import { MONTH_NAMES_DE, MONTH_SLUGS_DE, WEEKDAY_SHORT_DE, formatLongDE, weekdayDE } from "@/lib/de/locale";
import { monthMatrix, monthView, yearSummary, feiertageInMonth, type GridDay } from "@/lib/de/calendar";
import { getFeiertage, getNationalFeiertage } from "@/lib/de/feiertage";
import { workingDaysInMonth } from "@/lib/de/arbeitstage";
import { BUNDESLAENDER, type Bundesland } from "@/lib/de/bundeslaender";
import { getSchulferien, ferienPeriodsInMonth, FERIEN_TYP_LABEL, type FerienPeriod } from "@/lib/de/schulferien";
import { isNavigableYear } from "@/lib/de/year";
import { getBrueckentage } from "@/lib/de/brueckentage";
import { getBrueckentageBundesweit } from "@/lib/de/brueckentageBundesweit";
import { stateByCode } from "@/lib/de/bundeslaender";
import { ferienInRange, ferienNachTyp, regionaleFeiertageInRange, mondphasenInRange, sonneInWoche } from "@/lib/de/kwInfo";
import PageWithSidebar from "@/components/de/PageWithSidebar";
import Breadcrumbs from "@/components/de/Breadcrumbs";
import SeoProse, { type ProseBlock } from "@/components/de/SeoProse";
import Faq from "@/components/de/Faq";
import type { QA } from "@/lib/de/jsonLd";

const DAYS_IN_MONTH_LABEL = (year: number, month0: number) => new Date(Date.UTC(year, month0 + 1, 0)).getUTCDate();

/** Set of ISO dates that fall inside any school-holiday period of a Bundesland. */
function ferienDateSet(year: number, state?: Bundesland): Set<string> {
  const set = new Set<string>();
  if (!state) return set;
  const rec = getSchulferien(year, state.code);
  if (!rec) return set;
  for (const p of rec.periods) {
    for (let t = Date.parse(`${p.start}T00:00:00Z`); t <= Date.parse(`${p.end}T00:00:00Z`); t += 86400000) {
      set.add(new Date(t).toISOString().slice(0, 10));
    }
  }
  return set;
}

function Cell({ d, ferien = false }: { d: Pick<GridDay, "day" | "weekend" | "holiday">; ferien?: boolean }) {
  if (d.day === 0) return <span className="text-transparent">0</span>;
  const tone = d.holiday
    ? "bg-brand-green-100 font-bold text-brand-green-700"
    : ferien
      ? "bg-amber-100 font-medium text-amber-700"
      : d.weekend
        ? "text-slate-400"
        : "text-navy-800";
  return <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${tone}`}>{d.day}</span>;
}

function StateLinks({ base }: { base: (b: Bundesland) => string }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {BUNDESLAENDER.map((b) => (
        <Link key={b.code} href={base(b)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-navy-700 hover:border-navy-300 hover:shadow-sm">
          {b.name}
        </Link>
      ))}
    </div>
  );
}

/** Full-year overview (12 month grids), national or for one Bundesland. */
export function KalenderYear({ year, state }: { year: number; state?: Bundesland }) {
  const summary = yearSummary(year, state?.code);
  const feiertage = state ? getFeiertage(year, state.code, { includePartial: false }) : getNationalFeiertage(year);
  const label = state ? state.name : "Deutschland";
  const ferien = ferienDateSet(year, state);
  // Schulferien-Perioden des Landes für dieses Jahr — differenziert die
  // Jahresseite je Bundesland zusätzlich zu den regionalen Feiertagen.
  const ferienList = state ? (getSchulferien(year, state.code)?.periods ?? []) : [];
  const ferienSummary = ferienList.length
    ? [...new Set(ferienList.map((p) => FERIEN_TYP_LABEL[p.typ]))].join(", ")
    : "";
  const suffix = state ? `/${state.slug}` : "";
  const landQ = state ? `?land=${state.slug}` : "";

  return (
    <PageWithSidebar>
      <Breadcrumbs
        items={
          state
            ? [
                { name: "Start", url: "/" },
                { name: `Kalender ${year}`, url: `/kalender/${year}` },
                { name: state.name, url: `/kalender/${year}/${state.slug}` },
              ]
            : [
                { name: "Start", url: "/" },
                { name: `Kalender ${year}`, url: `/kalender/${year}` },
              ]
        }
      />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">Kalender {year}{state ? ` – ${state.name}` : ""}</h1>
        <div className="flex flex-wrap gap-2 text-sm">
          <a href={`/api/pdf/de/jahr/${year}${landQ}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">🖨 PDF</a>
          <Link href={`/kalender-zum-ausdrucken/${year}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Alle PDFs</Link>
        </div>
      </div>
      <p className="mt-2 max-w-2xl text-slate-600">
        Kalender für das ganze Jahr {year}{state ? ` in ${state.name}` : ""} — alle 12 Monate, gesetzliche Feiertage,
        Kalenderwochen und Arbeitstage. Monat anklicken für Details und PDF zum Ausdrucken.
      </p>

      {isNavigableYear(year) && (
        <div className="mt-4 flex gap-2 text-sm">
          <Link href={`/kalender/${year - 1}${suffix}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">← {year - 1}</Link>
          <Link href={`/kalender/${year + 1}${suffix}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">{year + 1} →</Link>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { k: "Tage", v: summary.totalDays },
          { k: "Kalenderwochen", v: summary.isoWeeks },
          { k: `Feiertage (${label})`, v: summary.feiertageCount },
          { k: "Arbeitstage", v: summary.arbeitstage },
        ].map((s) => (
          <div key={s.k} className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
            <div className="text-2xl font-black text-navy-800">{s.v}</div>
            <div className="mt-0.5 text-xs text-slate-500">{s.k}</div>
          </div>
        ))}
      </div>

      {/* Farblegende */}
      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded bg-brand-green-100 ring-1 ring-brand-green-300" /> Feiertag</span>
        <span className="inline-flex items-center gap-1.5"><span className="text-slate-400">7</span> Wochenende</span>
        {state ? (
          <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded bg-amber-100 ring-1 ring-amber-300" /> Schulferien</span>
        ) : (
          <Link href={`/schulferien/${year}`} className="font-medium text-navy-600 hover:text-brand-green-600">Schulferien nach Bundesland →</Link>
        )}
      </div>

      <section className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {MONTH_NAMES_DE.map((name, m) => {
          const weeks = monthMatrix(year, m, state?.code);
          const href = state ? `/kalender/${MONTH_SLUGS_DE[m]}-${year}/${state.slug}` : `/kalender/${MONTH_SLUGS_DE[m]}-${year}`;
          return (
            <div key={m} className="rounded-2xl border border-slate-200 bg-white p-4">
              <Link href={href} className="mb-2 block text-sm font-bold text-navy-700 hover:text-navy-600">{name} {year} →</Link>
              <table className="w-full table-fixed text-center text-[12px]">
                <thead>
                  <tr className="text-slate-400">
                    {WEEKDAY_SHORT_DE.map((w, i) => <th key={w} className={`py-1 font-medium ${i >= 5 ? "text-slate-500" : ""}`}>{w}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {weeks.map((wk, i) => (
                    <tr key={i}>{wk.map((d, j) => <td key={j} className="py-0.5"><Cell d={d} ferien={ferien.has(d.iso)} /></td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </section>

      {/* Schnellzugriff & Downloads */}
      <div className="mt-6 flex flex-wrap gap-2 text-sm">
        <Link href={`/feiertage/${year}${suffix}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Feiertage {year}</Link>
        <Link href={`/brueckentage/${year}${suffix}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Brückentage {year}</Link>
        <Link href={`/schulferien/${year}${suffix}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Schulferien {year}</Link>
        <Link href={`/kalender-zum-ausdrucken/${year}`} className="rounded-lg bg-brand-green-600 px-3 py-1.5 font-semibold text-white hover:bg-brand-green-700">Kalender {year} zum Ausdrucken</Link>
        <a href={`/api/ics/feiertage/${year}${suffix}`} className="rounded-lg border border-brand-green-200 bg-brand-green-50 px-3 py-1.5 font-medium text-brand-green-700 hover:bg-brand-green-100">📅 Feiertage als .ics</a>
        <a href={`/api/pdf/de/jahr/${year}${landQ}`} className="rounded-lg bg-navy-600 px-3 py-1.5 font-semibold text-white hover:bg-navy-700">⬇ Ganzes Jahr auf 1 Seite (PDF)</a>
      </div>

      <section className="mt-10">
        <h2 className="mb-3 text-xl font-bold text-navy-800">Feiertage {year}{state ? ` in ${state.name}` : " (bundesweit)"}</h2>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr><th className="px-4 py-2 font-medium">Feiertag</th><th className="px-4 py-2 font-medium">Datum</th><th className="px-4 py-2 font-medium">Wochentag</th></tr>
            </thead>
            <tbody>
              {feiertage.map((h) => (
                <tr key={h.slug} className="border-t border-slate-100">
                  <td className="px-4 py-2 font-medium text-navy-800">{h.name}</td>
                  <td className="px-4 py-2 text-slate-600">{formatLongDE(h.date)}</td>
                  <td className="px-4 py-2 text-slate-600">{weekdayDE(h.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          <Link href={state ? `/feiertage/${year}/${state.slug}` : `/feiertage/${year}`} className="font-medium text-navy-600 underline">Alle Details zu den Feiertagen {year}{state ? ` in ${state.name}` : ""} →</Link>
        </p>
      </section>

      {state && ferienList.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-xl font-bold text-navy-800">Schulferien {year} in {state.name}</h2>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr><th className="px-4 py-2 font-medium">Ferien</th><th className="px-4 py-2 font-medium">Von</th><th className="px-4 py-2 font-medium">Bis</th></tr>
              </thead>
              <tbody>
                {ferienList.map((p, i) => (
                  <tr key={`${p.typ}-${i}`} className="border-t border-slate-100">
                    <td className="px-4 py-2 font-medium text-navy-800">{FERIEN_TYP_LABEL[p.typ]}</td>
                    <td className="px-4 py-2 text-slate-600">{formatLongDE(p.start)}{p.note ? ` (${p.note})` : ""}</td>
                    <td className="px-4 py-2 text-slate-600">{formatLongDE(p.end)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            <Link href={`/schulferien/${year}/${state.slug}`} className="font-medium text-navy-600 underline">Alle Schulferien {year} in {state.name} →</Link>
            <span className="ml-2 text-slate-400">Quelle: KMK, Angaben ohne Gewähr.</span>
          </p>
        </section>
      )}

      <section className="mt-10">
        <h2 className="mb-3 text-xl font-bold text-navy-800">Kalender {year} nach Bundesland</h2>
        <StateLinks base={(b) => `/kalender/${year}/${b.slug}`} />
      </section>

      <SeoProse blocks={yearProse(year, label, summary, ferienSummary)} />
      <Faq items={yearFaq(year, label, summary, ferienList)} />
    </PageWithSidebar>
  );
}

function yearProse(year: number, label: string, summary: ReturnType<typeof yearSummary>, ferienSummary = ""): ProseBlock[] {
  const schaltjahr = summary.totalDays === 366;
  const neujahr = weekdayDE(`${year}-01-01`);
  const weihnachten = weekdayDE(`${year}-12-25`);
  const ferienSatz = ferienSummary
    ? ` In ${label} sind ${year} Schulferien in diesen Zeiträumen: ${ferienSummary} – die genauen Termine finden Sie in der Tabelle „Schulferien ${year}" weiter oben.`
    : "";
  return [
    {
      h2: `Kalender ${year} für ${label} im Überblick`,
      p: [
        `Das Jahr ${year} hat ${summary.totalDays} Tage und verteilt sich auf ${summary.isoWeeks} Kalenderwochen. ${schaltjahr ? `${year} ist ein Schaltjahr – der Februar hat 29 Tage.` : `${year} ist kein Schaltjahr – der Februar hat 28 Tage.`} Der Kalender oben zeigt alle zwölf Monate mit gesetzlichen Feiertagen (grün), Wochenenden und – bei Auswahl eines Bundeslandes – den Schulferien. Jeder Monat lässt sich anklicken; dort finden Sie den Monatskalender mit Kalenderwochen und einen Druck-PDF.`,
        `Neujahr fällt ${year} auf einen ${neujahr}, der 1. Weihnachtsfeiertag auf einen ${weihnachten}. Diese Wochentage bestimmen, wo sich Brückentage und lange Wochenenden lohnen.`,
      ],
    },
    {
      h2: `Feiertage, Brückentage und Ferien ${year}`,
      p: [
        `Bundesweit gelten neun gesetzliche Feiertage einheitlich in allen 16 Bundesländern; je nach Land kommen regionale Feiertage wie Fronleichnam, Reformationstag oder Allerheiligen hinzu. Für ${label} gelten ${year} ${summary.feiertageCount} gesetzliche Feiertage, davon ${summary.feiertageAnWerktagen} an Werktagen (Montag bis Freitag) – daraus ergeben sich ${summary.arbeitstage} Arbeitstage. Mit den passenden Brückentagen lässt sich aus wenigen Urlaubstagen ein langer Zeitraum machen – eine detaillierte Übersicht bietet die Brückentage-Seite.${ferienSatz}`,
      ],
    },
    {
      h2: `Kalender ${year} zum Ausdrucken (PDF)`,
      p: [
        `Sie können den Kalender ${year} kostenlos als PDF herunterladen und ausdrucken – wahlweise das ganze Jahr auf einer Seite, einzelne Monate oder eine Feiertagsliste. Die Kalenderwochen sind nach ISO 8601 nummeriert (die Woche beginnt am Montag, die erste Kalenderwoche ist die mit dem ersten Donnerstag des Jahres). Zusätzlich stehen alle Feiertage als ICS-Datei für den Import in Google Kalender, Outlook oder Apple Kalender bereit.`,
      ],
    },
  ];
}

function yearFaq(year: number, label: string, summary: ReturnType<typeof yearSummary>, ferienList: FerienPeriod[] = []): QA[] {
  return [
    { q: `Wie viele Tage hat das Jahr ${year}?`, a: `${year} hat ${summary.totalDays} Tage${summary.totalDays === 366 ? " – es ist ein Schaltjahr" : ""}.` },
    { q: `Wie viele Kalenderwochen hat ${year}?`, a: `${year} hat ${summary.isoWeeks} Kalenderwochen (nach ISO 8601, Wochenbeginn Montag).` },
    { q: `Wie viele Feiertage und Arbeitstage hat ${year} in ${label}?`, a: `Für ${label} gelten ${year} ${summary.feiertageCount} gesetzliche Feiertage, davon ${summary.feiertageAnWerktagen} an Werktagen; daraus ergeben sich ${summary.arbeitstage} Arbeitstage (5-Tage-Woche).` },
    ...(ferienList.length
      ? [{
          q: `Wann sind ${year} Schulferien in ${label}?`,
          a: `${year} gibt es in ${label} folgende Schulferien: ${ferienList.map((p) => `${FERIEN_TYP_LABEL[p.typ]} (${formatLongDE(p.start)} – ${formatLongDE(p.end)})`).join("; ")}. Quelle: KMK, Angaben ohne Gewähr.`,
        }]
      : []),
    { q: `Ist ${year} ein Schaltjahr?`, a: summary.totalDays === 366 ? `Ja, ${year} ist ein Schaltjahr mit 366 Tagen; der Februar hat 29 Tage.` : `Nein, ${year} ist kein Schaltjahr; der Februar hat 28 Tage.` },
    { q: `Auf welchen Wochentag fällt Neujahr ${year}?`, a: `Der 1. Januar ${year} ist ein ${weekdayDE(`${year}-01-01`)}.` },
    { q: `Kann ich den Kalender ${year} kostenlos ausdrucken?`, a: `Ja. Der Kalender ${year} steht kostenlos als PDF zum Ausdrucken bereit – als Jahresübersicht auf einer Seite oder nach Monaten. Feiertage gibt es zusätzlich als ICS-Datei.` },
  ];
}

/** Single-month view with KW column, national or for one Bundesland. */
export function KalenderMonth({ year, month0, state }: { year: number; month0: number; state?: Bundesland }) {
  const weeks = monthView(year, month0, state?.code);
  const feiertage = feiertageInMonth(year, month0, state?.code);
  const wd = workingDaysInMonth(year, month0, state?.code ?? "BY"); // state for counts; national handled below
  const nationalCounts = workingDaysInMonthNational(year, month0);
  const counts = state ? wd : nationalCounts;
  const name = MONTH_NAMES_DE[month0];
  const prev = month0 === 0 ? { y: year - 1, m: 11 } : { y: year, m: month0 - 1 };
  const next = month0 === 11 ? { y: year + 1, m: 0 } : { y: year, m: month0 + 1 };
  const mSlug = (y: number, m: number) => `${MONTH_SLUGS_DE[m]}-${y}`;
  const suffix = state ? `/${state.slug}` : "";
  const ferien = ferienDateSet(year, state);

  // Zusatzfakten des Monats (gleicher Mechanismus wie auf den KW-Seiten):
  // Schulferien der Länder, regionale Feiertage, Brückentage, Mond, Sonne, KW.
  const mm = String(month0 + 1).padStart(2, "0");
  const mStart = `${year}-${mm}-01`;
  const mEnd = `${year}-${mm}-${String(DAYS_IN_MONTH_LABEL(year, month0)).padStart(2, "0")}`;
  const kurz = (code: string) => stateByCode(code as never).abbr ?? code;
  const ferienLaender = state ? [] : ferienNachTyp(ferienInRange(mStart, mEnd));
  const regionalAlle = state ? [] : regionaleFeiertageInRange(mStart, mEnd);
  const bruecken = (state
    ? getBrueckentage(year, state.code).map((b) => ({ ...b, states: [] as string[], bundesweit: true }))
    : getBrueckentageBundesweit(year)
  ).filter((b) => b.urlaub.some((u) => u >= mStart && u <= mEnd)).slice(0, 5);
  const mond = mondphasenInRange(mStart, mEnd);
  const sonne = sonneInWoche(mStart, mEnd);
  const kwLinks = weeks.map((row) => ({ kw: row.kw, isoYear: month0 === 0 && row.kw >= 52 ? year - 1 : month0 === 11 && row.kw === 1 ? year + 1 : year }));
  const vollmond = mond.find((m) => m.type === "full");

  return (
    <PageWithSidebar>
      <Breadcrumbs
        items={[
          { name: "Start", url: "/" },
          { name: `Kalender ${year}`, url: state ? `/kalender/${year}/${state.slug}` : `/kalender/${year}` },
          {
            name: `${name}${state ? ` · ${state.name}` : ""}`,
            url: state ? `/kalender/${mSlug(year, month0)}/${state.slug}` : `/kalender/${mSlug(year, month0)}`,
          },
        ]}
      />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">{name} {year}{state ? ` – ${state.name}` : ""}</h1>
        <div className="flex gap-2 text-sm">
          <a href={`/api/pdf/de/${year}/${MONTH_SLUGS_DE[month0]}${state ? `?land=${state.slug}` : ""}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">🖨 PDF</a>
          <Link href={`/kalender/${mSlug(prev.y, prev.m)}${suffix}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">←</Link>
          <Link href={`/kalender/${mSlug(next.y, next.m)}${suffix}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">→</Link>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { k: "Tage", v: counts.total },
          { k: "Arbeitstage", v: counts.arbeitstage },
          { k: "Freie Tage", v: counts.freie },
        ].map((s) => (
          <div key={s.k} className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
            <div className="text-2xl font-black text-navy-800">{s.v}</div>
            <div className="mt-0.5 text-xs text-slate-500">{s.k}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4">
        <table className="w-full table-fixed text-center text-sm">
          <thead>
            <tr className="text-slate-400">
              <th className="py-2 text-[11px] font-semibold text-slate-400">KW</th>
              {WEEKDAY_SHORT_DE.map((w, i) => <th key={w} className={`py-2 font-medium ${i >= 5 ? "text-slate-500" : ""}`}>{w}</th>)}
            </tr>
          </thead>
          <tbody>
            {weeks.map((row) => (
              <tr key={row.kw}>
                <td className="py-1 text-[11px] font-semibold text-slate-400">{row.kw}</td>
                {row.days.map((d, j) => <td key={j} className="py-1"><Cell d={d} ferien={ferien.has(d.iso)} /></td>)}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded bg-brand-green-100 ring-1 ring-brand-green-300" /> Feiertag</span>
          <span className="inline-flex items-center gap-1.5"><span className="text-slate-400">7</span> Wochenende</span>
          {state && <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded bg-amber-100 ring-1 ring-amber-300" /> Schulferien</span>}
        </div>
      </div>

      {feiertage.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 text-lg font-bold text-navy-800">Feiertage im {name} {year}</h2>
          <ul className="space-y-1 text-sm">
            {feiertage.map((h) => (
              <li key={h.slug} className="text-slate-700"><strong className="text-navy-800">{h.name}</strong> — {formatLongDE(h.date)} ({weekdayDE(h.date)})</li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="mb-2 text-lg font-bold text-navy-800">{state ? `Brückentage im ${name} ${year}` : `Brückentage im ${name} ${year} (bundesweit)`}</h2>
          {bruecken.length === 0 ? (
            <p className="text-sm text-slate-600">Im {name} {year} gibt es {state ? `in ${state.name}` : "bundesweit"} keinen klassischen Brückentag.</p>
          ) : (
            <ul className="space-y-1.5 text-sm text-slate-700">
              {bruecken.map((b) => (
                <li key={b.von + b.urlaub.join()} className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <span className="font-semibold text-navy-800">{b.urlaubstage} Urlaubstag{b.urlaubstage > 1 ? "e" : ""} → {b.freieTage} freie Tage:</span> {formatLongDE(b.von)} – {formatLongDE(b.bis)} (Urlaub: {b.urlaub.map((d) => formatLongDE(d).replace(` ${year}`, "")).join(", ")}){!state && !b.bundesweit ? ` · nur ${b.states.map(kurz).join(", ")}` : ""}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 text-xs text-slate-500"><Link href={`/brueckentage/${year}${suffix}`} className="underline">Alle Brückentage {year}{state ? ` in ${state.name}` : ""}</Link></p>

          {!state && (
            <>
              <h2 className="mb-2 mt-6 text-lg font-bold text-navy-800">Schulferien im {name} {year} nach Bundesland</h2>
              {ferienLaender.length === 0 ? (
                <p className="text-sm text-slate-600">Im {name} {year} hat kein Bundesland Schulferien.</p>
              ) : (
                <ul className="space-y-1.5 text-sm text-slate-700">
                  {ferienLaender.map((g) => (
                    <li key={g.typ} className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                      <span className="font-semibold text-navy-800">{g.label}:</span> {g.laender.length === 16 ? "alle 16 Länder" : g.laender.map((f) => `${f.abbr ?? f.code} (${f.start === f.end ? formatLongDE(f.start).replace(` ${year}`, "") : `${formatLongDE(f.start).replace(` ${year}`, "")} – ${formatLongDE(f.end).replace(` ${year}`, "")}`})`).join(", ")}
                    </li>
                  ))}
                </ul>
              )}
              {regionalAlle.length > 0 && (
                <>
                  <h2 className="mb-2 mt-6 text-lg font-bold text-navy-800">Regionale Feiertage im {name} {year}</h2>
                  <ul className="space-y-1.5 text-sm text-slate-700">
                    {regionalAlle.map((h) => (
                      <li key={h.date + h.slug + h.scope} className="rounded-xl border border-slate-200 bg-white px-3 py-2"><span className="font-semibold text-navy-800">{h.name}</span> – {formatLongDE(h.date)} ({weekdayDE(h.date)}) · {h.states.map(kurz).join(", ")}{h.scope === "partial" ? " (nur teilweise)" : ""}</li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}
        </div>
        <div>
          <h2 className="mb-2 text-lg font-bold text-navy-800">Mond &amp; Sonne im {name} {year}</h2>
          <ul className="space-y-1.5 text-sm text-slate-700">
            {mond.map((m) => (
              <li key={m.date + m.type} className="rounded-xl border border-slate-200 bg-white px-3 py-2">{m.icon} <span className="font-semibold text-navy-800">{m.label}</span> am {formatLongDE(m.date)} um {m.time} Uhr{m.zodiacSign ? ` (Mond im ${m.zodiacSign})` : ""}</li>
            ))}
            <li className="rounded-xl border border-slate-200 bg-white px-3 py-2">☀️ Sonne in {sonne.ort}: am 1. {name} {sonne.montag.sunrise ?? "–"}–{sonne.montag.sunset ?? "–"} Uhr ({sonne.montag.dayLengthText}), am {DAYS_IN_MONTH_LABEL(year, month0)}. {name} {sonne.sonntag.sunrise ?? "–"}–{sonne.sonntag.sunset ?? "–"} Uhr ({sonne.sonntag.dayLengthText}); Tageslänge {sonne.deltaMinuten >= 0 ? "+" : "−"}{Math.abs(sonne.deltaMinuten)} Min. im Monatsverlauf.</li>
          </ul>
          <h2 className="mb-2 mt-6 text-lg font-bold text-navy-800">Kalenderwochen im {name} {year}</h2>
          <div className="flex flex-wrap gap-2 text-sm">
            {kwLinks.map((k) => (
              <Link key={`${k.kw}-${k.isoYear}`} href={`/kw/${k.kw}-${k.isoYear}`} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-navy-700 hover:border-navy-300">KW {k.kw}</Link>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500">Mondphasen in MEZ/MESZ; Sonnenzeiten für Berlin – andere Orte: <Link href="/sonnenaufgang-sonnenuntergang" className="underline">Sonnenaufgang &amp; Sonnenuntergang</Link>.</p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">{name} {year} nach Bundesland</h2>
        <StateLinks base={(b) => `/kalender/${mSlug(year, month0)}/${b.slug}`} />
      </section>

      <SeoProse blocks={monthProse(year, month0, name, state, counts, feiertage)} />
      <Faq items={[...monthFaq(year, month0, name, state, counts, feiertage), ...(vollmond ? [{ q: `Wann ist Vollmond im ${name} ${year}?`, a: `Vollmond ist am ${formatLongDE(vollmond.date)} um ${vollmond.time} Uhr (MEZ/MESZ).` }] : []), ...(!state ? [{ q: `Welche Bundesländer haben im ${name} ${year} Schulferien?`, a: ferienLaender.length ? ferienLaender.map((g) => `${g.label}: ${g.laender.map((f) => f.name).join(", ")}`).join(". ") + "." : `Im ${name} ${year} hat kein Bundesland Schulferien.` }] : []), ...(bruecken[0] ? [{ q: `Gibt es im ${name} ${year} ${state ? `in ${state.name} ` : ""}Brückentage?`, a: `Ja: mit ${bruecken[0].urlaubstage} Urlaubstag${bruecken[0].urlaubstage > 1 ? "en" : ""} (${bruecken[0].urlaub.map((d) => formatLongDE(d)).join(", ")}) entstehen ${bruecken[0].freieTage} freie Tage am Stück vom ${formatLongDE(bruecken[0].von)} bis ${formatLongDE(bruecken[0].bis)}.` }] : [])]} />
    </PageWithSidebar>
  );
}

type MonthCounts = { total: number; arbeitstage: number; freie: number };

function monthProse(
  year: number,
  month0: number,
  name: string,
  state: Bundesland | undefined,
  counts: MonthCounts,
  feiertage: ReturnType<typeof feiertageInMonth>,
): ProseBlock[] {
  const days = DAYS_IN_MONTH_LABEL(year, month0);
  const region = state ? ` in ${state.name}` : "";
  const erster = weekdayDE(`${year}-${String(month0 + 1).padStart(2, "0")}-01`);
  const feiertagText = feiertage.length
    ? `Im ${name} ${year} liegen ${feiertage.length === 1 ? "ein gesetzlicher Feiertag" : `${feiertage.length} gesetzliche Feiertage`}: ${feiertage.map((h) => h.name).join(", ")}.`
    : `Im ${name} ${year} gibt es${region} keinen bundesweiten gesetzlichen Feiertag.`;
  // Schulferien des Bundeslandes in diesem Monat — differenziert die Monatsseiten
  // je Bundesland inhaltlich (sonst textlich identisch, wenn kein regionaler
  // Feiertag im Monat liegt).
  const ferienPeriods = state ? ferienPeriodsInMonth(year, month0, state.code) : [];
  const ferienText = state
    ? ferienPeriods.length
      ? `In ${state.name} liegen im ${name} ${year} Schulferien: ${ferienPeriods.map((f) => `${f.label} (${formatLongDE(f.start)} – ${formatLongDE(f.end)})`).join("; ")}. Diese Tage sind im Kalender oben orange markiert.`
      : `In ${state.name} sind im ${name} ${year} keine Schulferien.`
    : null;
  return [
    {
      h2: `${name} ${year}${region} im Überblick`,
      p: [
        `Der ${name} ${year} hat ${days} Tage. Der Monat beginnt an einem ${erster}. Von den ${counts.total} Tagen sind ${counts.arbeitstage} Arbeitstage und ${counts.freie} freie Tage (Wochenenden und Feiertage${state ? "" : " – bundesweit"}). Der Kalender oben zeigt zu jeder Woche die Kalenderwoche (KW) nach ISO 8601.`,
        feiertagText,
        ...(ferienText ? [ferienText] : []),
      ],
    },
    {
      h2: `Arbeitstage und Kalenderwochen im ${name} ${year}`,
      p: [
        `Für die Arbeitszeit- und Urlaubsplanung zählen die ${counts.arbeitstage} Arbeitstage im ${name} ${year}. Fällt Ihr Urlaub in diesen Monat, hilft der Blick auf die Feiertage und benachbarte Brückentage, um freie Tage optimal zu nutzen. Den vollständigen Monatskalender können Sie oben als PDF herunterladen und ausdrucken; die Feiertage lassen sich als ICS-Datei in Ihren digitalen Kalender importieren.`,
      ],
    },
  ];
}

function monthFaq(
  year: number,
  month0: number,
  name: string,
  state: Bundesland | undefined,
  counts: MonthCounts,
  feiertage: ReturnType<typeof feiertageInMonth>,
): QA[] {
  const days = DAYS_IN_MONTH_LABEL(year, month0);
  const region = state ? state.name : "Deutschland";
  const ferienPeriods = state ? ferienPeriodsInMonth(year, month0, state.code) : [];
  return [
    { q: `Wie viele Tage hat der ${name} ${year}?`, a: `Der ${name} ${year} hat ${days} Tage.` },
    { q: `Wie viele Arbeitstage hat der ${name} ${year} in ${region}?`, a: `Der ${name} ${year} hat in ${region} ${counts.arbeitstage} Arbeitstage und ${counts.freie} freie Tage.` },
    {
      q: `Welche Feiertage gibt es im ${name} ${year}?`,
      a: feiertage.length ? `Im ${name} ${year} gibt es: ${feiertage.map((h) => `${h.name} (${formatLongDE(h.date)})`).join(", ")}.` : `Im ${name} ${year} gibt es keinen bundesweiten gesetzlichen Feiertag.`,
    },
    ...(state
      ? [
          {
            q: `Sind im ${name} ${year} in ${state.name} Schulferien?`,
            a: ferienPeriods.length
              ? `Ja. Im ${name} ${year} fallen in ${state.name} folgende Schulferien: ${ferienPeriods.map((f) => `${f.label} (${formatLongDE(f.start)} – ${formatLongDE(f.end)})`).join("; ")}.`
              : `Im ${name} ${year} sind in ${state.name} keine Schulferien.`,
          },
        ]
      : []),
    { q: `Auf welchen Wochentag fällt der 1. ${name} ${year}?`, a: `Der 1. ${name} ${year} ist ein ${weekdayDE(`${year}-${String(month0 + 1).padStart(2, "0")}-01`)}.` },
  ];
}

// National month counts (no state): weekday minus national weekday holidays.
function workingDaysInMonthNational(year: number, month0: number) {
  const weeks = monthView(year, month0);
  let total = 0;
  let freie = 0;
  for (const row of weeks) {
    for (const d of row.days) {
      if (d.day === 0) continue;
      total++;
      if (d.weekend || d.holiday) freie++;
    }
  }
  return { total, freie, arbeitstage: total - freie };
}
