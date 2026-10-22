import test from "node:test";
import assert from "node:assert/strict";
import { normalizeIndexNowUrls, INDEXNOW_KEY } from "../src/lib/de/indexnow.ts";
import fs from "node:fs";
import path from "node:path";

test("IndexNow: Schlüsseldatei liegt in public/ und enthält genau den Schlüssel", () => {
  const p = path.join(process.cwd(), "public", `${INDEXNOW_KEY}.txt`);
  assert.ok(fs.existsSync(p), "public/<key>.txt fehlt");
  assert.equal(fs.readFileSync(p, "utf8").trim(), INDEXNOW_KEY);
  assert.match(INDEXNOW_KEY, /^[a-f0-9]{32}$/);
});

test("IndexNow: nur eigene, öffentliche, indexierbare URLs ohne Query/Fragment", () => {
  const out = normalizeIndexNowUrls([
    "/kalender/2027",
    "https://kalender365.pro/kalender/2027?utm=x#top",
    "https://kalender365.pro/api/pdf/de/2027/januar",
    "https://kalender365.pro/suche?q=ostern",
    "https://kalender365.pro/og-vorschau",
    "https://example.com/kalender/2027",
    "http://kalender365.pro/feiertage/2027",
    "",
    "ftp://kalender365.pro/x",
  ]);
  assert.deepEqual(out, ["https://kalender365.pro/kalender/2027"]);
});
