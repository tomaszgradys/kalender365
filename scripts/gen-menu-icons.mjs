// Generowanie ikon menu bocznego przez fal.ai (FLUX dev) — spójna rodzina soft-3D.
// Białe tło (renderowane w białym kafelku w menu). Zapis: public/icons/calendar-menu/<klucz>.jpg
// + manifest src/lib/generatedMenuIcons.ts. Użycie: node scripts/gen-menu-icons.mjs [klucz...]
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
if (!FAL) { console.error("Brak FAL_KEY w kalendarz/.env.local"); process.exit(1); }

const BASE =
  "Create a clean soft 3D semi-flat app icon for a modern Polish calendar website. Pure solid white background. Rounded friendly shapes. Minimal details. Premium utility website style. Color palette: deep navy (#0B376D), bright blue (#0E7AFE), warm yellow (#F5B800), white, light gray. Subtle soft shadow, high readability at 24px, no text, no letters, no numbers, no background scene, single centered object, consistent icon family.";

const JOBS = [
  ["calendar-year", "a single minimalist wall calendar card"],
  ["calendar-month", "a monthly calendar grid sheet"],
  ["tear-off", "a single tear-off daily calendar sheet peeling at the corner"],
  ["calendar-print", "a small printer with a calendar sheet coming out"],
  ["calendar-week", "a weekly planner sheet with one highlighted row"],
  ["week-numbers", "a small bookmark tab with a counter badge"],
  ["days-off", "a beach umbrella next to a sun lounger"],
  ["workdays", "a business briefcase with a small checkmark"],
  ["long-weekends", "three connected day blocks forming a small bridge"],
  ["vacation-planner", "a travel suitcase with a checkmark"],
  ["shopping-sundays", "a shopping bag"],
  ["countdown-vacation", "a sun over a palm beach, summer holiday feel"],
  ["countdown-weekend", "two connected weekend day blocks with a small star"],
  ["countdown-christmas", "a small stylised christmas tree"],
  ["workday-calc", "a pocket calculator next to a briefcase"],
  ["holidays", "a gift box with a shining star"],
  ["unusual-holidays", "a party popper with confetti"],
  ["movable-holidays", "a decorated easter egg with a small circular arrow"],
  ["name-days", "a birthday cake with a single candle"],
  ["seasons", "four small season symbols arranged in a circle: leaf, sun, snowflake, flower"],
  ["time-change", "a round clock with a curved arrow"],
  ["school-calendar", "a school backpack"],
  ["winter-break", "a snowflake with a small winter hat"],
  ["lesson-plan", "a school timetable notebook with colored blocks"],
  ["age-calc", "a birthday cake next to a pocket calculator"],
  ["pregnancy-calc", "a gentle heart with a small baby silhouette, tasteful, not childish"],
  ["moon-phases", "a row of moon phases from crescent to full moon"],
  ["full-moon", "a single full glowing moon"],
  ["new-moon", "a dark new moon with a thin glowing outline"],
  ["sun-times", "a sun rising over a horizon line with soft rays"],
  ["gardener", "a young plant sprout next to a small watering can"],
  ["angler", "a fish with a fishing hook"],
  ["days-calc", "a pocket calculator next to a small calendar"],
  ["countdowns", "an hourglass sand timer"],
  ["weekday-finder", "a calendar sheet with a large question mark"],
  ["zodiac", "a small constellation of connected stars"],
];

const outDir = join(ROOT, "public", "icons", "calendar-menu");
mkdirSync(outDir, { recursive: true });

const only = process.argv.slice(2);
const jobs = only.length ? JOBS.filter(([k]) => only.includes(k)) : JOBS;

let ok = 0;
for (const [key, subject] of jobs) {
  try {
    const res = await fetch("https://fal.run/fal-ai/flux/dev", {
      method: "POST",
      headers: { Authorization: `Key ${FAL}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: `${subject}. ${BASE}`,
        image_size: "square",
        num_inference_steps: 30,
        num_images: 1,
        enable_safety_checker: true,
      }),
    });
    if (!res.ok) throw new Error(`${res.status}: ${(await res.text()).slice(0, 160)}`);
    const data = await res.json();
    const img = await fetch(data.images[0].url);
    writeFileSync(join(outDir, `${key}.jpg`), Buffer.from(await img.arrayBuffer()));
    ok++;
    console.log(`✓ ${key}.jpg`);
  } catch (e) {
    console.error(`✗ ${key}: ${e.message}`);
  }
}

// Manifest wygenerowanych ikon → sidebar wie, które ma pliki (reszta = emoji).
const have = readdirSync(outDir).filter((f) => f.endsWith(".jpg")).map((f) => f.replace(/\.jpg$/, "")).sort();
const manifest =
  "// Auto-generowane przez scripts/gen-menu-icons.mjs — NIE edytuj ręcznie.\n" +
  "export const MENU_ICON_FILES: string[] = " + JSON.stringify(have, null, 2) + ";\n";
writeFileSync(join(ROOT, "src", "lib", "generatedMenuIcons.ts"), manifest);
console.log(`\nGotowe: ${ok}/${jobs.length} · manifest: ${have.length} ikon`);
