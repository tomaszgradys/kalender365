import test from "node:test";
import assert from "node:assert/strict";
import { getBrueckentageBundesweit, getLangeWochenendenBundesweit, feiertageAmWochenende } from "../src/lib/de/brueckentageBundesweit.ts";

test("Brückentage bundesweit 2027: Himmelfahrt-Brücke (Fr 7. Mai) gilt in allen 16 Ländern", () => {
  const all = getBrueckentageBundesweit(2027);
  const himmelfahrt = all.find((b) => b.urlaub.includes("2027-05-07"));
  assert.ok(himmelfahrt, "Brücke am 7. Mai 2027 fehlt");
  assert.equal(himmelfahrt.bundesweit, true);
  assert.equal(himmelfahrt.states.length, 16);
  // Erste Einträge sind bundesweit, danach regionale.
  const firstRegional = all.findIndex((b) => !b.bundesweit);
  assert.ok(firstRegional === -1 || all.slice(0, firstRegional).every((b) => b.bundesweit));
});

test("Fronleichnam-Brücke 2027 (Fr 28. Mai) gilt nur in den Fronleichnam-Ländern", () => {
  const b = getBrueckentageBundesweit(2027).find((x) => x.urlaub.length === 1 && x.urlaub[0] === "2027-05-28");
  assert.ok(b, "Fronleichnam-Brücke fehlt");
  assert.equal(b.bundesweit, false);
  for (const s of ["BW", "BY", "HE", "NW", "RP", "SL"]) assert.ok(b.states.includes(s as never), s);
  assert.ok(!b.states.includes("BE" as never));
});

test("Feiertage am Wochenende 2027: Neujahr (Fr) nicht, 1. Mai (Sa) ja, 3. Oktober (So) ja", () => {
  const dates = feiertageAmWochenende(2027).map((h) => h.date);
  assert.ok(!dates.includes("2027-01-01"));
  assert.ok(dates.includes("2027-05-01"));
  assert.ok(dates.includes("2027-10-03"));
  assert.ok(getLangeWochenendenBundesweit(2027).some((w) => w.bundesweit));
});
