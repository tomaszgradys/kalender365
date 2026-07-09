// Central URL builder — single source of truth for the German routing scheme.
// Changing a path here changes it site-wide. Slugs are ASCII (no umlauts).
//
// This mirrors the PL src/lib/urls.ts but maps to the German information
// architecture from the brief (kalender / feiertage / schulferien / brueckentage
// / kalenderwochen / arbeitstage / tools / legal).

import { MONTH_SLUGS_DE } from "./locale";
import type { Bundesland } from "./bundeslaender";

export const routes = {
  home: () => `/`,

  // Kalender
  year: (y: number) => `/kalender/${y}`,
  yearState: (y: number, s: Bundesland) => `/kalender/${y}/${s.slug}`,
  month: (y: number, m: number) => `/kalender/${MONTH_SLUGS_DE[m]}-${y}`,
  monthState: (y: number, m: number, s: Bundesland) => `/kalender/${MONTH_SLUGS_DE[m]}-${y}/${s.slug}`,
  kalenderblatt: (isoDate: string) => `/kalenderblatt/${isoDate}`,
  printYear: (y: number) => `/kalender-zum-ausdrucken/${y}`,

  // Feiertage & Arbeit
  feiertage: (y: number) => `/feiertage/${y}`,
  feiertageState: (y: number, s: Bundesland) => `/feiertage/${y}/${s.slug}`,
  gesetzlicheFeiertage: (y: number) => `/gesetzliche-feiertage/${y}`, // alias → canonical /feiertage/{y}
  arbeitstage: (y: number) => `/arbeitstage/${y}`,
  arbeitstageState: (y: number, s: Bundesland) => `/arbeitstage/${y}/${s.slug}`,
  brueckentage: (y: number) => `/brueckentage/${y}`,
  brueckentageState: (y: number, s: Bundesland) => `/brueckentage/${y}/${s.slug}`,
  urlaubsplaner: (y: number) => `/urlaubsplaner/${y}`,

  // Schule & Familie
  schulferien: (y: number) => `/schulferien/${y}`,
  schulferienState: (y: number, s: Bundesland) => `/schulferien/${y}/${s.slug}`,
  sommerferienState: (y: number, s: Bundesland) => `/sommerferien/${y}/${s.slug}`,
  weihnachtsferienState: (y: number, s: Bundesland) => `/weihnachtsferien/${y}/${s.slug}`,
  osterferienState: (y: number, s: Bundesland) => `/osterferien/${y}/${s.slug}`,

  // Brauchtum & Anlässe
  heute: () => `/heute`,
  besondereTage: (y: number) => `/besondere-tage/${y}`,
  besondererTag: (y: number, slug: string) => `/besondere-tage/${y}/${slug}`,
  namenstage: () => `/namenstage`,
  namenstag: (mmdd: string) => `/namenstage/${mmdd}`,
  bauernregeln: () => `/bauernregeln`,
  sternzeichen: () => `/sternzeichen`,
  sternzeichenSign: (slug: string) => `/sternzeichen/${slug}`,
  mondkalender: (y: number) => `/mondkalender/${y}`,
  mondkalenderMonat: (slug: string) => `/mondkalender/${slug}`,

  // Zeit, Natur, Hobby
  kalenderwochen: (y: number) => `/kalenderwochen/${y}`,
  kalenderwoche: (kw: number, y: number) => `/kw/${kw}-${y}`,
  mondphasen: (y: number) => `/mondphasen/${y}`,
  vollmond: (y: number) => `/vollmond/${y}`,
  neumond: (y: number) => `/neumond/${y}`,
  zeitumstellung: (y: number) => `/zeitumstellung/${y}`,
  jahreszeiten: (y: number) => `/jahreszeiten/${y}`,
  sonne: () => `/sonnenaufgang-sonnenuntergang`,

  // Tools
  tageRechner: () => `/tage-rechner`,
  arbeitstageRechner: () => `/arbeitstage-rechner`,
  wochentagRechner: () => `/wochentag-rechner`,
  altersrechner: () => `/altersrechner`,
  countdown: () => `/countdown`,
  stundenplan: () => `/stundenplan`,
  generatoren: () => `/generatoren`,

  // Legal / trust
  impressum: () => `/impressum`,
  datenschutz: () => `/datenschutz`,
  cookies: () => `/cookies`,
  nutzungsbedingungen: () => `/nutzungsbedingungen`,
  soBerechnenWir: () => `/so-berechnen-wir`,
  kontakt: () => `/kontakt`,

  // Export endpoints
  pdfMonth: (y: number, m: number) => `/api/pdf/de/${y}/${MONTH_SLUGS_DE[m]}`,
  pdfYear: (y: number) => `/api/pdf/de/jahr/${y}`,
  icsFeiertage: (y: number, s: Bundesland) => `/api/ics/feiertage/${y}/${s.slug}`,
  icsSchulferien: (y: number, s: Bundesland) => `/api/ics/schulferien/${y}/${s.slug}`,
} as const;
