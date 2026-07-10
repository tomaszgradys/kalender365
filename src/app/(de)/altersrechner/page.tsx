import PageWithSidebar from "@/components/de/PageWithSidebar";
import type { Metadata } from "next";
import Link from "next/link";
import { AltersRechner } from "@/components/de/Rechner";
import SeoProse from "@/components/de/SeoProse";
import Faq from "@/components/de/Faq";
import RelatedLinks from "@/components/de/RelatedLinks";

export const metadata: Metadata = {
  title: "Altersrechner – Alter genau berechnen",
  description: "Berechnen Sie Ihr genaues Alter in Jahren, Monaten und Tagen – plus Gesamttage, Wochentag der Geburt und Countdown bis zum nächsten Geburtstag.",
  alternates: { canonical: "/altersrechner" },
};

export default function AltersRechnerPage() {
  return (
    <div className="flex-1">
      <PageWithSidebar>
        <nav className="mb-4 text-sm text-slate-500"><Link href="/generatoren" className="hover:text-navy-600">Tools</Link> <span className="mx-1">/</span> <span className="text-navy-700">Altersrechner</span></nav>
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Altersrechner</h1>
        <p className="mt-2 text-slate-600">Wie alt sind Sie genau? Geburtsdatum eingeben und Alter in Jahren, Monaten und Tagen berechnen.</p>
        <div className="mt-6"><AltersRechner /></div>

        <RelatedLinks
          items={[
            { href: "/wochentag-rechner", emoji: "📆", label: "Wochentag-Rechner", desc: "An welchem Tag wurden Sie geboren?" },
            { href: "/wie-viele-tage-bis", emoji: "⏳", label: "Countdown", desc: "Tage bis zum nächsten Geburtstag" },
            { href: "/sternzeichen", emoji: "⭐", label: "Sternzeichen", desc: "Ihr Sternzeichen nach Geburtsdatum" },
            { href: "/namenstage", emoji: "📛", label: "Namenstage", desc: "Namenstag heute & A–Z" },
          ]}
        />

        <SeoProse
          blocks={[
            {
              h2: "Alter genau berechnen",
              p: [
                "Der Altersrechner ermittelt aus Ihrem Geburtsdatum das exakte Alter in Jahren, Monaten und Tagen. Zusätzlich sehen Sie, an welchem Wochentag Sie geboren wurden, wie viele Tage Sie insgesamt schon leben und wie viele Tage es noch bis zu Ihrem nächsten Geburtstag sind. Schaltjahre – inklusive des 29. Februar – werden dabei korrekt berücksichtigt.",
                "Das genaue Alter wird oft für Formulare, Bewerbungen, Versicherungen oder einfach aus Neugier benötigt. Der Rechner arbeitet ausschließlich in Ihrem Browser; es werden keine Geburtsdaten gespeichert oder übertragen.",
              ],
            },
          ]}
        />
        <Faq
          items={[
            { q: "Wie berechne ich mein genaues Alter?", a: "Geben Sie Ihr Geburtsdatum ein. Der Rechner zeigt Ihr Alter in Jahren, Monaten und Tagen sowie die Gesamtzahl der gelebten Tage." },
            { q: "An welchem Wochentag wurde ich geboren?", a: "Der Altersrechner nennt zusätzlich den Wochentag Ihrer Geburt – oder nutzen Sie direkt den Wochentag-Rechner." },
            { q: "Wie viele Tage sind es bis zu meinem nächsten Geburtstag?", a: "Der Rechner zeigt automatisch den Countdown in Tagen bis zu Ihrem nächsten Geburtstag an." },
            { q: "Werden meine Daten gespeichert?", a: "Nein. Die Berechnung findet lokal in Ihrem Browser statt; es werden keine Eingaben gespeichert oder an einen Server gesendet." },
          ]}
        />
      </PageWithSidebar>
    </div>
  );
}
