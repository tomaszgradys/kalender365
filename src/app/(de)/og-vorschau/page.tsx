import type { Metadata } from "next";
import { headers } from "next/headers";

// Interne QA-/Vorschau-Galerie für Social-Previews (Open Graph). Kein
// öffentliches Feature: noindex + in robots.txt gesperrt. Lädt für eine
// kuratierte Test-Matrix die tatsächlich ausgelieferten Seiten, liest die
// echten og:-Meta-Tags und zeigt Bild, Titel, Beschreibung sowie Warnungen
// (fehlendes Bild, Bild-Status ≠ 200, Titel zu lang, og:url ≠ canonical,
// falsche Sprache). So lassen sich alle Vorschauen auf einen Blick prüfen —
// die Admin-Anforderung aus dem Social-Audit ohne separaten Login.

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "OG-Vorschau (intern) – Kalender365.pro",
  robots: { index: false, follow: false },
  alternates: { canonical: "/og-vorschau" },
};

// Test-Matrix: Startseite, Hubs, Länder, lange Namen, Sonderfälle, Werkzeuge.
const TEST_URLS: { path: string; group: string }[] = [
  { path: "/", group: "Kernseiten" },
  { path: "/heute", group: "Kernseiten" },
  { path: "/kalender/2026", group: "Kernseiten" },
  { path: "/kalender/juli-2026", group: "Kernseiten" },
  { path: "/kalender/september-2026/bayern", group: "Kernseiten" },
  { path: "/feiertage/2026", group: "Feiertage & Ferien" },
  { path: "/feiertage/2026/bayern", group: "Feiertage & Ferien" },
  { path: "/schulferien/2026", group: "Feiertage & Ferien" },
  { path: "/schulferien/2026/mecklenburg-vorpommern", group: "Feiertage & Ferien" },
  { path: "/sommerferien/2026/nordrhein-westfalen", group: "Feiertage & Ferien" },
  { path: "/brueckentage/2026", group: "Feiertage & Ferien" },
  { path: "/brueckentage/2026/baden-wuerttemberg", group: "Feiertage & Ferien" },
  { path: "/kalenderwochen/2026", group: "Kalenderwochen & Mond" },
  { path: "/kw/1-2026", group: "Kalenderwochen & Mond" },
  { path: "/mondphasen/2026", group: "Kalenderwochen & Mond" },
  { path: "/vollmond/2026", group: "Kalenderwochen & Mond" },
  { path: "/neumond/2026", group: "Kalenderwochen & Mond" },
  { path: "/mondkalender/2026", group: "Kalenderwochen & Mond" },
  { path: "/mondkalender/september-2026", group: "Kalenderwochen & Mond" },
  { path: "/zeitumstellung/2026", group: "Weitere Typen" },
  { path: "/jahreszeiten/2026", group: "Weitere Typen" },
  { path: "/kalenderblatt/2026-12-24", group: "Weitere Typen" },
  { path: "/wie-viele-tage-bis/weihnachten", group: "Weitere Typen" },
  { path: "/sternzeichen", group: "Weitere Typen" },
  { path: "/sternzeichen/waage", group: "Weitere Typen" },
  { path: "/blog", group: "Weitere Typen" },
];

type MetaInfo = {
  ok: boolean;
  status: number;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogUrl?: string;
  canonical?: string;
  htmlLang?: string;
  twitterImage?: string;
  imageStatus?: number;
  error?: string;
};

/** Liest alle <meta>-Tags in eine {property|name → content}-Map. */
function parseMeta(html: string): Map<string, string> {
  const map = new Map<string, string>();
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const tag of tags) {
    const key = tag.match(/(?:property|name)="([^"]+)"/i)?.[1];
    const content = tag.match(/content="([^"]*)"/i)?.[1];
    if (key && content != null && !map.has(key)) map.set(key, content);
  }
  return map;
}

