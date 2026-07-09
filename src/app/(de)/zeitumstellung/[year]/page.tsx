import PageWithSidebar from "@/components/de/PageWithSidebar";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRERENDER_YEARS, parseYear, yearRobots } from "@/lib/de/year";
import { getDSTChanges } from "@/lib/de/astroYear";
import SeoProse from "@/components/de/SeoProse";
import Faq from "@/components/de/Faq";

export function generateStaticParams() {
  return PRERENDER_YEARS.map((y) => ({ year: String(y) }));
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
  const sommer = changes[0];
  const winter = changes[1];
  return (
    <main className="flex-1">
      <PageWithSidebar>
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

        <SeoProse
          blocks={[
            {
              h2: `Zeitumstellung ${y}: Sommerzeit und Winterzeit`,
              p: [
                `In Deutschland und der gesamten EU werden die Uhren zweimal im Jahr umgestellt. Im Frühjahr (${y}: ${sommer?.date}) beginnt die Sommerzeit: Die Uhr wird um 2:00 Uhr um eine Stunde auf 3:00 Uhr vorgestellt – diese Nacht ist also eine Stunde kürzer. Im Herbst (${y}: ${winter?.date}) endet die Sommerzeit: Die Uhr wird um 3:00 Uhr auf 2:00 Uhr zurückgestellt, die Nacht dauert eine Stunde länger.`,
                `Die Umstellung erfolgt immer am letzten Sonntag im März und am letzten Sonntag im Oktober. Eine einfache Merkhilfe: Im Sommer stellt man die Gartenmöbel VOR die Tür (Uhr vor), im Winter zurück in den Schuppen (Uhr zurück).`,
              ],
            },
            {
              h2: `Warum gibt es die Zeitumstellung?`,
              p: [
                `Die Sommerzeit wurde eingeführt, um das Tageslicht am Abend besser zu nutzen und Energie zu sparen. Der tatsächliche Spareffekt ist heute umstritten. Zwar hat sich die EU 2018 grundsätzlich für eine Abschaffung der Zeitumstellung ausgesprochen, eine einheitliche Regelung wurde jedoch bislang nicht umgesetzt – deshalb gilt die halbjährliche Umstellung auch ${y} weiter.`,
              ],
            },
          ]}
        />
        <Faq
          items={[
            { q: `Wann ist die Zeitumstellung ${y}?`, a: `${y} beginnt die Sommerzeit am ${sommer?.date} (Uhr eine Stunde vor) und endet am ${winter?.date} (Uhr eine Stunde zurück).` },
            { q: "Wird die Uhr im Frühjahr vor- oder zurückgestellt?", a: "Im Frühjahr wird die Uhr vorgestellt: Um 2:00 Uhr springt sie auf 3:00 Uhr. Man verliert also eine Stunde Schlaf, dafür ist es abends länger hell." },
            { q: "Wird die Uhr im Herbst vor- oder zurückgestellt?", a: "Im Herbst wird die Uhr zurückgestellt: Um 3:00 Uhr springt sie zurück auf 2:00 Uhr. Man gewinnt eine Stunde." },
            { q: "Wann ist Sommerzeit, wann Winterzeit?", a: "Die Sommerzeit gilt vom letzten Sonntag im März bis zum letzten Sonntag im Oktober. Die übrige Zeit gilt die Normalzeit, umgangssprachlich Winterzeit genannt (in Deutschland MEZ)." },
            { q: `Wird die Zeitumstellung ${y} abgeschafft?`, a: `Nein. Trotz eines EU-Beschlusses von 2018 gibt es bislang keine einheitliche Umsetzung, daher wird auch ${y} weiterhin umgestellt.` },
          ]}
        />
      </PageWithSidebar>
    </main>
  );
}
