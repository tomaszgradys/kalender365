// Generowanie okładek wpisów bloga przez fal.ai (FLUX dev) — landscape 1216×640.
// Użycie: node scripts/gen-blog-covers.mjs [slug...]  (bez arg = wszystkie).
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnv() {
  const f = join(ROOT, ".env.local");
  if (!existsSync(f)) return;
  for (const l of readFileSync(f, "utf8").split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
loadEnv();
const FAL = process.env.FAL_KEY;
if (!FAL) {
  console.error("Brak FAL_KEY w kalendarz/.env.local");
  process.exit(1);
}

const outDir = join(ROOT, "public", "blog");
mkdirSync(outDir, { recursive: true });

const STYLE =
  "editorial flat vector illustration, deep navy blue (#003890) and white with a vivid green (#00B978) accent and soft periwinkle (#A4B6F8) details, soft shadows, clean, modern, calm, no text, no letters, no words, no watermark, wide landscape banner composition";

// [slug, prompt] — prompt = pole cover.prompt danego wpisu.
const JOBS = [
  [
    "dlugie-weekendy-do-konca-2026",
    "a wall calendar for autumn and winter 2026 with a few dates circled in green marker, a cozy planning scene with a coffee mug and a pen on a desk",
  ],
  [
    "kalendarz-roku-szkolnego-2026-2027",
    "a school desk scene with a backpack, notebooks and a wall calendar marking the start of the school year, warm early-autumn light",
  ],
  [
    "ile-dni-do-konca-wakacji-2026",
    "a sunny beach scene with a small wall calendar showing late August, summer holidays ending, relaxed end-of-summer mood",
  ],
  [
    "dni-wolne-od-pracy-2027",
    "a yearly wall calendar for 2027 with several holiday dates circled in green marker, tidy planning desk scene",
  ],
];

const only = process.argv.slice(2);
const jobs = only.length ? JOBS.filter(([s]) => only.includes(s)) : JOBS;

let ok = 0;
for (const [slug, subject] of jobs) {
  try {
    const res = await fetch("https://fal.run/fal-ai/flux/dev", {
      method: "POST",
      headers: { Authorization: `Key ${FAL}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: `${subject}. ${STYLE}`,
        image_size: { width: 1216, height: 640 },
        num_inference_steps: 30,
        num_images: 1,
        enable_safety_checker: true,
      }),
    });
    if (!res.ok) throw new Error(`${res.status}: ${(await res.text()).slice(0, 200)}`);
    const data = await res.json();
    const img = await fetch(data.images[0].url);
    writeFileSync(join(outDir, `${slug}.jpg`), Buffer.from(await img.arrayBuffer()));
    ok++;
    console.log(`✓ public/blog/${slug}.jpg`);
  } catch (e) {
    console.error(`✗ ${slug}: ${e.message}`);
  }
}
console.log(`\nGotowe: ${ok}/${jobs.length}`);
