import { warsawNow, isoWeekOf } from "./now";
import { MONTH_SLUGS } from "./months";

// ── Struktura menu bocznego kalendarz.pro (8 sekcji) ─────────────────────────
// Jedno źródło prawdy dla sidebara (desktop) i drawera (mobile). Href-y używają
// znaczników {y} rok, {m} slug miesiąca, {d} dzień, {isoY}/{w} bieżący tydzień ISO.

export type MenuItem = { label: string; href: string; icon: string };
export type MenuSection = { title: string; items: MenuItem[]; popular?: boolean };

export const MENU: MenuSection[] = [
  {
    title: "Najpopularniejsze",
    popular: true,
    items: [
      { label: "Kalendarz {y}", href: "/kalendarz/{y}", icon: "calendar-year" },
      { label: "Kalendarz do druku", href: "/kalendarz-do-druku/{y}", icon: "calendar-print" },
      { label: "Dni wolne od pracy", href: "/dni-wolne-od-pracy/{y}", icon: "days-off" },
      { label: "Długie weekendy", href: "/dlugie-weekendy/{y}", icon: "long-weekends" },
      { label: "Planer urlopu", href: "/planer-urlopu/{y}", icon: "vacation-planner" },
      { label: "Numery tygodni", href: "/tydzien/{y}", icon: "week-numbers" },
      { label: "Niedziele handlowe", href: "/niedziele-handlowe/{y}", icon: "shopping-sundays" },
      { label: "Ile dni do wakacji", href: "/ile-dni-do-wakacji", icon: "countdown-vacation" },
      { label: "Fazy księżyca", href: "/fazy-ksiezyca/{y}", icon: "moon-phases" },
      { label: "Kalendarz szkolny", href: "/kalendarz-szkolny/{y}", icon: "school-calendar" },
    ],
  },
  {
    title: "Kalendarze",
    items: [
      { label: "Kalendarz roczny", href: "/kalendarz/{y}", icon: "calendar-year" },
      { label: "Kalendarz miesięczny", href: "/kalendarz/{m}-{y}", icon: "calendar-month" },
      { label: "Kartka z kalendarza", href: "/kalendarz/{m}-{y}/{d}", icon: "tear-off" },
      { label: "Kalendarz do druku PDF", href: "/kalendarz-do-druku/{y}", icon: "calendar-print" },
      { label: "Kalendarz tygodniowy", href: "/tydzien/{isoY}/{w}", icon: "calendar-week" },
      { label: "Numery tygodni", href: "/tydzien/{y}", icon: "week-numbers" },
    ],
  },
  {
    title: "Praca, wolne i urlopy",
    items: [
      { label: "Dni wolne od pracy", href: "/dni-wolne-od-pracy/{y}", icon: "days-off" },
      { label: "Dni robocze", href: "/dni-robocze/{y}", icon: "workdays" },
      { label: "Długie weekendy", href: "/dlugie-weekendy/{y}", icon: "long-weekends" },
      { label: "Planer urlopu", href: "/planer-urlopu/{y}", icon: "vacation-planner" },
      { label: "Niedziele handlowe", href: "/niedziele-handlowe/{y}", icon: "shopping-sundays" },
      { label: "Ile dni do weekendu", href: "/ile-dni-do-weekendu", icon: "countdown-weekend" },
      { label: "Ile dni do świąt", href: "/ile-dni-do-bozego-narodzenia", icon: "countdown-christmas" },
      { label: "Kalkulator dni roboczych", href: "/kalkulator-dni-roboczych", icon: "workday-calc" },
    ],
  },
  {
    title: "Święta i okazje",
    items: [
      { label: "Kalendarz świąt", href: "/swieta/{y}", icon: "holidays" },
      { label: "Święta nietypowe", href: "/swieta-nietypowe/{y}", icon: "unusual-holidays" },
      { label: "Święta ruchome", href: "/wielkanoc/{y}", icon: "movable-holidays" },
      { label: "Kalendarz imienin", href: "/imieniny", icon: "name-days" },
      { label: "Pory roku", href: "/pory-roku/{y}", icon: "seasons" },
      { label: "Zmiana czasu", href: "/zmiana-czasu/{y}", icon: "time-change" },
    ],
  },
  {
    title: "Szkoła i rodzina",
    items: [
      { label: "Kalendarz szkolny", href: "/kalendarz-szkolny/{y}", icon: "school-calendar" },
      { label: "Ferie zimowe", href: "/ferie-zimowe/{y}", icon: "winter-break" },
      { label: "Plan lekcji", href: "/plan-lekcji", icon: "lesson-plan" },
      { label: "Ile dni do wakacji", href: "/ile-dni-do-wakacji", icon: "countdown-vacation" },
      { label: "Kalkulator wieku", href: "/kalkulator-wieku", icon: "age-calc" },
      { label: "Kalkulator ciąży", href: "/kalkulator-ciazy", icon: "pregnancy-calc" },
    ],
  },
  {
    title: "Księżyc, natura i hobby",
    items: [
      { label: "Fazy księżyca", href: "/fazy-ksiezyca/{y}", icon: "moon-phases" },
      { label: "Pełnia księżyca", href: "/pelnia-ksiezyca/{y}", icon: "full-moon" },
      { label: "Nów księżyca", href: "/now-ksiezyca/{y}", icon: "new-moon" },
      { label: "Wschody i zachody słońca", href: "/wschod-zachod-slonca/{y}/{m}", icon: "sun-times" },
      { label: "Kalendarz ogrodnika", href: "/kalendarz-ogrodnika/{y}", icon: "gardener" },
      { label: "Kalendarz wędkarza", href: "/kalendarz-wedkarza/{y}", icon: "angler" },
    ],
  },
  {
    title: "Czas i obliczenia",
    items: [
      { label: "Kalkulator dni", href: "/kalkulator-dni", icon: "days-calc" },
      { label: "Odliczania", href: "/odliczania", icon: "countdowns" },
      { label: "Jaki to dzień tygodnia", href: "/dzien-tygodnia", icon: "weekday-finder" },
      { label: "Znaki zodiaku", href: "/zodiak", icon: "zodiac" },
      { label: "Zmiana czasu", href: "/zmiana-czasu/{y}", icon: "time-change" },
    ],
  },
  {
    title: "Narzędzia",
    items: [
      { label: "Plan lekcji", href: "/plan-lekcji", icon: "lesson-plan" },
      { label: "Kalkulator dni", href: "/kalkulator-dni", icon: "days-calc" },
      { label: "Kalkulator wieku", href: "/kalkulator-wieku", icon: "age-calc" },
      { label: "Kalkulator dni roboczych", href: "/kalkulator-dni-roboczych", icon: "workday-calc" },
      { label: "Kalkulator ciąży", href: "/kalkulator-ciazy", icon: "pregnancy-calc" },
      { label: "Jaki to dzień tygodnia", href: "/dzien-tygodnia", icon: "weekday-finder" },
    ],
  },
];

