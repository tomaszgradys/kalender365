import { permanentRedirect, notFound } from "next/navigation";
import { isValidYear, monthSlugToIndex, MONTH_SLUGS } from "@/lib/months";
import { daysInMonth } from "@/lib/dayInfo";

// Stary adres /2026/lipiec/4 → kanoniczny /kalendarz/lipiec-2026/4 (stała migracja: 308).
export const dynamicParams = true;
export function generateStaticParams() {
  return [];
}

export default async function LegacyDay({ params }: { params: Promise<{ year: string; month: string; day: string }> }) {
  const { year, month, day } = await params;
  const y = Number(year);
  const m = monthSlugToIndex("pl", month);
  const d = Number(day);
  if (!isValidYear(y) || m === null || !Number.isInteger(d) || d < 1 || d > daysInMonth(y, m)) notFound();
  permanentRedirect(`/kalendarz/${MONTH_SLUGS.pl[m]}-${y}/${d}`);
}
