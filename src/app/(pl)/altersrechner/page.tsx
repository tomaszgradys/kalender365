import PageWithSidebar from "@/components/de/PageWithSidebar";
import type { Metadata } from "next";
import Link from "next/link";
import { AltersRechner } from "@/components/de/Rechner";

export const metadata: Metadata = {
  title: "Altersrechner – Alter genau berechnen",
  description: "Berechnen Sie Ihr genaues Alter in Jahren, Monaten und Tagen – plus Gesamttage, Wochentag der Geburt und Countdown bis zum nächsten Geburtstag.",
  alternates: { canonical: "/altersrechner" },
};

export default function AltersRechnerPage() {
  return (
    <main className="flex-1">
      <PageWithSidebar>
        <nav className="mb-4 text-sm text-slate-500"><Link href="/generatoren" className="hover:text-navy-600">Tools</Link> <span className="mx-1">/</span> <span className="text-navy-700">Altersrechner</span></nav>
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Altersrechner</h1>
        <p className="mt-2 text-slate-600">Wie alt sind Sie genau? Geburtsdatum eingeben und Alter in Jahren, Monaten und Tagen berechnen.</p>
        <div className="mt-6"><AltersRechner /></div>
      </PageWithSidebar>
    </main>
  );
}
