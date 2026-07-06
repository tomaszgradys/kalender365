import type { Metadata } from "next";
import Link from "next/link";
import PageWithSidebar from "@/components/PageWithSidebar";
import FaqSection from "@/components/FaqSection";
import { notFound } from "next/navigation";
import { getAllNames, getDatesForSlug, getNameDays, nameToSlug } from "@/lib/nameDays";
import { MONTH_NAMES_GENITIVE_PL, WEEKDAY_NAMES } from "@/lib/months";
import { url } from "@/lib/urls";
import { warsawNow, warsawToday } from "@/lib/now";

export const revalidate = 3600;

export function generateStaticParams() {
  return getAllNames().map((n) => ({ name: n.slug }));
}

// Najbliższa data imienin (dziś lub w przyszłości) dla podanych dni w roku.
function nextOccurrence(entries: { month0: number; day: number }[]) {
  const today = warsawToday();
  const currentYear = warsawNow().year;
  let best: { date: Date; month0: number; day: number } | null = null;
  for (const e of entries) {
    for (const y of [currentYear, currentYear + 1]) {
      const d = new Date(Date.UTC(y, e.month0, e.day));
      if (d >= today && (!best || d < best.date)) best = { date: d, month0: e.month0, day: e.day };
    }
  }
  return best;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name: slug } = await params;
  const entries = getDatesForSlug(slug);
  if (entries.length === 0) return {};
  const displayName = entries[0].name;
  const dates = entries.map((e) => `${e.day} ${MONTH_NAMES_GENITIVE_PL[e.month0]}`).join(", ");
  const times = entries.length === 1 ? "raz w roku" : `${entries.length} razy w roku`;
  return {
    title: `Kiedy imieniny ${displayName}? Daty imienin ${displayName}`,
    description: `Imieniny ${displayName} obchodzone są ${times}: ${dates}. Sprawdź najbliższą datę imienin ${displayName}, dzień tygodnia i kto jeszcze obchodzi imieniny tego dnia.`,
    alternates: { canonical: `/imieniny/${slug}` },
  };
}

