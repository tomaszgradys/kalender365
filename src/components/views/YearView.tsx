import Link from "next/link";
import { MONTH_NAMES, isNavigableYear } from "@/lib/months";
import { buildMonthData, buildYearSummary } from "@/lib/calendar";
import { getNonWorkingHolidays } from "@/lib/holidays";
import { schoolBreaks } from "@/lib/vacationPlanner";
import { url } from "@/lib/urls";
import MiniMonth from "@/components/MiniMonth";
import PageWithSidebar from "@/components/PageWithSidebar";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

export default function YearView({ year }: { year: number }) {
  const summary = buildYearSummary(year);
  const holidays = getNonWorkingHolidays(year);
  // Dni wolne od szkoły niezależne od województwa: wakacje + przerwy świąteczne.
  const breaks = schoolBreaks(year);
  const isBreak = (iso: string) => breaks.some((b) => iso >= b.start && iso <= b.end);

  return (
    <PageWithSidebar relatedExclude={["kalendarz-roczny"]}>
      <BreadcrumbJsonLd
        items={[
          { name: "Kalendarz.pro", path: "/" },
          { name: "Kalendarz", path: "/kalendarz" },
          { name: String(year), path: url.year(year) },
        ]}
      />
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-navy-600">
          Kalendarz.pro
        </Link>{" "}
        /{" "}
        <Link href="/kalendarz" className="hover:text-navy-600">
          Kalendarz
        </Link>{" "}
        / {year}
      </nav>
      <h1 className="text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">Kalendarz {year}</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Kalendarz na cały {year} rok — wszystkie 12 miesięcy, święta, dni wolne od pracy, dni robocze i
        numery tygodni. Kliknij miesiąc, aby zobaczyć szczegóły i pobrać PDF do druku.
      </p>

      <div className="mt-5 flex flex-wrap gap-2 text-sm">
        <span className="rounded-full bg-navy-50 px-3 py-1 font-medium text-navy-700">
          {summary.isLeap ? "Rok przestępny" : "Rok zwykły"} · {summary.isLeap ? 366 : 365} dni
        </span>
        <span className="rounded-full bg-brand-green-50 px-3 py-1 font-medium text-brand-green-700">
          {summary.workingDaysCount} dni roboczych
        </span>
        <span className="rounded-full bg-rose-50 px-3 py-1 font-medium text-rose-700">
          {summary.nonWorkingDaysCount} dni wolnych
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">
          {summary.holidaysCount} świąt
        </span>
      </div>

      {/* legenda kolorów */}
      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded bg-rose-100 ring-1 ring-rose-300" /> święto / dzień wolny</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded bg-amber-100 ring-1 ring-amber-300" /> wakacje i przerwy szkolne</span>
        <span className="inline-flex items-center gap-1.5"><span className="text-rose-400">7</span> weekend</span>
        <Link href={`/ferie-zimowe/${year}`} className="font-medium text-navy-600 hover:text-brand-green-600">ferie zimowe wg województwa →</Link>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {MONTH_NAMES.pl.map((name, i) => {
          const data = buildMonthData(year, i);
          return <MiniMonth key={i} data={data} locale="pl" href={url.month(year, i)} monthName={name} isBreak={isBreak} />;
        })}
      </div>

      {/* szybkie linki i pobieranie — pod kalendarzem, żeby na mobile siatka miesięcy
          była widoczna od razu (główna intencja zapytania „kalendarz {rok}") */}
      <div className="mt-6 flex flex-wrap gap-2 text-sm">
        <Link href={`/dni-wolne-od-pracy/${year}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">
          Dni wolne {year}
        </Link>
        <Link href={`/dni-robocze/${year}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">
          Dni robocze {year}
        </Link>
        <Link href={`/dlugie-weekendy/${year}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">
          Długie weekendy {year}
        </Link>
        <Link href={`/swieta/${year}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">
          Święta {year}
        </Link>
        <Link href={`/fazy-ksiezyca/${year}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">
          Fazy księżyca {year}
        </Link>
        <Link href={url.printYear(year)} className="rounded-lg bg-brand-green-600 px-3 py-1.5 font-semibold text-white hover:bg-brand-green-700">
          Kalendarz {year} do druku
        </Link>
        <a href={`/api/ics/dni-wolne/${year}`} className="rounded-lg border border-brand-green-200 bg-brand-green-50 px-3 py-1.5 font-medium text-brand-green-700 hover:bg-brand-green-100">
          📅 Święta do kalendarza (.ics)
        </a>
        <a href={`/api/pdf/rok/${year}`} className="rounded-lg bg-navy-600 px-3 py-1.5 font-semibold text-white hover:bg-navy-700">
          ⬇ Cały rok {year} na 1 stronie (PDF)
        </a>
      </div>

      <section className="mt-12">
        <h2 className="mb-3 text-lg font-bold text-navy-800">Święta i dni wolne w {year} roku</h2>
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {holidays.map((h) => (
            <li key={h.date} className="flex items-center justify-between px-4 py-2.5 text-sm">
              <span className="text-slate-700">{h.name.pl}</span>
              <span className="font-mono text-slate-500">{h.date}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8 flex justify-between text-sm">
        {isNavigableYear(year - 1) ? (
          <Link href={url.year(year - 1)} className="font-medium text-navy-600 hover:underline">
            ← Kalendarz {year - 1}
          </Link>
        ) : (
          <span />
        )}
        {isNavigableYear(year + 1) && (
          <Link href={url.year(year + 1)} className="font-medium text-navy-600 hover:underline">
            Kalendarz {year + 1} →
          </Link>
        )}
      </div>
    </PageWithSidebar>
  );
}
