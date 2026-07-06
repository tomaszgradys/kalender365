import type { Metadata } from "next";
import Link from "next/link";
import { COUNTDOWNS, daysUntil } from "@/lib/countdowns";
import { warsawToday } from "@/lib/now";
import PageWithSidebar from "@/components/PageWithSidebar";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Odliczania — ile dni do świąt, wakacji, weekendu",
  description:
    "Liczniki dni do najważniejszych wydarzeń: wakacji, Bożego Narodzenia, Wielkanocy, Sylwestra, weekendu i innych. Sprawdź, ile dni zostało.",
  alternates: { canonical: "/odliczania" },
};

export default function OdliczaniaPage() {
  const now = warsawToday();
  const items = COUNTDOWNS.map((c) => ({ ...c, days: daysUntil(c.target(now), now) })).sort((a, b) => a.days - b.days);

  return (
    <PageWithSidebar>
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-navy-600">Kalendarz.pro</Link> / Odliczania
      </nav>
      <h1 className="text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">Odliczania — ile dni do…</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Liczniki dni na żywo do najważniejszych wydarzeń w roku. Kliknij, aby zobaczyć dokładne
        odliczanie z godzinami i minutami.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <Link
            key={c.slug}
            href={`/${c.slug}`}
            className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-md"
          >
            <span className="flex items-center gap-3">
              <span className="text-2xl">{c.emoji}</span>
              <span className="font-semibold text-navy-800">Do {c.name}</span>
            </span>
            <span className="rounded-full bg-navy-50 px-3 py-1 text-sm font-bold text-navy-700">
              {c.days === 0 ? "dziś!" : `${c.days} dni`}
            </span>
          </Link>
        ))}
      </div>
    </PageWithSidebar>
  );
}
