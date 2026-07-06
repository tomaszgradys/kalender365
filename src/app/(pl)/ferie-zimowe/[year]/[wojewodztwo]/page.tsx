import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidYear } from "@/lib/months";
import { FERIE } from "@/lib/school";
import { ferieForRegion, wojSlug, wojFromSlug, WOJEWODZTWA } from "@/lib/vacationPlanner";
import { formatISODatePL, weekdayPL } from "@/lib/format";
import PageWithSidebar from "@/components/PageWithSidebar";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import FaqSection from "@/components/FaqSection";

export const dynamicParams = true;

export function generateStaticParams() {
  const params: { year: string; wojewodztwo: string }[] = [];
  for (const year of Object.keys(FERIE)) {
    for (const w of WOJEWODZTWA) params.push({ year, wojewodztwo: wojSlug(w) });
  }
  return params;
}

function daysInRange(start: string, end: string): number {
  return Math.round((Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86400000) + 1;
}

export async function generateMetadata({ params }: { params: Promise<{ year: string; wojewodztwo: string }> }): Promise<Metadata> {
  const { year, wojewodztwo } = await params;
  const woj = wojFromSlug(wojewodztwo);
  const y = Number(year);
  if (!woj) return {};
  const f = ferieForRegion(woj, y);
  const range = f ? ` — ${formatISODatePL(f.start)} – ${formatISODatePL(f.end)}` : "";
  return {
    title: `Ferie zimowe ${y} ${woj} — terminy (od kiedy do kiedy)`,
    description: `Ferie zimowe ${y} w województwie ${woj}${range}. Sprawdź dokładny termin, ile trwają i kiedy dzieci wracają do szkoły.`,
    alternates: { canonical: `/ferie-zimowe/${y}/${wojewodztwo}` },
    // Brak danych o terminie = pusty stan (thin) → noindex do czasu publikacji terminów przez MEN.
    ...(f ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function FerieWojPage({ params }: { params: Promise<{ year: string; wojewodztwo: string }> }) {
  const { year: yp, wojewodztwo } = await params;
  const year = Number(yp);
  const woj = wojFromSlug(wojewodztwo);
  if (!isValidYear(year) || !woj) notFound();

  const f = ferieForRegion(woj, year);
  const others = WOJEWODZTWA.filter((w) => w !== woj);

  const faq = f
    ? [
        {
          q: `Kiedy są ferie zimowe ${year} w województwie ${woj}?`,
          a: `Ferie zimowe ${year} w województwie ${woj} trwają od ${formatISODatePL(f.start)} (${weekdayPL(f.start)}) do ${formatISODatePL(f.end)} (${weekdayPL(f.end)}).`,
        },
        {
          q: `Ile trwają ferie zimowe?`,
          a: `Ferie zimowe trwają dwa tygodnie. W ${year} roku w województwie ${woj} to ${daysInRange(f.start, f.end)} dni (razem z weekendami).`,
        },
        {
          q: `Kiedy dzieci wracają do szkoły po feriach?`,
          a: `Pierwszy dzień nauki po feriach to najbliższy dzień roboczy po ${formatISODatePL(f.end)}.`,
        },
      ]
    : [
        {
          q: `Kiedy są ferie zimowe ${year} w województwie ${woj}?`,
          a: `Terminy ferii zimowych ${year} ustala Ministerstwo Edukacji Narodowej i ogłasza z wyprzedzeniem w podziale na województwa. Dane dla tego roku nie są jeszcze dostępne w serwisie.`,
        },
      ];

  return (
    <PageWithSidebar relatedExclude={["ferie-zimowe"]}>
      <BreadcrumbJsonLd
        items={[
          { name: "Kalendarz.pro", path: "/" },
          { name: "Ferie zimowe", path: `/ferie-zimowe/${year}` },
          { name: woj, path: `/ferie-zimowe/${year}/${wojewodztwo}` },
        ]}
      />
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-navy-600">Kalendarz.pro</Link> /{" "}
        <Link href={`/ferie-zimowe/${year}`} className="hover:text-navy-600">Ferie zimowe {year}</Link> / {woj}
      </nav>

      <h1 className="text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">
        Ferie zimowe {year} — <span className="capitalize">{woj}</span>
      </h1>

      {f ? (
        <>
          <div className="mt-5 overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 to-cyan-400 p-8 text-white shadow-lg">
            <p className="text-sm font-medium uppercase tracking-widest text-white/80">Termin ferii</p>
            <p className="mt-2 text-2xl font-black sm:text-3xl">
              {formatISODatePL(f.start)} – {formatISODatePL(f.end)}
            </p>
            <p className="mt-1 text-white/90">
              od {weekdayPL(f.start)} do {weekdayPL(f.end)} · {daysInRange(f.start, f.end)} dni wolnego
            </p>
          </div>

          <p className="mt-5 max-w-2xl text-slate-600">
            W województwie <strong className="capitalize">{woj}</strong> ferie zimowe {year} trwają dwa
            tygodnie — od {formatISODatePL(f.start)} do {formatISODatePL(f.end)}. To dobry moment na wyjazd
            na narty lub odpoczynek z dziećmi. Rodzice mogą dopasować urlop do ferii w{" "}
            <Link href={`/planer-urlopu/${year}`} className="font-medium text-navy-600 hover:text-brand-green-600">planerze urlopu</Link>{" "}
            (tryb rodzinny uwzględnia ferie w Twoim województwie).
          </p>

          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <Link href={`/ferie-zimowe/${year}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">
              Ferie {year} — wszystkie województwa
            </Link>
            <Link href={`/kalendarz-szkolny/${year - 1}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">
              Kalendarz roku szkolnego {year - 1}/{year}
            </Link>
            <Link href={`/planer-urlopu/${year}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">
              Zaplanuj urlop na ferie
            </Link>
            <a href={`/api/ics/ferie/${year}/${wojewodztwo}`} className="rounded-lg border border-brand-green-200 bg-brand-green-50 px-3 py-1.5 font-medium text-brand-green-700 hover:bg-brand-green-100">
              📅 Dodaj do kalendarza (.ics)
            </a>
          </div>
        </>
      ) : (
        <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Terminy ferii zimowych {year} dla województwa {woj} nie są jeszcze dostępne — MEN ogłasza je z
          wyprzedzeniem. Sprawdź <Link href={`/ferie-zimowe/${year}`} className="font-medium underline">ferie {year}</Link>{" "}
          dla pozostałych lat i województw.
        </p>
      )}

      {/* Inne województwa */}
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-bold text-navy-800">Ferie {year} w innych województwach</h2>
        <div className="flex flex-wrap gap-2">
          {others.map((w) => (
            <Link
              key={w}
              href={`/ferie-zimowe/${year}/${wojSlug(w)}`}
              className="rounded-full border border-slate-200 px-3 py-1 text-sm capitalize text-slate-700 hover:border-navy-300 hover:text-navy-600"
            >
              {w}
            </Link>
          ))}
        </div>
      </section>

      <FaqSection items={faq} />
    </PageWithSidebar>
  );
}