// Podstawienie znaczników w href-ie. Przyjmuje kontekst policzony na serwerze
// (żeby uniknąć rozjazdu SSR↔klient na przełomie doby); domyślnie warsawNow().
export function resolveHref(template: string, ctx?: { year: number; month0: number; day: number }): string {
  const { year, month0, day } = ctx ?? warsawNow();
  const iso = isoWeekOf(year, month0, day);
  const map: Record<string, string> = {
    "{y}": String(year),
    "{m}": MONTH_SLUGS.pl[month0],
    "{d}": String(day),
    "{isoY}": String(iso.isoYear),
    "{w}": String(iso.week),
  };
  return template.replace(/\{y\}|\{m\}|\{d\}|\{isoY\}|\{w\}/g, (t) => map[t] ?? t);
}

// ── Ikony menu: emoji-fallback + alt + temat (subject) do generacji fal.ai ────
// Pliki docelowe: /public/icons/calendar-menu/<klucz>.jpg (soft-3D, białe tło,
// renderowane w białym kafelku). Gdy brak pliku — pokazujemy emoji-fallback.
export const MENU_ICONS: Record<string, { emoji: string; alt: string; subject: string }> = {
  "calendar-year": { emoji: "📅", alt: "Kalendarz roczny", subject: "a single minimalist wall calendar card" },
  "calendar-month": { emoji: "🗓️", alt: "Kalendarz miesięczny", subject: "a monthly calendar grid sheet" },
  "tear-off": { emoji: "📆", alt: "Kartka z kalendarza", subject: "a single tear-off daily calendar sheet peeling at the corner" },
  "calendar-print": { emoji: "🖨️", alt: "Kalendarz do druku", subject: "a small printer with a calendar sheet coming out" },
  "calendar-week": { emoji: "📋", alt: "Kalendarz tygodniowy", subject: "a weekly planner sheet with one highlighted row" },
  "week-numbers": { emoji: "🔢", alt: "Numery tygodni", subject: "a small bookmark tab with a counter badge" },
  "days-off": { emoji: "🏖️", alt: "Dni wolne od pracy", subject: "a beach umbrella next to a sun lounger" },
  "workdays": { emoji: "💼", alt: "Dni robocze", subject: "a business briefcase with a small checkmark" },
  "long-weekends": { emoji: "🌉", alt: "Długie weekendy", subject: "three connected day blocks forming a small bridge" },
  "vacation-planner": { emoji: "🧳", alt: "Planer urlopu", subject: "a travel suitcase with a checkmark" },
  "shopping-sundays": { emoji: "🛍️", alt: "Niedziele handlowe", subject: "a shopping bag" },
  "countdown-vacation": { emoji: "⛱️", alt: "Ile dni do wakacji", subject: "a sun over a palm beach, summer holiday feel" },
  "countdown-weekend": { emoji: "🎉", alt: "Ile dni do weekendu", subject: "two connected weekend day blocks with a small star" },
  "countdown-christmas": { emoji: "🎄", alt: "Ile dni do świąt", subject: "a small stylised christmas tree" },
  "workday-calc": { emoji: "🧮", alt: "Kalkulator dni roboczych", subject: "a pocket calculator next to a briefcase" },
  "holidays": { emoji: "🎊", alt: "Kalendarz świąt", subject: "a gift box with a shining star" },
  "unusual-holidays": { emoji: "🎈", alt: "Święta nietypowe", subject: "a party popper with confetti" },
  "movable-holidays": { emoji: "🥚", alt: "Święta ruchome", subject: "a decorated easter egg with a small circular arrow" },
  "name-days": { emoji: "🎂", alt: "Kalendarz imienin", subject: "a birthday cake with a single candle" },
  "seasons": { emoji: "🍂", alt: "Pory roku", subject: "four small season symbols arranged in a circle: leaf, sun, snowflake, flower" },
  "time-change": { emoji: "🕐", alt: "Zmiana czasu", subject: "a round clock with a curved arrow" },
  "school-calendar": { emoji: "🎒", alt: "Kalendarz szkolny", subject: "a school backpack" },
  "winter-break": { emoji: "❄️", alt: "Ferie zimowe", subject: "a snowflake with a small winter hat" },
  "lesson-plan": { emoji: "📓", alt: "Plan lekcji", subject: "a school timetable notebook with colored blocks" },
  "age-calc": { emoji: "⏳", alt: "Kalkulator wieku", subject: "a birthday cake next to a pocket calculator" },
  "pregnancy-calc": { emoji: "👶", alt: "Kalkulator ciąży", subject: "a gentle heart with a small baby silhouette, tasteful, not childish" },
  "moon-phases": { emoji: "🌙", alt: "Fazy księżyca", subject: "a row of moon phases from crescent to full moon" },
  "full-moon": { emoji: "🌕", alt: "Pełnia księżyca", subject: "a single full glowing moon" },
  "new-moon": { emoji: "🌑", alt: "Nów księżyca", subject: "a dark new moon with a thin glowing outline" },
  "sun-times": { emoji: "🌅", alt: "Wschody i zachody słońca", subject: "a sun rising over a horizon line with soft rays" },
  "gardener": { emoji: "🌱", alt: "Kalendarz ogrodnika", subject: "a young plant sprout next to a small watering can" },
  "angler": { emoji: "🐟", alt: "Kalendarz wędkarza", subject: "a fish with a fishing hook" },
  "days-calc": { emoji: "➕", alt: "Kalkulator dni", subject: "a pocket calculator next to a small calendar" },
  "countdowns": { emoji: "⏲️", alt: "Odliczania", subject: "an hourglass sand timer" },
  "weekday-finder": { emoji: "❓", alt: "Jaki to dzień tygodnia", subject: "a calendar sheet with a large question mark" },
  "zodiac": { emoji: "♒", alt: "Znaki zodiaku", subject: "a small constellation of connected stars" },
};

// Wspólny prompt bazowy do fal.ai (spójna rodzina ikon).
export const ICON_BASE_PROMPT =
  "Create a clean soft 3D semi-flat app icon for a modern Polish calendar website. Pure solid white background. Rounded friendly shapes. Minimal details. Premium utility website style. Color palette: deep navy (#0B376D), bright blue (#0E7AFE), warm yellow (#F5B800), white, light gray. Subtle soft shadow, high readability at 24px, no text, no letters, no numbers, no background scene, single centered object, consistent icon family.";
