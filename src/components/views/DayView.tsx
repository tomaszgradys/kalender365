import Link from "next/link";
import { MONTH_NAMES, MONTH_NAMES_GENITIVE_PL, WEEKDAY_NAMES, isNavigableYear } from "@/lib/months";
import { getISOWeek, getMoonPhase } from "@/lib/calendar";
import { getNameDays, nameToSlug } from "@/lib/nameDays";
import { getUnusualHolidays, getProverb, getQuoteOfDay, dayOfYear } from "@/lib/observances";
import { getSunTimes, getMoonTimes, DEFAULT_LOCATION } from "@/lib/astro";
import { getPolishHolidays } from "@/lib/holidays";
import { MOON_PHASE_PL, getZodiac } from "@/lib/dayInfo";
import { url } from "@/lib/urls";
import { warsawNow } from "@/lib/now";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import PageWithSidebar from "@/components/PageWithSidebar";
import ExportPdfButton from "@/components/ExportPdfButton";
import FaqSection from "@/components/FaqSection";

function Card({ title, icon, children, className = "" }: { title: string; icon: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
        <span className="text-base">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function SunRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-1.5 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="font-mono text-sm font-semibold text-slate-800">{value ?? "—"}</span>
    </div>
  );
}

export default function DayView({ year, monthIndex, day }: { year: number; monthIndex: number; day: number }) {
  const dateUTC = new Date(Date.UTC(year, monthIndex, day));
  const weekdayIdx = (dateUTC.getUTCDay() + 6) % 7;
  const weekdayName = WEEKDAY_NAMES.pl[weekdayIdx];
  const isSunday = weekdayIdx === 6;
  const genMonth = MONTH_NAMES_GENITIVE_PL[monthIndex];

  const doy = dayOfYear(year, monthIndex, day);
  const isoWeek = getISOWeek(dateUTC);

  const names = getNameDays(monthIndex, day);
  const unusual = getUnusualHolidays(monthIndex, day);
  const proverb = getProverb(monthIndex, day);
  const quote = getQuoteOfDay(year, monthIndex, day);
  const sun = getSunTimes(year, monthIndex, day);
  const moon = getMoonTimes(year, monthIndex, day);
  const moonPhase = getMoonPhase(new Date(Date.UTC(year, monthIndex, day, 12)));
  const zodiac = getZodiac(monthIndex, day);

  const iso = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const officialHoliday = getPolishHolidays(year).find((h) => h.date === iso);

  const prev = new Date(Date.UTC(year, monthIndex, day - 1));
  const next = new Date(Date.UTC(year, monthIndex, day + 1));
  const prevHref = isNavigableYear(prev.getUTCFullYear())
    ? url.day(prev.getUTCFullYear(), prev.getUTCMonth(), prev.getUTCDate())
    : null;
  const nextHref = isNavigableYear(next.getUTCFullYear())
    ? url.day(next.getUTCFullYear(), next.getUTCMonth(), next.getUTCDate())
    : null;

  // Ten sam dzień w indeksowalnych latach kartki (bieżący i następny — spójnie z tym,
  // które kartki indeksujemy). Nie linkujemy do stron noindex. Dla 29 lutego pomijamy
  // lata nieprzestępne (dzień nie istnieje).
  const cy = warsawNow().year;
  const otherYears = [cy, cy + 1].filter((y) => {
    if (y === year) return false;
    return new Date(Date.UTC(y, monthIndex, day)).getUTCMonth() === monthIndex;
  });

  return (
    <PageWithSidebar relatedExclude={["kartka-z-kalendarza"]}>
      <BreadcrumbJsonLd
        items={[
          { name: "Kalendarz.pro", path: "/" },
          { name: String(year), path: url.year(year) },
          { name: MONTH_NAMES.pl[monthIndex], path: url.month(year, monthIndex) },
          { name: `${day} ${genMonth}`, path: url.day(year, monthIndex, day) },
        ]}
      />

      <nav className="mb-5 text-sm text-slate-500">
        <Link href="/" className="hover:text-navy-600">
          Kalendarz.pro
        </Link>{" "}
        /{" "}
        <Link href={url.year(year)} className="hover:text-navy-600">
          {year}
        </Link>{" "}
        /{" "}
        <Link href={url.month(year, monthIndex)} className="hover:text-navy-600">
          {MONTH_NAMES.pl[monthIndex]}
        </Link>{" "}
        / {day}
      </nav>

      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-navy-600 via-navy-700 to-navy-800 p-8 text-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-navy-100">
              {MONTH_NAMES.pl[monthIndex]} {year}
            </p>
            <div className="mt-1 flex items-baseline gap-4">
              <span className="text-7xl font-black leading-none">{day}</span>
              <span className={`text-2xl font-semibold ${isSunday ? "text-rose-200" : "text-navy-50"}`}>{weekdayName}</span>
            </div>
            <h1 className="mt-3 text-xl font-semibold text-white">
              {day} {genMonth} {year} — kartka z kalendarza ({weekdayName})
            </h1>
            <div className="mt-3 no-print">
              <ExportPdfButton
                filename={`kartka-${year}-${String(monthIndex + 1).padStart(2, "0")}-${day}`}
                label="⬇ Pobierz kartkę (PDF)"
                className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/25 backdrop-blur hover:bg-white/25 disabled:opacity-60"
              />
            </div>
          </div>
          <div className="flex gap-3 text-center">
            <div className="rounded-2xl bg-white/15 px-4 py-3 backdrop-blur">
              <div className="text-2xl font-bold">{doy}</div>
              <div className="text-[11px] text-navy-100">dzień roku</div>
            </div>
            <div className="rounded-2xl bg-white/15 px-4 py-3 backdrop-blur">
              <div className="text-2xl font-bold">{isoWeek}</div>
              <div className="text-[11px] text-navy-100">tydzień</div>
            </div>
            <div className="rounded-2xl bg-white/15 px-4 py-3 backdrop-blur">
              <div className="text-2xl font-bold">{zodiac.symbol}</div>
              <div className="text-[11px] text-navy-100">{zodiac.name}</div>
            </div>
          </div>
        </div>
        {officialHoliday && (
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-rose-500/90 px-4 py-1.5 text-sm font-semibold">
            🎉 {officialHoliday.name.pl} — dzień ustawowo wolny od pracy
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card title="Imieniny obchodzą" icon="🎂">
          {names.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {names.map((n) => (
                <Link key={n} href={`/imieniny/${nameToSlug(n)}`} className="rounded-full bg-navy-50 px-3 py-1 text-sm font-medium text-navy-700 hover:bg-navy-100">
                  {n}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Brak danych o imieninach.</p>
          )}
        </Card>

        <Card title="Święta i obchody" icon="📌">
          {unusual.length > 0 || officialHoliday ? (
            <ul className="space-y-1.5 text-sm text-slate-700">
              {officialHoliday && <li className="font-semibold text-rose-600">{officialHoliday.name.pl}</li>}
              {unusual.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">Brak nietypowych świąt tego dnia.</p>
          )}
        </Card>

        <Card title={`Słońce · ${DEFAULT_LOCATION.name}`} icon="☀️">
          <SunRow label="Świt" value={sun.dawn} />
          <SunRow label="Wschód słońca" value={sun.sunrise} />
          <SunRow label="Górowanie" value={sun.solarNoon} />
          <SunRow label="Zachód słońca" value={sun.sunset} />
          <SunRow label="Zmierzch" value={sun.dusk} />
          <SunRow label="Długość dnia" value={sun.dayLengthText} />
        </Card>

        <Card title="Księżyc" icon={moonPhase.icon}>
          <SunRow label="Faza" value={MOON_PHASE_PL[moonPhase.name]} />
          <SunRow label="Wschód Księżyca" value={moon.moonrise} />
          <SunRow label="Zachód Księżyca" value={moon.moonset} />
          <div className="mt-3 text-center text-4xl">{moonPhase.icon}</div>
        </Card>

        <Card title="Przysłowie na dziś" icon="📖" className="md:col-span-2">
          <p className="text-lg italic text-slate-700">„{proverb}"</p>
        </Card>

        <Card title="Cytat dnia" icon="💬" className="md:col-span-2">
          <blockquote className="text-lg italic text-slate-700">„{quote.text}"</blockquote>
          <p className="mt-2 text-right text-sm font-medium text-slate-500">— {quote.author}</p>
        </Card>
      </div>

      <div className="mt-8 flex items-center justify-between">
        {prevHref ? (
          <Link href={prevHref} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:border-navy-300 hover:text-navy-600">
            ← Poprzedni dzień
          </Link>
        ) : (
          <span />
        )}
        <Link href={url.month(year, monthIndex)} className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200">
          Kalendarz {genMonth}
        </Link>
        {nextHref ? (
          <Link href={nextHref} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:border-navy-300 hover:text-navy-600">
            Następny dzień →
          </Link>
        ) : (
          <span />
        )}
      </div>

      {otherYears.length > 0 && (
        <section className="mt-10 flex flex-wrap gap-2">
          <span className="w-full text-sm font-semibold text-navy-800">
            {day} {genMonth} w innych latach:
          </span>
          {otherYears.map((y) => (
            <Link
              key={y}
              href={url.day(y, monthIndex, day)}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600"
            >
              {day} {genMonth} {y}
            </Link>
          ))}
        </section>
      )}

      <section className="mt-10 max-w-2xl space-y-3 text-slate-600">
        <h2 className="text-xl font-bold text-navy-800">
          {day} {genMonth} {year} — co warto wiedzieć o tym dniu
        </h2>
        <p>
          {day} {genMonth} {year} to <strong>{weekdayName}</strong> i <strong>{doy}. dzień roku</strong>{" "}
          (przypada w {isoWeek}. tygodniu kalendarzowym).{" "}
          {names.length > 0 && <>Imieniny obchodzą tego dnia: {names.join(", ")}. </>}
          {officialHoliday
            ? `Tego dnia przypada ${officialHoliday.name.pl} — dzień ustawowo wolny od pracy.`
            : "Tego dnia nie ma świąt ustawowo wolnych od pracy."}{" "}
          Sprawdź powyżej godziny wschodu i zachodu słońca, fazę księżyca oraz przysłowie na ten dzień.
        </p>
      </section>

      <FaqSection
        items={[
          { q: `Jaki to dzień tygodnia — ${day} ${genMonth} ${year}?`, a: `${day} ${genMonth} ${year} to ${weekdayName}.` },
          {
            q: `Kto obchodzi imieniny ${day} ${genMonth}?`,
            a: names.length > 0 ? `Imieniny ${day} ${genMonth} obchodzą: ${names.join(", ")}.` : `Brak popularnych imienin przypisanych do dnia ${day} ${genMonth}.`,
          },
          { q: `Który to dzień roku?`, a: `${day} ${genMonth} ${year} to ${doy}. dzień roku i przypada w ${isoWeek}. tygodniu.` },
        ]}
      />
    </PageWithSidebar>
  );
}
