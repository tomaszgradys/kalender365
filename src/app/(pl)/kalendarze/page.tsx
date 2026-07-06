import type { Metadata } from "next";
import Link from "next/link";
import { calendarsByCategory, popularCalendars, nowCtx } from "@/lib/calendars";
import CalendarThumb from "@/components/CalendarThumb";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Wszystkie kalendarze — spis rodzajów kalendarzy",
  description:
    "Pełny spis kalendarzy: roczne, miesięczne, świąt, dni wolnych, faz księżyca, szkolne, ferie, niedziele handlowe, imieniny i więcej. Wybierz kalendarz, którego szukasz.",
  alternates: { canonical: "/kalendarze" },
};

export default function KalendarzeHub() {
  const ctx = nowCtx();
  const groups = calendarsByCategory();
  const popular = popularCalendars();

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Rodzaje kalendarzy",
    itemListElement: groups
      .flatMap((g) => g.items)
      .map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.label,
        url: `${SITE_URL}${c.href(ctx)}`,
      })),
  };

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />

      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-navy-600">
          Kalendarz.pro
        </Link>{" "}
        / Wszystkie kalendarze
      </nav>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Wszystkie kalendarze</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Wybierz rodzaj kalendarza, którego szukasz. Każdy z nich jest darmowy, dostępny online i
        gotowy do wydruku.
      </p>

      {/* POPULARNE */}
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold text-slate-800">Najpopularniejsze</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {popular.map((c) => (
            <Link
              key={c.slug}
              href={c.href(ctx)}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3 transition hover:border-navy-300 hover:shadow-sm"
            >
              <CalendarThumb thumb={c.thumb} slug={c.slug} alt={c.label} size={44} />
              <span className="text-sm font-semibold text-slate-800">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* WG KATEGORII */}
      {groups.map((g) => (
        <section key={g.category} className="mt-10">
          <h2 className="mb-3 text-lg font-semibold text-slate-800">{g.category}</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {g.items.map((c) => (
              <Link
                key={c.slug}
                href={c.href(ctx)}
                className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-navy-300 hover:shadow-sm"
              >
                <CalendarThumb thumb={c.thumb} slug={c.slug} alt={c.label} size={52} className="shrink-0" />
                <span>
                  <span className="block font-semibold text-slate-800">{c.label}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">{c.desc}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
