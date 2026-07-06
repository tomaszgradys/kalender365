import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MONTH_SLUGS, MONTH_NAMES_GENITIVE_PL, parseMonthYearSlug, isValidYear } from "@/lib/months";
import { daysInMonth } from "@/lib/dayInfo";
import { getNameDays } from "@/lib/nameDays";
import { warsawNow } from "@/lib/now";
import DayView from "@/components/views/DayView";

const CURRENT_YEAR = new Date().getFullYear();

// „Kartka z kalendarza" ma realną intencję wyszukiwania tylko dla dat bieżących i
// nadchodzących — indeksujemy więc rok bieżący i następny (spójnie z sitemapą).
// Pozostałe lata renderują się (przeglądanie dzień po dniu, przeskoki z narzędzi),
// ale są noindex, żeby nie indeksować ~7 tys. niskointencyjnych stron-szablonów.
function isKartkaIndexable(year: number): boolean {
  const cy = warsawNow().year;
  return year === cy || year === cy + 1;
}

export const dynamicParams = true;

export function generateStaticParams() {
  const params: { slug: string; day: string }[] = [];
  for (let m = 0; m < 12; m++) {
    const dim = daysInMonth(CURRENT_YEAR, m);
    for (let d = 1; d <= dim; d++) {
      params.push({ slug: `${MONTH_SLUGS.pl[m]}-${CURRENT_YEAR}`, day: String(d) });
    }
  }
  return params;
}

function parse(slug: string, dayParam: string) {
  const my = parseMonthYearSlug(slug);
  if (!my || !isValidYear(my.year)) return null;
  const day = Number(dayParam);
  if (!Number.isInteger(day) || day < 1 || day > daysInMonth(my.year, my.monthIndex)) return null;
  return { year: my.year, monthIndex: my.monthIndex, day };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; day: string }> }): Promise<Metadata> {
  const { slug, day: dp } = await params;
  const parsed = parse(slug, dp);
  if (!parsed) return {};
  const { year, monthIndex, day } = parsed;
  const gen = MONTH_NAMES_GENITIVE_PL[monthIndex];
  const names = getNameDays(monthIndex, day).slice(0, 3).join(", ");
  return {
    title: `${day} ${gen} ${year} — kartka z kalendarza, imieniny, święto`,
    description: `${day} ${gen} ${year}: imieniny obchodzą ${names}. Dzień tygodnia, dzień roku, numer tygodnia, wschód i zachód słońca, faza księżyca, przysłowie i cytat.`,
    alternates: { canonical: `/kalendarz/${slug}/${day}` },
    ...(isKartkaIndexable(year) ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function CalendarDayPage({ params }: { params: Promise<{ slug: string; day: string }> }) {
  const { slug, day: dp } = await params;
  const parsed = parse(slug, dp);
  if (!parsed) notFound();
  return <DayView year={parsed.year} monthIndex={parsed.monthIndex} day={parsed.day} />;
}
