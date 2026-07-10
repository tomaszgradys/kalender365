import PageWithSidebar from "@/components/de/PageWithSidebar";
import type { Metadata } from "next";
import Link from "next/link";
import { WochentagRechner } from "@/components/de/Rechner";
import SeoProse from "@/components/de/SeoProse";
import Faq from "@/components/de/Faq";
import RelatedLinks from "@/components/de/RelatedLinks";
import { berlinNow } from "@/lib/de/now";

export const metadata: Metadata = {
  title: "Wochentag-Rechner – an welchem Wochentag liegt ein Datum?",
  description: "Finden Sie heraus, auf welchen Wochentag ein beliebiges Datum fällt – für Geburtstage, Termine und Jubiläen.",
  alternates: { canonical: "/wochentag-rechner" },
};

export default function WochentagRechnerPage() {
  const y = berlinNow().year;
  return (
    <main className="flex-1">
      <PageWithSidebar>
        <nav className="mb-4 text-sm text-slate-500"><Link href="/generatoren" className="hover:text-navy-600">Tools</Link> <span className="mx-1">/</span> <span className="text-navy-700">Wochentag-Rechner</span></nav>
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Wochentag-Rechner</h1>
        <p className="mt-2 text-slate-600">Auf welchen Wochentag fällt ein Datum? Datum eingeben und sofort sehen.</p>
        <div className="mt-6"><WochentagRechner /></div>

        <RelatedLinks
          items={[
            { href: "/altersrechner", emoji: "🎂", label: "Altersrechner", desc: "Alter genau in Jahren, Monaten, Tagen" },
            { href: `/kalenderwochen/${y}`, emoji: "🔢", label: `Kalenderwochen ${y}`, desc: "Alle KW nach ISO 8601" },
            { href: `/feiertage/${y}`, emoji: "🎉", label: `Feiertage ${y}`, desc: "Wochentag jedes Feiertags" },
            { href: "/tage-rechner", emoji: "➗", label: "Tage-Rechner", desc: "Tage zwischen zwei Daten" },
          ]}
        />

        <SeoProse
          blocks={[
            {
              h2: "Auf welchen Wochentag fällt ein Datum?",
              p: [
                "Der Wochentag-Rechner zeigt Ihnen, an welchem Wochentag ein beliebiges Datum liegt – vergangen oder zukünftig. Das ist nützlich, um herauszufinden, an welchem Tag Sie geboren wurden, auf welchen Wochentag ein Jubiläum oder ein Feiertag fällt oder wann sich eine Terminplanung am besten anbietet. Der Rechner arbeitet mit dem gregorianischen Kalender und berücksichtigt Schaltjahre automatisch.",
                "In Deutschland beginnt die Woche nach ISO 8601 am Montag. Der Rechner nennt den Wochentag im Klartext (z. B. Dienstag) und ordnet das Datum bei Bedarf der passenden Kalenderwoche zu.",
              ],
            },
          ]}
        />
        <Faq
          items={[
            { q: "An welchem Wochentag wurde ich geboren?", a: "Geben Sie Ihr Geburtsdatum oben ein – der Rechner zeigt sofort den Wochentag, an dem Sie geboren wurden." },
            { q: "Beginnt die Woche am Montag oder Sonntag?", a: "In Deutschland und nach ISO 8601 beginnt die Woche am Montag. In manchen Ländern (etwa den USA) gilt der Sonntag als erster Wochentag." },
            { q: "Funktioniert der Rechner auch für weit zurückliegende Daten?", a: "Ja, für alle Daten des gregorianischen Kalenders. Schaltjahre werden korrekt berücksichtigt." },
            { q: "Auf welchen Wochentag fällt ein bestimmter Feiertag?", a: "Geben Sie das Datum des Feiertags ein. Eine Jahresübersicht mit allen Feiertagen und ihren Wochentagen finden Sie zusätzlich auf der Feiertage-Seite." },
          ]}
        />
      </PageWithSidebar>
    </main>
  );
}
