import PageWithSidebar from "@/components/de/PageWithSidebar";
import type { Metadata } from "next";
import Link from "next/link";
import { berlinNow } from "@/lib/de/now";

export const metadata: Metadata = {
  title: "Tools & Rechner – Kalender, Arbeitstage & Termine",
  description: "Kostenlose Kalender-Tools: Tage-Rechner, Arbeitstage-Rechner, Wochentag-Rechner, Urlaubsplaner und mehr.",
  alternates: { canonical: "/generatoren" },
};

export default function GeneratorenPage() {
  const y = berlinNow().year;
  const tools = [
    { href: "/tage-rechner", emoji: "➗", label: "Tage-Rechner", desc: "Tage zwischen zwei Daten" },
    { href: "/arbeitstage-rechner", emoji: "🧮", label: "Arbeitstage-Rechner", desc: "Arbeitstage je Bundesland" },
    { href: "/wochentag-rechner", emoji: "📆", label: "Wochentag-Rechner", desc: "Wochentag eines Datums" },
    { href: "/altersrechner", emoji: "🎂", label: "Altersrechner", desc: "Alter genau berechnen" },
    { href: "/stundenplan", emoji: "📝", label: "Stundenplan", desc: "Erstellen & ausdrucken" },
    { href: "/wie-viele-tage-bis", emoji: "⏳", label: "Countdown", desc: "Tage bis Weihnachten, Ostern …" },
    { href: `/urlaubsplaner/${y}`, emoji: "🏖️", label: "Urlaubsplaner", desc: "Brückentage optimal nutzen" },
    { href: `/kalenderwochen/${y}`, emoji: "🔢", label: "Kalenderwochen", desc: "Alle KW nach ISO 8601" },
    { href: `/brueckentage/${y}`, emoji: "🌉", label: "Brückentage", desc: "Lange Wochenenden planen" },
    { href: `/besondere-tage/${y}`, emoji: "✨", label: "Besondere Tage", desc: "Muttertag, Karneval, Advent …" },
    { href: "/namenstage", emoji: "📛", label: "Namenstage", desc: "Namenstag heute & A–Z" },
    { href: "/bauernregeln", emoji: "🌾", label: "Bauernregeln", desc: "Lostage & Wetterregeln" },
    { href: "/sternzeichen", emoji: "⭐", label: "Sternzeichen", desc: "Daten & Eigenschaften" },
    { href: `/mondkalender/${y}`, emoji: "🌱", label: "Mondkalender", desc: "Aussaattage nach dem Mond" },
  ];
  return (
    <div className="flex-1">
      <PageWithSidebar>
        <nav className="mb-4 text-sm text-slate-500"><Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span> <span className="text-navy-700">Tools</span></nav>
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Tools &amp; Rechner</h1>
        <p className="mt-2 text-slate-600">Praktische Helfer rund um Kalender, Arbeitstage und Termine – kostenlos und ohne Anmeldung.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link key={t.href} href={t.href} className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-md">
              <div className="text-2xl">{t.emoji}</div>
              <div className="mt-1 font-bold text-navy-800">{t.label}</div>
              <div className="text-sm text-slate-500">{t.desc}</div>
            </Link>
          ))}
        </div>
      </PageWithSidebar>
    </div>
  );
}
