import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRERENDER_YEARS, isIndexableYear } from "@/lib/de/year";
import { MONTH_NAMES_DE, MONTH_SLUGS_DE } from "@/lib/de/locale";
import { parseKalenderSlug } from "@/lib/de/calendar";
import { stateBySlug, STATE_SLUGS } from "@/lib/de/bundeslaender";
import { KalenderYear, KalenderMonth } from "@/components/de/KalenderView";

// Prerender: year × state for the whole window, plus month × state for the
// current and next year (rest render on-demand via ISR).
export function generateStaticParams() {
  const nowY = new Date().getUTCFullYear();
  const params: { slug: string; bundesland: string }[] = [];
  for (const y of PRERENDER_YEARS) {
    for (const slug of STATE_SLUGS) params.push({ slug: String(y), bundesland: slug });
  }
  for (const y of [nowY, nowY + 1]) {
    for (const ms of MONTH_SLUGS_DE) {
      for (const slug of STATE_SLUGS) params.push({ slug: `${ms}-${y}`, bundesland: slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; bundesland: string }> }): Promise<Metadata> {
  const { slug, bundesland } = await params;
  const parsed = parseKalenderSlug(slug);
  const state = stateBySlug(bundesland);
  if (!parsed || !state) return {};
  if (parsed.kind === "year") {
    return {
      title: `Kalender ${parsed.year} ${state.name} – Feiertage & Ferien`,
      description: `Jahreskalender ${parsed.year} für ${state.name} mit gesetzlichen Feiertagen, Kalenderwochen und Arbeitstagen. Zum Ausdrucken.`,
      alternates: { canonical: `/kalender/${parsed.year}/${state.slug}` },
      ...(isIndexableYear(parsed.year) ? {} : { robots: { index: false, follow: true } }),
    };
  }
  const mName = MONTH_NAMES_DE[parsed.month0];
  return {
    title: `Kalender ${mName} ${parsed.year} ${state.name} – Feiertage & KW`,
    description: `Monatskalender ${mName} ${parsed.year} für ${state.name} mit Kalenderwochen, Feiertagen und Arbeitstagen.`,
    alternates: { canonical: `/kalender/${MONTH_SLUGS_DE[parsed.month0]}-${parsed.year}/${state.slug}` },
    ...(isIndexableYear(parsed.year) ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function KalenderSlugStatePage({ params }: { params: Promise<{ slug: string; bundesland: string }> }) {
  const { slug, bundesland } = await params;
  const parsed = parseKalenderSlug(slug);
  const state = stateBySlug(bundesland);
  if (!parsed || !state) notFound();
  return (
    <main className="flex-1">
      {parsed.kind === "year" ? (
        <KalenderYear year={parsed.year} state={state} />
      ) : (
        <KalenderMonth year={parsed.year} month0={parsed.month0} state={state} />
      )}
    </main>
  );
}
