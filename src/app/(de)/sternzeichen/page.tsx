import PageWithSidebar from "@/components/de/PageWithSidebar";
import Breadcrumbs from "@/components/de/Breadcrumbs";
import Link from "next/link";
import type { Metadata } from "next";
import { berlinNow } from "@/lib/de/now";
import { MONTH_NAMES_DE } from "@/lib/de/locale";
import { STERNZEICHEN, sternzeichenByDate, ELEMENT_COLOR } from "@/lib/de/sternzeichen";
import SeoProse from "@/components/de/SeoProse";
import Faq from "@/components/de/Faq";
import ModuleHero from "@/components/de/ModuleHero";
import { MODULE_HERO, heroSrc } from "@/lib/de/heroes";
import { ogMeta } from "@/lib/de/ogMeta";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Sternzeichen – Daten, Zeiträume & Bedeutung der Tierkreiszeichen",
  description: "Alle 12 Sternzeichen mit Datum, Zeitraum, Element und Eigenschaften. Welches Sternzeichen habe ich? Übersicht der Tierkreiszeichen von Widder bis Fische.",
  alternates: { canonical: "/sternzeichen" },
  openGraph: ogMeta("/sternzeichen"),
};

export default function SternzeichenPage() {
  const { month0, day } = berlinNow();
  const heute = sternzeichenByDate(month0, day);

  const faq = [
    {
      q: "Welches Sternzeichen habe ich?",
      a: "Ihr Sternzeichen richtet sich nach Ihrem Geburtsdatum. Wer z. B. zwischen dem 21. März und 20. April geboren ist, ist Widder. Die genauen Zeiträume finden Sie in der Übersicht oben.",
    },
    {
      q: "Was bedeuten die vier Elemente?",
      a: "Die zwölf Tierkreiszeichen werden vier Elementen zugeordnet: Feuer (Widder, Löwe, Schütze), Erde (Stier, Jungfrau, Steinbock), Luft (Zwillinge, Waage, Wassermann) und Wasser (Krebs, Skorpion, Fische).",
    },
    {
      q: "Sind die Sternzeichen-Daten jedes Jahr gleich?",
      a: "Die Übergänge können sich um einen Tag verschieben, weil das Tierkreisjahr nicht exakt mit dem Kalenderjahr übereinstimmt. Die hier angegebenen Zeiträume folgen der üblichen Kalender-Konvention.",
    },
  ];

  return (
    <div className="flex-1">
      <PageWithSidebar>
        <Breadcrumbs
          items={[
            { name: "Start", url: "/" },
            { name: "Sternzeichen", url: "/sternzeichen" },
          ]}
        />

        <ModuleHero src={heroSrc(MODULE_HERO, "sternzeichen")} alt="Sternzeichen im Überblick" motif="sterne" uid="hero-sternzeichen" className="mb-5 h-36 w-full sm:h-44" priority />

        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Sternzeichen im Überblick</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Die zwölf Tierkreiszeichen mit Datum, Zeitraum, Element und typischen Eigenschaften. Finden Sie heraus,
          welches Sternzeichen zu einem Geburtsdatum gehört.
        </p>

        <div className="mt-5 flex items-center gap-4 rounded-2xl border border-slate-200 bg-navy-50/40 p-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-4xl text-white" style={{ backgroundColor: ELEMENT_COLOR[heute.element] }}>
            {heute.symbol}
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Aktuelles Sternzeichen ({day}. {MONTH_NAMES_DE[month0]})</div>
            <Link href={`/sternzeichen/${heute.slug}`} className="text-lg font-bold text-navy-800 hover:text-navy-600">{heute.name}</Link>
            <div className="text-sm text-slate-600">{heute.zeitraum} · Element {heute.element}</div>
          </div>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STERNZEICHEN.map((z) => (
            <Link key={z.slug} href={`/sternzeichen/${z.slug}`} className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-md">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl text-3xl text-white" style={{ backgroundColor: ELEMENT_COLOR[z.element] }}>
                {z.symbol}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-navy-800">{z.name}</div>
                <div className="text-xs text-slate-500">{z.zeitraum}</div>
                <div className="text-xs text-slate-400">Element {z.element}</div>
              </div>
            </Link>
          ))}
        </section>

        <SeoProse
          blocks={[
            {
              h2: "Die zwölf Tierkreiszeichen",
              p: [
                "Der Tierkreis (Zodiak) teilt den scheinbaren Jahreslauf der Sonne in zwölf Abschnitte von je etwa 30 Grad. Jedem Abschnitt ist ein Sternzeichen zugeordnet – von Widder zu Frühlingsbeginn bis Fische am Ende des Winters.",
                "Sternzeichen sind fester Bestandteil vieler Kalender und Tageszeitungen. Diese Übersicht ordnet jedem Geburtsdatum das passende Zeichen zu und beschreibt Element, Planet und die traditionell zugeschriebenen Eigenschaften – als kalendarische Einordnung, nicht als Vorhersage.",
              ],
            },
          ]}
        />
        <Faq items={faq} />
      </PageWithSidebar>
    </div>
  );
}
