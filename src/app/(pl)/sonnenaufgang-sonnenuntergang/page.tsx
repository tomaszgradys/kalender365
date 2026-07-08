import PageWithSidebar from "@/components/de/PageWithSidebar";
import Link from "next/link";
import type { Metadata } from "next";
import { berlinNow } from "@/lib/de/now";
import SonnenzeitenClient from "@/components/de/SonnenzeitenClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Sonnenaufgang & Sonnenuntergang – Zeiten für Deutschland",
  description: "Sonnenaufgang, Sonnenuntergang und Tageslänge für deutsche Städte – tagesgenau, mit Ortsauswahl. Zeiten in MEZ/MESZ.",
  alternates: { canonical: "/sonnenaufgang-sonnenuntergang" },
};

export default function SonnenzeitenPage() {
  const { year, month0 } = berlinNow();
  return (
    <main className="flex-1">
      <PageWithSidebar>
        <nav className="mb-4 text-sm text-slate-500"><Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span> <span className="text-navy-700">Sonnenaufgang & Sonnenuntergang</span></nav>
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Sonnenaufgang &amp; Sonnenuntergang</h1>
        <p className="mt-2 max-w-2xl text-slate-600">Tagesgenaue Zeiten für Sonnenaufgang, Sonnenuntergang und Tageslänge. Wählen Sie eine Stadt und blättern Sie durch die Monate.</p>
        <div className="mt-6">
          <SonnenzeitenClient year={year} month0={month0} />
        </div>
      </PageWithSidebar>
    </main>
  );
}
