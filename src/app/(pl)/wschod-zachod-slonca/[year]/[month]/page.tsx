import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  STATIC_YEARS,
  isValidYear,
  isNavigableYear,
  yearRobotsMeta,
  MONTH_NAMES,
  MONTH_NAMES_GENITIVE_PL,
  MONTH_NAMES_LOCATIVE_PL,
  MONTH_SLUGS,
  monthSlugToIndex,
} from "@/lib/months";
import { getSunTimes, DEFAULT_LOCATION } from "@/lib/astro";
import { daysInMonth } from "@/lib/dayInfo";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import PageWithSidebar from "@/components/PageWithSidebar";
import ExportPdfButton from "@/components/ExportPdfButton";
import FaqSection from "@/components/FaqSection";
import { ogType } from "@/lib/ogType";

// „X h Y min" z liczby minut (na potrzeby opisu zmiany długości dnia).
function hm(min: number): string {
  const a = Math.abs(min);
  const h = Math.floor(a / 60);
  const m = a % 60;
  return h > 0 ? `${h} h ${m} min` : `${m} min`;
}

export const dynamicParams = true;
export function generateStaticParams() {
  return STATIC_YEARS.flatMap((year) => MONTH_SLUGS.pl.map((month) => ({ year: String(year), month })));
}

function parse(yp: string, mp: string) {
  const year = Number(yp);
  const m = monthSlugToIndex("pl", mp);
  if (!isValidYear(year) || m === null) return null;
  return { year, m };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}): Promise<Metadata> {
  const { year: yp, month: mp } = await params;
  const parsed = parse(yp, mp);
  if (!parsed) return {};
  const gen = MONTH_NAMES_GENITIVE_PL[parsed.m];
  const loc = MONTH_NAMES_LOCATIVE_PL[parsed.m];
  return {
    title: `Wschód i zachód słońca — ${gen} ${parsed.year} (Warszawa)`,
    description: `Godziny wschodu i zachodu słońca w ${loc} ${parsed.year} dla Warszawy — dzień po dniu, wraz z długością dnia. Świt, zachód i zmierzch.`,
    alternates: { canonical: `/wschod-zachod-slonca/${parsed.year}/${mp}` },
    ...ogType("wschod-zachod-slonca"),
    ...yearRobotsMeta(parsed.year),
  };
}

