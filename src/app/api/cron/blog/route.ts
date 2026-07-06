import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { generateOnePost } from "@/lib/blogGen";
import { isDueToday } from "@/lib/blogSchedule";
import { latestPublishedDate } from "@/lib/blog";
import { hasDb } from "@/lib/db";

export const runtime = "nodejs";
export const maxDuration = 300;
export const dynamic = "force-dynamic";

// Cron Vercel (codziennie) z bramką „co 2 dni": generuje wpis tylko, gdy najnowszy
// ma >= 2 dni. Vercel dokłada nagłówek Authorization: Bearer <CRON_SECRET>.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  const url = new URL(request.url);
  const qsSecret = url.searchParams.get("secret");
  // Fail-CLOSED: bez ustawionego CRON_SECRET endpoint jest zamknięty. Generacja wpisu
  // korzysta z płatnych API (AI + fal.ai), więc otwarty endpoint = finansowy DoS. Nie
  // wolno pozostawić „otwarte, gdy brak sekretu" — to by się odsłoniło przy każdej
  // literówce/usunięciu zmiennej w konfiguracji.
  const authorized = !!secret && (auth === `Bearer ${secret}` || qsSecret === secret);
  if (!authorized) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  if (!hasDb()) return NextResponse.json({ ok: false, error: "no-db" }, { status: 503 });

  const force = url.searchParams.get("force") === "1";
  const latest = await latestPublishedDate();
  if (!force && !isDueToday(latest)) {
    return NextResponse.json({ ok: true, skipped: "not-due", latest });
  }

  const result = await generateOnePost();
  if (result.ok) {
    revalidatePath("/blog");
    revalidatePath(`/blog/${result.slug}`);
    revalidatePath("/");
  }
  return NextResponse.json(result);
}
