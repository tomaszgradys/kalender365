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
      { label: "Arbeitstage {y}", href: "/arbeitstage/{y}", emoji: "💼" },
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
    ],
  },
  {
    title: "Zeit & Rechner",
    items: [
      { label: "Kalenderwochen {y}", href: "/kalenderwochen/{y}", emoji: "🔢" },
      { label: "Tage-Rechner", href: "/tage-rechner", emoji: "➗" },
      { label: "Arbeitstage-Rechner", href: "/arbeitstage-rechner", emoji: "🧮" },
      { label: "Wochentag-Rechner", href: "/wochentag-rechner", emoji: "📆" },
      { label: "Alle Tools", href: "/generatoren", emoji: "⚙️" },
    ],
  },
];

/** Resolve {y} in a label or href against the given year (default: Berlin now). */
export function resolveHref(template: string, year?: number): string {
  const y = year ?? berlinNow().year;
  return template.replaceAll("{y}", String(y));
}
