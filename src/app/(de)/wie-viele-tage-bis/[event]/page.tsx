import PageWithSidebar from "@/components/de/PageWithSidebar";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COUNTDOWNS, getCountdown, berlinMidnight } from "@/lib/de/countdowns";
import { berlinNow } from "@/lib/de/now";
import { formatFullDE } from "@/lib/de/locale";
import CountdownClient from "@/components/de/CountdownClient";

export const revalidate = 3600;

export function generateStaticParams() {
  return COUNTDOWNS.map((c) => ({ event: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ event: string }> }): Promise<Metadata> {
  const { event } = await params;
  const c = getCountdown(event);
  if (!c) return {};
  return {
    title: `Wie viele Tage bis ${c.title}? – Countdown`,
    description: `Countdown bis ${c.title}: wie viele Tage, Stunden und Minuten noch bleiben. Mit genauem Datum.`,
    alternates: { canonical: `/wie-viele-tage-bis/${c.slug}` },
  };
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default async function CountdownEventPage({ params }: { params: Promise<{ event: string }> }) {
  const { event } = await params;
  const c = getCountdown(event);
  if (!c) notFound();

  const { year, month0, day } = berlinNow();
  const t = c.resolve(new Date(Date.UTC(year, month0, day)));
  const targetMs = berlinMidnight(t.year, t.month0, t.day);
  const todayMs = berlinMidnight(year, month0, day);
  const days = Math.round((targetMs - todayMs) / 86400000);
  const targetISO = `${t.year}-${pad(t.month0 + 1)}-${pad(t.day)}`;

  return (
    <main className="flex-1">
      <PageWithSidebar>
        <nav className="mb-4 text-sm text-slate-500"><Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span> <Link href="/wie-viele-tage-bis" className="hover:text-navy-600">Countdown</Link> <span className="mx-1">/</span> <span className="text-navy-700">{c.title}</span></nav>
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">{c.emoji} Wie viele Tage bis {c.title}?</h1>
        <p className="mt-2 text-slate-600">
          Bis {c.title} sind es noch <strong>{days} Tage</strong> — {c.title} ist am {formatFullDE(targetISO)}.
        </p>
        <div className="mt-6">
          <CountdownClient target={targetMs} doneLabel={`${c.title} ist da! ${c.emoji}`} />
        </div>

        <section className="mt-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Weitere Countdowns</h2>
          <div className="flex flex-wrap gap-2">
            {COUNTDOWNS.filter((x) => x.slug !== c.slug).map((x) => (
              <Link key={x.slug} href={`/wie-viele-tage-bis/${x.slug}`} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-navy-700 hover:border-navy-300">{x.emoji} {x.title}</Link>
            ))}
            <Link href="/wie-viele-tage-bis-zu-den-sommerferien" className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-navy-700 hover:border-navy-300">🎒 Sommerferien</Link>
          </div>
        </section>
      </PageWithSidebar>
    </main>
  );
}