export default async function SunPage({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year: yp, month: mp } = await params;
  const parsed = parse(yp, mp);
  if (!parsed) notFound();
  const { year, m } = parsed;
  const dim = daysInMonth(year, m);
  const rows = Array.from({ length: dim }, (_, i) => {
    const day = i + 1;
    return { day, sun: getSunTimes(year, m, day) };
  });

  const prev = m === 0 ? { y: year - 1, m: 11 } : { y: year, m: m - 1 };
  const next = m === 11 ? { y: year + 1, m: 0 } : { y: year, m: m + 1 };

  // Opis oparty na danych — unikalny dla każdego miesiąca i roku.
  const first = rows[0].sun;
  const last = rows[rows.length - 1].sun;
  const delta = last.dayLengthMinutes - first.dayLengthMinutes;
  const longer = delta >= 0;
  const gen = MONTH_NAMES_GENITIVE_PL[m];
  const loc = MONTH_NAMES_LOCATIVE_PL[m];
  const seoFaq = [
    {
      q: `O której wschodzi i zachodzi słońce w ${loc} ${year}?`,
      a: `1 ${gen} ${year} w ${DEFAULT_LOCATION.name} słońce wschodzi o ${first.sunrise ?? "—"}, a zachodzi o ${first.sunset ?? "—"}. Pod koniec miesiąca (${dim} ${gen}) wschód przypada o ${last.sunrise ?? "—"}, a zachód o ${last.sunset ?? "—"}.`,
    },
    {
      q: `Jak zmienia się długość dnia w ${loc} ${year}?`,
      a: `W ciągu ${gen} ${year} dzień ${longer ? "wydłuża się" : "skraca się"} o około ${hm(delta)} — od ${first.dayLengthText} na początku miesiąca do ${last.dayLengthText} na jego końcu.`,
    },
    {
      q: "Dla jakiej lokalizacji podane są godziny?",
      a: `Godziny obliczamy dla ${DEFAULT_LOCATION.name} w czasie obowiązującym w Polsce. W innych miastach różnią się o kilka–kilkanaście minut: na zachodzie kraju słońce wschodzi i zachodzi później, na wschodzie wcześniej.`,
    },
  ];

  return (
    <PageWithSidebar relatedExclude={["wschod-zachod-slonca"]}>
      <BreadcrumbJsonLd
        items={[
          { name: "Kalendarz.pro", path: "/" },
          { name: "Kalendarze", path: "/kalendarze" },
          { name: `Słońce ${MONTH_NAMES.pl[m]} ${year}`, path: `/wschod-zachod-slonca/${year}/${mp}` },
        ]}
      />
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-navy-600">Kalendarz.pro</Link> /{" "}
        <Link href="/kalendarze" className="hover:text-navy-600">Kalendarze</Link> / Słońce
      </nav>

      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 to-orange-400 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-black">
          Wschód i zachód słońca — {MONTH_NAMES_GENITIVE_PL[m]} {year}
        </h1>
        <p className="mt-2 text-white/90">Lokalizacja: {DEFAULT_LOCATION.name}. Godziny dla każdego dnia miesiąca.</p>
        <div className="mt-5 no-print">
          <ExportPdfButton
            filename={`wschod-zachod-slonca-${mp}`}
            className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/25 backdrop-blur hover:bg-white/25 disabled:opacity-60"
          />
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Dzień</th>
              <th className="px-3 py-2 text-right font-medium">Wschód</th>
              <th className="px-3 py-2 text-right font-medium">Zachód</th>
              <th className="px-3 py-2 text-right font-medium">Długość dnia</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.day} className="border-t border-slate-100">
                <td className="whitespace-nowrap px-3 py-2 text-slate-700">
                  {r.day} {MONTH_NAMES_GENITIVE_PL[m].slice(0, 3)}.
                </td>
                <td className="px-3 py-2 text-right font-mono text-slate-700">{r.sun.sunrise ?? "—"}</td>
                <td className="px-3 py-2 text-right font-mono text-slate-700">{r.sun.sunset ?? "—"}</td>
                <td className="px-3 py-2 text-right font-mono text-slate-500">{r.sun.dayLengthText}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Wszystkie miesiące roku — spłaszcza głębokość crawla (bez tego strony
          miesięcy byłyby dostępne tylko łańcuchem prev/next). */}
      <nav className="mt-6" aria-label={`Wschód i zachód słońca ${year} — miesiące`}>
        <h2 className="mb-2 text-sm font-semibold text-slate-700">
          Wschód i zachód słońca {year} — wszystkie miesiące
        </h2>
        <div className="flex flex-wrap gap-2">
          {MONTH_SLUGS.pl.map((ms, i) => (
            <Link
              key={ms}
              href={`/wschod-zachod-slonca/${year}/${ms}`}
              aria-current={i === m ? "page" : undefined}
              className={`rounded-lg border px-2.5 py-1 text-sm ${
                i === m
                  ? "border-amber-300 bg-amber-50 font-semibold text-amber-700"
                  : "border-slate-200 text-slate-600 hover:border-navy-300 hover:text-navy-600"
              }`}
            >
              {MONTH_NAMES.pl[i]} {year}
            </Link>
          ))}
        </div>
      </nav>

      <section className="mt-10 max-w-3xl">
        <h2 className="text-xl font-bold text-navy-800">Długość dnia w {loc} {year}</h2>
        <p className="mt-2 text-slate-600">
          W {loc} {year} dzień w {DEFAULT_LOCATION.name} {longer ? "wydłuża się" : "skraca się"} o około{" "}
          <strong>{hm(delta)}</strong> — od {first.dayLengthText} 1 {gen} do {last.dayLengthText} {dim} {gen}.
          Wschód słońca przesuwa się z {first.sunrise ?? "—"} na {last.sunrise ?? "—"}, a zachód z{" "}
          {first.sunset ?? "—"} na {last.sunset ?? "—"}. Godziny podajemy dla {DEFAULT_LOCATION.name} w czasie
          urzędowym obowiązującym w Polsce (z uwzględnieniem zmiany czasu letniego i zimowego).
        </p>
        <p className="mt-3 text-slate-600">
          Wschód i zachód liczymy dla środka tarczy słonecznej na wysokości horyzontu −0,833° (uwzględniając
          refrakcję atmosferyczną). Długość dnia to czas między wschodem a zachodem. W innych miastach Polski
          godziny różnią się o kilka–kilkanaście minut względem {DEFAULT_LOCATION.name}.
        </p>
      </section>

      <FaqSection items={seoFaq} />

      <div className="mt-8 flex items-center justify-between text-sm">
        {isNavigableYear(prev.y) ? (
          <Link href={`/wschod-zachod-slonca/${prev.y}/${MONTH_SLUGS.pl[prev.m]}`} className="text-navy-600 hover:underline">
            ← {MONTH_NAMES.pl[prev.m]} {prev.y}
          </Link>
        ) : <span />}
        {isNavigableYear(next.y) ? (
          <Link href={`/wschod-zachod-slonca/${next.y}/${MONTH_SLUGS.pl[next.m]}`} className="text-navy-600 hover:underline">
            {MONTH_NAMES.pl[next.m]} {next.y} →
          </Link>
        ) : <span />}
      </div>
    </PageWithSidebar>
  );
}
