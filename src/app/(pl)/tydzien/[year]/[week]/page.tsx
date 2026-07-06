import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ALL_YEARS, isValidYear, isNavigableYear, yearRobotsMeta, WEEKDAY_NAMES, MONTH_NAMES } from "@/lib/months";
import {
  getISOWeekRange,
  isoWeeksInYear,
  isValidWeek,
  formatDatePL,
  formatDateShort,
} from "@/lib/weeks";
import { url } from "@/lib/urls";
import PageWithSidebar from "@/components/PageWithSidebar";
import FaqSection from "@/components/FaqSection";

export function generateStaticParams() {
  const params: { year: string; week: string }[] = [];
  for (const year of ALL_YEARS) {
    const weeks = isoWeeksInYear(year);
    for (let w = 1; w <= weeks; w++) params.push({ year: String(year), week: String(w) });
  }
  return params;
}

function parse(yearParam: string, weekParam: string) {
  const year = Number(yearParam);
  const week = Number(weekParam);
  if (!isValidYear(year) || !isValidWeek(year, week)) return null;
  return { year, week };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string; week: string }>;
}): Promise<Metadata> {
  const { year: y, week: w } = await params;
  const parsed = parse(y, w);
  if (!parsed) return {};
  const { year, week } = parsed;
  const range = getISOWeekRange(year, week);
  return {
    title: `${week}. tydzień ${year} — daty ${formatDateShort(range.start)}–${formatDateShort(range.end)}`,
    description: `${week} tydzień roku ${year} trwa od ${formatDatePL(range.start)} do ${formatDatePL(range.end)}. Sprawdź numer tygodnia kalendarzowego wg ISO 8601.`,
    alternates: { canonical: `/tydzien/${year}/${week}` },
    ...yearRobotsMeta(year),
  };
}

