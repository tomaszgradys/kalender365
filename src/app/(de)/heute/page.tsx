import PageWithSidebar from "@/components/de/PageWithSidebar";
import Breadcrumbs from "@/components/de/Breadcrumbs";
import Link from "next/link";
import type { Metadata } from "next";
import { berlinNow, isoWeekOf } from "@/lib/de/now";
import { MONTH_NAMES_DE, WEEKDAY_NAMES_DE, formatLongDE } from "@/lib/de/locale";
import { getAllFeiertage } from "@/lib/de/feiertage";
import { getMoonPhaseDE } from "@/lib/de/moon";
import { getSunTimes, DEFAULT_LOCATION } from "@/lib/de/sun";
import { getNamenstage } from "@/lib/de/namenstage";
import { getBauernregel } from "@/lib/de/bauernregeln";
import { sternzeichenByDate } from "@/lib/de/sternzeichen";
import { getAnlaesseAmTag } from "@/lib/de/besondereTage";
import EventArt from "@/components/de/EventArt";
import SeoProse from "@/components/de/SeoProse";
import Faq from "@/components/de/Faq";

// "Heute" muss immer den echten aktuellen Tag zeigen → keine statische Zwischenspeicherung.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Welcher Tag ist heute? – Datum, Kalenderwoche & Feiertag",
  description: "Welcher Tag ist heute? Aktuelles Datum, Wochentag, Kalenderwoche, Tag des Jahres, Feiertag, Namenstag, Mondphase und Sternzeichen – alles auf einen Blick.",
  alternates: { canonical: "/heute" },
};

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function HeutePage() {
  const { year, month0, day } = berlinNow();
  const iso = `${year}-${pad(month0 + 1)}-${pad(day)}`;
  const weekdayIdx = (new Date(Date.UTC(year, month0, day)).getUTCDay() + 6) % 7;
  const { isoYear, week } = isoWeekOf(year, month0, day);
  const doy = Math.floor((Date.UTC(year, month0, day) - Date.UTC(year, 0, 1)) / 86400000) + 1;
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const totalDays = isLeap ? 366 : 365;

  const feiertage = getAllFeiertage(year).filter((h) => h.date === iso);
  const nationalFeiertag = feiertage.find((h) => h.scope === "national") ?? null;
  const moon = getMoonPhaseDE(new Date(Date.UTC(year, month0, day, 12)));
  const sun = getSunTimes(year, month0, day);
  const namen = getNamenstage(month0, day);
  const regel = getBauernregel(month0, day);
  const zodiac = sternzeichenByDate(month0, day);
  const anlaesse = getAnlaesseAmTag(year, iso);

  const faq = [
    { q: "Welcher Tag ist heute?", a: `Heute ist ${WEEKDAY_NAMES_DE[weekdayIdx]}, der ${formatLongDE(iso)}. Es ist der ${doy}. Tag des Jahres ${year}.` },
    { q: "Welche Kalenderwoche haben wir gerade?", a: `Aktuell ist Kalenderwoche ${week} (KW ${week}) des Jahres ${isoYear}, gezählt nach ISO 8601 (Woche beginnt montags).` },
    { q: `Der wievielte ist heute?`, a: `Heute ist der ${day}. ${MONTH_NAMES_DE[month0]} ${year}.` },
    {
      q: "Ist heute ein Feiertag?",
      a: nationalFeiertag
        ? `Ja, heute ist ${nationalFeiertag.name} – ein bundesweiter gesetzlicher Feiertag.`
        : `Heute ist kein bundesweiter gesetzlicher Feiertag. Ob in Ihrem Bundesland ein regionaler Feiertag gilt, sehen Sie auf der Feiertagsseite.`,
    },
  ];

  const stat = (k: string, v: string, href?: string) => (
    <div key={k} className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
      <div className="text-lg font-black text-navy-800">{href ? <Link href={href} className="hover:text-navy-600">{v}</Link> : v}</div>
      <div className="mt-0.5 text-xs text-slate-500">{k}</div>
    </div>
  );

  return (
    <div className="flex-1">
      <PageWithSidebar>
        <Breadcrumbs
          items={[
            { name: "Start", url: "/" },
            { name: "Heute", url: "/heute" },
          ]}
        />

        <div className="overflow-hidden rounded-2xl">
          <EventArt motif={anlaesse[0]?.motif ?? "kalender"} uid="heute-hero" className="h-36 w-full sm:h-44" />
        </div>

        <h1 className="mt-5 text-2xl font-black text-navy-800 sm:text-3xl">Welcher Tag ist heute?</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Heute ist <strong className="text-navy-800">{WEEKDAY_NAMES_DE[weekdayIdx]}, der {formatLongDE(iso)}</strong> —
          Kalenderwoche {week}, der {doy}. von {totalDays} Tagen des Jahres.
        </p>

        {(nationalFeiertag || anlaesse.length > 0) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {nationalFeiertag && (
              <span className="rounded-full bg-brand-green-50 px-3 py-1 text-sm font-semibold text-brand-green-700">🎉 {nationalFeiertag.name}</span>
            )}
            {anlaesse.map((a) => (
              <Link key={a.slug} href={`/besondere-tage/${year}/${a.slug}`} className="rounded-full border border-brand-green-200 bg-white px-3 py-1 text-sm font-medium text-brand-green-700 hover:border-brand-green-400">
                {a.emoji} {a.name}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stat("Kalenderwoche", `KW ${week}`, `/kalenderwochen/${isoYear}`)}
          {stat("Tag des Jahres", `${doy}. / ${totalDays}`)}
          {stat("Rest des Jahres", `${totalDays - doy} Tage`)}
          {stat("Wochentag", WEEKDAY_NAMES_DE[weekdayIdx])}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-bold text-navy-700">☀️ Sonne ({DEFAULT_LOCATION.name})</h2>
            <p className="mt-1 text-sm text-slate-600">Aufgang: <strong className="text-navy-800">{sun.sunrise ?? "—"}</strong> · Untergang: <strong className="text-navy-800">{sun.sunset ?? "—"}</strong></p>
            <p className="text-sm text-slate-500">Tageslänge: {sun.dayLengthText}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-bold text-navy-700">🌙 Mond</h2>
            <p className="mt-1 text-sm text-slate-600">{moon.icon} <strong className="text-navy-800">{moon.label}</strong></p>
            <Link href={`/mondphasen/${year}`} className="mt-1 inline-block text-xs font-medium text-navy-600 hover:underline">Alle Mondphasen {year} →</Link>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-bold text-navy-700">📛 Namenstag</h2>
            <p className="mt-1 text-sm text-slate-700">{namen.length ? namen.join(", ") : "Kein Eintrag heute."}</p>
            <Link href={`/namenstage/${pad(month0 + 1)}-${pad(day)}`} className="mt-1 inline-block text-xs font-medium text-navy-600 hover:underline">Namenstage →</Link>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-bold text-navy-700">⭐ Sternzeichen</h2>
            <p className="mt-1 text-sm text-slate-700">{zodiac.symbol} {zodiac.name}</p>
            <Link href={`/sternzeichen/${zodiac.slug}`} className="mt-1 inline-block text-xs font-medium text-navy-600 hover:underline">Zum Sternzeichen →</Link>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-bold text-navy-700">🌾 Bauernregel</h2>
            <p className="mt-1 text-sm italic text-slate-700">„{regel}“</p>
            <Link href="/bauernregeln" className="mt-1 inline-block text-xs font-medium text-navy-600 hover:underline">Mehr Bauernregeln →</Link>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 text-sm">
          <Link href={`/kalenderblatt/${iso}`} className="rounded-lg bg-navy-600 px-3 py-1.5 font-semibold text-white hover:bg-navy-700">Kalenderblatt von heute</Link>
          <Link href={`/feiertage/${year}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Feiertage {year}</Link>
          <Link href={`/besondere-tage/${year}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Besondere Tage</Link>
          <Link href={`/kalender/${year}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Kalender {year}</Link>
        </div>

        <SeoProse
          blocks={[
            {
              h2: "Datum, Kalenderwoche und Feiertag heute",
              p: [
                `Diese Seite zeigt jederzeit das aktuelle Datum für Deutschland (Zeitzone Europe/Berlin): heute ist ${WEEKDAY_NAMES_DE[weekdayIdx]}, der ${formatLongDE(iso)}, in Kalenderwoche ${week}. So beantworten sich die häufigsten Fragen – „Welcher Tag ist heute?“, „Der wievielte ist heute?“ und „Welche KW haben wir gerade?“ – auf einen Blick.`,
                `Ergänzt wird das Datum um Namenstag, Sternzeichen, Mondphase, Sonnenauf- und -untergang sowie besondere Anlässe des Tages. Für einen bestimmten Tag lohnt sich das ausführliche Kalenderblatt, für die Ferien- und Feiertagsplanung die jeweiligen Jahresübersichten.`,
              ],
            },
          ]}
        />
        <Faq items={faq} />
      </PageWithSidebar>
    </div>
  );
}
