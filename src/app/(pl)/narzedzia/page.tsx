import type { Metadata } from "next";
import Link from "next/link";
import PageWithSidebar from "@/components/PageWithSidebar";
import CalendarThumb from "@/components/CalendarThumb";
import BlogPromo from "@/components/BlogPromo";
import { SITE_URL } from "@/lib/site";
import { warsawNow } from "@/lib/now";
import type { ThumbKey } from "@/lib/calendars";

export const metadata: Metadata = {
  title: "Narzędzia i kalkulatory — dni, wiek, urlop, ciąża",
  description:
    "Darmowe kalkulatory i narzędzia: planer urlopu, kalkulator dni, wieku, dni roboczych, ciąży, sprawdzenie dnia tygodnia oraz generator planu lekcji.",
  alternates: { canonical: "/narzedzia" },
};

type Tool = { href: string; thumb: ThumbKey; slug: string; title: string; desc: string; badge?: string };

const TOOLS: Tool[] = [
  { href: `/planer-urlopu/${warsawNow().year}`, thumb: "freedays", slug: "planer-urlopu", title: "Planer urlopu", desc: "Oblicz najlepsze kombinacje urlopu i ułóż wolne na cały rok.", badge: "Najpopularniejsze" },
  { href: "/kalkulator-dni", thumb: "counter", slug: "kalkulator-dni", title: "Kalkulator dni", desc: "Ile dni między datami i ile do wydarzenia." },
  { href: "/kalkulator-wieku", thumb: "cake", slug: "kalkulator-wieku", title: "Kalkulator wieku", desc: "Dokładny wiek, dni i tygodnie życia, znak zodiaku." },
  { href: "/kalkulator-dni-roboczych", thumb: "week", slug: "kalkulator-dni-roboczych", title: "Kalkulator dni roboczych", desc: "Dni robocze między datami — policz urlop lub termin." },
  { href: "/kalkulator-ciazy", thumb: "counter", slug: "kalkulator-ciazy", title: "Kalkulator ciąży", desc: "Tydzień ciąży, trymestr i termin porodu." },
  { href: "/dzien-tygodnia", thumb: "weekday", slug: "dzien-tygodnia", title: "Jaki to dzień tygodnia", desc: "Sprawdź dzień tygodnia dowolnej daty." },
  { href: "/odliczania", thumb: "counter", slug: "odliczania", title: "Odliczania", desc: "Ile dni do świąt, wakacji, weekendu i innych." },
  { href: "/plan-lekcji", thumb: "school", slug: "plan-lekcji", title: "Generator planu lekcji", desc: "Ułóż plan lekcji z własnym zdjęciem i pobierz PDF." },
];

export default function NarzedziaPage() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Narzędzia i kalkulatory",
    itemListElement: TOOLS.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.title, url: `${SITE_URL}${t.href}` })),
  };
  return (
    <PageWithSidebar relatedExclude={["kalkulator-dni", "dzien-tygodnia", "odliczania"]}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-navy-600">Kalendarz.pro</Link> / Narzędzia
      </nav>
      <h1 className="text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">Narzędzia i kalkulatory</h1>
      <p className="mt-2 max-w-2xl text-slate-600">Przydatne kalkulatory dat i czasu oraz generatory. Wszystko za darmo, w przeglądarce.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {TOOLS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={`group flex items-start gap-4 rounded-2xl border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md ${
              t.badge ? "border-brand-green-300 ring-1 ring-brand-green-200" : "border-slate-200 hover:border-navy-300"
            }`}
          >
            <CalendarThumb thumb={t.thumb} slug={t.slug} size={48} className="shrink-0" />
            <span>
              <span className="flex flex-wrap items-center gap-2">
                <span className="block font-bold text-navy-800">{t.title}</span>
                {t.badge && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-green-50 px-2 py-0.5 text-[11px] font-semibold text-brand-green-700">
                    <span className="text-[#f5b800]">★</span> {t.badge}
                  </span>
                )}
              </span>
              <span className="mt-1 block text-sm text-slate-500">{t.desc}</span>
            </span>
          </Link>
        ))}
      </div>

      <BlogPromo planerYear={warsawNow().year} />
    </PageWithSidebar>
  );
}