export default async function WeekPage({
  params,
}: {
  params: Promise<{ year: string; week: string }>;
}) {
  const { year: y, week: w } = await params;
  const parsed = parse(y, w);
  if (!parsed) notFound();
  const { year, week } = parsed;
  const range = getISOWeekRange(year, week);
  const totalWeeks = isoWeeksInYear(year);

  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(range.start);
    d.setUTCDate(range.start.getUTCDate() + i);
    days.push(d);
  }

  const prevWeek = week > 1 ? { year, week: week - 1 } : null;
  const nextWeek = week < totalWeeks ? { year, week: week + 1 } : null;

  // Miesiące, przez które przechodzi ten tydzień (do linkowania kontekstowego).
  const monthsSpan = Array.from(new Set(days.map((d) => d.getUTCMonth()))).map((m) => ({
    m,
    href: url.month(year, m),
    name: MONTH_NAMES.pl[m],
  }));

  // Ten sam numer tygodnia w sąsiednich latach.
  const otherYears = [year - 2, year - 1, year + 1, year + 2].filter(
    (y) => isNavigableYear(y) && week <= isoWeeksInYear(y),
  );

  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Kalendarz.pro", item: "/" },
      { "@type": "ListItem", position: 2, name: String(year), item: url.year(year) },
      { "@type": "ListItem", position: 3, name: `${week}. tydzień`, item: `/tydzien/${year}/${week}` },
    ],
  };

  const FAQ = [
    {
      q: `Od kiedy do kiedy trwa ${week}. tydzień ${year}?`,
      a: `${week}. tydzień ${year} trwa od ${formatDatePL(range.start)} (poniedziałek) do ${formatDatePL(range.end)} (niedziela), zgodnie z normą ISO 8601.`,
    },
    {
      q: `Ile tygodni ma rok ${year}?`,
      a: `Rok ${year} ma ${totalWeeks} tygodni kalendarzowych według ISO 8601.`,
    },
    {
      q: "Od którego dnia zaczyna się tydzień?",
      a: "W numeracji ISO 8601 (stosowanej w Polsce i Europie) tydzień zaczyna się w poniedziałek, a kończy w niedzielę.",
    },
  ];

  return (
    <PageWithSidebar relatedExclude={["numery-tygodni"]}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-navy-600">
          Kalendarz.pro
        </Link>{" "}
        /{" "}
        <Link href={url.year(year)} className="hover:text-navy-600">
          {year}
        </Link>{" "}
        / Tydzień {week}
      </nav>

      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-navy-600 to-brand-green-600 p-8 text-center text-white shadow-lg">
        <p className="text-sm font-medium uppercase tracking-widest text-white/80">
          Tydzień kalendarzowy {year}
        </p>
        <div className="mt-2 text-7xl font-black">{week}</div>
        <p className="mt-3 text-lg text-white/90">
          od {formatDatePL(range.start)} do {formatDatePL(range.end)}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-7">
        {days.map((d, i) => (
          <Link
            key={i}
            href={url.day(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())}
            className="rounded-xl border border-slate-200 p-3 text-center transition hover:border-navy-300 hover:shadow-sm"
          >
            <div className="text-[11px] uppercase text-slate-500">{WEEKDAY_NAMES.pl[i].slice(0, 3)}</div>
            <div className="text-xl font-bold text-slate-800">{d.getUTCDate()}</div>
            <div className="text-[10px] text-slate-500">{formatDateShort(d).slice(3)}</div>
          </Link>
        ))}
      </div>

      <div className="mt-5">
        <Link href={`/tydzien/${year}`} className="inline-flex items-center gap-1 rounded-xl bg-navy-50 px-4 py-2 text-sm font-semibold text-navy-700 hover:bg-navy-100">
          📋 Zobacz wszystkie tygodnie {year} (tabela)
        </Link>
      </div>

      <div className="mt-8 flex items-center justify-between">
        {prevWeek ? (
          <Link
            href={`/tydzien/${prevWeek.year}/${prevWeek.week}`}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:border-navy-300 hover:text-navy-600"
          >
            ← Tydzień {prevWeek.week}
          </Link>
        ) : (
          <span />
        )}
        {nextWeek && (
          <Link
            href={`/tydzien/${nextWeek.year}/${nextWeek.week}`}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:border-navy-300 hover:text-navy-600"
          >
            Tydzień {nextWeek.week} →
          </Link>
        )}
      </div>

      <section className="mt-10 flex flex-wrap gap-2">
        <span className="w-full text-sm font-semibold text-navy-800">Ten tydzień w kalendarzu miesięcznym:</span>
        {monthsSpan.map((m) => (
          <Link
            key={m.m}
            href={m.href}
            className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600"
          >
            Kalendarz {m.name.toLowerCase()} {year}
          </Link>
        ))}
      </section>

      {otherYears.length > 0 && (
        <section className="mt-6 flex flex-wrap gap-2">
          <span className="w-full text-sm font-semibold text-navy-800">
            {week}. tydzień w innych latach:
          </span>
          {otherYears.map((y) => (
            <Link
              key={y}
              href={`/tydzien/${y}/${week}`}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600"
            >
              {week}. tydzień {y}
            </Link>
          ))}
        </section>
      )}

      <section className="mt-10 max-w-2xl space-y-4 text-sm leading-relaxed text-slate-600">
        <h2 className="text-xl font-bold text-navy-800">Co to jest tydzień kalendarzowy?</h2>
        <p>
          Tydzień kalendarzowy (tydzień ISO) to sposób numerowania tygodni w roku zgodnie z normą ISO
          8601. Tydzień zaczyna się w poniedziałek, a kończy w niedzielę. Pierwszym tygodniem roku jest
          ten, który zawiera pierwszy czwartek stycznia — czyli obejmuje co najmniej 4 dni nowego roku.
        </p>
        <p>
          Rok {year} ma <strong>{totalWeeks} tygodni</strong> kalendarzowych. <strong>{week}. tydzień {year}</strong>{" "}
          trwa od {formatDatePL(range.start)} do {formatDatePL(range.end)} i obejmuje dni od{" "}
          {formatDateShort(range.start)} do {formatDateShort(range.end)}.
        </p>
        <p>
          Numer tygodnia jest przydatny w pracy, logistyce i planowaniu projektów. Aby sprawdzić numer
          tygodnia dla konkretnej daty, użyj narzędzia{" "}
          <Link href="/dzien-tygodnia" className="text-navy-600 hover:underline">
            jaki to dzień tygodnia
          </Link>
          .
        </p>
      </section>

      <FaqSection items={FAQ} />
    </PageWithSidebar>
  );
}
