import Link from "next/link";
import { getMoonPhaseInstants, type PhaseType } from "@/lib/de/moonPhases";
import { formatLongDE, weekdayDE } from "@/lib/de/locale";
import PageWithSidebar from "@/components/de/PageWithSidebar";
import SeoProse, { type ProseBlock } from "@/components/de/SeoProse";
import Faq from "@/components/de/Faq";
import type { QA } from "@/lib/de/jsonLd";

const MONTH_DE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

function moonSeo(year: number, only: PhaseType | undefined, all: ReturnType<typeof getMoonPhaseInstants>) {
  const vollmonde = all.filter((p) => p.type === "full");
  const neumonde = all.filter((p) => p.type === "new");
  const blueMoon = all.find((p) => p.blueMoon);
  const blueMonthName = blueMoon ? MONTH_DE[new Date(blueMoon.date + "T00:00:00Z").getUTCMonth()] : null;

  if (only === "full") {
    const blocks: ProseBlock[] = [
      {
        h2: `Vollmond ${year} – Termine und Uhrzeiten`,
        p: [
          `${year} gibt es ${vollmonde.length} Vollmonde in Deutschland. Vollmond ist der Moment, in dem Sonne, Erde und Mond nahezu auf einer Linie stehen und uns die komplette beleuchtete Mondscheibe zugewandt ist. Weil dieser Zeitpunkt astronomisch exakt definiert ist, geben wir für jeden Vollmond ${year} die genaue Uhrzeit in mitteleuropäischer Zeit (Europe/Berlin) an – inklusive automatischer Umstellung auf Sommerzeit.`,
          `Zwischen zwei Vollmonden liegen rund 29,5 Tage (ein synodischer Monat). Deshalb wandert der Vollmond jedes Jahr durch die Monate und kann in seltenen Fällen zweimal im selben Kalendermonat auftreten.`,
        ],
      },
      {
        h2: "Blue Moon: zweiter Vollmond im Monat",
        p: [
          blueMoon
            ? `${year} gibt es einen Blue Moon: Im ${blueMonthName} fällt ein zweiter Vollmond in denselben Kalendermonat. Mit „Blue Moon“ ist keine Farbe gemeint – der Mond erscheint völlig normal. Der Begriff steht schlicht für diesen selteneren zweiten Vollmond, der nur etwa alle zwei bis drei Jahre vorkommt.`
            : `${year} gibt es keinen Blue Moon – in keinem Kalendermonat fallen zwei Vollmonde zusammen. Ein Blue Moon (zweiter Vollmond im selben Monat) tritt nur etwa alle zwei bis drei Jahre auf; in unserer Tabelle ist er, sobald er vorkommt, eigens gekennzeichnet.`,
        ],
      },
      {
        h2: "Warum die Uhrzeit wichtig ist",
        p: [
          `Viele Kalender nennen nur das Datum des Vollmonds. Fällt der exakte Zeitpunkt jedoch kurz nach Mitternacht, verschiebt sich der volle Mond gefühlt auf den Vortag oder Folgetag. Unsere Termine sind nach dem Algorithmus von Jean Meeus berechnet (Genauigkeit rund eine Minute) und in Ortszeit angegeben – so sehen Sie sofort, an welchem Abend der Mond wirklich am rundesten steht.`,
        ],
      },
    ];
    const faq: QA[] = [
      { q: `Wie viele Vollmonde gibt es ${year}?`, a: `${year} gibt es ${vollmonde.length} Vollmonde. In den meisten Jahren sind es zwölf, gelegentlich dreizehn.` },
      { q: `Wann ist der erste Vollmond ${year}?`, a: vollmonde.length ? `Der erste Vollmond ${year} ist am ${formatLongDE(vollmonde[0].date)} um ${vollmonde[0].time} Uhr (${weekdayDE(vollmonde[0].date)}).` : `Für ${year} liegen keine Daten vor.` },
      { q: "Was ist ein Blue Moon?", a: "Ein Blue Moon ist der zweite Vollmond innerhalb eines Kalendermonats. Der Mond ist dabei nicht blau – der Name beschreibt nur die Seltenheit dieses Ereignisses." },
      { q: "In welcher Zeitzone sind die Uhrzeiten angegeben?", a: "Alle Uhrzeiten gelten für Deutschland (Europe/Berlin) und berücksichtigen automatisch Winter- und Sommerzeit." },
    ];
    return { blocks, faq };
  }

  if (only === "new") {
    const blocks: ProseBlock[] = [
      {
        h2: `Neumond ${year} – Termine und Uhrzeiten`,
        p: [
          `${year} gibt es ${neumonde.length} Neumonde. Bei Neumond steht der Mond zwischen Erde und Sonne; seine beleuchtete Seite zeigt von uns weg, sodass er am Himmel praktisch unsichtbar ist. Wenige Tage später wird die schmale Sichel des zunehmenden Mondes wieder sichtbar. Für jeden Neumond ${year} finden Sie hier die genaue Uhrzeit in mitteleuropäischer Zeit (Europe/Berlin).`,
        ],
      },
      {
        h2: "Neumond im Garten und im Alltag",
        p: [
          `Der Neumond markiert den Beginn eines neuen Mondzyklus und wird traditionell mit Neuanfängen verbunden – etwa für das Setzen von Vorsätzen, Fastentage oder Gartenarbeiten nach dem Mondkalender. Auch für die Sternbeobachtung ist die Neumondnacht ideal, weil kein Mondlicht den dunklen Himmel aufhellt.`,
        ],
      },
      {
        h2: "Neumond, Vollmond und die Mondphasen",
        p: [
          `Zwischen zwei Neumonden liegen etwa 29,5 Tage. In dieser Zeit durchläuft der Mond alle Phasen: vom Neumond über das zunehmende Erste Viertel zum Vollmond und über das abnehmende Letzte Viertel zurück zum Neumond. Eine vollständige Übersicht aller vier Phasen finden Sie auf der Seite Mondphasen.`,
        ],
      },
    ];
    const faq: QA[] = [
      { q: `Wie viele Neumonde gibt es ${year}?`, a: `${year} gibt es ${neumonde.length} Neumonde.` },
      { q: `Wann ist der nächste Neumond ${year}?`, a: neumonde.length ? `Der erste Neumond ${year} ist am ${formatLongDE(neumonde[0].date)} um ${neumonde[0].time} Uhr.` : `Für ${year} liegen keine Daten vor.` },
      { q: "Warum sieht man den Neumond nicht?", a: "Bei Neumond ist die der Erde zugewandte Seite des Mondes unbeleuchtet. Erst ein bis zwei Tage später wird die schmale zunehmende Sichel am Abendhimmel sichtbar." },
      { q: "Ist Neumond gut zum Sternebeobachten?", a: "Ja. In der Neumondnacht stört kein Mondlicht, deshalb sind lichtschwache Sterne, Galaxien und die Milchstraße dann am besten zu sehen." },
    ];
    return { blocks, faq };
  }

  // all phases
  const blocks: ProseBlock[] = [
    {
      h2: "Die vier Mondphasen im Überblick",
      p: [
        `Der Mond durchläuft in rund 29,5 Tagen (einem synodischen Monat) vier Hauptphasen: Bei Neumond steht er zwischen Erde und Sonne und ist unsichtbar. Beim Ersten Viertel (zunehmender Halbmond) ist die rechte Hälfte beleuchtet. Beim Vollmond ist die gesamte zugewandte Seite hell. Beim Letzten Viertel (abnehmender Halbmond) leuchtet die linke Hälfte, bevor der Mond zum nächsten Neumond zurückkehrt.`,
        `${year} listen wir jede dieser Phasen mit Datum, exakter Uhrzeit (Europe/Berlin) und dem Sternzeichen, in dem der Mond steht. Insgesamt gibt es ${year} ${vollmonde.length} Vollmonde und ${neumonde.length} Neumonde.`,
      ],
    },
    {
      h2: "Zunehmender und abnehmender Mond",
      p: [
        `Zwischen Neumond und Vollmond nimmt der Mond zu – die beleuchtete Fläche wächst von rechts. Zwischen Vollmond und Neumond nimmt er ab. Eine einfache Merkregel für die Nordhalbkugel: Bildet die Sichel ein „a“ (Bogen nach links offen), ist der Mond abnehmend; ähnelt sie einem „z“ bzw. dem Bauch eines „D“, ist er zunehmend.`,
      ],
    },
    {
      h2: "Wie genau sind die Termine?",
      p: [
        `Alle Zeitpunkte sind nach dem astronomischen Algorithmus von Jean Meeus berechnet und auf etwa eine Minute genau. Die Uhrzeiten gelten für Deutschland und stellen automatisch zwischen Winter- und Sommerzeit um, sodass Sie den Mondkalender ${year} ohne Umrechnen nutzen können.`,
      ],
    },
  ];
  const faq: QA[] = [
    { q: `Wie viele Vollmonde und Neumonde gibt es ${year}?`, a: `${year} gibt es ${vollmonde.length} Vollmonde und ${neumonde.length} Neumonde.` },
    { q: "Welche vier Mondphasen gibt es?", a: "Neumond, zunehmender Halbmond (Erstes Viertel), Vollmond und abnehmender Halbmond (Letztes Viertel). Ein vollständiger Zyklus dauert rund 29,5 Tage." },
    { q: "Woran erkenne ich, ob der Mond zu- oder abnimmt?", a: "Auf der Nordhalbkugel gilt: Ist die rechte Seite beleuchtet, nimmt der Mond zu; ist die linke Seite beleuchtet, nimmt er ab." },
    { q: "In welcher Zeitzone gelten die Uhrzeiten?", a: "Alle Uhrzeiten gelten für Deutschland (Europe/Berlin) inklusive automatischer Sommerzeit-Umstellung." },
    ...(blueMoon ? [{ q: `Gibt es ${year} einen Blue Moon?`, a: `Ja, ${year} fällt im ${blueMonthName} ein zweiter Vollmond in denselben Kalendermonat – ein sogenannter Blue Moon.` }] : []),
  ];
  return { blocks, faq };
}

