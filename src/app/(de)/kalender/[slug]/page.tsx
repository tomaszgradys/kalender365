import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRERENDER_YEARS, isIndexableYear } from "@/lib/de/year";
import { MONTH_NAMES_DE, MONTH_SLUGS_DE } from "@/lib/de/locale";
import { parseKalenderSlug } from "@/lib/de/calendar";
import { KalenderYear, KalenderMonth } from "@/components/de/KalenderView";

export function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (const y of PRERENDER_YEARS) {
    params.push({ slug: String(y) });
    for (const ms of MONTH_SLUGS_DE) params.push({ slug: `${ms}-${y}` });
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseKalenderSlug(slug);
  if (!parsed) return {};
  if (parsed.kind === "year") {
    return {
      title: `Kalender ${parsed.year} Deutschland – Feiertage, KW & PDF`,
      description: `Jahreskalender ${parsed.year} für Deutschland mit Kalenderwochen, Feiertagen, Arbeitstagen und PDF-Kalendern zum Ausdrucken.`,
      alternates: { canonical: `/kalender/${parsed.year}` },
      ...(isIndexableYear(parsed.year) ? {} : { robots: { index: false, follow: true } }),
    };
  }
  const mName = MONTH_NAMES_DE[parsed.month0];
  return {
    title: `Kalender ${mName} ${parsed.year} – Feiertage, KW & Arbeitstage`,
    description: `Monatskalender ${mName} ${parsed.year} mit Kalenderwochen, Feiertagen und Arbeitstagen. Auch nach Bundesland und zum Ausdrucken.`,
    alternates: { canonical: `/kalender/${MONTH_SLUGS_DE[parsed.month0]}-${parsed.year}` },
    ...(isIndexableYear(parsed.year) ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function KalenderSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const parsed = parseKalenderSlug(slug);
  if (!parsed) notFound();
  return (
    <div className="flex-1">
      {parsed.kind === "year" ? (
        <KalenderYear year={parsed.year} />
      ) : (
        <KalenderMonth year={parsed.year} month0={parsed.month0} />
      )}
    </div>
  );
}
