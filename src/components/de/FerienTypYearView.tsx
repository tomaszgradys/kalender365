import Link from "next/link";
import PageWithSidebar from "@/components/de/PageWithSidebar";
import Breadcrumbs from "@/components/de/Breadcrumbs";
import BundeslandSelect from "@/components/de/BundeslandSelect";
import SeoProse from "@/components/de/SeoProse";
import Faq from "@/components/de/Faq";
import { BUNDESLAENDER } from "@/lib/de/bundeslaender";
import {
  getSchulferien,
  isSchulferienIndexable,
  FERIEN_TYP_LABEL,
  type FerienTyp,
  type SchulferienRecord,
} from "@/lib/de/schulferien";
import type { QA } from "@/lib/de/jsonLd";

// Typ-spezifische Einleitung + Prosa für die Jahres-Übersicht (alle Länder).
// Zielt auf die hochvolumige Query „<Ferien> <Jahr>" (z. B. „Sommerferien 2026")
// — eine eigene Landingpage neben dem Sammel-Hub /schulferien/{Jahr}.
const TYP_COPY: Record<
  FerienTyp,
  { intro: string; whenTitle: string; when: string[]; planTitle: string; plan: string[]; faq: QA[] }
> = {
  winterferien: {
    intro:
      "Die Winterferien liegen je nach Bundesland im Januar oder Februar und geben eine Pause im zweiten Schulhalbjahr – vielerorts als Ski- oder Faschingsferien.",
    whenTitle: "Wann sind die Winterferien?",
    when: [
      "Die Winterferien fallen meist in den Zeitraum von Ende Januar bis Anfang März. Ihre Länge und ihr Termin unterscheiden sich stark: Manche Länder haben eine ganze Ferienwoche, andere nur ein bis zwei bewegliche Tage rund um das Halbjahreszeugnis oder den Fasching.",
      "Weil die Winterferien Ländersache sind, gibt es keinen bundeseinheitlichen Termin – die genauen Tage finden Sie über die Auswahl Ihres Bundeslandes.",
    ],
    planTitle: "Winterferien clever nutzen",
    plan: [
      "Rund um die Winterferien lassen sich mit Brückentagen und Feiertagen zusätzliche freie Tage gewinnen. Der vollständige Ferienkalender und die Feiertage des Jahres helfen bei der Planung.",
    ],
    faq: [
      { q: "Haben alle Bundesländer Winterferien?", a: "Nein. Einige Länder haben eine volle Ferienwoche, andere vergeben nur ein bis zwei bewegliche Ferientage rund um das Halbjahreszeugnis – manche haben gar keine gesonderten Winterferien." },
      { q: "Warum sind die Winterferien nicht überall gleich?", a: "Ferientermine legen die Kultusministerien der Länder selbst fest. Anders als bei den Sommerferien gibt es bei den Winterferien keine bundesweite Staffelung durch die KMK." },
    ],
  },
  osterferien: {
    intro:
      "Die Osterferien – in manchen Ländern Frühjahrsferien – fallen ins Frühjahr rund um das Osterfest und dauern je nach Bundesland ein bis zwei Wochen.",
    whenTitle: "Wann sind die Osterferien?",
    when: [
      "Die Osterferien liegen je nach Bundesland zwischen Mitte März und Ende April, meist rund um Karfreitag und Ostermontag. Da das Osterdatum beweglich ist, verschieben sich auch die Ferien von Jahr zu Jahr.",
      "Einige Länder nennen diese Ferien Frühjahrsferien und koppeln sie nicht fest an das Osterfest. Die genauen Termine finden Sie über die Auswahl Ihres Bundeslandes.",
    ],
    planTitle: "Osterferien mit Feiertagen kombinieren",
    plan: [
      "Karfreitag und Ostermontag sind bundesweite gesetzliche Feiertage. Wer Urlaub um die Osterferien legt, gewinnt mit wenigen Brückentagen einen langen zusammenhängenden Zeitraum – ein Blick auf Feiertage und Brückentage des Jahres lohnt sich.",
    ],
    faq: [
      { q: "Sind Karfreitag und Ostermontag Teil der Osterferien?", a: "Beide Tage fallen in vielen Ländern in die Osterferien und sind zugleich bundesweite gesetzliche Feiertage. In einzelnen Ländern liegen die Ferien aber auch vor oder nach dem Osterwochenende." },
      { q: "Warum verschieben sich die Osterferien jedes Jahr?", a: "Ostern ist ein bewegliches Fest – der Ostersonntag richtet sich nach dem ersten Frühlingsvollmond. Entsprechend verschieben sich auch die daran gekoppelten Osterferien." },
    ],
  },
  pfingstferien: {
    intro:
      "Die Pfingstferien liegen im Mai oder Juni rund um Pfingsten. Nicht jedes Bundesland hat zusammenhängende Pfingstferien – manche vergeben stattdessen einzelne bewegliche Ferientage.",
    whenTitle: "Wann sind die Pfingstferien?",
    when: [
      "Die Pfingstferien fallen 49 bis rund 60 Tage nach Ostern in den Mai oder Anfang Juni. Weil Pfingsten beweglich ist, ändert sich der Termin jährlich.",
      "Nur ein Teil der Länder hat eine ganze Pfingstferienwoche; andere geben lediglich einzelne bewegliche Tage rund um Pfingstmontag frei. Details über die Länderauswahl.",
    ],
    planTitle: "Pfingstferien und Feiertage",
    plan: [
      "Pfingstmontag ist bundesweit ein gesetzlicher Feiertag. In Kombination mit Brückentagen ergibt sich rund um Pfingsten oft eine attraktive Urlaubsbrücke.",
    ],
    faq: [
      { q: "Haben alle Bundesländer Pfingstferien?", a: "Nein. Einige Länder – etwa Bayern und Baden-Württemberg – haben eine volle Pfingstferienwoche, andere vergeben nur einzelne bewegliche Ferientage oder haben gar keine Pfingstferien." },
      { q: "Ist Pfingstmontag ein Feiertag?", a: "Ja, Pfingstmontag ist in allen 16 Bundesländern ein gesetzlicher Feiertag." },
    ],
  },
  sommerferien: {
    intro:
      "Die Sommerferien sind mit rund sechs Wochen die längsten Ferien des Schuljahres. Ihr Beginn ist über die Bundesländer gestaffelt, um den Reiseverkehr zu entzerren.",
    whenTitle: "Wann beginnen die Sommerferien?",
    when: [
      "Der Beginn der Sommerferien ist bundesweit gestaffelt und liegt je nach Bundesland zwischen Mitte Juni und Ende Juli. Die Kultusministerkonferenz (KMK) legt ein rollierendes System fest, damit nicht alle Familien gleichzeitig in den Urlaub starten.",
      "Die Dauer beträgt in allen Ländern rund sechs Wochen. Den genauen Start Ihres Bundeslandes finden Sie über die Auswahl oben.",
    ],
    planTitle: "Sommerferien planen",
    plan: [
      "Weil der Ferienstart gestaffelt ist, lohnt sich beim Reisen der Blick auf die Nachbarländer: Wer früh oder spät in der Staffelung liegt, reist oft günstiger und staufreier. Der Urlaubsplaner hilft, Urlaubstage optimal auf die Ferien zu legen.",
    ],
    faq: [
      { q: "Warum beginnen die Sommerferien in jedem Bundesland anders?", a: "Die KMK staffelt die Sommerferien bewusst über mehrere Wochen, um Reiseverkehr und Auslastung von Urlaubsregionen zu entzerren. Deshalb starten die Länder zu unterschiedlichen Terminen." },
      { q: "Wie lange dauern die Sommerferien?", a: "In allen Bundesländern dauern die Sommerferien etwa sechs Wochen. Nur der Beginn verschiebt sich je nach Land." },
      { q: "Welche Bundesländer haben zuerst Sommerferien?", a: "Das wechselt jährlich durch das rollierende KMK-System. Traditionell starten oft nördliche und östliche Länder früher, Bayern und Baden-Württemberg meist zuletzt." },
    ],
  },
  herbstferien: {
    intro:
      "Die Herbstferien liegen im Oktober und dauern je nach Bundesland ein bis zwei Wochen – oft rund um den Reformationstag oder Allerheiligen.",
    whenTitle: "Wann sind die Herbstferien?",
    when: [
      "Die Herbstferien fallen meist in den Oktober, in einzelnen Ländern bis Anfang November. Ihre Länge reicht von einer bis zu zwei Wochen, teils ergänzt um einzelne bewegliche Ferientage rund um Reformationstag (31. Oktober) oder Allerheiligen (1. November).",
      "Die genauen Termine legt jedes Land selbst fest – die Auswahl Ihres Bundeslandes zeigt die exakten Tage.",
    ],
    planTitle: "Herbstferien und Feiertage",
    plan: [
      "Reformationstag und Allerheiligen sind in mehreren Bundesländern gesetzliche Feiertage und liegen häufig günstig zu den Herbstferien. Mit Brückentagen lässt sich der freie Zeitraum verlängern.",
    ],
    faq: [
      { q: "Wie lange dauern die Herbstferien?", a: "Je nach Bundesland dauern die Herbstferien ein bis zwei Wochen. Einige Länder ergänzen sie um bewegliche Ferientage rund um Reformationstag und Allerheiligen." },
      { q: "Fallen die Herbstferien mit Feiertagen zusammen?", a: "Häufig ja: Reformationstag (31. Oktober) und Allerheiligen (1. November) liegen oft in oder direkt neben den Herbstferien – in mehreren Ländern sind sie gesetzliche Feiertage." },
    ],
  },
  weihnachtsferien: {
    intro:
      "Die Weihnachtsferien überbrücken den Jahreswechsel mit Weihnachten und Neujahr und dauern in der Regel etwa zwei Wochen.",
    whenTitle: "Wann sind die Weihnachtsferien?",
    when: [
      "Die Weihnachtsferien beginnen meist um den 22. bis 24. Dezember und enden Anfang Januar. Sie umfassen die gesetzlichen Feiertage 1. und 2. Weihnachtsfeiertag sowie Neujahr und dauern in fast allen Ländern rund zwei Wochen.",
      "Kleine Unterschiede beim Beginn und Ende ergeben sich je nach Bundesland und Lage der Wochenenden. Die genauen Tage finden Sie über die Länderauswahl.",
    ],
    planTitle: "Weihnachtsferien und Feiertage",
    plan: [
      "Erster und zweiter Weihnachtsfeiertag sowie Neujahr sind bundesweite gesetzliche Feiertage. Da sie in die Ferien fallen, entsteht zum Jahreswechsel ohnehin ein langer freier Block – mit wenigen Brückentagen lässt er sich weiter ausdehnen.",
    ],
    faq: [
      { q: "Sind die Weihnachtsfeiertage Teil der Weihnachtsferien?", a: "Ja. 1. und 2. Weihnachtsfeiertag (25./26. Dezember) sowie Neujahr (1. Januar) fallen in die Weihnachtsferien und sind zugleich bundesweite gesetzliche Feiertage." },
      { q: "Wie lange dauern die Weihnachtsferien?", a: "In fast allen Bundesländern dauern die Weihnachtsferien rund zwei Wochen – meist von kurz vor Heiligabend bis Anfang Januar." },
    ],
  },
};

