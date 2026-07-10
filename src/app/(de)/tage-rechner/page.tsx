import PageWithSidebar from "@/components/de/PageWithSidebar";
import type { Metadata } from "next";
import Link from "next/link";
import { TageRechner } from "@/components/de/Rechner";
import SeoProse from "@/components/de/SeoProse";
import Faq from "@/components/de/Faq";
import RelatedLinks from "@/components/de/RelatedLinks";
import { berlinNow } from "@/lib/de/now";

export const metadata: Metadata = {
  title: "Tage-Rechner – Tage zwischen zwei Daten berechnen",
  description: "Berechnen Sie kostenlos die Anzahl der Tage zwischen zwei Daten – mit und ohne Start-/Endtag.",
  alternates: { canonical: "/tage-rechner" },
};

export default function TageRechnerPage() {
  const y = berlinNow().year;
  return (
    <div className="flex-1">
      <PageWithSidebar>
        <nav className="mb-4 text-sm text-slate-500"><Link href="/generatoren" className="hover:text-navy-600">Tools</Link> <span className="mx-1">/</span> <span className="text-navy-700">Tage-Rechner</span></nav>
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Tage-Rechner</h1>
        <p className="mt-2 text-slate-600">Wie viele Tage liegen zwischen zwei Daten? Einfach beide Daten eingeben.</p>
        <div className="mt-6"><TageRechner /></div>

        <RelatedLinks
          items={[
            { href: "/wie-viele-tage-bis", emoji: "⏳", label: "Countdown", desc: "Tage bis Weihnachten, Ostern, Urlaub …" },
            { href: "/arbeitstage-rechner", emoji: "🧮", label: "Arbeitstage-Rechner", desc: "Nur Werktage im Zeitraum" },
            { href: "/wochentag-rechner", emoji: "📆", label: "Wochentag-Rechner", desc: "Auf welchen Tag fällt ein Datum?" },
            { href: `/kalender-zum-ausdrucken/${y}`, emoji: "🖨️", label: `Kalender ${y} zum Ausdrucken`, desc: "Kostenlos als PDF" },
          ]}
        />

        <SeoProse
          blocks={[
            {
              h2: "Tage zwischen zwei Daten berechnen",
              p: [
                "Der Tage-Rechner ermittelt, wie viele Tage zwischen einem Start- und einem Enddatum liegen. Geben Sie beide Daten ein, und Sie erhalten die exakte Differenz – wahlweise mit oder ohne Berücksichtigung des Start- bzw. Endtags. Das ist praktisch, um Fristen zu prüfen, das Alter eines Ereignisses zu bestimmen oder herunterzuzählen, wie viele Tage bis zu einem Termin, Urlaub oder Geburtstag verbleiben.",
                "Ob eine Frist „inklusive“ oder „exklusive“ des ersten Tages zählt, hängt vom Anwendungsfall ab. Bei einer Aufenthaltsdauer (z. B. Hotelnächte) zählt man oft nur die Nächte, bei gesetzlichen Fristen dagegen häufig den Ereignistag mit. Der Rechner zeigt beide Varianten.",
              ],
            },
          ]}
        />
        <Faq
          items={[
            { q: "Wie viele Tage liegen zwischen zwei Daten?", a: "Geben Sie oben Start- und Enddatum ein – der Rechner zeigt die genaue Anzahl der Tage, wahlweise mit oder ohne den ersten und letzten Tag." },
            { q: "Wird der erste Tag mitgezählt?", a: "Das können Sie wählen. Standardmäßig zeigt der Rechner die reine Differenz; mit der Option „inklusive“ wird der Start- bzw. Endtag mitgezählt." },
            { q: "Werden Schaltjahre berücksichtigt?", a: "Ja. Die Berechnung berücksichtigt Schaltjahre automatisch, sodass der 29. Februar korrekt einbezogen wird." },
            { q: "Kann ich damit ein zukünftiges Datum berechnen?", a: "Für die Anzahl der Tage bis zu einem künftigen Termin nutzen Sie diesen Rechner. Für ein Countdown mit Datum eignet sich zusätzlich die Seite „Wie viele Tage bis …“." },
          ]}
        />
      </PageWithSidebar>
    </div>
  );
}
