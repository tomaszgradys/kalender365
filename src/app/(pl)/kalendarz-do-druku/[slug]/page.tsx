import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  STATIC_YEARS,
  MONTH_SLUGS,
  MONTH_NAMES,
  MONTH_NAMES_GENITIVE_PL,
  parseCalendarSlug,
  yearRobotsMeta,
} from "@/lib/months";
import { buildMonthData } from "@/lib/calendar";
import { schoolBreaks } from "@/lib/vacationPlanner";
import { url } from "@/lib/urls";
import CalendarGrid from "@/components/CalendarGrid";
import PageWithSidebar from "@/components/PageWithSidebar";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

export const dynamicParams = true;
export function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (const y of STATIC_YEARS) {
    params.push({ slug: String(y) });
    for (const m of MONTH_SLUGS.pl) params.push({ slug: `${m}-${y}` });
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseCalendarSlug(slug);
  if (!parsed) return {};
  if (parsed.kind === "year") {
    return {
      title: `Kalendarz ${parsed.year} do druku — PDF za darmo`,
      description: `Kalendarz ${parsed.year} do druku: pobierz gotowe pliki PDF wszystkich miesięcy albo wydrukuj bezpośrednio ze strony. Za darmo.`,
      alternates: { canonical: `/kalendarz-do-druku/${parsed.year}` },
      ...yearRobotsMeta(parsed.year),
    };
  }
  const gen = MONTH_NAMES_GENITIVE_PL[parsed.monthIndex];
  return {
    title: `Kalendarz ${gen} ${parsed.year} do druku — PDF`,
    description: `Kalendarz ${gen} ${parsed.year} do druku: podgląd i pobranie PDF gotowego do wydruku. Za darmo.`,
    alternates: { canonical: `/kalendarz-do-druku/${slug}` },
    ...yearRobotsMeta(parsed.year),
  };
}

export default async function PrintPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const parsed = parseCalendarSlug(slug);
  if (!parsed) notFound();

  if (parsed.kind === "year") {
    const { year } = parsed;
    return (
      <PageWithSidebar>
        <BreadcrumbJsonLd items={[{ name: "Kalendarz.pro", path: "/" }, { name: "Do druku", path: "/kalendarz-do-druku" }, { name: String(year), path: `/kalendarz-do-druku/${year}` }]} />
        <nav className="mb-4 text-sm text-slate-500">
          <Link href="/" className="hover:text-navy-600">Kalendarz.pro</Link> / Do druku / {year}
        </nav>
        <h1 className="text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">Kalendarz {year} do druku</h1>
        <p className="mt-2 text-slate-600">Pobierz kalendarz {year} w PDF — wybierz miesiąc do wydruku.</p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {MONTH_NAMES.pl.map((name, m) => (
            <div key={m} className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
              <div className="font-semibold text-navy-800">{name}</div>
              <a
                href={url.pdfMonth(year, m)}
                className="mt-2 inline-block rounded-full bg-brand-green-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-green-700"
              >
                PDF
              </a>
              <Link href={url.printMonth(year, m)} className="mt-2 block text-xs text-navy-600 hover:underline">
                podgląd
              </Link>
            </div>
          ))}
        </div>
      </PageWithSidebar>
    );
  }

  const { year, monthIndex } = parsed;
  const data = buildMonthData(year, monthIndex);
  const gen = MONTH_NAMES_GENITIVE_PL[monthIndex];
  const breaks = schoolBreaks(year);
  const isBreak = (iso: string) => breaks.some((b) => iso >= b.start && iso <= b.end);
  return (
    <PageWithSidebar>
      <BreadcrumbJsonLd items={[{ name: "Kalendarz.pro", path: "/" }, { name: "Do druku", path: `/kalendarz-do-druku/${year}` }, { name: `${MONTH_NAMES.pl[monthIndex]} ${year}`, path: `/kalendarz-do-druku/${slug}` }]} />
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-navy-600">Kalendarz.pro</Link> /{" "}
        <Link href={`/kalendarz-do-druku/${year}`} className="hover:text-navy-600">Do druku {year}</Link> / {MONTH_NAMES.pl[monthIndex]}
      </nav>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">
          Kalendarz {gen} {year} do druku
        </h1>
        <a href={url.pdfMonth(year, monthIndex)} className="rounded-full bg-brand-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-green-700">
          Pobierz PDF
        </a>
      </div>
      <p className="mt-2 text-slate-600">Podgląd kalendarza {gen} {year}. Pobierz PDF lub wydrukuj bezpośrednio.</p>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <CalendarGrid data={data} locale="pl" showMoon={false} isBreak={isBreak} />
      </div>
      <div className="mt-5 flex flex-wrap gap-2 text-sm">
        <Link href={url.month(year, monthIndex)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">
          Kalendarz {gen} {year}
        </Link>
        <Link href={`/kalendarz-do-druku/${year}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">
          Cały rok {year} do druku
        </Link>
      </div>
    </PageWithSidebar>
  );
}
