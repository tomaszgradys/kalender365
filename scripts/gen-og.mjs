// Generowanie dedykowanych grafik OG 1200x630 dla głównych kategorii kalendarzy
// przez fal.ai (FLUX dev). Bez tekstu — tytuł/opis dokłada scraper (WhatsApp/FB).
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
  console.error("Brak FAL_KEY. Dodaj FAL_KEY=... do pliku kalendarz/.env.local");
  process.exit(1);
}

const outDir = join(ROOT, "public", "brand", "og", "types");
mkdirSync(outDir, { recursive: true });

// Spójny styl marki, ale w formie szerokiej, atrakcyjnej ilustracji-banera.
const STYLE =
  "wide landscape banner illustration, modern flat vector style, deep navy blue (#003890) background with vivid green (#00B978) and light periwinkle blue (#A4B6F8) accents, clean geometric shapes, soft depth, subtle rays and dots, generous negative space on the left, hero motif on the right, professional, elegant, no text, no letters, no words, no watermark, high quality";

const JOBS = [
  ["swieta", "a bright festive calendar page with a glowing star, small gift and confetti, holidays theme"],
  ["dlugie-weekendy", "a beach chair, sun and a calendar with three highlighted days in a row, long weekend getaway"],
  ["dni-wolne-od-pracy", "a relaxed free day scene with a hammock, sun and a calendar page, public holidays off work"],
  ["dni-robocze", "a briefcase, laptop and a calendar with weekdays marked, working days theme"],
  ["swieta-nietypowe", "a playful party popper, balloons and confetti around a calendar page, unusual fun holidays"],
  ["wielkanoc", "decorated easter eggs, spring willow catkins and a calendar page, easter theme"],
  ["niedziele-handlowe", "a shopping cart and shopping bags next to a calendar page, trading sundays theme"],
  ["fazy-ksiezyca", "a horizontal row of moon phases from new moon to full moon over a starry night sky, lunar calendar"],
  ["pelnia-ksiezyca", "a large glowing full moon over a calm night landscape with stars, full moon"],
  ["now-ksiezyca", "a thin new moon crescent in a deep starry night sky, new moon"],
  ["kalendarz-ogrodnika", "a lush green garden with sprouting seedlings, watering can and a calendar, gardener calendar spring"],
  ["kalendarz-wedkarza", "a serene lake at dawn with a fishing rod, a jumping fish and a calendar, angler fishing calendar"],
  ["pory-roku", "four seasons blended in one landscape: spring blossom, summer sun, autumn leaves and winter snow"],
  ["zmiana-czasu", "a large clock with curved arrows over a day-to-night sky, daylight saving time change"],
  ["wschod-zachod-slonca", "a golden sunrise over a horizon with soft rays and a calendar, sunrise and sunset times"],
  ["kalendarz-szkolny", "a school backpack, books and a graduation cap next to a calendar, school year calendar"],
  ["ferie-zimowe", "a snowy winter scene with snowflakes, a sled and a calendar, winter school break"],
  ["zodiak", "a circular zodiac wheel with constellations and stars in a night sky, zodiac signs"],
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
    if (!res.ok) throw new Error(`${res.status}: ${(await res.text()).slice(0, 160)}`);
    const data = await res.json();
    const img = await fetch(data.images[0].url);
    writeFileSync(join(outDir, `${slug}.jpg`), Buffer.from(await img.arrayBuffer()));
    ok++;
    console.log(`✓ brand/og/types/${slug}.jpg`);
  } catch (e) {
    console.error(`✗ ${slug}: ${e.message}`);
  }
}
console.log(`\nGotowe: ${ok}/${jobs.length}`);
