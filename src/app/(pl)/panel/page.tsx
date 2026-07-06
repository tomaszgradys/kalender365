import type { Metadata } from "next";
import { isAdmin } from "@/lib/admin";
import { hasDb, db, ensureSchema } from "@/lib/db";
import { estimateBlogCost } from "@/lib/blogCosts";
import { nextSlots } from "@/lib/blogSchedule";
import { getPublishedSummaries, latestPublishedDate } from "@/lib/blog";
import LoginForm from "@/components/panel/LoginForm";
import PanelDashboard from "@/components/panel/PanelDashboard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Panel kalendarz.pro",
  robots: { index: false, follow: false },
};

async function actualStats(): Promise<{ count: number; avgUsd: number; last30Usd: number }> {
  if (!hasDb()) return { count: 0, avgUsd: 0, last30Usd: 0 };
  try {
    await ensureSchema();
    const rows = (await db()`SELECT
        COUNT(*) FILTER (WHERE ok)::int AS count,
        COALESCE(AVG(cost_usd) FILTER (WHERE ok), 0)::float8 AS avg,
        COALESCE(SUM(cost_usd) FILTER (WHERE ok AND created_at > now() - interval '30 days'), 0)::float8 AS last30
      FROM blog_gen_log`) as { count: number; avg: number; last30: number }[];
    const r = rows[0];
    return { count: r?.count ?? 0, avgUsd: r?.avg ?? 0, last30Usd: r?.last30 ?? 0 };
  } catch {
    return { count: 0, avgUsd: 0, last30Usd: 0 };
  }
}

export default async function PanelPage() {
  if (!(await isAdmin())) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-16">
        <LoginForm />
      </main>
    );
  }

  const estimate = estimateBlogCost();
  const [actual, summaries, latest] = await Promise.all([actualStats(), getPublishedSummaries(), latestPublishedDate()]);
  const slots = nextSlots(latest, 8);
  const posts = summaries.map((p) => ({ slug: p.slug, title: p.title, publishedAt: p.publishedAt, source: p.source }));

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <PanelDashboard
        hasDb={hasDb()}
        estimate={estimate}
        actual={actual}
        slots={slots}
        posts={posts}
        publishedCount={summaries.length}
      />
    </main>
  );
}
