import PageWithSidebar from "@/components/de/PageWithSidebar";
import type { Metadata } from "next";
import Link from "next/link";
import StundenplanClient from "@/components/de/StundenplanClient";
import SeoProse from "@/components/de/SeoProse";
import Faq from "@/components/de/Faq";

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

        <div className="print:hidden">
          <SeoProse
            blocks={[
              {
                h2: "Stundenplan erstellen und ausdrucken",
                p: [
                  "Mit dem Stundenplan-Generator erstellen Sie kostenlos einen übersichtlichen Wochenplan: Tragen Sie Ihre Fächer ein, passen Sie die Zahl der Stunden und Tage an und drucken Sie den Plan anschließend aus. Der Stundenplan wird automatisch in Ihrem Browser gespeichert, sodass er beim nächsten Besuch wieder da ist – ganz ohne Anmeldung.",
                  "Der Generator eignet sich für Schülerinnen und Schüler, Studierende und Lehrkräfte. Zum Ausdrucken nutzen Sie einfach die Druckfunktion Ihres Browsers; das Layout ist für eine saubere DIN-A4-Seite optimiert.",
                ],
              },
            ]}
          />
          <Faq
            items={[
              { q: "Wird mein Stundenplan gespeichert?", a: "Ja, aber nur lokal in Ihrem Browser (localStorage). Es werden keine Daten an einen Server übertragen. Auf einem anderen Gerät oder nach dem Löschen der Browserdaten ist der Plan nicht mehr vorhanden." },
              { q: "Kann ich den Stundenplan ausdrucken?", a: "Ja. Über die Druckfunktion Ihres Browsers (Strg+P bzw. Cmd+P) drucken Sie den Plan sauber formatiert auf DIN A4 aus." },
              { q: "Kostet der Stundenplan-Generator etwas?", a: "Nein, die Nutzung ist vollständig kostenlos und ohne Registrierung möglich." },
            ]}
          />
        </div>
      </PageWithSidebar>
    </main>
  );
}
