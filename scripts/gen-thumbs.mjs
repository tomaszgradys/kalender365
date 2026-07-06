// Generowanie miniaturek kalendarzy przez fal.ai (FLUX dev) — spójne ze stylem marki.
import { writeFileSync, mkdirSync, readFileSync, existsSync, readdirSync } from "node:fs";
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

const outDir = join(ROOT, "public", "thumbs");
mkdirSync(outDir, { recursive: true });

// Spójny styl marki: płaska ikona, granat #033c93, zielony akcent #00aa6e, białe tło.
const STYLE =
  "flat minimalist vector icon illustration, deep navy blue (#033c93) and white with a single vivid green (#00aa6e) accent and soft periwinkle blue details, thick rounded shapes, centered composition, clean solid white background, generous padding, no text, no letters, no words, no watermark, app icon style, crisp and simple";

const JOBS = [
  ["kalendarz-roczny", "a wall calendar page showing a full year grid of twelve small month blocks"],
  ["kalendarz-miesieczny", "a single monthly calendar page with a grid of day squares and binder rings on top"],
  ["kartka-z-kalendarza", "a tear-off daily calendar page showing one large date number"],
  ["kalendarz-do-druku", "a small printer printing out a calendar page"],
  ["numery-tygodni", "a calendar page with one horizontal week row highlighted in green"],
  ["dni-wolne-od-pracy", "a calendar page with a beach umbrella and a relaxing free day marked"],
  ["kalendarz-swiat", "a calendar page with a shining star and a small gift, festive"],
  ["swieta-nietypowe", "a calendar page with a party popper and confetti"],
  ["wielkanoc", "a decorated easter egg next to a small calendar page"],
  ["niedziele-handlowe", "a shopping cart next to a calendar page"],
  ["fazy-ksiezyca", "a row of moon phases from crescent to full moon over a calendar"],
  ["kalendarz-ogrodnika", "a young green plant sprout growing next to a calendar page"],
  ["kalendarz-wedkarza", "a fish and a fishing hook next to a small calendar"],
  ["pory-roku", "four seasons symbols: a leaf, a sun, a snowflake and a flower arranged in a circle"],
  ["zmiana-czasu", "a round clock with two curved arrows showing time change"],
  ["wschod-zachod-slonca", "a sun rising over a horizon line with soft rays"],
  ["zodiak", "a circular zodiac wheel with small stars and constellations"],
  ["kalendarz-szkolny", "a school backpack and a graduation cap next to a calendar"],
  ["ferie-zimowe", "a large snowflake next to a calendar page, winter"],
  ["kalendarz-imienin", "a birthday cake with candles next to a calendar page"],
  ["kalkulator-dni", "a pocket calculator next to a calendar page"],
  ["dzien-tygodnia", "a calendar page with a large question mark"],
  ["dni-robocze", "a briefcase next to a calendar page with a few days marked green"],
  ["dlugie-weekendy", "a beach chair and a small calendar showing three highlighted days in a row"],
  ["pelnia-ksiezyca", "a large full moon glowing over a small calendar page"],
  ["now-ksiezyca", "a dark new moon crescent next to a small calendar page"],
  ["odliczania", "an hourglass next to a calendar page with a countdown feeling"],
  ["ile-dni-do-wakacji", "a sun and a palm beach with a small calendar, summer holidays countdown"],
  ["ile-dni-do-bozego-narodzenia", "a small christmas tree next to a calendar page, countdown to Christmas"],
  ["ile-dni-do-weekendu", "a calendar page with saturday and sunday highlighted, weekend countdown"],
  ["plan-lekcji", "a school timetable grid with colorful subject blocks, lesson plan"],
  ["kalkulator-wieku", "a birthday cake and a pocket calculator, age calculator"],
  ["kalkulator-dni-roboczych", "a briefcase and a pocket calculator with a calendar, working days"],
  ["kalkulator-ciazy", "a pregnant belly silhouette next to a small calendar, pregnancy weeks"],
];

const only = process.argv.slice(2); // opcjonalnie: generuj tylko wskazane slug-i
const jobs = only.length ? JOBS.filter(([s]) => only.includes(s)) : JOBS;

let ok = 0;
for (const [slug, subject] of jobs) {
  try {
    const res = await fetch("https://fal.run/fal-ai/flux/dev", {
      method: "POST",
      headers: { Authorization: `Key ${FAL}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: `${subject}. ${STYLE}`,
        image_size: "square",
        num_inference_steps: 28,
        num_images: 1,
        enable_safety_checker: true,
      }),
    });
    if (!res.ok) throw new Error(`${res.status}: ${(await res.text()).slice(0, 160)}`);
    const data = await res.json();
    const img = await fetch(data.images[0].url);
    writeFileSync(join(outDir, `${slug}.jpg`), Buffer.from(await img.arrayBuffer()));
    ok++;
    console.log(`✓ thumbs/${slug}.jpg`);
  } catch (e) {
    console.error(`✗ ${slug}: ${e.message}`);
  }
}
console.log(`\nGotowe: ${ok}/${jobs.length}`);

// Zapisz manifest ze wszystkimi slugami, które mają wygenerowaną miniaturkę.
const have = readdirSync(outDir)
  .filter((f) => f.endsWith(".jpg"))
  .map((f) => f.replace(/\.jpg$/, ""))
  .sort();
const manifest =
  "// Auto-generowane przez scripts/gen-thumbs.mjs — NIE edytuj ręcznie.\n" +
  "export const GENERATED_THUMBS: string[] = " +
  JSON.stringify(have, null, 2) +
  ";\n";
writeFileSync(join(ROOT, "src", "lib", "generatedThumbs.ts"), manifest);
console.log(`Manifest: ${have.length} miniaturek → src/lib/generatedThumbs.ts`);

