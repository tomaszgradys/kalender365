import { SITE_NAME } from "./site";

// Baut ein VOLLSTÄNDIGES openGraph-Objekt für eine Seite. Notwendig, weil Next
// das openGraph-Feld NICHT tief zusammenführt: sobald eine Seite ein eigenes
// openGraph setzt (und sei es nur og:url), ersetzt es das geerbte openGraph des
// Layouts komplett — inkl. siteName, locale und (Datei-)Bild. Dieser Helfer
// liefert daher url + siteName + locale + type in einem Rutsch.
//
//   • Seiten MIT eigenem opengraph-image im Segment: ogMeta(path)
//     → Bild kommt aus der Datei-Konvention (keine images hier setzen).
//   • Seiten OHNE eigenes Segmentbild: ogMeta(path, { defaultImage: true })
//     → garantiertes Markenbild über die stabile URL /og-standard.

export const OG_STANDARD_IMAGE = "/og-standard";

type OgMetaOptions = {
  /** Setzt das Standard-Markenbild (/og-standard) als og:image. */
  defaultImage?: boolean;
};

export function ogMeta(url: string, opts: OgMetaOptions = {}) {
  return {
    url,
    siteName: SITE_NAME,
    locale: "de_DE",
    type: "website" as const,
    ...(opts.defaultImage
      ? { images: [{ url: OG_STANDARD_IMAGE, width: 1200, height: 630, alt: SITE_NAME }] }
      : {}),
  };
}
