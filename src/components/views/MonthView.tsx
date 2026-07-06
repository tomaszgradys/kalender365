import Link from "next/link";
import { MONTH_NAMES, MONTH_NAMES_GENITIVE_PL, MONTH_NAMES_LOCATIVE_PL, isNavigableYear } from "@/lib/months";
import { buildMonthData } from "@/lib/calendar";
import { schoolBreaks } from "@/lib/vacationPlanner";
import { url } from "@/lib/urls";
import CalendarGrid from "@/components/CalendarGrid";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import PageWithSidebar from "@/components/PageWithSidebar";

export default function MonthView({ year, monthIndex }: { year: number; monthIndex: number }) {
  const data = buildMonthData(year, monthIndex);
  const gen = MONTH_NAMES_GENITIVE_PL[monthIndex];
  const loc = MONTH_NAMES_LOCATIVE_PL[monthIndex];
  const name = MONTH_NAMES.pl[monthIndex];
  const breaks = schoolBreaks(year);
  const isBreak = (iso: string) => breaks.some((b) => iso >= b.start && iso <= b.end);

  const prevMonth = monthIndex === 0 ? { y: year - 1, m: 11 } : { y: year, m: monthIndex - 1 };
  const nextMonth = monthIndex === 11 ? { y: year + 1, m: 0 } : { y: year, m: monthIndex + 1 };

  const faq = [
    {
      q: `Ile dni ma ${name} ${year}?`,
      a: `${name} ${year} ma ${data.daysInMonth} dni, w tym ${data.workingDaysCount} dni roboczych i ${data.nonWorkingCount} dni wolnych.`,
    },
    {
      q: `Ile dni roboczych ma ${name} ${year}?`,
      a: `W ${loc} ${year} jest ${data.workingDaysCount} dni roboczych.`,
    },
    {
      q: `Jakie święta są w ${loc} ${year}?`,
      a:
        data.holidaysInMonth.length > 0
          ? `Święta ustawowo wolne w ${loc} ${year}: ${data.holidaysInMonth.map((h) => h.name.pl).join(", ")}.`
          : `W ${loc} ${year} nie ma dni ustawowo wolnych od pracy.`,
    },
  ];
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <PageWithSidebar relatedExclude={["kalendarz-miesieczny"]}>
      <BreadcrumbJsonLd
        items={[
          { name: "Kalendarz.pro", path: "/" },
          { name: String(year), path: url.year(year) },
          { name, path: url.month(year, monthIndex) },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-navy-600">
          Kalendarz.pro
        </Link>{" "}
        /{" "}
        <Link href={url.year(year)} className="hover:text-navy-600">
          {year}
        </Link>{" "}
        / {name}
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">
          Kalendarz {gen} {year}
        </h1>
        <div className="flex gap-2 no-print">
          <a
            href={url.pdfMonth(year, monthIndex)}
            className="rounded-full bg-brand-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-green-700"
          >
            ⬇ Pobierz PDF
          </a>
        </div>
      </div>

      <p className="mt-2 max-w-2xl text-slate-600">
        {name} {year} ma {data.daysInMonth} dni: {data.workingDaysCount} dni roboczych,{" "}
        {data.weekendDaysCount} dni weekendowych
        {data.holidaysInMonth.length > 0
          ? ` i ${data.holidaysInMonth.length} dni ustawowo wolnych`
          : " i brak dni ustawowo wolnych"}
        . Sprawdź kalendarz online lub pobierz go w PDF.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Dni w miesiącu" value={data.daysInMonth} />
        <Stat label="Dni robocze" value={data.workingDaysCount} accent />
        <Stat label="Dni wolne" value={data.nonWorkingCount} />
        <Stat label="Tygodnie ISO" value={`${data.firstIsoWeek}–${data.lastIsoWeek}`} />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:p-4">
        <CalendarGrid data={data} locale="pl" dayHref={(d) => url.day(year, monthIndex, d)} isBreak={isBreak} />
      </div>

      {/* Nawigacja miesięcy TUŻ POD kalendarzem — jedno kliknięcie zmienia miesiąc. */}
      <div className="mt-3 flex items-center justify-between gap-2 no-print">
        {isNavigableYear(prevMonth.y) ? (
          <Link
            href={url.month(prevMonth.y, prevMonth.m)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-navy-300 hover:text-navy-600"
          >
            ← {MONTH_NAMES.pl[prevMonth.m]}
          </Link>
        ) : (
          <span />
        )}
        <Link
          href={url.year(year)}
          className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200"
        >
          Cały rok {year}
        </Link>
        {isNavigableYear(nextMonth.y) ? (
          <Link
            href={url.month(nextMonth.y, nextMonth.m)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-navy-300 hover:text-navy-600"
          >
            {MONTH_NAMES.pl[nextMonth.m]} →
          </Link>
        ) : (
          <span />
        )}
      </div>

      {/* linki powiązane */}
      <div className="mt-5 flex flex-wrap gap-2 text-sm">
        <Link href={url.printMonth(year, monthIndex)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">
          {name} {year} do druku
        </Link>
        <Link href={`/fazy-ksiezyca/${year}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">
          Fazy księżyca {year}
        </Link>
        <Link href={`/dni-wolne-od-pracy/${year}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">
          Dni wolne {year}
        </Link>
        <Link href={url.year(year)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">
          Cały rok {year}
        </Link>
      </div>

      {(data.holidaysInMonth.length > 0 || data.fullMoons.length > 0 || data.newMoons.length > 0) && (
        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          {data.holidaysInMonth.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h2 className="mb-2 text-sm font-bold text-navy-800">Święta w tym miesiącu</h2>
              <ul className="space-y-1 text-sm text-slate-600">
                {data.holidaysInMonth.map((h) => (
                  <li key={h.date}>
                    <span className="font-mono text-slate-500">{h.date}</span> — {h.name.pl}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {(data.fullMoons.length > 0 || data.newMoons.length > 0) && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h2 className="mb-2 text-sm font-bold text-navy-800">Fazy księżyca</h2>
              <ul className="space-y-1 text-sm text-slate-600">
                {data.newMoons.map((d) => (
                  <li key={d}>🌑 Nów: {d}</li>
                ))}
                {data.fullMoons.map((d) => (
                  <li key={d}>🌕 Pełnia: {d}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="mb-3 text-lg font-bold text-navy-800">Najczęstsze pytania</h2>
        <div className="space-y-3">
          {faq.map((f) => (
            <div key={f.q} className="rounded-2xl border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-navy-800">{f.q}</h3>
              <p className="mt-1 text-sm text-slate-600">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-10 flex justify-between text-sm">
        {isNavigableYear(prevMonth.y) ? (
          <Link href={url.month(prevMonth.y, prevMonth.m)} className="font-medium text-navy-600 hover:underline">
            ← {MONTH_NAMES.pl[prevMonth.m]} {prevMonth.y}
          </Link>
        ) : (
          <span />
        )}
        {isNavigableYear(nextMonth.y) && (
          <Link href={url.month(nextMonth.y, nextMonth.m)} className="font-medium text-navy-600 hover:underline">
            {MONTH_NAMES.pl[nextMonth.m]} {nextMonth.y} →
          </Link>
        )}
      </div>
    </PageWithSidebar>
  );
}

function Stat({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={`rounded-xl px-3 py-3 text-center ${accent ? "bg-brand-green-50" : "bg-slate-50"}`}>
      <div className={`text-xl font-black ${accent ? "text-brand-green-700" : "text-navy-800"}`}>{value}</div>
      <div className="text-[11px] text-slate-500">{label}</div>
    </div>
  );
}
