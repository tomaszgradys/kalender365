import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NAV_YEARS, parseYear, yearRobots } from "@/lib/de/year";
import { getSeasons } from "@/lib/de/astroYear";

export function generateStaticParams() {
  return NAV_YEARS.map((y) => ({ year: String(y) }));
}
export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) return {};
  return {
    title: `Jahreszeiten ${y} – Frühling, Sommer, Herbst & Winter`,
    description: `Astronomischer Beginn der Jahreszeiten ${y}: Frühlingsanfang, Sommeranfang, Herbstanfang und Winteranfang mit genauem Datum und Uhrzeit.`,
    alternates: { canonical: `/jahreszeiten/${y}` },
    ...yearRobots(y),
  };
}
const ICON: Record<string, string> = { fruehling: "🌱", sommer: "☀️", herbst: "🍂", winter: "❄️" };
export default async function JahreszeitenPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) notFound();
  const seasons = getSeasons(y);
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        <nav className="mb-4 text-sm text-slate-500"><Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span> <span className="text-navy-700">Jahreszeiten {y}</span></nav>
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Jahreszeiten {y}</h1>
        <p className="mt-2 text-slate-600">Astronomischer Beginn der vier Jahreszeiten {y} — mit genauer Uhrzeit (Europe/Berlin). Berechnung nach Meeus.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {seasons.map((s) => (
            <div key={s.key} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-3xl">{ICON[s.key]}</div>
              <h2 className="mt-1 text-lg font-bold text-navy-800">{s.name}</h2>
              <p className="mt-1 font-semibold text-brand-green-700">{s.date}</p>
              <p className="text-sm text-slate-500">um {s.time} Uhr</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-2 text-sm">
          <Link href={`/jahreszeiten/${y - 1}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">← {y - 1}</Link>
          <Link href={`/jahreszeiten/${y + 1}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">{y + 1} →</Link>
          <Link href={`/zeitumstellung/${y}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Zeitumstellung {y}</Link>
        </div>
      </div>
    </main>
  );
}