export default async function ImieninyName({ params }: { params: Promise<{ name: string }> }) {
  const { name: slug } = await params;
  const entries = getDatesForSlug(slug);
  if (entries.length === 0) notFound();
  const displayName = entries[0].name;
  const next = nextOccurrence(entries);
  const CURRENT_YEAR = warsawNow().year;
  const datesText = entries.map((e) => `${e.day} ${MONTH_NAMES_GENITIVE_PL[e.month0]}`).join(", ");

  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Kalendarz.pro", item: "/" },
      { "@type": "ListItem", position: 2, name: "Imieniny", item: "/imieniny" },
      { "@type": "ListItem", position: 3, name: displayName, item: `/imieniny/${slug}` },
    ],
  };

  const FAQ = [
    {
      q: `Kiedy są imieniny ${displayName}?`,
      a:
        entries.length === 1
          ? `Imieniny ${displayName} obchodzimy raz w roku — ${datesText}.`
          : `Imieniny ${displayName} obchodzimy ${entries.length} razy w roku: ${datesText}.`,
    },
    {
      q: `Ile razy w roku wypadają imieniny ${displayName}?`,
      a: `Imię ${displayName} ma ${entries.length} ${entries.length === 1 ? "datę imienin" : "daty imienin"} w kalendarzu.`,
    },
  ];
  if (next) {
    const wd = WEEKDAY_NAMES.pl[(next.date.getDay() + 6) % 7];
    FAQ.push({
      q: `Kiedy najbliższe imieniny ${displayName}?`,
      a: `Najbliższe imieniny ${displayName} wypadają ${next.day} ${MONTH_NAMES_GENITIVE_PL[next.month0]} ${next.date.getFullYear()} (${wd}).`,
    });
  }

  return (
    <PageWithSidebar>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-navy-600">
          Kalendarz.pro
        </Link>{" "}
        /{" "}
        <Link href="/imieniny" className="hover:text-navy-600">
          Imieniny
        </Link>{" "}
        / {displayName}
      </nav>

      <h1 className="text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">
        Kiedy imieniny obchodzi {displayName}?
      </h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        {entries.length === 1
          ? `Imieniny ${displayName} obchodzone są raz w roku — ${datesText}.`
          : `Imieniny ${displayName} obchodzone są ${entries.length} razy w roku: ${datesText}.`}{" "}
        Poniżej znajdziesz każdą datę imienin <strong>{displayName}</strong> wraz z dniem tygodnia oraz
        kartką z kalendarza na ten dzień.
      </p>

      {next && (
        <div className="mt-6 rounded-2xl bg-gradient-to-br from-navy-600 to-navy-800 p-6 text-white">
          <p className="text-sm uppercase tracking-widest text-navy-100">Najbliższe imieniny {displayName}</p>
          <p className="mt-1 text-2xl font-black">
            {next.day} {MONTH_NAMES_GENITIVE_PL[next.month0]} {next.date.getFullYear()}
          </p>
          <p className="text-sm text-navy-100">{WEEKDAY_NAMES.pl[(next.date.getDay() + 6) % 7]}</p>
          <Link
            href={url.day(next.date.getFullYear(), next.month0, next.day)}
            className="mt-3 inline-block rounded-full bg-white/15 px-4 py-2 text-sm font-semibold ring-1 ring-white/25 hover:bg-white/25"
          >
            Otwórz kartkę z kalendarza →
          </Link>
        </div>
      )}

      <h2 className="mt-10 text-xl font-bold text-navy-800">Wszystkie daty imienin {displayName}</h2>
      <div className="mt-4 space-y-6">
        {entries.map((e) => {
          const others = getNameDays(e.month0, e.day).filter((n) => n !== displayName);
          return (
            <div key={`${e.month0}-${e.day}`} className="rounded-2xl border border-slate-200 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xl font-semibold text-slate-800">
                  {e.day} {MONTH_NAMES_GENITIVE_PL[e.month0]}
                </span>
                <div className="flex gap-3 text-sm">
                  <Link href={url.day(CURRENT_YEAR, e.month0, e.day)} className="text-navy-600 hover:underline">
                    kartka {CURRENT_YEAR} →
                  </Link>
                  <Link href={url.day(CURRENT_YEAR + 1, e.month0, e.day)} className="text-navy-600 hover:underline">
                    kartka {CURRENT_YEAR + 1} →
                  </Link>
                </div>
              </div>
              {others.length > 0 && (
                <div className="mt-3 border-t border-slate-100 pt-3">
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Tego dnia imieniny obchodzą również
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {others.slice(0, 16).map((n) => (
                      <Link
                        key={n}
                        href={`/imieniny/${nameToSlug(n)}`}
                        className="rounded-full bg-navy-50 px-2.5 py-1 text-sm font-medium text-navy-700 hover:bg-navy-100"
                      >
                        {n}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <section className="mt-10 max-w-2xl space-y-3">
        <h2 className="text-xl font-bold text-navy-800">Imieniny {displayName} — o czym warto pamiętać</h2>
        <p className="text-slate-600">
          Imieniny to obchodzone w Polsce święto związane z dniem wspomnienia patrona danego imienia.
          Imię <strong>{displayName}</strong>{" "}
          {entries.length === 1
            ? "ma jedną datę imienin w roku"
            : `ma ${entries.length} daty imienin w roku`}
          . Jeśli obchodzisz imieniny, możesz otworzyć kartkę z kalendarza na wybrany dzień i sprawdzić
          przypadające tego dnia święta, przysłowie oraz godziny wschodu i zachodu słońca.
        </p>
        <p className="text-slate-600">
          Zobacz też{" "}
          <Link href="/imieniny" className="text-navy-600 hover:underline">
            pełny kalendarz imienin
          </Link>{" "}
          albo sprawdź, jaki to{" "}
          <Link href="/dzien-tygodnia" className="text-navy-600 hover:underline">
            dzień tygodnia
          </Link>{" "}
          wypada wybrana data.
        </p>
      </section>

      <FaqSection items={FAQ} />
    </PageWithSidebar>
  );
}
