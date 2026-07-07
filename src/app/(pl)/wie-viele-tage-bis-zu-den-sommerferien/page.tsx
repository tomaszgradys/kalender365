import Link from "next/link";
import type { Metadata } from "next";
import SommerferienCountdown from "@/components/de/SommerferienCountdown";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Wie viele Tage bis zu den Sommerferien? – nach Bundesland",
  description: "Countdown bis zu den Sommerferien: Bundesland wählen und live sehen, wie viele Tage noch bis zum ersten Ferientag bleiben.",
  alternates: { canonical: "/wie-viele-tage-bis-zu-den-sommerferien" },
};

export default function SommerferienCountdownPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-2xl px-4 py-8">
        <nav className="mb-4 text-sm text-slate-500"><Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span> <Link href="/wie-viele-tage-bis" className="hover:text-navy-600">Countdown</Link> <span className="mx-1">/</span> <span className="text-navy-700">Sommerferien</span></nav>
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">🎒 Wie viele Tage bis zu den Sommerferien?</h1>
        <p className="mt-2 text-slate-600">Die Sommerferien beginnen je nach Bundesland zu unterschiedlichen Terminen. Wählen Sie Ihr Bundesland für den passenden Countdown.</p>
        <div className="mt-6"><SommerferienCountdown /></div>
      </div>
    </main>
  );
}
