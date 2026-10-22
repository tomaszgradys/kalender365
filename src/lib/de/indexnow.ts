// IndexNow: Bing (und Yandex, Naver, Seznam) über neue oder geänderte URLs
// informieren. Google nutzt das Protokoll NICHT. Der Schlüssel ist öffentlich —
// er liegt als /<key>.txt in public/ und dient nur als Eigentumsnachweis.
//
// Regeln (indexnow.org): max. 10 000 URLs je POST, nur URLs des eigenen Hosts,
// nur indexierbare, öffentliche Seiten. Best-effort: ein Fehler darf nie die
// eigentliche Veröffentlichung (Blog-Cron, Deploy) scheitern lassen.
import { SITE_URL } from "./site";

export const INDEXNOW_KEY = "5ad5fb26b7d273088ab12390953bd862";
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const BATCH = 10_000;

export type IndexNowResult = { status: number; count: number; ok: boolean; error?: string };

/** Nur absolute URLs des eigenen Hosts, dedupliziert, ohne Query/Fragment. */
export function normalizeIndexNowUrls(urls: Iterable<string>): string[] {
  const host = new URL(SITE_URL).host;
  const out = new Set<string>();
  for (const raw of urls) {
    if (!raw) continue;
    let u: URL;
    try {
      u = new URL(raw, SITE_URL);
    } catch {
      continue;
    }
    if (u.host !== host || u.protocol !== "https:") continue;
    if (u.pathname.startsWith("/api/") || u.pathname.startsWith("/suche") || u.pathname.startsWith("/og-vorschau")) continue;
    u.search = "";
    u.hash = "";
    out.add(u.toString());
  }
  return [...out];
}

async function post(urlList: string[], attempt = 1): Promise<IndexNowResult> {
  const host = new URL(SITE_URL).host;
  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host, key: INDEXNOW_KEY, keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`, urlList }),
      signal: AbortSignal.timeout(15_000),
    });
    // 200 = ok, 202 = angenommen (Schlüssel wird noch geprüft), 429 = zu viele
    // Anfragen → einmal warten und erneut. 4xx sonst = Konfigurationsfehler.
    if (res.status === 429 && attempt < 3) {
      await new Promise((r) => setTimeout(r, 2_000 * attempt));
      return post(urlList, attempt + 1);
    }
    return { status: res.status, count: urlList.length, ok: res.status === 200 || res.status === 202 };
  } catch (e) {
    if (attempt < 3) {
      await new Promise((r) => setTimeout(r, 1_000 * attempt));
      return post(urlList, attempt + 1);
    }
    return { status: 0, count: urlList.length, ok: false, error: (e as Error).message };
  }
}

/** Meldet die URLs in Batches; gibt je Batch das Ergebnis zurück. Wirft nie. */
export async function submitToIndexNow(urls: Iterable<string>): Promise<IndexNowResult[]> {
  const list = normalizeIndexNowUrls(urls);
  const results: IndexNowResult[] = [];
  for (let i = 0; i < list.length; i += BATCH) {
    const r = await post(list.slice(i, i + BATCH));
    results.push(r);
    console.log(`[indexnow] ${r.status}${r.error ? ` ${r.error}` : ""} → ${r.count} URL(s)`);
  }
  return results;
}
