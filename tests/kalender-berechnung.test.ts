import { test } from "node:test";
import assert from "node:assert/strict";
import { isoWeeksInYear, getISOWeekRange, allWeeks, isValidWeek } from "../src/lib/de/weeks.ts";
import { getDSTChanges } from "../src/lib/de/astroYear.ts";
import { arbeitstageInYear, werktageInYear, arbeitstageBetween, yearDays, workingDaysInMonth } from "../src/lib/de/arbeitstage.ts";
import { getBrueckentage } from "../src/lib/de/brueckentage.ts";

const isoOf = (d: Date) => d.toISOString().slice(0, 10);

test("ISO 8601: Jahre mit 53 Kalenderwochen 2015–2035", () => {
  // 53 KW: Jahr beginnt an einem Donnerstag, oder Schaltjahr beginnt an einem Mittwoch.
  const with53 = [2015, 2020, 2026, 2032];
  for (let y = 2015; y <= 2035; y++) {
    assert.equal(isoWeeksInYear(y), with53.includes(y) ? 53 : 52, `KW-Anzahl ${y}`);
    assert.equal(allWeeks(y).length, isoWeeksInYear(y));
  }
});

test("ISO 8601: KW-Grenzen 2026/2027/2028", () => {
  assert.equal(isoOf(getISOWeekRange(2026, 1).start), "2025-12-29");
  assert.equal(isoOf(getISOWeekRange(2026, 53).start), "2026-12-28");
  assert.equal(isoOf(getISOWeekRange(2026, 53).end), "2027-01-03");
  assert.equal(isoOf(getISOWeekRange(2027, 1).start), "2027-01-04");
  assert.equal(isoOf(getISOWeekRange(2027, 52).end), "2028-01-02");
  assert.equal(isoOf(getISOWeekRange(2028, 1).start), "2028-01-03");
  assert.equal(isoOf(getISOWeekRange(2028, 52).end), "2028-12-31");
  assert.equal(isValidWeek(2026, 53), true);
  assert.equal(isValidWeek(2027, 53), false);
  for (const y of [2026, 2027, 2028]) {
    for (const w of allWeeks(y)) {
      assert.equal(w.start.getUTCDay(), 1, `KW ${y}/${w.week} beginnt nicht am Montag`);
      assert.equal((w.end.getTime() - w.start.getTime()) / 86400000, 6);
    }
  }
});

test("Schaltjahre: 2028 hat 366 Tage, 2027 hat 365, 2100 ist kein Schaltjahr", () => {
  assert.equal(yearDays(2028, "BE").length, 366);
  assert.equal(yearDays(2027, "BE").length, 365);
  assert.equal(yearDays(2024, "BE").length, 366);
  assert.equal(yearDays(2100, "BE").length, 365);
  assert.equal(workingDaysInMonth(2028, 1, "BE").total, 29);
});

test("Zeitumstellung MEZ/MESZ 2026–2028: letzter Sonntag im März und Oktober", () => {
  const expected: Record<number, [string, string]> = {
    2026: ["2026-03-29", "2026-10-25"],
    2027: ["2027-03-28", "2027-10-31"],
    2028: ["2028-03-26", "2028-10-29"],
  };
  for (const [y, [s, a]] of Object.entries(expected)) {
    const [spring, autumn] = getDSTChanges(Number(y));
    assert.equal(spring.iso, s);
    assert.equal(autumn.iso, a);
    for (const iso of [s, a]) {
      const d = new Date(iso + "T00:00:00Z");
      assert.equal(d.getUTCDay(), 0, `${iso} ist kein Sonntag`);
      // letzter Sonntag: 7 Tage später liegt bereits im Folgemonat
      const next = new Date(d);
      next.setUTCDate(d.getUTCDate() + 7);
      assert.notEqual(next.getUTCMonth(), d.getUTCMonth());
    }
    assert.match(spring.label, /Sommerzeit/);
  }
});

