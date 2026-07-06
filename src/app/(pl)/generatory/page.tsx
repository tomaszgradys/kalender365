import type { Metadata } from "next";
import Link from "next/link";
import PageWithSidebar from "@/components/PageWithSidebar";
import CalendarThumb from "@/components/CalendarThumb";
import { MONTH_SLUGS } from "@/lib/months";
import { SITE_URL } from "@/lib/site";
import { warsawNow } from "@/lib/now";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Generatory — plan lekcji i kalendarze do druku (PDF)",
  description:
    "Darmowe generatory: stwórz własny plan lekcji z własnym zdjęciem, wygeneruj kalendarz miesięczny lub roczny do druku i pobierz gotowy PDF.",
  alternates: { canonical: "/generatory" },
};

export default function GeneratoryPage() {
  const now = warsawNow();
  const y = now.year;
  const mSlug = MONTH_SLUGS.pl[now.month0];

  const items = [
    {
      href: "/plan-lekcji",
      thumb: "school" as const,
      slug: "plan-lekcji",
      title: "Generator planu lekcji",
      desc: "Ułóż plan lekcji z przedmiotami, godzinami, kolorami i własnym zdjęciem. Pobierz do PDF lub wydrukuj.",
      badge: "Najpopularniejszy",
    },
    {
      href: `/kalendarz-do-druku/${mSlug}-${y}`,
      thumb: "print" as const,
      slug: "kalendarz-do-druku",
      title: "Kalendarz miesięczny do druku",
      desc: "Wybierz miesiąc i pobierz gotowy do druku kalendarz w PDF.",
    },
    {
      href: `/kalendarz-do-druku/${y}`,
      thumb: "print" as const,
      slug: "kalendarz-do-druku",
      title: "Kalendarz roczny do druku",
      desc: "Wszystkie miesiące roku w jednym miejscu — pobierz PDF każdego miesiąca.",
    },
  ];

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Generatory kalendarzy",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.title, url: `${SITE_URL}${it.href}` })),
  };

  return (
    <PageWithSidebar relatedExclude={["kalendarz-do-druku", "plan-lekcji"]}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-navy-600">Kalendarz.pro</Link> / Generatory
      </nav>
      <h1 className="text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">Generatory</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Twórz własne materiały i pobieraj je w PDF. Wszystko działa w przeglądarce, za darmo.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className={`group flex items-start gap-4 rounded-2xl border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md ${
              it.badge ? "border-brand-green-300 ring-1 ring-brand-green-200" : "border-slate-200 hover:border-navy-300"
            }`}
          >
            <CalendarThumb thumb={it.thumb} slug={it.slug} alt={it.title} size={56} className="shrink-0" />
            <span>
              <span className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-navy-800">{it.title}</span>
                {it.badge && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-green-50 px-2 py-0.5 text-[11px] font-semibold text-brand-green-700">
                    <span className="text-[#f5b800]">★</span> {it.badge}
                  </span>
                )}
              </span>
              <span className="mt-1 block text-sm text-slate-500">{it.desc}</span>
            </span>
          </Link>
        ))}
      </div>

      <p className="mt-6 text-sm text-slate-500">
        Szukasz kalkulatorów dat i czasu?{" "}
        <Link href="/narzedzia" className="font-semibold text-navy-600 hover:text-brand-green-600">
          Zobacz narzędzia i kalkulatory →
        </Link>
      </p>
    </PageWithSidebar>
  );
}
