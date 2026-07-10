import { getSeedPosts } from "@/lib/de/blog";
import { existingSlugs, insertDbPost, dbConfigured } from "@/lib/de/db";
import { generatePost, QualityError } from "@/lib/de/blogGen";
import { cronAuthorized } from "@/lib/de/cronAuth";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!cronAuthorized(req)) return new Response("Unauthorized", { status: 401 });
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ ok: false, error: "ANTHROPIC_API_KEY fehlt" }, { status: 503 });
  }
  if (!dbConfigured()) {
    return Response.json({ ok: false, error: "DATABASE_URL fehlt (AI-Beiträge brauchen Neon)" }, { status: 503 });
  }

  try {
    const seedSlugs = getSeedPosts().map((p) => p.slug);
    const seedTitles = getSeedPosts().map((p) => p.title);
    const dbSlugs = [...(await existingSlugs())];

    // Bis zu 2 Versuche: schlägt die Qualitätskontrolle fehl, einmal neu
    // generieren. Qualität vor Kadenz — lieber heute kein Beitrag als ein
    // schlechter. Andere Fehler (API/DB) werden nicht wiederholt.
    let lastReasons: string[] = [];
    for (let attempt = 1; attempt <= 2; attempt++) {
      let post;
      try {
        post = await generatePost({
          avoidSlugs: [...seedSlugs, ...dbSlugs],
          avoidTitles: seedTitles,
        });
      } catch (e) {
        if (e instanceof QualityError) {
          lastReasons = e.reasons;
          continue; // neu versuchen
        }
        throw e;
      }

      if (seedSlugs.includes(post.slug) || dbSlugs.includes(post.slug)) {
        lastReasons = [`Slug bereits vorhanden: ${post.slug}`];
        continue;
      }

      await insertDbPost(post);
      return Response.json({ ok: true, slug: post.slug, title: post.title, category: post.category, attempt });
    }

    // Beide Versuche unter dem Qualitätsniveau → bewusst nichts veröffentlichen.
    return Response.json({ ok: false, skipped: true, reason: "Qualitätskontrolle", details: lastReasons }, { status: 200 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unbekannter Fehler";
    return Response.json({ ok: false, error: msg }, { status: 500 });
  }
}
