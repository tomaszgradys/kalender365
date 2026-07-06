import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

// Dedykowane grafiki OG 1200x630 (właściwie 1216x640) dla głównych kategorii.
// Slugi zgodne z plikami w public/brand/og/types/<slug>.jpg (generowane: scripts/gen-og.mjs).
const OG_TYPES = new Set([
  "swieta",
  "dlugie-weekendy",
  "dni-wolne-od-pracy",
  "dni-robocze",
  "swieta-nietypowe",
  "wielkanoc",
  "niedziele-handlowe",
  "fazy-ksiezyca",
  "pelnia-ksiezyca",
  "now-ksiezyca",
  "kalendarz-ogrodnika",
  "kalendarz-wedkarza",
  "pory-roku",
  "zmiana-czasu",
  "wschod-zachod-slonca",
  "kalendarz-szkolny",
  "ferie-zimowe",
  "zodiak",
]);

// Zwraca fragment metadanych z dedykowaną grafiką OG dla danego typu kalendarza.
// Uwaga: Next scala metadane płytko, więc powtarzamy siteName/locale/type,
// by strona typu zachowała pełne dane OpenGraph.
export function ogType(slug: string, alt?: string): Pick<Metadata, "openGraph" | "twitter"> {
  if (!OG_TYPES.has(slug)) return {};
  const url = `/brand/og/types/${slug}.jpg`;
  return {
    openGraph: {
      siteName: SITE_NAME,
      locale: "pl_PL",
      type: "website",
      images: [{ url, width: 1216, height: 640, alt: alt ?? SITE_NAME }],
    },
    twitter: { card: "summary_large_image", images: [url] },
  };
}
