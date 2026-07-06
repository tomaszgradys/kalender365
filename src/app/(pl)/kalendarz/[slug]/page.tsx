import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  STATIC_YEARS,
  MONTH_SLUGS,
  MONTH_NAMES_GENITIVE_PL,
  parseCalendarSlug,
  yearRobotsMeta,
} from "@/lib/months";
import YearView from "@/components/views/YearView";
import MonthView from "@/components/views/MonthView";

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
    const { year } = parsed;
    return {
      title: `Kalendarz ${year} — wszystkie miesiące, święta i dni wolne`,
      description: `Kalendarz ${year} online: 12 miesięcy, święta, dni wolne od pracy, dni robocze i numery tygodni. Pobierz PDF do druku za darmo.`,
      alternates: { canonical: `/kalendarz/${year}` },
      ...yearRobotsMeta(year),
    };
  }
  const { year, monthIndex } = parsed;
  const gen = MONTH_NAMES_GENITIVE_PL[monthIndex];
  return {
    title: `Kalendarz ${gen} ${year} — do druku i pobrania PDF`,
    description: `Kalendarz ${gen} ${year}: dni robocze, dni wolne, święta, numery tygodni i fazy księżyca. Podgląd online oraz PDF gotowy do druku.`,
    alternates: { canonical: `/kalendarz/${slug}` },
    ...yearRobotsMeta(year),
  };
}

export default async function CalendarSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const parsed = parseCalendarSlug(slug);
  if (!parsed) notFound();
  if (parsed.kind === "year") return <YearView year={parsed.year} />;
  return <MonthView year={parsed.year} monthIndex={parsed.monthIndex} />;
}
