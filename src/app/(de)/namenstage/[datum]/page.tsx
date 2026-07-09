import PageWithSidebar from "@/components/de/PageWithSidebar";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { berlinNow } from "@/lib/de/now";
import { MONTH_NAMES_DE, weekdayDE } from "@/lib/de/locale";
import { allNamenstage, getNamenstageByKey } from "@/lib/de/namenstage";
import { sternzeichenByDate } from "@/lib/de/sternzeichen";
import { getBauernregel } from "@/lib/de/bauernregeln";
import SeoProse from "@/components/de/SeoProse";
import Faq from "@/components/de/Faq";

export const revalidate = 86400;

export function generateStaticParams() {
  return allNamenstage().map((e) => ({ datum: e.mmdd }));
}

function parse(datum: string): { m0: number; day: number } | null {
  const m = /^(\d{2})-(\d{2})$/.exec(datum);
  if (!m) return null;
  const month = Number(m[1]);
  const day = Number(m[2]);
  if (month < 1 || month > 12) return null;
  const dim = new Date(Date.UTC(2024, month, 0)).getUTCDate(); // Schaltjahr → 29.02 gültig
  if (day < 1 || day > dim) return null;
  return { m0: month - 1, day };
}

export async function generateMetadata({ params }: { params: Promise<{ datum: string }> }): Promise<Metadata> {
  const { datum } = await params;
  const p = parse(datum);
  if (!p) return {};
  const names = getNamenstageByKey(datum);
  const label = `${p.day}. ${MONTH_NAMES_DE[p.m0]}`;
  const title = names.length ? `Namenstag ${names.join(", ")} – ${label}` : `Namenstag am ${label}`;
  return {
    title,
    description: names.length
      ? `Am ${label} haben ${names.join(", ")} Namenstag. Bedeutung, Datum und Kalenderblatt zum ${label}.`
      : `Namenstag am ${label} im Heiligenkalender.`,
    alternates: { canonical: `/namenstage/${datum}` },
    // Dünne Tage ohne hinterlegten Namenstag (rund 240 von 366) werden von
    // jedem Kalenderblatt verlinkt – bleiben crawlbar, aber aus dem Index.
    ...(names.length ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function NamenstagDatumPage({ params }: { params: Promise<{ datum: string }> }) {
  const { datum } = await params;
  const p = parse(datum);
  if (!p) notFound();
  const names = getNamenstageByKey(datum);

  const { year } = berlinNow();
  const iso = `${year}-${datum}`;
  const label = `${p.day}. ${MONTH_NAMES_DE[p.m0]}`;
  const zodiac = sternzeichenByDate(p.m0, p.day);
  const regel = getBauernregel(p.m0, p.day);

  // Nachbar-Namenstage.
  const alle = allNamenstage();
  const idx = alle.findIndex((e) => e.mmdd === datum);
  const prev = idx > 0 ? alle[idx - 1] : alle[alle.length - 1];
  const next = idx >= 0 && idx < alle.length - 1 ? alle[idx + 1] : alle[0];

  const faq = names.length
    ? [
        {
          q: `Wann hat ${names[0]} Namenstag?`,
          a: `${names[0]} hat am ${label} Namenstag${names.length > 1 ? ` – gemeinsam mit ${names.slice(1).join(", ")}` : ""}. Der Termin ist jedes Jahr gleich.`,
        },
        {
          q: `Wer hat noch am ${label} Namenstag?`,
          a: `Am ${label} haben folgende Namen Namenstag: ${names.join(", ")}.`,
        },
      ]
    : [];

  return (
    <main className="flex-1">
      <PageWithSidebar>
        <nav className="mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span>
          <Link href="/namenstage" className="hover:text-navy-600">Namenstage</Link> <span className="mx-1">/</span>
          <span className="text-navy-700">{label}</span>
        </nav>

        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Namenstag am {label}</h1>
        {names.length ? (
          <p className="mt-2 max-w-3xl text-slate-600">
            Am {label} haben <strong className="text-navy-800">{names.join(", ")}</strong> Namenstag – nach dem
            katholischen Heiligenkalender. Der Termin ist jedes Jahr derselbe.
          </p>
        ) : (
          <p className="mt-2 max-w-3xl text-slate-600">Für den {label} ist in diesem Verzeichnis kein Namenstag hinterlegt.</p>
        )}

        {names.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {names.map((n) => (
              <span key={n} className="rounded-full bg-brand-green-50 px-4 py-1.5 text-sm font-semibold text-brand-green-700">{n}</span>
            ))}
          </div>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Kalenderblatt {year}</div>
            <div className="mt-1 font-bold text-navy-800">{weekdayDE(iso)}, {label}</div>
            <Link href={`/kalenderblatt/${iso}`} className="mt-1 inline-block text-xs font-medium text-navy-600 hover:underline">Tag ansehen →</Link>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sternzeichen</div>
            <div className="mt-1 font-bold text-navy-800">{zodiac.symbol} {zodiac.name}</div>
            <Link href={`/sternzeichen/${zodiac.slug}`} className="mt-1 inline-block text-xs font-medium text-navy-600 hover:underline">Zum Sternzeichen →</Link>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Bauernregel</div>
            <div className="mt-1 text-sm italic text-slate-700">„{regel}“</div>
          </div>
        </div>

        <section className="mt-8 flex flex-wrap items-center gap-2 text-sm">
          <Link href={`/namenstage/${prev.mmdd}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">← {prev.day}. {MONTH_NAMES_DE[prev.month0]}</Link>
          <Link href="/namenstage" className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Alle Namenstage</Link>
          <Link href={`/namenstage/${next.mmdd}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">{next.day}. {MONTH_NAMES_DE[next.month0]} →</Link>
        </section>

        <SeoProse
          blocks={[
            {
              h2: `Namenstag am ${label}`,
              p: [
                names.length
                  ? `Der ${label} ist im katholischen Heiligenkalender der Namenstag von ${names.join(", ")}. Anders als der Geburtstag ist der Namenstag jedes Jahr am selben Datum und erinnert an den gleichnamigen Heiligen.`
                  : `Für den ${label} ist in diesem Verzeichnis kein fester Namenstag hinterlegt. Das Verzeichnis führt die bekanntesten Gedenktage des katholischen Heiligenkalenders.`,
              ],
            },
          ]}
        />
        {faq.length > 0 && <Faq items={faq} />}
      </PageWithSidebar>
    </main>
  );
}
