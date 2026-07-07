import { test } from "node:test";
import assert from "node:assert/strict";
import { getCountdown, COUNTDOWNS, berlinMidnight } from "../src/lib/de/countdowns.ts";

const ref = new Date(Date.UTC(2026, 6, 7)); // 2026-07-07

test("Fixed events roll to next year once passed", () => {
  const w = getCountdown("weihnachten")!.resolve(ref);
  assert.deepEqual([w.year, w.month0, w.day], [2026, 11, 24]);
  const nj = getCountdown("neujahr")!.resolve(ref);
  assert.deepEqual([nj.year, nj.month0, nj.day], [2027, 0, 1]); // 1 Jan already passed → next year
});

test("Easter uses the next future Ostersonntag", () => {
  const o = getCountdown("ostern")!.resolve(ref);
  // Easter 2026 (5 Apr) is past on 7 Jul → next is Easter 2027 (28 Mar).
  assert.deepEqual([o.year, o.month0, o.day], [2027, 2, 28]);
});

test("All countdown slugs resolve to a valid future-or-today date", () => {
  const todayMs = berlinMidnight(2026, 6, 7);
  for (const c of COUNTDOWNS) {
    const t = c.resolve(ref);
    assert.ok(berlinMidnight(t.year, t.month0, t.day) >= todayMs, `${c.slug} resolved to the past`);
  }
});
