import PageWithSidebar from "@/components/de/PageWithSidebar";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NAV_YEARS, parseYear, yearRobots, isNavigableYear } from "@/lib/de/year";
import { SITE_URL } from "@/lib/de/site";
import UrlaubsplanerClient from "@/components/de/UrlaubsplanerClient";

export function generateStaticParams() {
  return NAV_YEARS.map((y) => ({ year: String(y) }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) return {};
  return {
    title: `Urlaubsplaner ${y} – Brückentage & lange Wochenenden optimal planen`,
    description: `Urlaubsplaner ${y}: Urlaubstage und Bundesland eingeben, und der Planer zeigt die besten Brückentage für maximal viele freie Tage. Familienmodus mit Schulferien, Tage selbst anpassen, als PDF drucken.`,
    alternates: { canonical: `/urlaubsplaner/${y}` },
    ...yearRobots(y),
  };
}

export default async function UrlaubsplanerPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) notFound();

  const prev = y - 1;
  const next = y + 1;

  const faq = [
    {
      q: `Wie plane ich meinen Urlaub ${y}, um möglichst viele freie Tage zu haben?`,
      a: `Geben Sie Ihre Zahl an Urlaubstagen ein, und der Planer schlägt automatisch die besten „Brückentage“ vor — also einzelne Arbeitstage zwischen Feiertagen und Wochenenden, deren Nutzung den längsten zusammenhängenden Urlaub ergibt. Oft ergeben schon wenige gut gewählte Urlaubstage bis zu 9 freie Tage am Stück.`,
    },
    {
      q: "Was ist ein Brückentag?",
      a: "Ein Brückentag ist ein Arbeitstag, der zwischen einem Feiertag und dem Wochenende liegt. Nehmen Sie diesen Tag als Urlaub, verbinden Sie Feiertag und Wochenende zu einem langen freien Block — maximaler Effekt bei minimalem Urlaubseinsatz.",
    },
    {
      q: "Warum unterscheiden sich die Vorschläge je nach Bundesland?",
      a: "Feiertage sind in Deutschland Ländersache: Tage wie Fronleichnam, Reformationstag oder Allerheiligen gelten nur in bestimmten Bundesländern. Der Planer berücksichtigt genau die gesetzlichen Feiertage Ihres gewählten Bundeslandes — deshalb ändern sich die besten Brückentage mit dem Bundesland.",
    },
    {
      q: "Was macht der Familienmodus?",
      a: "Der Familienmodus (Familienjahr) berücksichtigt zusätzlich die Schulferien Ihres Bundeslandes und bevorzugt Urlaub in diesen Zeiträumen — damit Eltern frei haben, wenn die Kinder schulfrei haben. Die volle Optimierung sucht dagegen einfach die größtmögliche Zahl freier Tage.",
    },
    {
      q: "Kann ich die vorgeschlagenen Tage selbst anpassen?",
      a: "Ja. Klicken Sie einen beliebigen Arbeitstag im Kalender an, um ihn als Urlaub hinzuzufügen oder zu entfernen. Die Statistik (freie Tage, verbrauchte Urlaubstage, Effizienz) aktualisiert sich sofort. Mit „Plan vorschlagen“ kehren Sie zur Empfehlung des Planers zurück.",
    },
    {
      q: "Kann ich den Urlaubsplan ausdrucken?",
      a: "Ja, klicken Sie auf „Drucken / PDF“, um den fertigen Plan als PDF zu speichern — zum Beispiel, um ihn im Betrieb einzureichen.",
    },
  ];

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  const appLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `Urlaubsplaner ${y}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: `${SITE_URL}/urlaubsplaner/${y}`,
    description: `Kostenloser Urlaubsplaner für ${y} — berechnet die besten Kombinationen freier Tage aus Feiertagen, Wochenenden und Brückentagen je Bundesland. Bearbeitbarer Kalender mit PDF-Druck.`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  };

  return (
    <main className="flex-1">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLd) }} />
      <PageWithSidebar>
        <nav className="mb-4 text-sm text-slate-500 no-print" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span>
          <span className="text-navy-700">Urlaubsplaner {y}</span>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-black tracking-tight text-navy-800 sm:text-3xl">Urlaubsplaner {y}</h1>
          <div className="flex items-center gap-2 text-sm no-print">
            {isNavigableYear(prev) && <Link href={`/urlaubsplaner/${prev}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-600 hover:border-navy-300 hover:text-navy-600">← {prev}</Link>}
            {isNavigableYear(next) && <Link href={`/urlaubsplaner/${next}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-600 hover:border-navy-300 hover:text-navy-600">{next} →</Link>}
          </div>
        </div>

        <p className="mt-2 max-w-3xl text-slate-600 no-print">
          Geben Sie an, wie viele Urlaubstage Sie {y} haben, und der Planer berechnet die besten Kombinationen —
          er verbindet Feiertage, Wochenenden und Brückentage so, dass Sie möglichst viele freie Tage gewinnen.
          Wählen Sie Ihr Bundesland, passen Sie einzelne Tage selbst an und drucken Sie den fertigen Plan als PDF.
        </p>

        <UrlaubsplanerClient year={y} />

        {/* SEO */}
        <section className="mt-10 space-y-3 text-slate-600 no-print">
          <h2 className="text-xl font-bold text-navy-800">Wie funktioniert der Urlaubsplaner?</h2>
          <p>
            Der Planer analysiert das ganze Jahr {y}: Er markiert Wochenenden und die{" "}
            <Link href={`/feiertage/${y}`} className="font-medium text-navy-600 hover:text-brand-green-600">gesetzlichen Feiertage</Link>{" "}
            Ihres Bundeslandes und sucht dann die kürzesten Ketten von Arbeitstagen dazwischen. Füllt man einen
            solchen „Brückentag“ mit Urlaub, entsteht der längstmögliche freie Block bei kleinstem Urlaubseinsatz —
            dasselbe Prinzip, mit dem Sie aus den{" "}
            <Link href={`/brueckentage/${y}`} className="font-medium text-navy-600 hover:text-brand-green-600">Brückentagen {y}</Link>{" "}
            das Maximum herausholen.
          </p>
          <p>
            Im Familienmodus berücksichtigt der Planer zusätzlich die{" "}
            <Link href={`/schulferien/${y}`} className="font-medium text-navy-600 hover:text-brand-green-600">Schulferien</Link>{" "}
            Ihres Bundeslandes — von den Winterferien bis zu den{" "}
            <Link href={`/sommerferien/${y}`} className="font-medium text-navy-600 hover:text-brand-green-600">Sommerferien {y}</Link> —,
            damit sich Ihr Urlaub mit den schulfreien Zeiten der Kinder deckt. Das gesamte Jahr im Überblick sehen
            Sie im{" "}
            <Link href={`/kalender/${y}`} className="font-medium text-navy-600 hover:text-brand-green-600">Kalender {y}</Link>.
          </p>
        </section>

        {/* FAQ */}
        <section className="mt-10 no-print">
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
      </PageWithSidebar>
    </main>
  );
}
