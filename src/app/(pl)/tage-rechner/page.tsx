import PageWithSidebar from "@/components/de/PageWithSidebar";
import type { Metadata } from "next";
import Link from "next/link";
import { TageRechner } from "@/components/de/Rechner";

export const metadata: Metadata = {
  title: "Tage-Rechner – Tage zwischen zwei Daten berechnen",
  description: "Berechnen Sie kostenlos die Anzahl der Tage zwischen zwei Daten – mit und ohne Start-/Endtag.",
  alternates: { canonical: "/tage-rechner" },
};

export default function TageRechnerPage() {
  return (
    <main className="flex-1">
      <PageWithSidebar>
        <nav className="mb-4 text-sm text-slate-500"><Link href="/generatoren" className="hover:text-navy-600">Tools</Link> <span className="mx-1">/</span> <span className="text-navy-700">Tage-Rechner</span></nav>
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Tage-Rechner</h1>
        <p className="mt-2 text-slate-600">Wie viele Tage liegen zwischen zwei Daten? Einfach beide Daten eingeben.</p>
        <div className="mt-6"><TageRechner /></div>
      </PageWithSidebar>
    </main>
  );
}
