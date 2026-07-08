import PageWithSidebar from "@/components/de/PageWithSidebar";
import type { Metadata } from "next";
import Link from "next/link";
import StundenplanClient from "@/components/de/StundenplanClient";

export const metadata: Metadata = {
  title: "Stundenplan-Generator – erstellen & ausdrucken",
  description: "Erstellen Sie kostenlos Ihren Stundenplan: Fächer eintragen, Stunden und Tage anpassen, ausdrucken. Wird automatisch im Browser gespeichert.",
  alternates: { canonical: "/stundenplan" },
};

export default function StundenplanPage() {
  return (
    <main className="flex-1">
      <PageWithSidebar>
        <nav className="mb-4 text-sm text-slate-500 print:hidden"><Link href="/generatoren" className="hover:text-navy-600">Tools</Link> <span className="mx-1">/</span> <span className="text-navy-700">Stundenplan</span></nav>
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl print:text-xl">Stundenplan-Generator</h1>
        <p className="mt-2 text-slate-600 print:hidden">Tragen Sie Ihre Fächer ein, passen Sie Stunden und Tage an und drucken Sie den Stundenplan aus. Alles wird automatisch gespeichert.</p>
        <div className="mt-6"><StundenplanClient /></div>
      </PageWithSidebar>
    </main>
  );
}
