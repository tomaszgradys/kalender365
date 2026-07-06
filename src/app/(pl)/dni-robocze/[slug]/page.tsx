import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  STATIC_YEARS,
  MONTH_SLUGS,
  MONTH_NAMES,
  MONTH_NAMES_GENITIVE_PL,
  parseCalendarSlug,
  isNavigableYear,
  yearRobotsMeta,
} from "@/lib/months";
import { workingDaysByMonth, workingDaysInMonth, laborWorkingDays, saturdayHolidays } from "@/lib/workdays";
import { buildYearSummary } from "@/lib/calendar";
import { url } from "@/lib/urls";
import PageWithSidebar from "@/components/PageWithSidebar";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import TableExport from "@/components/TableExport";
import { ogType } from "@/lib/ogType";

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
    const s = buildYearSummary(parsed.year);
    return {
      title: `Dni robocze ${parsed.year} — ile dni roboczych w roku i miesiącach`,
      description: `W ${parsed.year} roku jest ${s.workingDaysCount} dni roboczych. Zobacz liczbę dni roboczych w każdym miesiącu ${parsed.year}.`,
      alternates: { canonical: `/dni-robocze/${parsed.year}` },
      ...ogType("dni-robocze"),
      ...yearRobotsMeta(parsed.year),
    };
  }
  const { year, monthIndex } = parsed;
  const gen = MONTH_NAMES_GENITIVE_PL[monthIndex];
  const w = workingDaysInMonth(year, monthIndex);
  return {
    title: `Dni robocze ${gen} ${year} — ${w.working} dni roboczych`,
    description: `${MONTH_NAMES.pl[monthIndex]} ${year} ma ${w.working} dni roboczych i ${w.free} dni wolnych. Sprawdź kalendarz dni roboczych.`,
    alternates: { canonical: `/dni-robocze/${slug}` },
    ...ogType("dni-robocze"),
    ...yearRobotsMeta(year),
  };
}

export default async function WorkdaysPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const parsed = parseCalendarSlug(slug);
  if (!parsed) notFound();

  if (parsed.kind === "year") {
    const { year } = parsed;
    const months = workingDaysByMonth(year);
    const total = buildYearSummary(year);
    return (
      <PageWithSidebar>
        <BreadcrumbJsonLd items={[{ name: "Kalendarz.pro", path: "/" }, { name: "Dni robocze", path: "/dni-robocze" }, { name: String(year), path: `/dni-robocze/${year}` }]} />
        <nav className="mb-4 text-sm text-slate-500">
          <Link href="/" className="hover:text-navy-600">Kalendarz.pro</Link> / Dni robocze / {year}
        </nav>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">Dni robocze {year}</h1>
          <div className="flex items-center gap-2 text-sm">
            {isNavigableYear(year - 1) && (
              <Link href={`/dni-robocze/${year - 1}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-600 hover:border-navy-300 hover:text-navy-600">← {year - 1}</Link>
            )}
            {isNavigableYear(year + 1) && (
              <Link href={`/dni-robocze/${year + 1}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-600 hover:border-navy-300 hover:text-navy-600">{year + 1} →</Link>
            )}
          </div>
        </div>
        <p className="mt-2 text-slate-600">
          W {year} roku jest <strong>{total.workingDaysCount} dni roboczych</strong> (dni pon–pt bez świąt) i{" "}
          {total.nonWorkingDaysCount} dni wolnych.
          {saturdayHolidays(year).length > 0 && (
            <>
              {" "}
              Wymiar czasu pracy wynosi <strong>{laborWorkingDays(year)} dni</strong> — o{" "}
              {saturdayHolidays(year).length} mniej, bo tyle świąt wypada w sobotę (pracodawca oddaje
              za nie dzień wolny).
            </>
          )}
        </p>
        <div className="mt-5">
          <TableExport
            headers={["Miesiąc", "Dni robocze", "Dni wolne"]}
            rows={months.map((m) => [MONTH_NAMES.pl[m.month0], m.workingDays, m.freeDays])}
            filename={`dni-robocze-${year}`}
          />
        </div>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Miesiąc</th>
                <th className="px-4 py-2 text-right font-medium">Dni robocze</th>
                <th className="px-4 py-2 text-right font-medium">Dni wolne</th>
              </tr>
            </thead>
            <tbody>
              {months.map((m) => (
                <tr key={m.month0} className="border-t border-slate-100">
                  <td className="px-4 py-2">
                    <Link href={`/dni-robocze/${MONTH_SLUGS.pl[m.month0]}-${year}`} className="text-navy-600 hover:underline">
                      {MONTH_NAMES.pl[m.month0]}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-slate-700">{m.workingDays}</td>
                  <td className="px-4 py-2 text-right font-mono text-slate-500">{m.freeDays}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageWithSidebar>
    );
  }

  const { year, monthIndex } = parsed;
  const w = workingDaysInMonth(year, monthIndex);
  const gen = MONTH_NAMES_GENITIVE_PL[monthIndex];
  return (
    <PageWithSidebar>
      <BreadcrumbJsonLd items={[{ name: "Kalendarz.pro", path: "/" }, { name: "Dni robocze", path: `/dni-robocze/${year}` }, { name: `${MONTH_NAMES.pl[monthIndex]} ${year}`, path: `/dni-robocze/${slug}` }]} />
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-navy-600">Kalendarz.pro</Link> /{" "}
        <Link href={`/dni-robocze/${year}`} className="hover:text-navy-600">Dni robocze {year}</Link> / {MONTH_NAMES.pl[monthIndex]}
      </nav>
      <h1 className="text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">Dni robocze — {gen} {year}</h1>
      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-brand-green-50 px-3 py-4 text-center">
          <div className="text-2xl font-black text-brand-green-700">{w.working}</div>
          <div className="text-[11px] text-slate-500">dni robocze</div>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-4 text-center">
          <div className="text-2xl font-black text-navy-800">{w.free}</div>
          <div className="text-[11px] text-slate-500">dni wolne</div>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-4 text-center">
          <div className="text-2xl font-black text-navy-800">{w.total}</div>
          <div className="text-[11px] text-slate-500">dni razem</div>
        </div>
      </div>
      <p className="mt-4 text-slate-600">
        {MONTH_NAMES.pl[monthIndex]} {year} ma {w.working} dni roboczych.
      </p>
      <div className="mt-5 flex flex-wrap gap-2 text-sm">
        <Link href={url.month(year, monthIndex)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">
          Kalendarz {gen} {year}
        </Link>
        <Link href={`/dni-robocze/${year}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">
          Dni robocze cały {year}
        </Link>
      </div>
    </PageWithSidebar>
  );
}
