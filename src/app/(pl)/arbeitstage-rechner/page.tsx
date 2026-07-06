import type { Metadata } from "next";
import Link from "next/link";
import { ArbeitstageRechner } from "@/components/de/Rechner";

export const metadata: Metadata = {
  title: "Arbeitstage-Rechner – Arbeitstage im Zeitraum berechnen",
  description: "Berechnen Sie die Anzahl der Arbeitstage zwischen zwei Daten je nach Bundesland (5-Tage-Woche, ohne gesetzliche Feiertage).",
  alternates: { canonical: "/arbeitstage-rechner" },
};

export default function ArbeitstageRechnerPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-2xl px-4 py-8">
        <nav className="mb-4 text-sm text-slate-500"><Link href="/generatoren" className="hover:text-navy-600">Tools</Link> <span className="mx-1">/</span> <span className="text-navy-700">Arbeitstage-Rechner</span></nav>
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Arbeitstage-Rechner</h1>
        <p className="mt-2 text-slate-600">Arbeitstage zwischen zwei Daten – abhängig vom Bundesland und seinen gesetzlichen Feiertagen.</p>
        <div className="mt-6"><ArbeitstageRechner /></div>
      </div>
    </main>
  );
}
