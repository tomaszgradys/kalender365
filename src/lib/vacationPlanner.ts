import { getNonWorkingHolidays, easterSunday } from "./holidays";
import { getFerie, schoolYearEnd } from "./school";

// ── Planer urlopu: optymalizacja dni wolnego ────────────────────────────────
// Model: rok jako ciąg dni. Dzień jest „wolny", gdy to weekend, święto ustawowe
// lub wzięty urlop. Szukamy „mostków" — krótkich ciągów dni roboczych między
// blokami wolnego — bo ich wypełnienie daje najwięcej wolnego za najmniej urlopu.
// Tryb „rodzinny" premiuje mostki nakładające się na ferie i wakacje (dziecko w domu).

export const WOJEWODZTWA = [
  "dolnośląskie", "kujawsko-pomorskie", "lubelskie", "lubuskie", "łódzkie", "małopolskie",
  "mazowieckie", "opolskie", "podkarpackie", "podlaskie", "pomorskie", "śląskie",
  "świętokrzyskie", "warmińsko-mazurskie", "wielkopolskie", "zachodniopomorskie",
] as const;
export type Wojewodztwo = (typeof WOJEWODZTWA)[number];

// Slug ASCII województwa do URL-a (np. „dolnośląskie" → „dolnoslaskie").
const PL_DIACRITICS: Record<string, string> = { ą: "a", ć: "c", ę: "e", ł: "l", ń: "n", ó: "o", ś: "s", ź: "z", ż: "z" };
export function wojSlug(name: string): string {
  return name.toLowerCase().replace(/[ąćęłńóśźż]/g, (c) => PL_DIACRITICS[c] ?? c);
}
export function wojFromSlug(slug: string): Wojewodztwo | null {
  return WOJEWODZTWA.find((w) => wojSlug(w) === slug) ?? null;
}

export type DateRange = { start: string; end: string };
export type PlanMode = "full" | "family";

export type PlanInput = {
  year: number;
  budget: number;
  mode: PlanMode;
  region?: string;
  fixed: DateRange[];
};

export type Suggestion = {
  ptoDays: string[];
  ptoCount: number;
  offStart: string;
  offEnd: string;
  offTotal: number;
  label: string;
  fixed: boolean;
};

export type PlanResult = {
  suggestions: Suggestion[];
  ptoBudget: number;
  ptoUsed: number;
  ptoLeft: number;
  totalDaysOff: number;
  efficiency: number;
  overBudget: boolean;
  ferie: (DateRange & { label: string }) | null;
  wakacje: DateRange | null;
};