/** "2026-06-29"/"2026-08-08" → "29.06.–08.08." (Einzeltag → "29.06."). */
function fmtRange(p: { start: string; end: string }): string {
  const [, sm, sd] = p.start.split("-");
  const [, em, ed] = p.end.split("-");
  const a = `${sd}.${sm}.`;
  const b = `${ed}.${em}.`;
  return a === b ? a : `${a}–${b}`;
}

function inclusiveDays(startISO: string, endISO: string): number {
  const a = new Date(startISO + "T00:00:00Z").getTime();
  const b = new Date(endISO + "T00:00:00Z").getTime();
  return Math.round((b - a) / 86400000) + 1;
}

/** Alle Phasen dieses Typs einer Landeszeile (mehrere möglich). */
function typPeriods(rec: SchulferienRecord | null, typ: FerienTyp) {
  return rec ? rec.periods.filter((p) => p.typ === typ) : [];
}

/** SEO-Jahresübersicht eines Ferientyps über alle 16 Bundesländer. */
export default function FerienTypYearView({ year, typ }: { year: number; typ: FerienTyp }) {
  const label = FERIEN_TYP_LABEL[typ];
  const copy = TYP_COPY[typ];

  return (
    <div className="flex-1">
      <PageWithSidebar>
        <Breadcrumbs
          items={[
            { name: "Start", url: "/" },
            { name: `Schulferien ${year}`, url: `/schulferien/${year}` },
            { name: `${label} ${year}`, url: `/${typ}/${year}` },
          ]}
        />
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">{label} {year} in Deutschland</h1>
        <p className="mt-2 max-w-2xl text-slate-600">{copy.intro} Wählen Sie Ihr Bundesland für die genauen Termine.</p>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-navy-50/40 p-4">
          <BundeslandSelect basePath={`/${typ}/${year}`} />
        </div>

        <section className="mt-6">
          <h2 className="mb-3 text-xl font-bold text-navy-800">{label} {year} nach Bundesland</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {BUNDESLAENDER.map((b) => {
              const has = typPeriods(getSchulferien(year, b.code), typ).length > 0;
              return (
                <Link key={b.code} href={`/${typ}/${year}/${b.slug}`} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-navy-700 hover:border-navy-300 hover:shadow-sm">
                  {b.name}
                  {!has && <span className="text-[10px] text-slate-400">—</span>}
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-3 text-xl font-bold text-navy-800">{label} {year} – alle Bundesländer im Überblick</h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[480px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-navy-50 text-navy-700">
                  <th scope="col" className="px-3 py-2 font-semibold">Bundesland</th>
                  <th scope="col" className="px-3 py-2 font-semibold">{label} {year}</th>
                  <th scope="col" className="whitespace-nowrap px-3 py-2 font-semibold">Dauer</th>
                </tr>
              </thead>
              <tbody>
                {BUNDESLAENDER.map((b) => {
                  const rec = getSchulferien(year, b.code);
                  const periods = typPeriods(rec, typ);
                  const days = periods.reduce((s, p) => s + inclusiveDays(p.start, p.end), 0);
                  return (
                    <tr key={b.code} className="border-t border-slate-100 odd:bg-white even:bg-slate-50/60">
                      <th scope="row" className="whitespace-nowrap px-3 py-2 text-left font-medium">
                        <Link href={`/${typ}/${year}/${b.slug}`} className="text-navy-700 hover:text-navy-900 hover:underline">
                          {b.name}
                        </Link>
                      </th>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-600">
                        {periods.length ? periods.map(fmtRange).join(" + ") : <span className="text-slate-400">keine</span>}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-600">
                        {days > 0 ? `${days} Tage` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Angaben in Kurzform (Tag.Monat), Dauer inkl. Wochenenden; „keine" = kein gesonderter Zeitraum dieser Art.
            Quelle: offizielle Ferienkalender der Kultusministerkonferenz (KMK). Angaben ohne Gewähr – vor verbindlicher
            Planung die amtliche Quelle prüfen. Genaue Termine mit Wochentag und ICS-Download je Land über die Ländernamen.
          </p>
        </section>

        <SeoProse
          blocks={[
            { h2: copy.whenTitle, p: copy.when },
            { h2: copy.planTitle, p: copy.plan },
          ]}
        />
        <Faq
          items={[
            ...copy.faq,
            { q: `Wo finde ich alle Schulferien ${year}?`, a: `Eine Gesamtübersicht aller Ferienarten für jedes Bundesland gibt es auf der Seite Schulferien ${year}. Dort sind Winter-, Oster-, Pfingst-, Sommer-, Herbst- und Weihnachtsferien zusammengefasst.` },
          ]}
        />

        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Weitere Ferien {year}</h2>
          <div className="flex flex-wrap gap-2">
            {(["osterferien", "sommerferien", "herbstferien", "weihnachtsferien"] as FerienTyp[])
              .filter((t) => t !== typ)
              .map((t) => (
                <Link key={t} href={`/${t}/${year}`} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:border-navy-300 hover:text-navy-600">
                  {FERIEN_TYP_LABEL[t]} {year}
                </Link>
              ))}
            <Link href={`/schulferien/${year}`} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:border-navy-300 hover:text-navy-600">
              Alle Schulferien {year}
            </Link>
          </div>
        </section>
      </PageWithSidebar>
    </div>
  );
}
