import PageWithSidebar from "@/components/de/PageWithSidebar";
import Breadcrumbs from "@/components/de/Breadcrumbs";
import type { Metadata } from "next";
import { berlinNow } from "@/lib/de/now";
import { MONTH_NAMES_DE } from "@/lib/de/locale";
import { getBauernregel, getDatierteBauernregeln, getAllgemeineBauernregeln } from "@/lib/de/bauernregeln";
import SeoProse from "@/components/de/SeoProse";
import Faq from "@/components/de/Faq";
import ModuleHero from "@/components/de/ModuleHero";
import { MODULE_HERO, heroSrc } from "@/lib/de/heroes";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Bauernregeln – Wetterregeln & Lostage im Kalender",
  description: "Die bekanntesten deutschen Bauernregeln und Lostage: von Siebenschläfer über die Eisheiligen bis Martini. Wetterregel des Tages und Sprüche für jeden Monat.",
  alternates: { canonical: "/bauernregeln" },
};

export default function BauernregelnPage() {
  const { month0, day } = berlinNow();
  const heute = getBauernregel(month0, day);
  const dated = getDatierteBauernregeln();
  const allgemein = getAllgemeineBauernregeln();

  const byMonth: Record<number, typeof dated> = {};
  for (const r of dated) (byMonth[r.month0] ??= []).push(r);

  const faq = [
    {
      q: "Was sind Bauernregeln?",
      a: "Bauernregeln sind überlieferte Merksprüche, die Wetter und Ernteverlauf mit bestimmten Kalendertagen (Lostagen) verknüpfen. Sie entstanden aus jahrhundertelanger Beobachtung und haben volkskundlichen Wert – einen wissenschaftlich-meteorologischen Anspruch erheben sie nicht.",
    },
    {
      q: "Was ist ein Lostag?",
      a: "Ein Lostag ist ein Kalendertag, dem nach alter Überlieferung eine besondere Bedeutung für Wetter oder Ernte zugeschrieben wird – etwa Siebenschläfer (27. Juni), die Eisheiligen (Mitte Mai) oder Martini (11. November).",
    },
    {
      q: "Stimmen Bauernregeln?",
      a: "Manche Regeln treffen statistisch erstaunlich oft zu, weil sie stabile Großwetterlagen beschreiben (z. B. die Siebenschläfer-Regel). Als verlässliche Wettervorhersage taugen sie jedoch nicht – sie sind Kulturgut, keine Wissenschaft.",
    },
  ];

  return (
    <main className="flex-1">
      <PageWithSidebar>
        <Breadcrumbs
          items={[
            { name: "Start", url: "/" },
            { name: "Bauernregeln", url: "/bauernregeln" },
          ]}
        />

        <ModuleHero src={heroSrc(MODULE_HERO, "bauernregeln")} alt="Bauernregeln und Lostage" motif="erntedank" uid="hero-bauern" className="mb-5 h-36 w-full sm:h-44" priority />

        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Bauernregeln & Lostage</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Überlieferte Wetter- und Bauernregeln aus dem deutschen Kalenderbrauchtum – die bekanntesten Lostage
          von den Eisheiligen über Siebenschläfer bis Martini, dazu allgemeine Wettersprüche.
        </p>

        <div className="mt-5 rounded-2xl border border-brand-green-100 bg-brand-green-50/50 p-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-brand-green-700">🌾 Bauernregel des Tages</div>
          <div className="mt-1 text-lg font-bold italic text-navy-800">„{heute}“</div>
          <div className="text-sm text-slate-600">{day}. {MONTH_NAMES_DE[month0]}</div>
        </div>

        <section className="mt-8">
          <h2 className="mb-3 text-xl font-bold text-navy-800">Lostage im Jahresverlauf</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {MONTH_NAMES_DE.map((mn, m0) =>
              (byMonth[m0]?.length ?? 0) > 0 ? (
                <div key={m0} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <div className="bg-navy-50/60 px-4 py-2 text-sm font-bold text-navy-800">{mn}</div>
                  <ul className="divide-y divide-slate-100 text-sm">
                    {byMonth[m0].map((r) => (
                      <li key={r.mmdd} className="flex gap-3 px-4 py-2">
                        <span className="w-8 shrink-0 text-right font-medium text-slate-500">{r.day}.</span>
                        <span className="italic text-slate-700">„{r.text}“</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null,
            )}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-3 text-xl font-bold text-navy-800">Allgemeine Wetterregeln</h2>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <ul className="grid gap-2 sm:grid-cols-2">
              {allgemein.map((r) => (
                <li key={r} className="text-sm italic text-slate-700">„{r}“</li>
              ))}
            </ul>
          </div>
        </section>

        <SeoProse
          blocks={[
            {
              h2: "Bauernregeln – Kulturgut aus dem Kalender",
              p: [
                "Bauernregeln gehören zum immateriellen Kulturerbe des ländlichen Deutschlands. Über Generationen dienten sie Bauern als Gedächtnisstütze für Aussaat, Ernte und Wetter, lange bevor es Wetterdienste gab. Viele sind an Namens- und Heiligentage geknüpft, die zugleich als „Lostage“ galten.",
                "Bekannte Beispiele sind die Eisheiligen Mitte Mai (Mamertus, Pankratius, Servatius, Bonifatius, kalte Sophie), der Siebenschläfer am 27. Juni und Martini am 11. November. Die Regeln spiegeln Beobachtung und Erfahrung wider – als Wettervorhersage im heutigen Sinn sind sie nicht gedacht.",
              ],
            },
          ]}
        />
        <Faq items={faq} />
      </PageWithSidebar>
    </main>
  );
}