test("Arbeitstage (Mo–Fr) und Werktage (Mo–Sa) 2026–2028 — Referenzwerte", () => {
  // 2026: 261 Wochentage; bundesweite Feiertage auf Mo–Fr: 7 (3.10. und 26.12. = Samstag).
  assert.equal(arbeitstageInYear(2026, "BE"), 254); // Frauentag 8.3. = Sonntag
  assert.equal(arbeitstageInYear(2026, "BY"), 252); // + Hl. Drei Könige (Di), Fronleichnam (Do); Allerheiligen = So
  assert.equal(arbeitstageInYear(2026, "NW"), 253);
  assert.equal(arbeitstageInYear(2026, "SN"), 253); // Reformationstag = Sa, Buß- und Bettag (Mi)
  // Werktage: 313 Mo–Sa minus 9 bundesweite Feiertage auf Mo–Sa.
  assert.equal(werktageInYear(2026, "BE"), 304);
  assert.equal(werktageInYear(2026, "BY"), 302);
  // 2027: 261 Wochentage; bundesweit auf Mo–Fr: 5 (1.5. Sa, 3.10. So, 25.12. Sa, 26.12. So).
  assert.equal(arbeitstageInYear(2027, "BB"), 256); // Reformationstag = So
  assert.equal(arbeitstageInYear(2027, "BE"), 255); // Frauentag = Mo
  assert.equal(arbeitstageInYear(2027, "BY"), 253);
  // 2028 (Schaltjahr, beginnt Samstag): 260 Wochentage; bundesweit auf Mo–Fr: 8.
  assert.equal(arbeitstageInYear(2028, "HH"), 251); // Reformationstag = Di
  assert.equal(arbeitstageInYear(2028, "BE"), 251); // Frauentag = Mi; 17.6. = Sa (zählt nicht)
  assert.equal(arbeitstageInYear(2028, "BY"), 249);
  assert.equal(arbeitstageInYear(2028, "SL"), 249); // Fronleichnam Do, Mariä Himmelfahrt Di, Allerheiligen Mi
  for (const y of [2026, 2027, 2028]) {
    assert.ok(werktageInYear(y, "BY") > arbeitstageInYear(y, "BY"));
  }
});

test("Werktage: Samstag zählt, Sonntag und Feiertag nicht", () => {
  // Sa 2026-10-03 (Tag der Deutschen Einheit): weder Arbeits- noch Werktag.
  assert.equal(arbeitstageBetween("2026-10-03", "2026-10-03", "BE", "6"), 0);
  // Sa 2026-10-10: Werktag, aber kein Arbeitstag.
  assert.equal(arbeitstageBetween("2026-10-10", "2026-10-10", "BE", "6"), 1);
  assert.equal(arbeitstageBetween("2026-10-10", "2026-10-10", "BE", "5"), 0);
  // So 2026-10-11: nie.
  assert.equal(arbeitstageBetween("2026-10-11", "2026-10-11", "BE", "6"), 0);
  // Jahresübergreifend: 2026-12-28 (Mo) .. 2027-01-04 (Mo) → Mo Di Mi Do + Mo (1.1. Fr Feiertag, Sa/So) = 5
  assert.equal(arbeitstageBetween("2026-12-28", "2027-01-04", "NW"), 5);
});

test("Brückentage 2027: Christi Himmelfahrt (Do 6.5.) → Freitag 7.5. als Brücke", () => {
  const b = getBrueckentage(2027, "NW");
  const fr = b.find((x) => x.urlaub.length === 1 && x.urlaub[0] === "2027-05-07");
  assert.ok(fr, "Brücke 2027-05-07 fehlt");
  assert.equal(fr!.von, "2027-05-06");
  assert.equal(fr!.bis, "2027-05-09");
  assert.equal(fr!.freieTage, 4);
  // 2028: Tag der Deutschen Einheit Di 3.10. → Montag 2.10. als Brücke (4 freie Tage).
  const b28 = getBrueckentage(2028, "HE").find((x) => x.urlaub.length === 1 && x.urlaub[0] === "2028-10-02");
  assert.ok(b28);
  assert.equal(b28!.freieTage, 4);
});