// ── Pomocnicze daty (UTC ISO) ────────────────────────────────────────────────
const pad = (n: number) => String(n).padStart(2, "0");
const isoOf = (y: number, m0: number, d: number) => `${y}-${pad(m0 + 1)}-${pad(d)}`;
function addDaysIso(iso: string, n: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
function weekdayIdx(iso: string): number {
  return (new Date(`${iso}T00:00:00Z`).getUTCDay() + 6) % 7; // pon=0 … niedz=6
}
function eachDayOfYear(year: number): string[] {
  const days: string[] = [];
  let cur = isoOf(year, 0, 1);
  const end = isoOf(year, 11, 31);
  while (cur <= end) {
    days.push(cur);
    cur = addDaysIso(cur, 1);
  }
  return days;
}
function inRange(iso: string, r: DateRange): boolean {
  return iso >= r.start && iso <= r.end;
}

// ── Ferie / wakacje dla trybu rodzinnego ─────────────────────────────────────
const MONTHS_PL: Record<string, number> = {
  stycznia: 1, lutego: 2, marca: 3, kwietnia: 4, maja: 5, czerwca: 6,
  lipca: 7, sierpnia: 8, września: 9, października: 10, listopada: 11, grudnia: 12,
};

export function ferieForRegion(region: string, year: number): (DateRange & { label: string }) | null {
  const turns = getFerie(year);
  if (!turns) return null;
  const turn = turns.find((t) => t.regions.includes(region));
  if (!turn) return null;
  // Obsługa DWÓCH formatów: „19 stycznia – 1 lutego 2026" ORAZ „2 – 15 lutego 2026"
  // (w drugim pierwszy dzień nie ma nazwy miesiąca — dziedziczy miesiąc z części końcowej).
  const parts = turn.dates.split(/\s+[–-]\s+/);
  if (parts.length !== 2) return null;
  const right = parts[1].match(/(\d{1,2})\s+(\p{L}+)\s+(\d{4})/u);
  const left = parts[0].match(/(\d{1,2})(?:\s+(\p{L}+))?/u);
  if (!right || !left) return null;
  const [, d2, monB, yr] = right;
  const d1 = left[1];
  const monA = left[2] || monB;
  const mA = MONTHS_PL[monA];
  const mB = MONTHS_PL[monB];
  if (!mA || !mB) return null;
  return { start: isoOf(+yr, mA - 1, +d1), end: isoOf(+yr, mB - 1, +d2), label: "Ferie zimowe" };
}

export function wakacjeWindow(year: number): DateRange {
  return { start: addDaysIso(schoolYearEnd(year), 1), end: isoOf(year, 7, 31) };
}

// Wszystkie dni wolne od szkoły w danym roku. Standardowe przerwy (świąteczne)
// są takie same dla wszystkich województw — zaznaczamy je domyślnie. Ferie zimowe
// zależą od województwa (jeśli podane i dostępne w danych).
export function schoolBreaks(year: number, region?: string): (DateRange & { label: string })[] {
  const out: (DateRange & { label: string })[] = [];
  // Zimowa przerwa świąteczna: koniec przerwy z przełomu roku (styczeń) i początek
  // przerwy wchodzącej w kolejny rok (grudzień) — orientacyjnie 23 XII – 1 I.
  out.push({ start: `${year - 1}-12-23`, end: `${year}-01-01`, label: "Przerwa świąteczna (zimowa)" });
  out.push({ start: `${year}-12-23`, end: `${year + 1}-01-01`, label: "Przerwa świąteczna (zimowa)" });
  // Wiosenna przerwa świąteczna (Wielki Czwartek – Wtorek Wielkanocny).
  const e = easterSunday(year).toISOString().slice(0, 10);
  out.push({ start: addDaysIso(e, -3), end: addDaysIso(e, 2), label: "Przerwa wielkanocna" });
  // Ferie zimowe (zależne od województwa).
  if (region) {
    const f = ferieForRegion(region, year);
    if (f) out.push(f);
  }
  // Wakacje letnie.
  out.push({ ...wakacjeWindow(year), label: "Wakacje letnie" });
  return out;
}

// ── Etykiety bloków wolnego ──────────────────────────────────────────────────
function labelStretch(start: string, end: string, holidayNames: Map<string, string>): string {
  for (let d = start; d <= end; d = addDaysIso(d, 1)) {
    const h = holidayNames.get(d);
    if (h) {
      if (h.includes("Pracy") || h.includes("Konstytucji")) return "Majówka";
      if (h.includes("Boże Narodzenie")) return "Święta Bożego Narodzenia";
      if (h.includes("Wielkanocny")) return "Wielkanoc";
      if (h.includes("Niepodległości")) return "Święto Niepodległości";
      if (h.includes("Boże Ciało")) return "Boże Ciało";
      if (h.includes("Wszystkich")) return "Wszystkich Świętych";
      return h;
    }
  }
  const len = Math.round((new Date(`${end}T00:00:00Z`).getTime() - new Date(`${start}T00:00:00Z`).getTime()) / 86400000) + 1;
  return len >= 5 ? "Dłuższa przerwa" : "Długi weekend";
}

// Podsumowanie planu dla DOWOLNEGO zestawu dni urlopu (po ręcznej edycji na kalendarzu).
export function summarizePlan(year: number, ptoDays: string[], budget: number): PlanResult {
  const days = eachDayOfYear(year);
  const daySet = new Set(days);
  const holidays = getNonWorkingHolidays(year);
  const holidayNames = new Map(holidays.map((h) => [h.date, h.name.pl]));
  const holidaySet = new Set(holidays.map((h) => h.date));
  const isStatFree = (iso: string) => weekdayIdx(iso) >= 5 || holidaySet.has(iso);
  const pto = new Set(ptoDays.filter((d) => daySet.has(d) && !isStatFree(d)));
  const isFree = (iso: string) => isStatFree(iso) || pto.has(iso);

  const suggestions: Suggestion[] = [];
  let i = 0;
  while (i < days.length) {
    if (!isFree(days[i])) { i++; continue; }
    const start = i;
    while (i < days.length && isFree(days[i])) i++;
    const end = i - 1;
    const pd: string[] = [];
    for (let x = start; x <= end; x++) if (pto.has(days[x])) pd.push(days[x]);
    if (pd.length === 0) continue;
    suggestions.push({
      ptoDays: pd,
      ptoCount: pd.length,
      offStart: days[start],
      offEnd: days[end],
      offTotal: end - start + 1,
      label: labelStretch(days[start], days[end], holidayNames),
      fixed: false,
    });
  }
  const ptoUsed = pto.size;
  const totalDaysOff = suggestions.reduce((s, x) => s + x.offTotal, 0);
  return {
    suggestions,
    ptoBudget: budget,
    ptoUsed,
    ptoLeft: Math.max(0, budget - ptoUsed),
    totalDaysOff,
    efficiency: ptoUsed > 0 ? totalDaysOff / ptoUsed : 0,
    overBudget: ptoUsed > budget,
    ferie: null,
    wakacje: null,
  };
}

// ── Główny optymalizator ─────────────────────────────────────────────────────
export function planVacation(input: PlanInput): PlanResult {
  const { year, mode } = input;
  const budget = Math.max(0, Math.floor(input.budget || 0));

  const days = eachDayOfYear(year);
  const idxOf = new Map(days.map((d, i) => [d, i]));
  const holidays = getNonWorkingHolidays(year);
  const holidayNames = new Map(holidays.map((h) => [h.date, h.name.pl]));
  const holidaySet = new Set(holidays.map((h) => h.date));

  const isStatFree = (iso: string) => weekdayIdx(iso) >= 5 || holidaySet.has(iso);

  const pto = new Set<string>();
  const fixedPto = new Set<string>();

  // 1) Terminy obowiązkowe (plany użytkownika) — pochłaniają urlop w pierwszej kolejności.
  for (const r of input.fixed) {
    if (!r.start || !r.end || r.start > r.end) continue;
    for (let d = r.start; d <= r.end; d = addDaysIso(d, 1)) {
      if (!idxOf.has(d)) continue;
      if (!isStatFree(d) && !pto.has(d)) {
        pto.add(d);
        fixedPto.add(d);
      }
    }
  }

  const isFree = (iso: string) => isStatFree(iso) || pto.has(iso);

  const region = input.region;
  const ferie = mode === "family" && region ? ferieForRegion(region, year) : null;
  const wakacje = mode === "family" ? wakacjeWindow(year) : null;
  const inSchoolBreak = (iso: string) =>
    (ferie && inRange(iso, ferie)) || (wakacje && inRange(iso, wakacje)) || false;

  let left = budget - fixedPto.size;

  // Stałe strojące. NEIGHBOR_CAP: liczymy tylko sąsiadujące dni USTAWOWO wolne
  // (weekend/święto), z limitem — inaczej mostki „doklejałyby się" do już wziętego
  // urlopu i tworzył się jeden gigantyczny blok zamiast kilku długich weekendów.
  const NEIGHBOR_CAP = 4;
  const MIN_RATIO = 1.4; // nie wypełniaj luk o gorszym stosunku wolne/urlop
  const MAX_STRETCH = 11; // nie rozdmuchuj jednego bloku wolnego resztą urlopu

  // 2) Mostki: wypełnianie luk dni roboczych między blokami wolnego.
  const findGaps = () => {
    const gaps: { start: number; end: number; L: number; fb: number; fa: number }[] = [];
    let i = 0;
    while (i < days.length) {
      if (isFree(days[i])) { i++; continue; }
      const start = i;
      while (i < days.length && !isFree(days[i])) i++;
      const end = i - 1;
      let fb = 0, j = start - 1;
      while (j >= 0 && isStatFree(days[j]) && fb < NEIGHBOR_CAP) { fb++; j--; }
      let fa = 0, k = end + 1;
      while (k < days.length && isStatFree(days[k]) && fa < NEIGHBOR_CAP) { fa++; k++; }
      gaps.push({ start, end, L: end - start + 1, fb, fa });
    }
    return gaps;
  };

  type Gap = { start: number; end: number; L: number; fb: number; fa: number };
  const gapBase = (g: Gap) => (g.fb + g.L + g.fa) / g.L; // dni wolnego / dzień urlopu
  const gapScore = (g: Gap) => {
    let boost = 1;
    if (mode === "family") {
      for (let x = g.start; x <= g.end; x++) if (inSchoolBreak(days[x])) { boost = 1.6; break; }
    }
    return gapBase(g) * boost;
  };

  while (left > 0) {
    const cand = findGaps().filter((g) => g.L <= left && (g.fb > 0 || g.fa > 0));
    if (cand.length === 0) break;
    cand.sort((a, b) => gapScore(b) - gapScore(a) || a.L - b.L || a.start - b.start);
    const g = cand[0];
    if (gapBase(g) < MIN_RATIO) break; // nic już opłacalnego
    for (let x = g.start; x <= g.end; x++) pto.add(days[x]);
    left -= g.L;
  }

  // 3) Reszta budżetu: wydłużaj bloki przylegające do wolnego (bez tworzenia molocha).
  while (left > 0) {
    let best: { idx: number; stretch: number; break: boolean } | null = null;
    for (let i = 0; i < days.length; i++) {
      if (isFree(days[i])) continue;
      const leftFree = i > 0 && isFree(days[i - 1]);
      const rightFree = i < days.length - 1 && isFree(days[i + 1]);
      if (!leftFree && !rightFree) continue;
      let s = i, e = i;
      while (s - 1 >= 0 && isFree(days[s - 1])) s--;
      while (e + 1 < days.length && isFree(days[e + 1])) e++;
      const stretch = e - s + 2;
      if (stretch > MAX_STRETCH) continue; // nie rozdmuchuj długich bloków
      const brk = mode === "family" && inSchoolBreak(days[i]);
      if (!best || (brk && !best.break) || (brk === best.break && stretch > best.stretch)) {
        best = { idx: i, stretch, break: brk };
      }
    }
    if (!best) break;
    pto.add(days[best.idx]);
    left -= 1;
  }

  // 4) Zbuduj sugestie z bloków wolnego zawierających urlop.
  const suggestions: Suggestion[] = [];
  let i = 0;
  while (i < days.length) {
    if (!isFree(days[i])) { i++; continue; }
    const start = i;
    while (i < days.length && isFree(days[i])) i++;
    const end = i - 1;
    const ptoDays: string[] = [];
    for (let x = start; x <= end; x++) if (pto.has(days[x])) ptoDays.push(days[x]);
    if (ptoDays.length === 0) continue;
    suggestions.push({
      ptoDays,
      ptoCount: ptoDays.length,
      offStart: days[start],
      offEnd: days[end],
      offTotal: end - start + 1,
      label: labelStretch(days[start], days[end], holidayNames),
      fixed: ptoDays.every((d) => fixedPto.has(d)),
    });
  }

  const ptoUsed = pto.size;
  const totalDaysOff = suggestions.reduce((s, x) => s + x.offTotal, 0);

  return {
    suggestions,
    ptoBudget: budget,
    ptoUsed,
    ptoLeft: Math.max(0, budget - ptoUsed),
    totalDaysOff,
    efficiency: ptoUsed > 0 ? totalDaysOff / ptoUsed : 0,
    overBudget: fixedPto.size > budget,
    ferie,
    wakacje,
  };
}
