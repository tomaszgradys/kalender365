import { getSeedPosts } from "@/lib/de/blog";
import { existingSlugs, insertDbPost, dbConfigured } from "@/lib/de/db";
import { generatePost } from "@/lib/de/blogGen";
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

    const post = await generatePost({
      avoidSlugs: [...seedSlugs, ...dbSlugs],
      avoidTitles: seedTitles,
    });

    if (seedSlugs.includes(post.slug) || dbSlugs.includes(post.slug)) {
      return Response.json({ ok: false, error: "Slug bereits vorhanden", slug: post.slug }, { status: 409 });
    }

    await insertDbPost(post);
    return Response.json({ ok: true, slug: post.slug, title: post.title, category: post.category });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unbekannter Fehler";
    return Response.json({ ok: false, error: msg }, { status: 500 });
  }
}
