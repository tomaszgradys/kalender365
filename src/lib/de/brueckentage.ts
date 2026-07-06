// Brückentage & lange Wochenenden per Bundesland.
//
// A Brückentag is a working day (Mon–Fri, not a holiday) wedged between a
// holiday and the weekend: taking it as Urlaub turns a small number of vacation
// days into a long block of free days. We compute, per gap of working days
// bounded by free days on both sides, how many free days a full bridge yields.
//
// Output is ranked by "efficiency" (freie Tage / Urlaubstage), then block
// length, then earliest date — so the best deals surface first. This is an
// informational planning aid, not legal or HR advice.

import type { StateCode } from "./bundeslaender";
import { yearDays } from "./arbeitstage";

export type LongWeekend = { start: string; end: string; length: number };

/** Natural long weekends (>=3 consecutive free days) under a 5-day week. */
export function getLangeWochenenden(year: number, state: StateCode): LongWeekend[] {
  const days = yearDays(year, state);
  const result: LongWeekend[] = [];
  let i = 0;
  while (i < days.length) {
    if (days[i].off5) {
      let j = i;
      while (j + 1 < days.length && days[j + 1].off5) j++;
      const len = j - i + 1;
      if (len >= 3) result.push({ start: days[i].date, end: days[j].date, length: len });
      i = j + 1;
    } else i++;
  }
  return result;
}

export type Brueckentag = {
  /** the working days to take as Urlaub (the bridge). */
  urlaub: string[];
  urlaubstage: number;
  /** total consecutive free days achieved (bridge + surrounding free days). */
  freieTage: number;
  /** first .. last day of the resulting free block. */
  von: string;
  bis: string;
  /** freieTage / urlaubstage — higher is a better deal. */
  effizienz: number;
};

/**
 * Bridge opportunities: gaps of 1–`maxBridge` working days fully enclosed by
 * free days. Default maxBridge=4 catches classic 4-day-vacation → 9-day-block
 * cases (e.g. Christi Himmelfahrt week).
 */
export function getBrueckentage(year: number, state: StateCode, maxBridge = 4): Brueckentag[] {
  const days = yearDays(year, state);
  const result: Brueckentag[] = [];
  let i = 0;
  while (i < days.length) {
    if (!days[i].off5) {
      let j = i;
      while (j + 1 < days.length && !days[j + 1].off5) j++;
      const workLen = j - i + 1;
      const leftOff = i > 0 && days[i - 1].off5;
      const rightOff = j + 1 < days.length && days[j + 1].off5;
      if (workLen <= maxBridge && leftOff && rightOff) {
        let a = i - 1;
        while (a - 1 >= 0 && days[a - 1].off5) a--;
        let b = j + 1;
        while (b + 1 < days.length && days[b + 1].off5) b++;
        const freieTage = b - a + 1;
        result.push({
          urlaub: days.slice(i, j + 1).map((d) => d.date),
          urlaubstage: workLen,
          freieTage,
          von: days[a].date,
          bis: days[b].date,
          effizienz: freieTage / workLen,
        });
      }
      i = j + 1;
    } else i++;
  }
  return result.sort(
    (x, y) =>
      y.effizienz - x.effizienz ||
      y.freieTage - x.freieTage ||
      x.von.localeCompare(y.von),
  );
}

// Default Urlaubstage chips for the Urlaubsplaner UI — German norms (30 is the
// common full-time entitlement; 20 is the statutory minimum at a 5-day week).
export const URLAUBSTAGE_CHIPS = [20, 25, 28, 30];
