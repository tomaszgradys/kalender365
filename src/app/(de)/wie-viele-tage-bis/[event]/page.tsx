import PageWithSidebar from "@/components/de/PageWithSidebar";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COUNTDOWNS, getCountdown, berlinMidnight } from "@/lib/de/countdowns";
import { berlinNow } from "@/lib/de/now";
import { formatFullDE, formatLongDE, weekdayDE } from "@/lib/de/locale";
import CountdownClient from "@/components/de/CountdownClient";
import SeoProse from "@/components/de/SeoProse";
import Faq from "@/components/de/Faq";
import ShareButtons from "@/components/de/ShareButtons";
import { ogMeta } from "@/lib/de/ogMeta";

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
    openGraph: ogMeta(`/wie-viele-tage-bis/${c.slug}`),
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

  // Nächste Vorkommen (aktuelles + folgende Jahre) — beantwortet „wann ist X 2027/2028?".
  const kommendeJahre = (() => {
    const out: { iso: string; year: number }[] = [];
    let ref = new Date(Date.UTC(year, month0, day));
    for (let i = 0; i < 5; i++) {
      const occ = c.resolve(ref);
      const iso = `${occ.year}-${pad(occ.month0 + 1)}-${pad(occ.day)}`;
      out.push({ iso, year: occ.year });
      ref = new Date(Date.UTC(occ.year, occ.month0, occ.day + 1));
    }
    return out;
  })();

  const faq = [
    { q: `Wann ist ${c.title} ${t.year}?`, a: `${c.title} ${t.year} ist am ${formatFullDE(targetISO)}.` },
    { q: `Auf welchen Wochentag fällt ${c.title} ${t.year}?`, a: `${c.title} fällt ${t.year} auf einen ${weekdayDE(targetISO)}.` },
    { q: `Wie viele Tage sind es noch bis ${c.title}?`, a: `Von heute an sind es noch ${days} Tage bis ${c.title} am ${formatLongDE(targetISO)}.` },
    c.beweglich
      ? { q: `Warum ändert sich das Datum von ${c.title} jedes Jahr?`, a: `${c.title} ist ein bewegliches Datum und richtet sich nach dem Osterfest bzw. einem bestimmten Wochentag – deshalb fällt es jedes Jahr auf einen anderen Kalendertag.` }
      : { q: `Ist ${c.title} immer am selben Datum?`, a: `Ja. ${c.title} fällt jedes Jahr auf den ${c.fixesDatum} – nur der Wochentag ändert sich.` },
  ];

  return (
    <div className="flex-1">
      <PageWithSidebar>
        <nav className="mb-4 text-sm text-slate-500"><Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span> <Link href="/wie-viele-tage-bis" className="hover:text-navy-600">Countdown</Link> <span className="mx-1">/</span> <span className="text-navy-700">{c.title}</span></nav>
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">{c.emoji} Wie viele Tage bis {c.title}?</h1>
        <p className="mt-2 text-slate-600">
          Bis {c.title} sind es noch <strong>{days} Tage</strong> — {c.title} ist am {formatFullDE(targetISO)}.
        </p>
        <div className="mt-6">
          <CountdownClient target={targetMs} doneLabel={`${c.title} ist da! ${c.emoji}`} />
        </div>

        {/* KOMMENDE JAHRE */}
        <section className="mt-10">
          <h2 className="mb-3 text-xl font-bold text-navy-800">{c.title} in den nächsten Jahren</h2>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-2 font-medium">Jahr</th>
                  <th className="px-4 py-2 font-medium">Datum</th>
                  <th className="px-4 py-2 font-medium">Wochentag</th>
                </tr>
              </thead>
              <tbody>
                {kommendeJahre.map((k) => (
                  <tr key={k.iso} className="border-t border-slate-100">
                    <td className="px-4 py-2 font-medium text-navy-800">{c.title} {k.year}</td>
                    <td className="px-4 py-2 text-slate-600">{formatLongDE(k.iso)}</td>
                    <td className="px-4 py-2 text-slate-600">{weekdayDE(k.iso)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Weitere Countdowns</h2>
          <div className="flex flex-wrap gap-2">
            {COUNTDOWNS.filter((x) => x.slug !== c.slug).map((x) => (
              <Link key={x.slug} href={`/wie-viele-tage-bis/${x.slug}`} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-navy-700 hover:border-navy-300">{x.emoji} {x.title}</Link>
            ))}
            <Link href="/wie-viele-tage-bis-zu-den-sommerferien" className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-navy-700 hover:border-navy-300">🎒 Sommerferien</Link>
          </div>
        </section>

        <SeoProse
          blocks={[
            {
              h2: `Wann ist ${c.title}?`,
              p: [
                c.about,
                `Der Countdown oben zählt taggenau bis zum nächsten Termin herunter: Bis ${c.title} am ${formatFullDE(targetISO)} sind es aktuell noch ${days} Tage. Die Uhrzeit im Countdown bezieht sich auf Mitternacht (Beginn des Tages) in der Zeitzone Europe/Berlin.`,
              ],
            },
          ]}
        />
        <Faq items={faq} />
        <ShareButtons title={`Countdown bis ${c.title}`} />
      </PageWithSidebar>
    </div>
  );
}
