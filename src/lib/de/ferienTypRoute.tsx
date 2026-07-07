import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { parseYear } from "./year";
import { stateBySlug, STATE_SLUGS } from "./bundeslaender";
import { FERIEN_TYP_LABEL, isSchulferienIndexable, getFerienByTyp, type FerienTyp } from "./schulferien";
import { berlinNow } from "./now";
import FerienTypView from "@/components/de/FerienTypView";

type Params = { year: string; bundesland: string };

/** Builds the Next route exports for one Ferien type (e.g. "sommerferien"). */
export function makeFerienTypRoute(typ: FerienTyp) {
  const label = FERIEN_TYP_LABEL[typ];

  function generateStaticParams() {
    const nowY = berlinNow().year;
    return [nowY, nowY + 1].flatMap((y) => STATE_SLUGS.map((slug) => ({ year: String(y), bundesland: slug })));
  }

  async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
    const { year, bundesland } = await params;
    const y = parseYear(year);
    const state = stateBySlug(bundesland);
    if (!y || !state) return {};
    const indexable = isSchulferienIndexable(y, state.code) && !!getFerienByTyp(y, state.code, typ);
    return {
      title: `${label} ${y} ${state.name} – Termine & Ferienkalender`,
      description: `${label} ${y} in ${state.name}: genaue Termine, Dauer und Ferienkalender. Quelle: Angaben der Länder (KMK), ohne Gewähr.`,
      alternates: { canonical: `/${typ}/${y}/${state.slug}` },
      ...(indexable ? {} : { robots: { index: false, follow: true } }),
    };
  }

  async function Page({ params }: { params: Promise<Params> }) {
    const { year, bundesland } = await params;
    const y = parseYear(year);
    const state = stateBySlug(bundesland);
    if (!y || !state) notFound();
    return <FerienTypView year={y} state={state} typ={typ} />;
  }

  return { generateStaticParams, generateMetadata, Page };
}
