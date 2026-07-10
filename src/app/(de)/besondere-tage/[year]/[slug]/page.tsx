import PageWithSidebar from "@/components/de/PageWithSidebar";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRERENDER_YEARS, parseYear, isNavigableYear, isIndexableYear } from "@/lib/de/year";
import { berlinNow, berlinToday } from "@/lib/de/now";
import { formatFullDE, formatLongDE, weekdayDE, MONTH_SLUGS_DE } from "@/lib/de/locale";
import { BESONDERE_TAGE, getBesondererTag } from "@/lib/de/besondereTage";
import { getCountdown, berlinMidnight } from "@/lib/de/countdowns";
import EventArt from "@/components/de/EventArt";
import ModuleHero from "@/components/de/ModuleHero";
import { EVENT_HERO, heroSrc } from "@/lib/de/heroes";
import CountdownClient from "@/components/de/CountdownClient";
import SeoProse from "@/components/de/SeoProse";
import Faq from "@/components/de/Faq";
import { serializeJsonLd, breadcrumbLd } from "@/lib/de/jsonLd";
import { SITE_URL } from "@/lib/de/site";
import { ogMeta } from "@/lib/de/ogMeta";

export function generateStaticParams() {
  const out: { year: string; slug: string }[] = [];
  for (const y of PRERENDER_YEARS) for (const e of BESONDERE_TAGE) out.push({ year: String(y), slug: e.slug });
  return out;
}

export async function generateMetadata({ params }: { params: Promise<{ year: string; slug: string }> }): Promise<Metadata> {
  const { year, slug } = await params;
  const y = parseYear(year);
  const e = getBesondererTag(slug);
  if (!y || !e) return {};
  const iso = e.date(y).toISOString().slice(0, 10);
  return {
    title: `${e.name} ${y} – Datum, Termin & Bedeutung`,
    description: `${e.name} ${y} ist am ${formatLongDE(iso)} (${weekdayDE(iso)}). ${e.intro}`.slice(0, 300),
    alternates: { canonical: `/besondere-tage/${y}/${e.slug}` },
    openGraph: ogMeta(`/besondere-tage/${y}/${e.slug}`, { defaultImage: true }),
    ...(isIndexableYear(y) ? {} : { robots: { index: false, follow: true } }),
  };
}

function daysBetween(aIso: string, bIso: string): number {
  return Math.round((Date.parse(`${aIso}T00:00:00Z`) - Date.parse(`${bIso}T00:00:00Z`)) / 86400000);
}

