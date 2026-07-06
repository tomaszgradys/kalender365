// Generowanie logo/ikony/favicona przez fal.ai (FLUX dev) — wzorzec z sennika.
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
  console.error("Brak FAL_KEY w środowisku.");
  process.exit(1);
}

const outDir = join(ROOT, "public", "brand");
mkdirSync(outDir, { recursive: true });

const STYLE =
  "flat vector app icon, minimalist, modern, clean, high contrast, centered, rounded square, simple geometric shapes, no text, no letters, no watermark, solid background";

const jobs = [
  {
    out: "icon.jpg",
    size: "square_hd",
    p: `a minimalist calendar app icon: a single calendar page with a small red header bar and one clean date square, indigo blue and white, subtle depth, ${STYLE}`,
  },
  {
    out: "og.jpg",
    size: "landscape_16_9",
    p: `a clean modern banner background about calendars and time, soft indigo and violet gradient, a large subtle calendar grid and a crescent moon and sun, lots of empty space, minimalist, no text, no letters, no watermark`,
  },
];

for (const j of jobs) {
  const res = await fetch("https://fal.run/fal-ai/flux/dev", {
    method: "POST",
    headers: { Authorization: `Key ${FAL}`, "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: j.p, image_size: j.size, num_images: 1 }),
  });
  if (!res.ok) throw new Error(`${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  const img = await fetch(data.images[0].url);
  writeFileSync(join(outDir, j.out), Buffer.from(await img.arrayBuffer()));
  console.log(`✓ brand/${j.out}`);
}
