import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ALL_YEARS, isValidYear, isNavigableYear, yearRobotsMeta } from "@/lib/months";
import { getPolishHolidays } from "@/lib/holidays";
import { buildYearSummary } from "@/lib/calendar";
import { url } from "@/lib/urls";
import { ogType } from "@/lib/ogType";
import PageWithSidebar from "@/components/PageWithSidebar";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import FaqSection from "@/components/FaqSection";
import TableExport from "@/components/TableExport";

export function generateStaticParams() {
  return ALL_YEARS.map((year) => ({ year: String(year) }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year: yearParam } = await params;
  const year = Number(yearParam);
  return {
    title: `Dni wolne od pracy ${year} — pełna lista świąt`,
    description: `Wszystkie dni wolne od pracy w ${year} roku: święta państwowe i kościelne z datami i dniami tygodnia. Sprawdź, kiedy nie pracujesz w ${year}.`,
    alternates: { canonical: `/dni-wolne-od-pracy/${year}` },
    ...ogType("dni-wolne-od-pracy"),
    ...yearRobotsMeta(year),
  };
}

const WEEKDAY_PL = ["poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota", "niedziela"];
const weekdayIdx = (iso: string) => (new Date(iso + "T00:00:00Z").getUTCDay() + 6) % 7;

export default async function NonWorkingDaysPage({ params }: { params: Promise<{ year: string }> }) {
  const { year: yearParam } = await params;
  const year = Number(yearParam);
  if (!isValidYear(year)) notFound();

  // Pełna lista 13 świąt ustawowo wolnych (z Niedzielą Wielkanocną — jest dniem
  // ustawowo wolnym; poprzednio pomijana zaniżała liczbę do 12 vs kanonicznych 13).
  const holidays = getPolishHolidays(year);
  const summary = buildYearSummary(year);
  const prev = year - 1;
  const next = year + 1;

  const satHolidays = holidays.filter((h) => weekdayIdx(h.date) === 5);
  const sunHolidays = holidays.filter((h) => weekdayIdx(h.date) === 6);
  const weekendHolidays = [...satHolidays, ...sunHolidays];
  const midweekHolidays = holidays.filter((h) => {
    const w = weekdayIdx(h.date);
    return w >= 1 && w <= 3; // wt–czw = najlepszy potencjał na mostek
  });

  const rows = holidays.map((h) => [h.name.pl, WEEKDAY_PL[weekdayIdx(h.date)], h.date]);

  const faq = [
    {
      q: `Ile jest dni wolnych od pracy w ${year} roku?`,
      a: `W ${year} roku przypada ${holidays.length} dni ustawowo wolnych od pracy (świąt). Łącznie z weekendami daje to ${summary.nonWorkingDaysCount} dni wolnych w całym roku.`,
    },
    {
      q: `Czy święta w sobotę dają dodatkowy dzień wolny w ${year}?`,
      a:
        satHolidays.length > 0
          ? `Tak. W ${year} w sobotę wypada ${satHolidays.length} ${satHolidays.length === 1 ? "święto" : "święta"}: ${satHolidays.map((h) => h.name.pl).join(", ")}. Za każde święto przypadające w sobotę pracodawca ma obowiązek oddać inny dzień wolny (art. 130 §2 Kodeksu pracy).`
          : `W ${year} żadne święto ustawowo wolne nie wypada w sobotę, więc nie przysługuje dodatkowy dzień wolny do odbioru z tego tytułu.`,
    },
    {
      q: `Które święta w ${year} wypadają w niedzielę?`,
      a:
        sunHolidays.length > 0
          ? `W niedzielę wypada ${sunHolidays.length} ${sunHolidays.length === 1 ? "święto" : "świąt/święta"}: ${sunHolidays.map((h) => h.name.pl).join(", ")}. Nie dają one dodatkowego dnia wolnego, bo niedziela jest już dniem wolnym.`
          : `W ${year} żadne święto ustawowo wolne nie wypada w niedzielę.`,
    },
    {
      q: `Jak zaplanować długie weekendy w ${year}?`,
      a: `Najwięcej zyskujesz na świętach wypadających we wtorek, środę lub czwartek — jednym–dwoma dniami urlopu domykasz cały długi weekend. Gotowe zestawienie znajdziesz w zakładce długie weekendy ${year}.`,
    },
    {
      q: `Czym różnią się dni wolne od dni roboczych?`,
      a: `Dni wolne to weekendy i święta ustawowo wolne od pracy. Dni robocze to pozostałe dni (pon–pt bez świąt). W ${year} jest ${summary.workingDaysCount ?? "—"} dni roboczych.`,
    },
  ];

  return (
    <PageWithSidebar relatedExclude={["dni-wolne-od-pracy"]}>
      <BreadcrumbJsonLd
        items={[
          { name: "Kalendarz.pro", path: "/" },
          { name: "Dni wolne od pracy", path: "/dni-wolne-od-pracy/2026" },
          { name: String(year), path: `/dni-wolne-od-pracy/${year}` },
        ]}
      />
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-navy-600">Kalendarz.pro</Link> / Dni wolne od pracy / {year}
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">Dni wolne od pracy {year}</h1>
        <YearNav prev={prev} next={next} basePath="/dni-wolne-od-pracy" />
      </div>

      <p className="mt-3 max-w-2xl text-slate-600">
        W {year} roku przypada {holidays.length} świąt ustawowo wolnych od pracy oraz{" "}
        {summary.nonWorkingDaysCount} dni wolnych łącznie z weekendami. Poniżej pełna lista z datami i dniami
        tygodnia — możesz ją skopiować lub pobrać do Excela.
      </p>

      {/* Skanowalny blok liczb — najważniejsza odpowiedź nad zgięciem (pod featured snippet). */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-rose-50 px-3 py-4 text-center">
          <div className="text-3xl font-black text-rose-600">{holidays.length}</div>
          <div className="mt-0.5 text-xs text-slate-600">świąt wolnych od pracy</div>
        </div>
        <div className="rounded-2xl bg-brand-green-50 px-3 py-4 text-center">
          <div className="text-3xl font-black text-brand-green-700">{summary.nonWorkingDaysCount}</div>
          <div className="mt-0.5 text-xs text-slate-600">dni wolnych łącznie</div>
        </div>
        <div className="rounded-2xl bg-navy-50 px-3 py-4 text-center">
          <div className="text-3xl font-black text-navy-700">{summary.workingDaysCount}</div>
          <div className="mt-0.5 text-xs text-slate-600">dni roboczych</div>
        </div>
      </div>

      <Link
        href={`/planer-urlopu/${year}`}
        className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-green-100 bg-brand-green-50 p-4 transition hover:border-brand-green-300"
      >
        <span className="text-sm text-slate-700">
          <strong className="text-navy-800">🏖️ Planer urlopu {year}</strong> — oblicz, kiedy wziąć urlop, by
          zyskać najwięcej dni wolnego.
        </span>
        <span className="shrink-0 rounded-full bg-brand-green-600 px-4 py-2 text-sm font-semibold text-white">Zaplanuj urlop →</span>
      </Link>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <TableExport
          headers={["Święto", "Dzień tygodnia", "Data"]}
          rows={rows}
          filename={`dni-wolne-od-pracy-${year}`}
        />
        <a
          href={`/api/ics/dni-wolne/${year}`}
          className="rounded-lg border border-brand-green-200 bg-brand-green-50 px-3 py-1.5 text-sm font-medium text-brand-green-700 hover:bg-brand-green-100"
        >
          📅 Dodaj do kalendarza (.ics)
        </a>
        <Link href="/dni-wolne-do-kalendarza" className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:border-navy-300 hover:text-navy-600">
          Jak dodać do Google/Apple?
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-navy-50 text-left text-navy-800">
              <th className="px-4 py-2.5 font-semibold">Święto</th>
              <th className="px-4 py-2.5 font-semibold">Dzień tygodnia</th>
              <th className="px-4 py-2.5 text-right font-semibold">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {holidays.map((h) => {
              const w = weekdayIdx(h.date);
              const weekend = w >= 5;
              return (
                <tr key={h.date} className={weekend ? "bg-slate-50/60" : ""}>
                  <td className="px-4 py-3 font-medium text-slate-800">{h.name.pl}</td>
                  <td className={`px-4 py-3 capitalize ${weekend ? "text-red-500" : "text-slate-500"}`}>{WEEKDAY_PL[w]}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-600">{h.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* SEO / CIEKAWOSTKI */}
      <section className="mt-8 space-y-3 text-slate-600">
        <h2 className="text-xl font-bold text-navy-800">Ile dni wolnych od pracy w {year} roku?</h2>
        <p>
          Kalendarz świąt państwowych i kościelnych w Polsce obejmuje 13 dni ustawowo wolnych od pracy.
          Część z nich ma stałą datę (np. 1 i 3 maja, 11 listopada, Boże Narodzenie), a część to{" "}
          <Link href={`/wielkanoc/${year}`} className="font-medium text-navy-600 hover:text-brand-green-600">święta ruchome</Link>{" "}
          zależne od daty Wielkanocy — Poniedziałek Wielkanocny, Zielone Świątki i Boże Ciało.
        </p>
        <p>
          {weekendHolidays.length > 0
            ? `W ${year} roku ${weekendHolidays.length} świąt wypada w weekend, więc realnie mamy mniej „dodatkowych" dni wolnych. `
            : `W ${year} roku żadne święto nie wypada w weekend, co sprzyja długim weekendom. `}
          {midweekHolidays.length > 0 &&
            `Aż ${midweekHolidays.length} świąt wypada między wtorkiem a czwartkiem — to idealny materiał na mostki urlopowe. `}
          Sprawdź gotowe{" "}
          <Link href={`/dlugie-weekendy/${year}`} className="font-medium text-navy-600 hover:text-brand-green-600">długie weekendy {year}</Link>{" "}
          oraz liczbę{" "}
          <Link href={`/dni-robocze/${year}`} className="font-medium text-navy-600 hover:text-brand-green-600">dni roboczych {year}</Link>.
        </p>
        <div className="rounded-2xl border border-brand-green-100 bg-brand-green-50 p-4 text-sm">
          <p className="font-semibold text-navy-800">💡 Ciekawostka</p>
          <p className="mt-1">
            Jeśli święto ustawowo wolne wypada w sobotę, pracodawca ma obowiązek oddać za nie inny dzień wolny.
            Dlatego liczba faktycznych dni wolnych bywa wyższa niż sama lista świąt.
          </p>
        </div>
      </section>

      <FaqSection items={faq} />

      <div className="mt-10 flex items-center justify-between">
        {isNavigableYear(prev) ? (
          <Link href={`/dni-wolne-od-pracy/${prev}`} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:border-navy-300 hover:text-navy-600">
            ← Dni wolne {prev}
          </Link>
        ) : <span />}
        <Link href={url.year(year)} className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200">
          Pełny kalendarz {year}
        </Link>
        {isNavigableYear(next) ? (
          <Link href={`/dni-wolne-od-pracy/${next}`} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:border-navy-300 hover:text-navy-600">
            Dni wolne {next} →
          </Link>
        ) : <span />}
      </div>
    </PageWithSidebar>
  );
}

function YearNav({ prev, next, basePath }: { prev: number; next: number; basePath: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {isNavigableYear(prev) ? (
        <Link href={`${basePath}/${prev}`} aria-label={`Rok ${prev}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-600 hover:border-navy-300 hover:text-navy-600">
          ← {prev}
        </Link>
      ) : <span />}
      {isNavigableYear(next) ? (
        <Link href={`${basePath}/${next}`} aria-label={`Rok ${next}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-600 hover:border-navy-300 hover:text-navy-600">
          {next} →
        </Link>
      ) : <span />}
    </div>
  );
}
