import { permanentRedirect, notFound } from "next/navigation";
import { isValidYear } from "@/lib/months";

// Stary adres /2026 → kanoniczny /kalendarz/2026 (stała migracja: 308, nie 307).
export const dynamicParams = true;
export function generateStaticParams() {
  return [];
}

export default async function LegacyYear({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  if (!isValidYear(Number(year))) notFound();
  permanentRedirect(`/kalendarz/${Number(year)}`);
}