export default async function BesondererTagPage({ params }: { params: Promise<{ year: string; slug: string }> }) {
  const { year, slug } = await params;
  const y = parseYear(year);
  const e = getBesondererTag(slug);
  if (!y || !e) notFound();

  const date = e.date(y);
  const iso = date.toISOString().slice(0, 10);
  const endIso = e.endDate ? e.endDate(y).toISOString().slice(0, 10) : null;
  const today = berlinToday().toISOString().slice(0, 10);
  const thisYear = berlinNow().year;
  const rel = daysBetween(iso, today);
  const isFuture = rel > 0;
  const isToday = rel === 0;
  const targetMs = berlinMidnight(y, date.getUTCMonth(), date.getUTCDate());

  const monthSlug = `${MONTH_SLUGS_DE[date.getUTCMonth()]}-${y}`;
  const hasCountdown = getCountdown(e.slug) !== null;

  // Auto-FAQ + evergreen-FAQ.
  const faq = [
    {
      q: `Wann ist ${e.name} ${y}?`,
      a: `${e.name} ${y} ist am ${formatFullDE(iso)}${endIso ? ` und dauert bis zum ${formatLongDE(endIso)}` : ""}. ${e.rule}`,
    },
    ...(e.faqExtra ?? []),
    {
      q: `Auf welchen Wochentag fällt ${e.name} ${y}?`,
      a: `${e.name} fällt ${y} auf einen ${weekdayDE(iso)}.`,
    },
  ];

  const related = e.related.map((s) => getBesondererTag(s)).filter((x): x is NonNullable<typeof x> => x !== null);

  const eventLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${e.name} ${y}`,
    startDate: iso,
    ...(endIso ? { endDate: endIso } : {}),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    description: e.intro,
    ...(e.regionNote ? { location: { "@type": "Place", name: e.regionNote } } : {}),
  };
  const breadcrumb = breadcrumbLd(
    [
      { name: "Start", url: "/" },
      { name: `Besondere Tage ${y}`, url: `/besondere-tage/${y}` },
      { name: e.name, url: `/besondere-tage/${y}/${e.slug}` },
    ],
    SITE_URL,
  );

  const prevY = y - 1;
  const nextY = y + 1;

  return (
    <div className="flex-1">
      <PageWithSidebar>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(eventLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumb) }} />

        <nav className="mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span>
          <Link href={`/besondere-tage/${y}`} className="hover:text-navy-600">Besondere Tage {y}</Link> <span className="mx-1">/</span>
          <span className="text-navy-700">{e.name}</span>
        </nav>

        <ModuleHero src={heroSrc(EVENT_HERO, e.slug)} alt={`${e.name} ${y}`} motif={e.motif} uid={`hero-${e.slug}`} className="h-44 w-full sm:h-56" priority />

        <h1 className="mt-5 text-2xl font-black text-navy-800 sm:text-3xl">{e.emoji} {e.name} {y}</h1>
        <p className="mt-2 max-w-3xl text-slate-600">{e.intro}</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Datum {y}</div>
            <div className="mt-1 text-xl font-black text-navy-800">
              {formatLongDE(iso)}{endIso && <> – {formatLongDE(endIso)}</>}
            </div>
            <div className="text-sm text-slate-600">{weekdayDE(iso)}</div>
            <Link href={`/kalenderblatt/${iso}`} className="mt-2 inline-block text-xs font-medium text-navy-600 hover:underline">Zum Kalenderblatt →</Link>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            {isToday ? (
              <div className="text-lg font-bold text-brand-green-700">Heute ist {e.name}! {e.emoji}</div>
            ) : isFuture ? (
              <>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Countdown</div>
                <div className="mt-1"><CountdownClient target={targetMs} doneLabel={`${e.name} ist da! ${e.emoji}`} /></div>
              </>
            ) : (
              <>
                <div className="text-sm text-slate-600">{e.name} {y} war vor {Math.abs(rel)} Tagen.</div>
                <Link href={`/besondere-tage/${nextY}/${e.slug}`} className="mt-2 inline-block text-sm font-semibold text-navy-600 hover:underline">
                  {e.name} {nextY} ansehen →
                </Link>
              </>
            )}
            {hasCountdown && (
              <Link href={`/wie-viele-tage-bis/${e.slug}`} className="mt-3 inline-block text-xs font-medium text-navy-600 hover:underline">
                Countdown bis {e.name} (nächster Termin) →
              </Link>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-navy-50/40 p-4 text-sm text-slate-600">
          <strong className="text-navy-800">Termin-Regel:</strong> {e.rule}
        </div>

        <section className="mt-8 space-y-3 text-[15px] leading-relaxed text-slate-600">
          <h2 className="text-xl font-bold text-navy-800">Bedeutung & Brauchtum</h2>
          {e.brauchtum.map((p, i) => (
            <p key={i} className="max-w-3xl">{p}</p>
          ))}
        </section>

        {related.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 text-xl font-bold text-navy-800">Verwandte Anlässe</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <Link key={r.slug} href={`/besondere-tage/${y}/${r.slug}`} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-md">
                  <EventArt motif={r.motif} uid={`rel-${r.slug}`} className="h-20 w-full" rounded={false} />
                  <div className="p-3">
                    <div className="text-sm font-bold text-navy-800">{r.emoji} {r.name}</div>
                    <div className="text-xs text-slate-500">{formatLongDE(r.date(y).toISOString().slice(0, 10))}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">{e.name} in anderen Jahren</h2>
          <div className="flex flex-wrap gap-2 text-sm">
            {isNavigableYear(prevY) && (
              <Link href={`/besondere-tage/${prevY}/${e.slug}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">← {e.name} {prevY}</Link>
            )}
            <Link href={`/besondere-tage/${thisYear}/${e.slug}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">{e.name} {thisYear}</Link>
            {isNavigableYear(nextY) && (
              <Link href={`/besondere-tage/${nextY}/${e.slug}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">{e.name} {nextY} →</Link>
            )}
            <Link href={`/kalender/${monthSlug}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Kalender {monthSlug.replace("-", " ")}</Link>
          </div>
        </section>

        <SeoProse
          blocks={[
            {
              h2: `${e.name} ${y} im Überblick`,
              p: [
                `${e.name} ${y} fällt auf ${formatFullDE(iso)}. ${e.rule} Damit lässt sich der Termin frühzeitig für Planung, Einkäufe oder Feiern vormerken.`,
              ],
            },
          ]}
        />
        <Faq items={faq} />
      </PageWithSidebar>
    </div>
  );
}
