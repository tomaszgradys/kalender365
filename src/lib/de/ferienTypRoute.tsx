import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { parseYear, PRERENDER_YEARS } from "./year";
import { stateBySlug, STATE_SLUGS, BUNDESLAENDER } from "./bundeslaender";
import { FERIEN_TYP_LABEL, isSchulferienIndexable, getFerienByTyp, type FerienTyp } from "./schulferien";
import { berlinNow } from "./now";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "./ogImage";
import FerienTypView from "@/components/de/FerienTypView";
import FerienTypYearView from "@/components/de/FerienTypYearView";

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

/**
 * Ein Ferientyp ist für ein Jahr indexierbar, sobald mindestens ein Bundesland
 * verifizierte Daten mit diesem Ferienabschnitt hat. Sonst noindex,follow —
 * analog zum Gate der Länderseiten.
 */
export function isFerienTypYearIndexable(y: number, typ: FerienTyp): boolean {
  return BUNDESLAENDER.some((b) => isSchulferienIndexable(y, b.code) && !!getFerienByTyp(y, b.code, typ));
}

/**
 * Route-Exports für die Jahres-Übersicht eines Ferientyps über alle Länder
 * (z. B. /sommerferien/{Jahr}). Zielt auf die Query „<Ferien> <Jahr>" und ist
 * eine eigene Landingpage neben dem Sammel-Hub /schulferien/{Jahr}.
 */
export function makeFerienTypYearRoute(typ: FerienTyp) {
  const label = FERIEN_TYP_LABEL[typ];

  function generateStaticParams() {
    return PRERENDER_YEARS.map((y) => ({ year: String(y) }));
  }

  async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
    const { year } = await params;
    const y = parseYear(year);
    if (!y) return {};
    return {
      title: `${label} ${y} – Termine aller Bundesländer im Überblick`,
      description: `${label} ${y} in Deutschland: Termine und Dauer für alle 16 Bundesländer auf einen Blick. Quelle: offizielle Angaben der Länder (KMK), ohne Gewähr.`,
      alternates: { canonical: `/${typ}/${y}` },
      ...(isFerienTypYearIndexable(y, typ) ? {} : { robots: { index: false, follow: true } }),
    };
  }

  async function Page({ params }: { params: Promise<{ year: string }> }) {
    const { year } = await params;
    const y = parseYear(year);
    if (!y) notFound();
    return <FerienTypYearView year={y} typ={typ} />;
  }

  return { generateStaticParams, generateMetadata, Page };
}

/**
 * Route-Exports für das dynamische OG-Bild eines Ferientyps pro Bundesland
 * (z. B. /sommerferien/{Jahr}/{Land}) → sprechende Vorschau „Sommerferien 2026
 * · Bayern" statt generischem Markenbild.
 */
export function makeFerienTypOgImage(typ: FerienTyp) {
  const label = FERIEN_TYP_LABEL[typ];
  const alt = `${label} nach Bundesland – Kalender365.pro`;
  async function Image({ params }: { params: Promise<Params> }) {
    const { year, bundesland } = await params;
    const y = parseYear(year) ?? berlinNow().year;
    const state = stateBySlug(bundesland);
    return renderOgImage({
      kicker: "Schulferien",
      title: `${label} ${y}`,
      subtitle: state ? state.name : "Deutschland",
    });
  }
  return { alt, size: OG_SIZE, contentType: OG_CONTENT_TYPE, Image };
}

/** OG-Bild für die Jahres-Übersicht eines Ferientyps (z. B. /sommerferien/{Jahr}). */
export function makeFerienTypYearOgImage(typ: FerienTyp) {
  const label = FERIEN_TYP_LABEL[typ];
  const alt = `${label} in Deutschland – Kalender365.pro`;
  async function Image({ params }: { params: Promise<{ year: string }> }) {
    const { year } = await params;
    const y = parseYear(year) ?? berlinNow().year;
    return renderOgImage({
      kicker: "Schulferien",
      title: `${label} ${y}`,
      subtitle: "Alle 16 Bundesländer im Überblick",
    });
  }
  return { alt, size: OG_SIZE, contentType: OG_CONTENT_TYPE, Image };
}
