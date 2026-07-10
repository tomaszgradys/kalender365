import PageWithSidebar from "@/components/de/PageWithSidebar";
import Link from "next/link";
import type { Metadata } from "next";
import { COUNTDOWNS, berlinMidnight } from "@/lib/de/countdowns";
import { berlinNow } from "@/lib/de/now";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Countdown – Wie viele Tage bis Weihnachten, Ostern & mehr",
  description: "Countdowns bis zu den beliebtesten Terminen: Weihnachten, Silvester, Ostern, Sommeranfang, Sommerferien und mehr – mit genauem Datum.",
  alternates: { canonical: "/wie-viele-tage-bis" },
};

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function CountdownHubPage() {
  const { year, month0, day } = berlinNow();
  const todayMs = berlinMidnight(year, month0, day);
  const items = COUNTDOWNS.map((c) => {
    const t = c.resolve(new Date(Date.UTC(year, month0, day)));
    const days = Math.round((berlinMidnight(t.year, t.month0, t.day) - todayMs) / 86400000);
    return { c, days, iso: `${t.year}-${pad(t.month0 + 1)}-${pad(t.day)}` };
  }).sort((a, b) => a.days - b.days);

  return (
    <div className="flex-1">
      <PageWithSidebar>
        <nav className="mb-4 text-sm text-slate-500"><Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span> <span className="text-navy-700">Countdown</span></nav>
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Countdown – wie viele Tage bis …?</h1>
        <p className="mt-2 text-slate-600">Wie lange noch bis zu den beliebtesten Terminen? Live-Countdown mit Tagen, Stunden und Minuten.</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {items.map(({ c, days }) => (
            <Link key={c.slug} href={`/wie-viele-tage-bis/${c.slug}`} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-navy-300 hover:shadow-md">
              <span className="font-semibold text-navy-800">{c.emoji} {c.title}</span>
              <span className="text-sm font-bold text-brand-green-700">{days} Tage</span>
            </Link>
          ))}
          <Link href="/wie-viele-tage-bis-zu-den-sommerferien" className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-navy-300 hover:shadow-md">
            <span className="font-semibold text-navy-800">🎒 Sommerferien</span>
            <span className="text-sm font-medium text-slate-500">nach Bundesland →</span>
          </Link>
          <Link href="/countdown" className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-navy-300 hover:shadow-md">
            <span className="font-semibold text-navy-800">⏳ Eigenes Datum</span>
            <span className="text-sm font-medium text-slate-500">Countdown-Rechner →</span>
          </Link>
        </div>
      </PageWithSidebar>
    </div>
  );
}
