"use client";

import { useState } from "react";
import type { CostEstimate } from "@/lib/blogCosts";
import type { ScheduleSlot } from "@/lib/blogSchedule";

type ActualStats = { count: number; avgUsd: number; last30Usd: number };
type PostRow = { slug: string; title: string; publishedAt: string; source: "seed" | "db" };

const pln = (v: number) => `${v.toFixed(2)} zł`;
const usd = (v: number) => `$${v.toFixed(3)}`;

export default function PanelDashboard({
  hasDb,
  estimate,
  actual,
  slots,
  posts,
  publishedCount,
}: {
  hasDb: boolean;
  estimate: CostEstimate;
  actual: ActualStats;
  slots: ScheduleSlot[];
  posts: PostRow[];
  publishedCount: number;
}) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function generateNow() {
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch("/api/panel/generate", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (data.ok) {
        setResult(`✓ Wygenerowano: „${data.title}" (koszt ${usd(data.costUsd)})`);
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setResult(`✗ ${data.error ?? "Błąd generowania"}`);
      }
    } catch {
      setResult("✗ Błąd połączenia");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/panel/login", { method: "DELETE" });
    window.location.href = "/";
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-navy-800">Panel — blog</h1>
        <button onClick={logout} className="text-sm font-medium text-slate-500 hover:text-navy-700">
          Wyloguj
        </button>
      </div>

      {!hasDb && (
        <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Baza danych nie jest podłączona (brak <code>DATABASE_URL</code>). Auto-blog i statystyki kosztów
          ruszą po utworzeniu bazy Neon w Vercel (Storage → Neon). Poniższe koszty to szacunki.
        </p>
      )}

      {/* KOSZTY */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Średni koszt 1 wpisu</h2>
          <p className="mt-1 text-3xl font-black text-navy-800">{pln(estimate.perBlogPln)}</p>
          <p className="text-xs text-slate-400">{usd(estimate.perBlogUsd)} · szacunek modelu</p>
          {actual.count > 0 && (
            <p className="mt-2 text-sm text-brand-green-700">
              Rzeczywisty (z {actual.count} wpisów): <strong>{pln(actual.avgUsd * estimate.assumptions.usdPln)}</strong> ({usd(actual.avgUsd)})
            </p>
          )}
          <ul className="mt-3 space-y-1 text-xs text-slate-500">
            {estimate.breakdown.map((b) => (
              <li key={b.label} className="flex justify-between">
                <span>{b.label}</span>
                <span>{usd(b.usd)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Koszt miesięczny</h2>
          <p className="mt-1 text-3xl font-black text-navy-800">{pln(estimate.perMonthPln)}</p>
          <p className="text-xs text-slate-400">
            {usd(estimate.perMonthUsd)} · przy {estimate.assumptions.postsPerMonth} wpisach/mies. (co 2 dni)
          </p>
          {actual.count > 0 && (
            <p className="mt-2 text-sm text-brand-green-700">
              Ostatnie 30 dni (rzeczywiście): <strong>{pln(actual.last30Usd * estimate.assumptions.usdPln)}</strong> ({usd(actual.last30Usd)})
            </p>
          )}
          <p className="mt-3 text-xs text-slate-400">{estimate.assumptions.price.promoNote}</p>
        </div>
      </section>

      {/* GENERUJ */}
      <section className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-green-100 bg-brand-green-50 p-5">
        <div>
          <h2 className="text-lg font-bold text-navy-800">Wygeneruj wpis teraz</h2>
          <p className="mt-1 text-sm text-slate-600">
            Model sam dobierze aktualny temat i napisze artykuł z researchem + grafiką. Publikacja od razu.
          </p>
          {result && <p className="mt-2 text-sm font-medium text-navy-700">{result}</p>}
        </div>
        <button
          onClick={generateNow}
          disabled={busy || !hasDb}
          className="rounded-full bg-brand-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-green-700 disabled:opacity-60"
        >
          {busy ? "Generuję… (do ~1 min)" : "Generuj wpis"}
        </button>
      </section>

      {/* HARMONOGRAM */}
      <section className="mt-6">
        <h2 className="text-lg font-bold text-navy-800">Harmonogram publikacji (co 2 dni)</h2>
        <p className="mt-1 text-sm text-slate-500">
          Tematy dobierane automatycznie wg sezonu — dlatego widać terminy, nie tytuły.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {slots.map((s) => (
            <div key={s.date} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm">
              <span className="font-semibold text-navy-700">{s.date}</span>
              <span className="text-slate-400">Automatyczny wpis — temat wg sezonu</span>
            </div>
          ))}
        </div>
      </section>

      {/* OPUBLIKOWANE */}
      <section className="mt-6">
        <h2 className="text-lg font-bold text-navy-800">Opublikowane wpisy ({publishedCount})</h2>
        <div className="mt-3 space-y-2">
          {posts.map((p) => (
            <div key={p.slug} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm">
              <a href={`/blog/${p.slug}`} className="font-medium text-navy-700 hover:text-brand-green-600">{p.title}</a>
              <span className="shrink-0 text-xs text-slate-400">
                {p.publishedAt} · {p.source === "db" ? "AI" : "seed"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
