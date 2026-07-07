import Link from "next/link";
import type { Metadata } from "next";
import CountdownGeneric from "@/components/de/CountdownGeneric";

export const metadata: Metadata = {
  title: "Countdown-Rechner – Tage bis zu einem Datum",
  description: "Countdown zu einem beliebigen Datum: Wählen Sie ein Zieldatum und sehen Sie live, wie viele Tage, Stunden und Minuten noch bleiben.",
  alternates: { canonical: "/countdown" },
};

export default function CountdownToolPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-2xl px-4 py-8">
        <nav className="mb-4 text-sm text-slate-500"><Link href="/generatoren" className="hover:text-navy-600">Tools</Link> <span className="mx-1">/</span> <span className="text-navy-700">Countdown</span></nav>
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Countdown-Rechner</h1>
        <p className="mt-2 text-slate-600">Wie lange noch bis zu Ihrem Termin? Zieldatum wählen und live mitzählen.</p>
        <div className="mt-6"><CountdownGeneric /></div>
        <p className="mt-8 text-sm"><Link href="/wie-viele-tage-bis" className="font-medium text-navy-600 underline">Beliebte Countdowns (Weihnachten, Ostern …) →</Link></p>
      </div>
    </main>
  );
}
