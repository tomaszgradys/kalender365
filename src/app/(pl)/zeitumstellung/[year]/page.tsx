import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NAV_YEARS, parseYear, yearRobots } from "@/lib/de/year";
import { getDSTChanges } from "@/lib/de/astroYear";

export function generateStaticParams() {
  return NAV_YEARS.map((y) => ({ year: String(y) }));
}
export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) return {};
  return {
    title: `Zeitumstellung ${y} – Sommerzeit & Winterzeit`,
    description: `Wann ist die Zeitumstellung ${y}? Beginn der Sommerzeit und Ende der Sommerzeit (Winterzeit) mit genauem Datum und Uhrzeit.`,
    alternates: { canonical: `/zeitumstellung/${y}` },
    ...yearRobots(y),
  };
}
export default async function ZeitumstellungPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) notFound();
  const changes = getDSTChanges(y);
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: changes.map((c) => ({ "@type": "Question", name: `${c.label} ${y}`, acceptedAnswer: { "@type": "Answer", text: `${c.date}. ${c.detail}` } })),
  };
  return (
    <main className="flex-1">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        <nav className="mb-4 text-sm text-slate-500"><Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span> <span className="text-navy-700">Zeitumstellung {y}</span></nav>
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Zeitumstellung {y}</h1>
        <p className="mt-2 text-slate-600">Die Uhren werden zweimal im Jahr umgestellt — jeweils am letzten Sonntag im März und Oktober (EU-Regelung, Europe/Berlin).</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {changes.map((c) => (
            <div key={c.label} className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-bold text-navy-800">{c.label}</h2>
              <p className="mt-1 font-semibold text-brand-green-700">{c.date}</p>
              <p className="mt-2 text-sm text-slate-600">{c.detail}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-2 text-sm">
          <Link href={`/zeitumstellung/${y - 1}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">← {y - 1}</Link>
          <Link href={`/zeitumstellung/${y + 1}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">{y + 1} →</Link>
          <Link href={`/jahreszeiten/${y}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Jahreszeiten {y}</Link>
        </div>
      </div>
    </main>
  );
}
