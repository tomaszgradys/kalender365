import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Guard: the German data/logic layer (src/lib/de) must contain no leftover
// Polish UI copy. Comments are allowed to reference the PL origin, so we scan
// only string literals for forbidden Polish tokens.
const DE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src/lib/de");

const FORBIDDEN = [
  "województwo",
  "ferie zimowe",
  "imieniny",
  "dni wolne",
  "kalendarz.pro",
  "niedziele handlowe",
];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = path.join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

/** Strip // line comments and /* *\/ block comments (crude but enough here). */
function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
}

test("no forbidden Polish strings in src/lib/de code (comments excluded)", () => {
  const files = walk(DE_DIR).filter((f) => f.endsWith(".ts"));
  assert.ok(files.length > 0, "expected DE lib files");
  const hits: string[] = [];
  for (const f of files) {
    const code = stripComments(readFileSync(f, "utf8")).toLowerCase();
    for (const tok of FORBIDDEN) {
      if (code.includes(tok.toLowerCase())) hits.push(`${path.basename(f)} → "${tok}"`);
    }
  }
  assert.deepEqual(hits, [], `Polish strings found:\n${hits.join("\n")}`);
});