async function inspect(origin: string, path: string): Promise<MetaInfo> {
  try {
    const res = await fetch(`${origin}${path}`, { cache: "no-store" });
    if (!res.ok) return { ok: false, status: res.status };
    const html = await res.text();
    const m = parseMeta(html);
    const ogImage = m.get("og:image");
    const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i)?.[1];
    const htmlLang = html.match(/<html[^>]+lang="([^"]*)"/i)?.[1];

    let imageStatus: number | undefined;
    if (ogImage) {
      try {
        const head = await fetch(ogImage, { method: "HEAD", cache: "no-store" });
        imageStatus = head.status;
      } catch {
        imageStatus = 0;
      }
    }
    return {
      ok: true,
      status: res.status,
      ogTitle: m.get("og:title"),
      ogDescription: m.get("og:description"),
      ogImage,
      ogImageAlt: m.get("og:image:alt"),
      ogUrl: m.get("og:url"),
      twitterImage: m.get("twitter:image"),
      canonical,
      htmlLang,
      imageStatus,
    };
  } catch (e) {
    return { ok: false, status: 0, error: e instanceof Error ? e.message : "Fetch-Fehler" };
  }
}

function warnings(path: string, info: MetaInfo): string[] {
  const w: string[] = [];
  if (!info.ok) {
    w.push(`Seite nicht erreichbar (Status ${info.status}${info.error ? `, ${info.error}` : ""})`);
    return w;
  }
  if (!info.ogImage) w.push("Kein og:image");
  else if (info.imageStatus && info.imageStatus !== 200) w.push(`og:image Status ${info.imageStatus}`);
  if (!info.ogImageAlt) w.push("Kein og:image:alt");
  if (!info.ogTitle) w.push("Kein og:title");
  else if (info.ogTitle.length > 75) w.push(`og:title sehr lang (${info.ogTitle.length})`);
  if (!info.ogDescription) w.push("Keine og:description");
  if (info.ogUrl && info.canonical && !info.canonical.endsWith(info.ogUrl.replace(/^https?:\/\/[^/]+/, "")))
    w.push("og:url ≠ canonical");
  if (!info.ogUrl) w.push("Kein og:url");
  if (info.htmlLang && !info.htmlLang.startsWith("de")) w.push(`html lang „${info.htmlLang}"`);
  return w;
}

export default async function OgVorschauPage() {
  const h = await headers();
  const host = h.get("host") ?? "kalender365.pro";
  const proto = host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https";
  const origin = `${proto}://${host}`;

  // Sequenziell prüfen (kein Promise.all): schont statische Seiten wie Dev-Server
  // gleichermaßen und vermeidet 500er durch parallele Kaltstarts/Kompilierung.
  const results: { path: string; group: string; info: MetaInfo }[] = [];
  for (const u of TEST_URLS) {
    results.push({ ...u, info: await inspect(origin, u.path) });
  }
  const groups = [...new Set(TEST_URLS.map((u) => u.group))];
  const problemCount = results.filter((r) => warnings(r.path, r.info).length > 0).length;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-black text-navy-800">OG-Vorschau (intern)</h1>
      <p className="mt-2 text-sm text-slate-600">
        Social-Preview-Kontrolle für {results.length} repräsentative Seitentypen. Diese Seite ist
        <strong> noindex</strong> und in der robots.txt gesperrt. Ohne Warnung = sauberes Preview.
      </p>
      <p className="mt-1 text-sm font-semibold text-navy-700">
        {problemCount === 0 ? "✅ Alle geprüften Seiten ohne Auffälligkeit." : `⚠️ ${problemCount} Seite(n) mit Hinweisen.`}
      </p>

      {groups.map((g) => (
        <section key={g} className="mt-8">
          <h2 className="mb-3 border-b border-slate-200 pb-1 text-sm font-bold uppercase tracking-wide text-slate-500">{g}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results
              .filter((r) => r.group === g)
              .map((r) => {
                const w = warnings(r.path, r.info);
                return (
                  <div key={r.path} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <div className="aspect-[1200/630] w-full bg-slate-50">
                      {r.info.ogImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={r.info.ogImage} alt={r.info.ogImageAlt ?? r.path} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-slate-400">kein og:image</div>
                      )}
                    </div>
                    <div className="p-3">
                      <a href={r.path} target="_blank" rel="noopener noreferrer" className="block truncate text-xs font-mono text-navy-600 hover:underline">{r.path}</a>
                      <p className="mt-1 line-clamp-2 text-sm font-semibold text-navy-800">{r.info.ogTitle ?? "—"}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{r.info.ogDescription ?? "—"}</p>
                      {w.length > 0 ? (
                        <ul className="mt-2 flex flex-wrap gap-1">
                          {w.map((x) => (
                            <li key={x} className="rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-medium text-amber-800">{x}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="mt-2 inline-block rounded bg-brand-green-50 px-1.5 py-0.5 text-[11px] font-medium text-brand-green-700">OK</span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      ))}
    </div>
  );
}
