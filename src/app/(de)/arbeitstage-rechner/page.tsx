import PageWithSidebar from "@/components/de/PageWithSidebar";
import type { Metadata } from "next";
import Link from "next/link";
import { ArbeitstageRechner } from "@/components/de/Rechner";
import SeoProse from "@/components/de/SeoProse";
import Faq from "@/components/de/Faq";
import RelatedLinks from "@/components/de/RelatedLinks";
import { berlinNow } from "@/lib/de/now";
import { ogMeta } from "@/lib/de/ogMeta";

export const metadata: Metadata = {
  title: "Arbeitstage-Rechner – Arbeitstage & Werktage je Bundesland",
  description: "Arbeitstage zwischen zwei Daten berechnen: je Bundesland, 5- oder 6-Tage-Woche (Werktage), Urlaubs- und Krankheitstage abziehen – mit Liste der abgezogenen Feiertage. Kostenlos.",
  alternates: { canonical: "/arbeitstage-rechner" },
  openGraph: ogMeta("/arbeitstage-rechner", { defaultImage: true }),
};

export default function ArbeitstageRechnerPage() {
  const y = berlinNow().year;
  return (
    <div className="flex-1">
      <PageWithSidebar>
        <nav className="mb-4 text-sm text-slate-500"><Link href="/generatoren" className="hover:text-navy-600">Tools</Link> <span className="mx-1">/</span> <span className="text-navy-700">Arbeitstage-Rechner</span></nav>
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Arbeitstage-Rechner</h1>
        <p className="mt-2 text-slate-600">Arbeitstage oder Werktage zwischen zwei Daten – abhängig vom Bundesland und seinen gesetzlichen Feiertagen, wahlweise abzüglich Urlaubs- und Krankheitstagen.</p>
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
                "Arbeitstage sind in der Regel Montag bis Freitag. Werktage umfassen dagegen Montag bis Samstag – der Samstag gilt rechtlich als Werktag, auch wenn viele Menschen an ihm nicht arbeiten. Sonntage und gesetzliche Feiertage zählen weder zu den Arbeitstagen noch zu den Werktagen. Für die genaue Feiertagsliste eines Jahres hilft die Feiertage-Übersicht des jeweiligen Bundeslandes. Im Rechner wählen Sie dafür die 6-Tage-Woche: Dann zählen auch Samstage, und Feiertage, die auf einen Samstag fallen, werden zusätzlich abgezogen.",
              ],
            },
            {
              h2: "Arbeitstage für die Entfernungspauschale (Pendlerpauschale)",
              p: [
                "In der Steuererklärung wird die Entfernungspauschale nur für Tage angesetzt, an denen Sie tatsächlich zur ersten Tätigkeitsstätte gefahren sind. Ausgangspunkt ist die Zahl der Arbeitstage im Jahr – bei einer 5-Tage-Woche je nach Bundesland und Jahr rund 250 bis 256 Tage –, abzüglich Urlaub, Krankheit, Dienstreisen und Homeoffice-Tagen. Viele Finanzämter akzeptieren bei einer 5-Tage-Woche ohne Nachweis etwa 220 bis 230 Fahrttage, bei einer 6-Tage-Woche etwa 260 bis 280; höhere Werte sollten Sie belegen können.",
                "Genau dafür sind die Felder „Urlaubstage“ und „Krankheitstage“ gedacht: Tragen Sie Ihre Fehltage ein, und der Rechner zeigt die tatsächlichen Arbeitstage des Jahres. Für Homeoffice-Tage gilt statt der Entfernungspauschale die Tagespauschale für häusliches Arbeiten; die aktuellen Kilometersätze und Höchstbeträge entnehmen Sie den Hinweisen des Bundesfinanzministeriums oder Ihrer Steuersoftware – sie ändern sich gelegentlich, deshalb nennen wir hier bewusst keine Beträge.",
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
            { q: "Wie viele Arbeitstage setze ich für die Pendlerpauschale an?", a: "Nur tatsächliche Fahrttage: Arbeitstage des Jahres (bei 5-Tage-Woche rund 250 bis 256) abzüglich Urlaub, Krankheit, Dienstreisen und Homeoffice. Ohne Nachweis akzeptieren Finanzämter meist etwa 220 bis 230 Tage (5-Tage-Woche) bzw. 260 bis 280 Tage (6-Tage-Woche). Tragen Sie Ihre Fehltage oben ein – der Rechner zeigt die tatsächlichen Arbeitstage." },
            { q: "Wie ziehe ich Urlaubs- und Krankheitstage ab?", a: "Geben Sie die Anzahl der Tage in die Felder „Urlaubstage abziehen“ und „Krankheitstage abziehen“ ein. Der Rechner zieht sie von den Arbeitstagen des Zeitraums ab und zeigt das Ergebnis als tatsächliche Arbeitstage." },
            { q: "Was ändert die 6-Tage-Woche?", a: "Bei der 6-Tage-Woche zählt der Samstag als Arbeitstag (das entspricht den Werktagen im Rechtssinn). Feiertage, die auf einen Samstag fallen, werden dann ebenfalls abgezogen; Sonntage zählen nie." },
          ]}
        />
      </PageWithSidebar>
    </div>
  );
}
