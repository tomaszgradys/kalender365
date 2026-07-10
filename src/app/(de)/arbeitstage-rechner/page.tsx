import PageWithSidebar from "@/components/de/PageWithSidebar";
import type { Metadata } from "next";
import Link from "next/link";
import { ArbeitstageRechner } from "@/components/de/Rechner";
import SeoProse from "@/components/de/SeoProse";
import Faq from "@/components/de/Faq";
import RelatedLinks from "@/components/de/RelatedLinks";
import { berlinNow } from "@/lib/de/now";

export const metadata: Metadata = {
  title: "Arbeitstage-Rechner – Arbeitstage im Zeitraum berechnen",
  description: "Berechnen Sie die Anzahl der Arbeitstage zwischen zwei Daten je nach Bundesland (5-Tage-Woche, ohne gesetzliche Feiertage).",
  alternates: { canonical: "/arbeitstage-rechner" },
};

export default function ArbeitstageRechnerPage() {
  const y = berlinNow().year;
  return (
    <div className="flex-1">
      <PageWithSidebar>
        <nav className="mb-4 text-sm text-slate-500"><Link href="/generatoren" className="hover:text-navy-600">Tools</Link> <span className="mx-1">/</span> <span className="text-navy-700">Arbeitstage-Rechner</span></nav>
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Arbeitstage-Rechner</h1>
        <p className="mt-2 text-slate-600">Arbeitstage zwischen zwei Daten – abhängig vom Bundesland und seinen gesetzlichen Feiertagen.</p>
        <div className="mt-6"><ArbeitstageRechner /></div>

        <RelatedLinks
          items={[
            { href: `/brueckentage/${y}`, emoji: "🌉", label: `Brückentage ${y}`, desc: "Aus Urlaubstagen lange Wochenenden machen" },
            { href: `/feiertage/${y}`, emoji: "🎉", label: `Feiertage ${y}`, desc: "Gesetzliche Feiertage nach Bundesland" },
            { href: `/urlaubsplaner/${y}`, emoji: "🏖️", label: `Urlaubsplaner ${y}`, desc: "Urlaub clever über das Jahr legen" },
            { href: "/tage-rechner", emoji: "➗", label: "Tage-Rechner", desc: "Alle Tage zwischen zwei Daten" },
          ]}
        />

        <SeoProse
          blocks={[
            {
              h2: "Wie werden Arbeitstage berechnet?",
              p: [
                "Der Arbeitstage-Rechner zählt alle Tage von Montag bis Freitag im gewählten Zeitraum und zieht die gesetzlichen Feiertage ab, die auf einen Werktag fallen. Da Feiertage in Deutschland Ländersache sind, wählen Sie das Bundesland aus – so werden regionale Feiertage wie Fronleichnam, der Reformationstag oder Allerheiligen korrekt berücksichtigt. Das Ergebnis entspricht der klassischen 5-Tage-Woche.",
                "Arbeitstage sind wichtig für die Berechnung von Urlaubsanspruch, Lohnfortzahlung, Projektlaufzeiten oder Lieferfristen. Wer stattdessen die Werktage benötigt, muss den Samstag hinzurechnen – dazu unten mehr.",
              ],
            },
            {
              h2: "Arbeitstage, Werktage und Wochenende",
              p: [
                "Arbeitstage sind in der Regel Montag bis Freitag. Werktage umfassen dagegen Montag bis Samstag – der Samstag gilt rechtlich als Werktag, auch wenn viele Menschen an ihm nicht arbeiten. Sonntage und gesetzliche Feiertage zählen weder zu den Arbeitstagen noch zu den Werktagen. Für die genaue Feiertagsliste eines Jahres hilft die Feiertage-Übersicht des jeweiligen Bundeslandes.",
              ],
            },
          ]}
        />
        <Faq
          items={[
            { q: "Was ist der Unterschied zwischen Arbeitstagen und Werktagen?", a: "Arbeitstage sind meist Montag bis Freitag. Werktage umfassen Montag bis Samstag – der Samstag ist rechtlich ein Werktag. Sonn- und Feiertage zählen bei beiden nicht." },
            { q: "Werden Feiertage bei den Arbeitstagen abgezogen?", a: "Ja. Gesetzliche Feiertage, die auf einen Werktag fallen, werden abgezogen. Weil Feiertage je nach Bundesland verschieden sind, sollten Sie das richtige Bundesland auswählen." },
            { q: "Zählt der Samstag als Arbeitstag?", a: "In der üblichen 5-Tage-Woche nicht. Der Samstag ist aber ein Werktag – relevant etwa bei gesetzlichen Fristen, die in Werktagen angegeben sind." },
            { q: "Wozu brauche ich die Arbeitstage?", a: "Etwa für Urlaubsberechnung, Gehaltsabrechnung, Projekt- und Lieferfristen oder die Planung von Home-Office- und Präsenztagen." },
          ]}
        />
      </PageWithSidebar>
    </div>
  );
}
