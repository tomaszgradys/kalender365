import type { Metadata } from "next";
import Link from "next/link";
import PageWithSidebar from "@/components/PageWithSidebar";
import CalendarThumb from "@/components/CalendarThumb";
import { CALENDAR_TYPES, nowCtx } from "@/lib/calendars";
import { getAllNames } from "@/lib/nameDays";
import { MONTH_NAMES, MONTH_NAMES_GENITIVE_PL, isValidYear } from "@/lib/months";
import { url } from "@/lib/urls";

export const metadata: Metadata = {
  title: "Szukaj w kalendarzu",
  description: "Wyszukaj kalendarz, imieniny, datę, miesiąc lub rok w serwisie kalendarz.pro.",
  alternates: { canonical: "/szukaj" },
  robots: { index: false, follow: true }, // strona wyników wyszukiwania — nie indeksujemy
};

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

const MONTHS_NORM = MONTH_NAMES.pl.map((m, i) => ({ i, keys: [norm(m), norm(MONTH_NAMES_GENITIVE_PL[i])] }));

type Result = { href: string; title: string; sub?: string; thumb?: string; slug?: string };

// Rozpoznaje bezpośrednie „skoki": rok, miesiąc rok, dzień miesiąc.
function smartMatches(q: string): Result[] {
  const ctx = nowCtx();
  const n = norm(q);
  const out: Result[] = [];

  const yearMatch = n.match(/\b(1[89]\d\d|20\d\d|21\d\d)\b/);
  const year = yearMatch ? Number(yearMatch[1]) : null;
  const monthHit = MONTHS_NORM.find((m) => m.keys.some((k) => k.length > 2 && n.includes(k)));
  const dayMatch = n.match(/\b([12]?\d|3[01])\b/);
  const day = dayMatch ? Number(dayMatch[1]) : null;

  if (monthHit && day && day >= 1 && day <= 31) {
    const y = year && isValidYear(year) ? year : ctx.year;
    out.push({
      href: url.day(y, monthHit.i, day),
      title: `${day} ${MONTH_NAMES_GENITIVE_PL[monthHit.i]} ${y}`,
      sub: "Kartka z kalendarza",
    });
  }
  if (monthHit) {
    const y = year && isValidYear(year) ? year : ctx.year;
    out.push({
      href: url.month(y, monthHit.i),
      title: `Kalendarz ${MONTH_NAMES_GENITIVE_PL[monthHit.i]} ${y}`,
      sub: "Kalendarz miesięczny",
    });
  }
  if (year && isValidYear(year)) {
    out.push({ href: url.year(year), title: `Kalendarz ${year}`, sub: "Kalendarz roczny" });
  }
  return out;
}

export default async function SzukajPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const n = norm(query);
  const ctx = nowCtx();

  let smart: Result[] = [];
  let types: Result[] = [];
  let names: Result[] = [];

  if (n.length >= 2) {
    smart = smartMatches(query);

    types = CALENDAR_TYPES.filter((t) => norm(t.label).includes(n) || norm(t.desc).includes(n))
      .slice(0, 12)
      .map((t) => ({ href: t.href(ctx), title: t.label, sub: t.desc, thumb: t.thumb, slug: t.slug }));

    names = getAllNames()
      .filter((x) => norm(x.name).includes(n))
      .slice(0, 30)
      .map((x) => ({ href: `/imieniny/${x.slug}`, title: `Imieniny: ${x.name}`, sub: "Kiedy imieniny" }));
  }

  const total = smart.length + types.length + names.length;

  return (
    <PageWithSidebar>
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-navy-600">
          Kalendarz.pro
        </Link>{" "}
        / Szukaj
      </nav>
      <h1 className="text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">Szukaj w kalendarzu</h1>

      <form action="/szukaj" className="mt-5 flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="np. Anna, 15 sierpnia, lipiec 2026, fazy księżyca…"
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-800 focus:border-navy-400 focus:outline-none"
          autoFocus
        />
        <button type="submit" className="rounded-xl bg-navy-600 px-5 py-2.5 font-semibold text-white hover:bg-navy-700">
          Szukaj
        </button>
      </form>

      {query.length >= 2 ? (
        total === 0 ? (
          <p className="mt-8 text-slate-500">
            Brak wyników dla „{query}". Spróbuj wpisać imię, datę (np. „11 listopada"), miesiąc i rok
            (np. „grudzień 2026") albo nazwę kalendarza.
          </p>
        ) : (
          <div className="mt-8 space-y-8">
            {smart.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Przejdź do</h2>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {smart.map((r) => (
                    <Link key={r.href} href={r.href} className="rounded-2xl border border-slate-200 p-4 hover:border-navy-300 hover:shadow-sm">
                      <div className="font-semibold text-navy-800">{r.title}</div>
                      {r.sub && <div className="text-sm text-slate-500">{r.sub}</div>}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {types.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Kalendarze i narzędzia</h2>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {types.map((r) => (
                    <Link key={r.href + r.title} href={r.href} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3 hover:border-navy-300 hover:shadow-sm">
                      {r.thumb && <CalendarThumb thumb={r.thumb as never} slug={r.slug} alt={r.title} size={38} />}
                      <span>
                        <span className="block font-semibold text-slate-800">{r.title}</span>
                        {r.sub && <span className="block text-xs text-slate-500">{r.sub}</span>}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {names.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Imieniny</h2>
                <div className="flex flex-wrap gap-2">
                  {names.map((r) => (
                    <Link key={r.href} href={r.href} className="rounded-full bg-navy-50 px-3 py-1.5 text-sm font-medium text-navy-700 hover:bg-navy-100">
                      {r.title.replace("Imieniny: ", "")}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )
      ) : (
        <p className="mt-8 text-slate-500">Wpisz co najmniej 2 znaki, aby wyszukać.</p>
      )}
    </PageWithSidebar>
  );
}
