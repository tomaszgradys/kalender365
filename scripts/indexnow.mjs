// IndexNow-CLI (Bing/Yandex). Meldet NUR geänderte oder neue URLs — niemals blind
// die ganze Sitemap. Zustand: scripts/indexnow-state.json (url → lastmod).
//
//   node scripts/indexnow.mjs --diff            geänderte/neue URLs aus der Live-Sitemap melden
//   node scripts/indexnow.mjs --diff --dry      nur anzeigen
//   node scripts/indexnow.mjs --urls /a,/b      konkrete Pfade melden (auch gelöschte: 404/410 → Bing entfernt sie)
//   node scripts/indexnow.mjs --all --yes       einmalig alles (z. B. bei Erstanbindung) — bewusst mit --yes
//
// Nach jedem Produktions-Deploy: `node scripts/indexnow.mjs --diff`. Die Sitemap
// trägt stabiles <lastmod> (CONTENT_VERSION bzw. eingefrorene Vorjahre), daher
// entspricht „lastmod geändert" einer echten inhaltlichen Änderung.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE_URL = "https://kalender365.pro";
const KEY = "5ad5fb26b7d273088ab12390953bd862";
const ENDPOINT = "https://api.indexnow.org/indexnow";
const HERE = path.dirname(fileURLToPath(import.meta.url));
const STATE = path.join(HERE, "indexnow-state.json");
const LOG = path.join(HERE, "indexnow-log.txt");
const BATCH = 10_000;

const args = process.argv.slice(2);
const flag = (f) => args.includes(f);
const opt = (k) => (args.find((a) => a.startsWith(`--${k}=`)) || "").split("=").slice(1).join("=");

const readState = () => (fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, "utf8")) : {});
const writeState = (s) => fs.writeFileSync(STATE, JSON.stringify(s, null, 0) + "\n");
const log = (line) => fs.appendFileSync(LOG, `${new Date().toISOString()} ${line}\n`);

async function sitemap() {
  const xml = await (await fetch(`${SITE_URL}/sitemap.xml`, { headers: { "user-agent": "kalender365-indexnow/1.0" } })).text();
  const map = {};
  for (const m of xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]+)<\/lastmod>)?/g)) map[m[1]] = m[2] || "";
  return map;
}

async function submit(urlList) {
  const host = new URL(SITE_URL).host;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ host, key: KEY, keyLocation: `${SITE_URL}/${KEY}.txt`, urlList }),
      });
      if (res.status === 429 && attempt < 3) { await new Promise((r) => setTimeout(r, 3000 * attempt)); continue; }
      return res.status;
    } catch (e) {
      if (attempt === 3) throw e;
      await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }
}

let urls = [];
const state = readState();
const live = flag("--diff") || flag("--all") ? await sitemap() : null;
if (flag("--all")) {
  if (!flag("--yes")) { console.error("--all meldet ALLE Sitemap-URLs. Bestätigen mit --yes."); process.exit(2); }
  urls = Object.keys(live);
} else if (flag("--diff")) {
  urls = Object.entries(live).filter(([u, lm]) => state[u] !== lm).map(([u]) => u);
  const removed = Object.keys(state).filter((u) => !(u in live));
  if (removed.length) console.error(`Hinweis: ${removed.length} URL(s) nicht mehr in der Sitemap (nicht gemeldet; bei echter Löschung --urls nutzen).`);
} else if (opt("urls")) {
  urls = opt("urls").split(",").map((p) => p.trim()).filter(Boolean).map((p) => (p.startsWith("http") ? p : SITE_URL + p));
} else {
  console.error("Nutzung: --diff [--dry] | --urls=/a,/b | --all --yes");
  process.exit(2);
}
urls = [...new Set(urls)].filter((u) => u.startsWith(SITE_URL + "/") || u === SITE_URL + "/");
if (!urls.length) { console.log("Nichts zu melden."); if (live) writeState(live); process.exit(0); }
console.log(`${urls.length} URL(s)${flag("--dry") ? " (dry-run)" : ""}:`);
for (const u of urls.slice(0, 25)) console.log("  " + u);
if (urls.length > 25) console.log(`  … +${urls.length - 25}`);
if (flag("--dry")) process.exit(0);
let allOk = true;
for (let i = 0; i < urls.length; i += BATCH) {
  const batch = urls.slice(i, i + BATCH);
  const status = await submit(batch);
  const ok = status === 200 || status === 202;
  allOk &&= ok;
  console.log(`IndexNow HTTP ${status} → ${batch.length} URL(s)`);
  log(`HTTP ${status} ${batch.length} URLs${flag("--diff") ? " (diff)" : ""}`);
}
if (allOk && live) writeState(live);
if (allOk && opt("urls")) { for (const u of urls) state[u] = live?.[u] ?? state[u] ?? "manual"; writeState(state); }
process.exit(allOk ? 0 : 1);