export default function MoonPhasesView({
  year,
  only,
  title,
  intro,
}: {
  year: number;
  only?: PhaseType;
  title: string;
  intro: string;
}) {
  const all = getMoonPhaseInstants(year);
  const phases = only ? all.filter((p) => p.type === only) : all;
  const { blocks, faq } = moonSeo(year, only, all);

  return (
    <PageWithSidebar>
      <nav className="mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span>
        <span className="text-navy-700">{title}</span>
      </nav>
      <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-slate-600">{intro}</p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Phase</th>
              <th className="px-4 py-2 font-medium">Datum</th>
              <th className="px-4 py-2 font-medium">Uhrzeit</th>
              <th className="px-4 py-2 font-medium">Sternzeichen</th>
            </tr>
          </thead>
          <tbody>
            {phases.map((p, i) => (
              <tr key={i} className="border-t border-slate-100">
                <td className="px-4 py-2 font-medium text-navy-800">
                  <span className="mr-1">{p.icon}</span>{p.label}
                  {p.blueMoon && <span className="ml-2 rounded-full bg-brand-green-100 px-2 py-0.5 text-[10px] font-bold text-brand-green-700">Blue Moon</span>}
                </td>
                <td className="px-4 py-2 text-slate-600 whitespace-nowrap">{formatLongDE(p.date)} ({weekdayDE(p.date)})</td>
                <td className="px-4 py-2 text-slate-600">{p.time} Uhr</td>
                <td className="px-4 py-2 text-slate-600">{p.zodiacSymbol} {p.zodiacSign}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-slate-400">Alle Uhrzeiten in mitteleuropäischer Zeit (Europe/Berlin), inkl. Sommerzeit. Berechnung nach Meeus.</p>

      <div className="mt-6 flex flex-wrap gap-2 text-sm">
        <Link href={`/mondphasen/${year}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Alle Mondphasen</Link>
        <Link href={`/vollmond/${year}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Vollmond</Link>
        <Link href={`/neumond/${year}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Neumond</Link>
        <Link href={`/mondphasen/${year - 1}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">← {year - 1}</Link>
        <Link href={`/mondphasen/${year + 1}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">{year + 1} →</Link>
      </div>

      <SeoProse blocks={blocks} />
      <Faq items={faq} />
    </PageWithSidebar>
  );
}
