import Link from "next/link";
import type { Metadata } from "next";
import { ALL_YEARS, isValidYear, MONTH_NAMES_GENITIVE_PL, WEEKDAY_NAMES } from "@/lib/months";
import { buildYearSummary, getISOWeek } from "@/lib/calendar";
import { getNameDays } from "@/lib/nameDays";
import { getUnusualHolidays, dayOfYear } from "@/lib/observances";
import { popularCalendars, nowCtx } from "@/lib/calendars";
import CalendarThumb from "@/components/CalendarThumb";
import CalendarSidebar from "@/components/CalendarSidebar";
import TearOffCalendar from "@/components/TearOffCalendar";
import BlogTeaser from "@/components/BlogTeaser";
import { url } from "@/lib/urls";
import { isoWeekOf } from "@/lib/now";

// Strona pokazuje „dzisiejszą" kartkę — musi się regenerować, nie może być
// zamrożona z czasu builda.
export const revalidate = 600;

export const metadata: Metadata = {
  title: "Kalendarz online — imieniny, święta, dni wolne i do druku PDF",
  description:
    "Kalendarze online i do druku: święta, dni wolne, imieniny, fazy księżyca i numery tygodni. Kartka na każdy dzień i darmowe PDF do pobrania.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const { year: y, month0: m, day: d } = nowCtx();
  const inRange = isValidYear(y);
  const cy = inRange ? y : 2026;
  const cm = inRange ? m : 6;
  const cd = inRange ? d : 4;

  const todayNames = getNameDays(cm, cd);
  const todayUnusual = getUnusualHolidays(cm, cd);
  const weekday = WEEKDAY_NAMES.pl[(new Date(cy, cm, cd).getDay() + 6) % 7];
  const doy = dayOfYear(cy, cm, cd);
  const week = getISOWeek(new Date(Date.UTC(cy, cm, cd)));
  const popular = popularCalendars();

  return (
    <main className="flex-1">
      {/* SLIM HERO */}
      <section className="border-b border-slate-100 bg-gradient-to-br from-navy-700 to-navy-800">
        <div className="mx-auto max-w-6xl px-4 py-9">
          <h1 className="text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl">
            Kalendarze online i do druku
          </h1>
          <p className="mt-2 max-w-xl text-navy-100">
            Miesięczne, roczne, święta, dni wolne, dni robocze, imieniny i PDF — wszystko w jednym miejscu, za darmo.
          </p>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-6xl gap-8 px-4 py-8">
        {/* LEWE MENU */}
        <CalendarSidebar ctx={nowCtx()} className="hidden lg:block" />

        {/* PRAWA KOLUMNA */}
        <div className="min-w-0 flex-1">
          {/* KARTKA ZDZIERAKA */}
          <section className="grid items-start gap-6 lg:grid-cols-[22rem_1fr]">
            <TearOffCalendar year={cy} monthIndex={cm} day={cd} />

            <div className="flex flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-green-600">Dziś jest</p>
              <p className="mt-1 text-2xl font-black capitalize text-navy-800">
                {weekday}, {cd} {MONTH_NAMES_GENITIVE_PL[cm]} {cy}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                <span className="rounded-full bg-navy-50 px-3 py-1 font-medium text-navy-700">{doy}. dzień roku</span>
                <Link
                  href={`/tydzien/${isoWeekOf(cy, cm, cd).isoYear}/${isoWeekOf(cy, cm, cd).week}`}
                  className="rounded-full bg-navy-50 px-3 py-1 font-medium text-navy-700 hover:bg-navy-100"
                >
                  {week}. tydzień →
                </Link>
              </div>
              {todayNames.length > 0 && (
                <p className="mt-3 text-sm text-slate-600">
                  🎂 Imieniny: <span className="font-semibold text-navy-700">{todayNames.join(", ")}</span>
                </p>
              )}
              {todayUnusual.length > 0 && <p className="mt-1 text-sm text-slate-600">📌 {todayUnusual.join(" · ")}</p>}

              <div className="mt-5 flex flex-wrap gap-2 text-sm">
                <Link href={url.month(cy, cm)} className="rounded-lg bg-navy-600 px-4 py-2 font-semibold text-white hover:bg-navy-700">
                  Kalendarz {MONTH_NAMES_GENITIVE_PL[cm]} {cy}
                </Link>
                <Link href={url.printMonth(cy, cm)} className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">
                  Do druku (PDF)
                </Link>
                <Link href={`/dni-wolne-od-pracy/${cy}`} className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">
                  Dni wolne {cy}
                </Link>
                <Link href={`/dlugie-weekendy/${cy}`} className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">
                  Długie weekendy {cy}
                </Link>
              </div>
            </div>
          </section>

          {/* POPULARNE */}
          <section className="mt-12">
            <div className="mb-4 flex items-end justify-between">
              <h2 className="text-xl font-bold text-navy-800">Najpopularniejsze kalendarze</h2>
              <Link href="/kalendarze" className="shrink-0 text-sm font-semibold text-navy-600 hover:text-brand-green-600">
                Wszystkie →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {popular.map((c) => (
                <Link
                  key={c.slug}
                  href={c.href(nowCtx())}
                  className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-md"
                >
                  <CalendarThumb thumb={c.thumb} slug={c.slug} alt={c.label} size={40} />
                  <span className="text-sm font-semibold text-navy-800">{c.label}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Z BLOGA */}
          <BlogTeaser />

          {/* LATA */}
          <section className="mt-12">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-navy-800">Kalendarz na rok</h2>
              <p className="mt-1 text-sm text-slate-500">Dostępne lata od 1900 do 2100.</p>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {ALL_YEARS.map((year) => {
                const summary = buildYearSummary(year);
                const isCurrent = year === cy;
                return (
                  <Link
                    key={year}
                    href={url.year(year)}
                    className={`rounded-2xl border p-3 text-center transition hover:-translate-y-0.5 hover:shadow-md ${
                      isCurrent
                        ? "border-brand-green-500 bg-brand-green-50 ring-1 ring-brand-green-500"
                        : "border-slate-200 bg-white hover:border-navy-300"
                    }`}
                  >
                    <div className="text-xl font-black text-navy-800">{year}</div>
                    <div className="mt-0.5 text-[11px] text-slate-500">{summary.nonWorkingDaysCount} dni wolnych</div>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
