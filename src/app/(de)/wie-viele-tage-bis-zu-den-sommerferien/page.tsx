import PageWithSidebar from "@/components/de/PageWithSidebar";
import Link from "next/link";
import type { Metadata } from "next";
import SommerferienCountdown from "@/components/de/SommerferienCountdown";
import SeoProse from "@/components/de/SeoProse";
import Faq from "@/components/de/Faq";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Wie viele Tage bis zu den Sommerferien? – nach Bundesland",
  description: "Countdown bis zu den Sommerferien: Bundesland wählen und live sehen, wie viele Tage noch bis zum ersten Ferientag bleiben.",
  alternates: { canonical: "/wie-viele-tage-bis-zu-den-sommerferien" },
};

export default function SommerferienCountdownPage() {
  return (
    <main className="flex-1">
      <PageWithSidebar>
        <nav className="mb-4 text-sm text-slate-500"><Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span> <Link href="/wie-viele-tage-bis" className="hover:text-navy-600">Countdown</Link> <span className="mx-1">/</span> <span className="text-navy-700">Sommerferien</span></nav>
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">🎒 Wie viele Tage bis zu den Sommerferien?</h1>
        <p className="mt-2 text-slate-600">Die Sommerferien beginnen je nach Bundesland zu unterschiedlichen Terminen. Wählen Sie Ihr Bundesland für den passenden Countdown.</p>
        <div className="mt-6"><SommerferienCountdown /></div>

        <div className="mt-8">
          <Link href="/schulferien" className="text-sm font-medium text-navy-600 hover:underline">Alle Schulferien nach Bundesland &amp; Jahr →</Link>
        </div>

        <SeoProse
          blocks={[
            {
              h2: "Wann beginnen die Sommerferien?",
              p: [
                "Die Sommerferien sind in Deutschland Ländersache und starten gestaffelt: Je nach Bundesland liegt der erste Ferientag zwischen Ende Juni und Ende Juli. Ein rollierendes System sorgt dafür, dass nicht alle 16 Länder gleichzeitig in die Ferien starten. Wählen Sie oben Ihr Bundesland – der Countdown zählt dann taggenau bis zum ersten Ferientag herunter.",
                "Die genauen Ferientermine werden von den Kultusministerien der Länder mehrere Jahre im Voraus festgelegt. Eine vollständige Übersicht mit allen Ferienzeiträumen finden Sie auf der Seite Schulferien nach Bundesland und Jahr.",
              ],
            },
          ]}
        />
        <Faq
          items={[
            { q: "Wann beginnen die Sommerferien in meinem Bundesland?", a: "Wählen Sie oben Ihr Bundesland aus. Der Countdown zeigt dann den ersten Ferientag und wie viele Tage noch bis dahin bleiben." },
            { q: "Warum starten die Sommerferien nicht überall gleichzeitig?", a: "Die Termine werden zwischen den Bundesländern rollierend abgestimmt, damit sich der Reiseverkehr entzerrt und nicht alle Familien zeitgleich in den Urlaub starten." },
            { q: "Wie lange dauern die Sommerferien?", a: "Die Sommerferien dauern in allen Bundesländern sechs Wochen." },
          ]}
        />
      </PageWithSidebar>
    </main>
  );
}
