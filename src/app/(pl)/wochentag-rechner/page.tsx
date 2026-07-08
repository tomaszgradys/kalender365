import PageWithSidebar from "@/components/de/PageWithSidebar";
import type { Metadata } from "next";
import Link from "next/link";
import { WochentagRechner } from "@/components/de/Rechner";

export const metadata: Metadata = {
  title: "Wochentag-Rechner – an welchem Wochentag liegt ein Datum?",
  description: "Finden Sie heraus, auf welchen Wochentag ein beliebiges Datum fällt – für Geburtstage, Termine und Jubiläen.",
  alternates: { canonical: "/wochentag-rechner" },
};

export default function WochentagRechnerPage() {
  return (
    <main className="flex-1">
      <PageWithSidebar>
        <nav className="mb-4 text-sm text-slate-500"><Link href="/generatoren" className="hover:text-navy-600">Tools</Link> <span className="mx-1">/</span> <span className="text-navy-700">Wochentag-Rechner</span></nav>
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Wochentag-Rechner</h1>
        <p className="mt-2 text-slate-600">Auf welchen Wochentag fällt ein Datum? Datum eingeben und sofort sehen.</p>
        <div className="mt-6"><WochentagRechner /></div>
      </PageWithSidebar>
    </main>
  );
}
