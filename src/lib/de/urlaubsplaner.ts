// Urlaubsplaner: optimisation of free days for a German Bundesland.
//
// Model: the year as a sequence of days. A day is "free" when it is a weekend,
// a statutory holiday (state-scoped!) or a taken vacation day. We look for
// "Brücken" — short stretches of working days between blocks of free days —
// because filling them yields the most free days for the fewest vacation days.
// "Familienjahr" mode rewards bridges that overlap the state's Schulferien
// (parent free while the kids are off school).
//
// This mirrors the Polish planer-urlopu logic, adapted to the German model:
//   - holidays are per Bundesland (see feiertage.ts / workFreeHolidaySet),
//   - "family" reference periods are the full Schulferien of the state
//     (winter/oster/pfingst/sommer/herbst/weihnachten), not just Ferien+Wakacje.

import { getAllFeiertage, workFreeHolidaySet } from "./feiertage";
import type { StateCode } from "./bundeslaender";
import { getSchulferien, getFerienByTyp, FERIEN_TYP_LABEL } from "./schulferien";

export type DateRange = { start: string; end: string };
export type PlanMode = "full" | "family";

export type PlanInput = {
  year: number;
  budget: number;
  mode: PlanMode;
  state: StateCode;
  fixed?: DateRange[];
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
};

// ── Date helpers (UTC ISO) ───────────────────────────────────────────────────
const pad = (n: number) => String(n).padStart(2, "0");
const isoOf = (y: number, m0: number, d: number) => `${y}-${pad(m0 + 1)}-${pad(d)}`;
function addDaysIso(iso: string, n: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
function weekdayIdx(iso: string): number {
  return (new Date(`${iso}T00:00:00Z`).getUTCDay() + 6) % 7; // Mon=0 … Sun=6
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

// ── Holiday names (for block labels + calendar tooltips) ─────────────────────
// Same day set as workFreeHolidaySet: national + state-scoped statutory days.
export function feiertagNames(year: number, state: StateCode): Map<string, string> {
  const m = new Map<string, string>();
  for (const h of getAllFeiertage(year)) {
    if (h.scope === "national" || (h.scope === "state" && h.states.includes(state))) {
      if (!m.has(h.date)) m.set(h.date, h.name);
    }
  }
  return m;
}

// ── Schulferien (family mode reference periods) ──────────────────────────────
/** All school-holiday periods of the state as labelled ranges (empty if unseeded). */
export function schoolBreaks(year: number, state: StateCode): (DateRange & { label: string })[] {
  const rec = getSchulferien(year, state);
  if (!rec) return [];
  return rec.periods.map((p) => ({ start: p.start, end: p.end, label: FERIEN_TYP_LABEL[p.typ] }));
}

/** Winter- and Sommerferien of the state (for the two info tiles). */
export function ferienHighlights(year: number, state: StateCode) {
  const winter = getFerienByTyp(year, state, "winterferien");
  const sommer = getFerienByTyp(year, state, "sommerferien");
  return {
    winter: winter ? { start: winter.start, end: winter.end } : null,
    sommer: sommer ? { start: sommer.start, end: sommer.end } : null,
  };
}

// ── Block labels ─────────────────────────────────────────────────────────────
function labelStretch(start: string, end: string, holidayNames: Map<string, string>): string {
  for (let d = start; d <= end; d = addDaysIso(d, 1)) {
    const h = holidayNames.get(d);
    if (h) {
      if (h.includes("Weihnacht")) return "Weihnachten";
      if (h === "Neujahr") return "Neujahr / Jahreswechsel";
      if (h.includes("Karfreitag") || h.includes("Oster")) return "Ostern";
      if (h.includes("Pfingst")) return "Pfingsten";
      if (h.includes("Christi Himmelfahrt")) return "Christi Himmelfahrt";
      if (h.includes("Tag der Arbeit")) return "Tag der Arbeit (1. Mai)";
      if (h.includes("Deutschen Einheit")) return "Tag der Deutschen Einheit";
      if (h.includes("Fronleichnam")) return "Fronleichnam";
      if (h.includes("Reformationstag")) return "Reformationstag";
      if (h.includes("Allerheiligen")) return "Allerheiligen";
      return h;
    }
  }
  const len = Math.round((new Date(`${end}T00:00:00Z`).getTime() - new Date(`${start}T00:00:00Z`).getTime()) / 86400000) + 1;
  return len >= 5 ? "Längere Auszeit" : "Langes Wochenende";
}

// ── Summary for ANY set of vacation days (after manual calendar editing) ──────
export function summarizePlan(year: number, state: StateCode, ptoDays: string[], budget: number): PlanResult {
  const days = eachDayOfYear(year);
  const daySet = new Set(days);
  const holidaySet = workFreeHolidaySet(year, state);
  const holidayNames = feiertagNames(year, state);
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
  };
}

// ── Main optimiser ────────────────────────────────────────────────────────────
export function planUrlaub(input: PlanInput): PlanResult {
  const { year, mode, state } = input;
  const budget = Math.max(0, Math.floor(input.budget || 0));

  const days = eachDayOfYear(year);
  const idxOf = new Map(days.map((d, i) => [d, i]));
  const holidaySet = workFreeHolidaySet(year, state);
  const holidayNames = feiertagNames(year, state);
  const isStatFree = (iso: string) => weekdayIdx(iso) >= 5 || holidaySet.has(iso);

  const pto = new Set<string>();
  const fixedPto = new Set<string>();

  // 1) Fixed periods (user's own plans) — consume budget first.
  for (const r of input.fixed ?? []) {
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

  // Family mode: any Schulferien period of the state is a "school break".
  const breaks = mode === "family" ? schoolBreaks(year, state) : [];
  const inSchoolBreak = (iso: string) => breaks.some((b) => inRange(iso, b));

  let left = budget - fixedPto.size;

  // Tuning constants. NEIGHBOR_CAP: count only adjacent STATUTORY-free days
  // (weekend/holiday) with a cap — otherwise bridges "glue" onto already-taken
  // vacation and one giant block forms instead of several long weekends.
  const NEIGHBOR_CAP = 4;
  const MIN_RATIO = 1.4; // don't fill gaps with a worse free/vacation ratio
  const MAX_STRETCH = 11; // don't inflate a single free block with the rest of the budget

  // 2) Bridges: fill gaps of working days between blocks of free days.
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
  const gapBase = (g: Gap) => (g.fb + g.L + g.fa) / g.L; // free days / vacation day
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
    if (gapBase(g) < MIN_RATIO) break; // nothing worthwhile left
    for (let x = g.start; x <= g.end; x++) pto.add(days[x]);
    left -= g.L;
  }

  // 3) Remaining budget: extend blocks adjoining free days (without a monster block).
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
      if (stretch > MAX_STRETCH) continue; // don't inflate long blocks
      const brk = mode === "family" && inSchoolBreak(days[i]);
      if (!best || (brk && !best.break) || (brk === best.break && stretch > best.stretch)) {
        best = { idx: i, stretch, break: brk };
      }
    }
    if (!best) break;
    pto.add(days[best.idx]);
    left -= 1;
  }

  // 4) Build suggestions from free blocks that contain vacation.
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
  };
}
