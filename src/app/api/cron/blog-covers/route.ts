// Backfill: erzeugt fehlende Titelbilder für bereits veröffentlichte AI-Posts
// (z. B. alte Posts von vor Einführung der Cover, oder falls fal.ai beim
// ursprünglichen Generieren kurzzeitig nicht erreichbar war).
import { postsMissingCover, updateDbPostCover, dbConfigured } from "@/lib/de/db";
import { genCoverImage } from "@/lib/de/blogGen";
import { cronAuthorized } from "@/lib/de/cronAuth";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!cronAuthorized(req)) return new Response("Unauthorized", { status: 401 });
  if (!process.env.FAL_KEY) {
    return Response.json({ ok: false, error: "FAL_KEY fehlt" }, { status: 503 });
  }
  if (!dbConfigured()) {
    return Response.json({ ok: false, error: "DATABASE_URL fehlt" }, { status: 503 });
  }

  const missing = await postsMissingCover();
  const results: { slug: string; ok: boolean }[] = [];
  for (const post of missing) {
    const url = await genCoverImage(post.title);
    if (url) {
      await updateDbPostCover(post.slug, { src: url, alt: post.title });
      results.push({ slug: post.slug, ok: true });
    } else {
      results.push({ slug: post.slug, ok: false });
    }
  }
  return Response.json({ ok: true, processed: results.length, results });
}
