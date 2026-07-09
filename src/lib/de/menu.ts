// German side/mega menu — single source of truth for header dropdown, sidebar
// and mobile drawer. {y} = current year placeholder, resolved server-side.
// Only links to routes that actually exist (no dead links).

import { berlinNow } from "./now";

export type MenuItem = { label: string; href: string; emoji: string };
export type MenuSection = { title: string; items: MenuItem[]; popular?: boolean };

export const MENU: MenuSection[] = [
  {
    title: "Beliebt",
    popular: true,
    items: [
      { label: "Kalender {y}", href: "/kalender/{y}", emoji: "📅" },
      { label: "Feiertage {y}", href: "/feiertage/{y}", emoji: "🎉" },
      { label: "Schulferien {y}", href: "/schulferien/{y}", emoji: "🎒" },
      { label: "Brückentage {y}", href: "/brueckentage/{y}", emoji: "🌉" },
      { label: "Urlaubsplaner {y}", href: "/urlaubsplaner/{y}", emoji: "🏖️" },
      { label: "Kalenderwochen {y}", href: "/kalenderwochen/{y}", emoji: "🔢" },
      { label: "Kalender zum Ausdrucken", href: "/kalender-zum-ausdrucken/{y}", emoji: "🖨️" },
      { label: "Arbeitstage-Rechner", href: "/arbeitstage-rechner", emoji: "🧮" },
    ],
  },
  {
    title: "Arbeit, Feiertage & Urlaub",
    items: [
      { label: "Feiertage {y}", href: "/feiertage/{y}", emoji: "🎉" },
      { label: "Arbeitstage {y}", href: "/arbeitstage/{y}", emoji: "💼" },
      { label: "Brückentage {y}", href: "/brueckentage/{y}", emoji: "🌉" },
      { label: "Urlaubsplaner {y}", href: "/urlaubsplaner/{y}", emoji: "🏖️" },
    ],
  },
  {
    title: "Schule & Familie",
    items: [
      { label: "Schulferien {y}", href: "/schulferien/{y}", emoji: "🎒" },
      { label: "Stundenplan", href: "/stundenplan", emoji: "📝" },
      { label: "Sommerferien-Countdown", href: "/wie-viele-tage-bis-zu-den-sommerferien", emoji: "⏳" },
    ],
  },
  {
    title: "Brauchtum & Anlässe",
    items: [
      { label: "Besondere Tage {y}", href: "/besondere-tage/{y}", emoji: "✨" },
      { label: "Muttertag {y}", href: "/besondere-tage/{y}/muttertag", emoji: "💐" },
      { label: "Vatertag {y}", href: "/besondere-tage/{y}/vatertag", emoji: "🍺" },
      { label: "Karneval {y}", href: "/besondere-tage/{y}/rosenmontag", emoji: "🎉" },
      { label: "Advent {y}", href: "/besondere-tage/{y}/erster-advent", emoji: "🕯️" },
      { label: "Namenstage", href: "/namenstage", emoji: "📛" },
      { label: "Bauernregeln", href: "/bauernregeln", emoji: "🌾" },
      { label: "Sternzeichen", href: "/sternzeichen", emoji: "⭐" },
    ],
  },
  {
    title: "Mond, Sonne & Natur",
    items: [
      { label: "Mondphasen {y}", href: "/mondphasen/{y}", emoji: "🌙" },
      { label: "Vollmond {y}", href: "/vollmond/{y}", emoji: "🌕" },
      { label: "Neumond {y}", href: "/neumond/{y}", emoji: "🌑" },
      { label: "Zeitumstellung {y}", href: "/zeitumstellung/{y}", emoji: "🕑" },
      { label: "Jahreszeiten {y}", href: "/jahreszeiten/{y}", emoji: "🍂" },
      { label: "Sonnauf- & -untergang", href: "/sonnenaufgang-sonnenuntergang", emoji: "🌅" },
    ],
  },
  {
    title: "Zeit & Rechner",
    items: [
      { label: "Kalenderwochen {y}", href: "/kalenderwochen/{y}", emoji: "🔢" },
      { label: "Tage-Rechner", href: "/tage-rechner", emoji: "➗" },
      { label: "Arbeitstage-Rechner", href: "/arbeitstage-rechner", emoji: "🧮" },
      { label: "Wochentag-Rechner", href: "/wochentag-rechner", emoji: "📆" },
      { label: "Altersrechner", href: "/altersrechner", emoji: "🎂" },
      { label: "Countdown", href: "/wie-viele-tage-bis", emoji: "⏳" },
      { label: "Alle Tools", href: "/generatoren", emoji: "⚙️" },
    ],
  },
];

/** Resolve {y} in a label or href against the given year (default: Berlin now). */
export function resolveHref(template: string, year?: number): string {
  const y = year ?? berlinNow().year;
  return template.replaceAll("{y}", String(y));
}
