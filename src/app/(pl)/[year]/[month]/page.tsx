import { permanentRedirect, notFound } from "next/navigation";
import { isValidYear, monthSlugToIndex, MONTH_SLUGS } from "@/lib/months";

// Stary adres /2026/lipiec → kanoniczny /kalendarz/lipiec-2026 (stała migracja: 308).
export const dynamicParams = true;
export function generateStaticParams() {
  return [];
}

export default async function LegacyMonth({ params }: { params: Promise<{ year: string; month: string }> }) {
  const { year, month } = await params;
  const y = Number(year);
  const m = monthSlugToIndex("pl", month);
  if (!isValidYear(y) || m === null) notFound();
  permanentRedirect(`/kalendarz/${MONTH_SLUGS.pl[m]}-${y}`);
}
