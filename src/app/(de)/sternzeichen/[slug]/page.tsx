import PageWithSidebar from "@/components/de/PageWithSidebar";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { STERNZEICHEN, getSternzeichen, ELEMENT_COLOR } from "@/lib/de/sternzeichen";
import SeoProse from "@/components/de/SeoProse";
import Faq from "@/components/de/Faq";
import { serializeJsonLd, breadcrumbLd } from "@/lib/de/jsonLd";
import { SITE_URL } from "@/lib/de/site";

export const revalidate = 86400;

export function generateStaticParams() {
  return STERNZEICHEN.map((z) => ({ slug: z.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const z = getSternzeichen(slug);
  if (!z) return {};
  return {
    title: `Sternzeichen ${z.name} – Datum, Element & Eigenschaften`,
    description: `${z.name} (${z.zeitraum}): Element ${z.element}, Planet ${z.planet}. ${z.kurz} Alles zum Tierkreiszeichen ${z.name}.`,
    alternates: { canonical: `/sternzeichen/${z.slug}` },
  };
}

export default async function SternzeichenSignPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const z = getSternzeichen(slug);
  if (!z) notFound();

  const color = ELEMENT_COLOR[z.element];
  const idx = STERNZEICHEN.findIndex((s) => s.slug === z.slug);
  const prev = STERNZEICHEN[(idx + STERNZEICHEN.length - 1) % STERNZEICHEN.length];
  const next = STERNZEICHEN[(idx + 1) % STERNZEICHEN.length];

  const faq = [
    { q: `Welcher Zeitraum gehört zum Sternzeichen ${z.name}?`, a: `Das Sternzeichen ${z.name} umfasst den Zeitraum ${z.zeitraum}.` },
    { q: `Welches Element hat ${z.name}?`, a: `${z.name} ist ein ${z.element}-Zeichen. Der zugeordnete Planet ist ${z.planet}.` },
    { q: `Welche Eigenschaften werden ${z.name} zugeschrieben?`, a: `Typisch für ${z.name} gelten: ${z.eigenschaften.join(", ")}.` },
  ];

  const breadcrumb = breadcrumbLd(
    [
      { name: "Start", url: "/" },
      { name: "Sternzeichen", url: "/sternzeichen" },
      { name: z.name, url: `/sternzeichen/${z.slug}` },
    ],
    SITE_URL,
  );

  return (
    <main className="flex-1">
      <PageWithSidebar>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumb) }} />

        <nav className="mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span>
          <Link href="/sternzeichen" className="hover:text-navy-600">Sternzeichen</Link> <span className="mx-1">/</span>
          <span className="text-navy-700">{z.name}</span>
        </nav>

        <div className="flex items-center gap-5 overflow-hidden rounded-2xl p-6" style={{ background: `linear-gradient(135deg, ${color}22, ${color}0d)` }}>
          <div className="grid h-24 w-24 shrink-0 place-items-center rounded-3xl text-6xl text-white shadow-sm" style={{ backgroundColor: color }}>
            {z.symbol}
          </div>
          <div>
            <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Sternzeichen {z.name}</h1>
            <p className="mt-1 text-slate-600">{z.zeitraum}</p>
            <p className="mt-0.5 text-sm font-medium text-slate-500">Element {z.element} · Planet {z.planet}</p>
          </div>
        </div>

        <p className="mt-5 max-w-3xl text-lg text-slate-700">{z.kurz}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {z.eigenschaften.map((eig) => (
            <span key={eig} className="rounded-full bg-navy-50 px-3 py-1 text-sm font-medium text-navy-700">{eig}</span>
          ))}
        </div>

        <section className="mt-8 space-y-3 text-[15px] leading-relaxed text-slate-600">
          <h2 className="text-xl font-bold text-navy-800">Das Tierkreiszeichen {z.name}</h2>
          {z.beschreibung.map((p, i) => (
            <p key={i} className="max-w-3xl">{p}</p>
          ))}
        </section>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { k: "Zeitraum", v: z.zeitraum },
            { k: "Element", v: z.element },
            { k: "Planet", v: z.planet },
          ].map((s) => (
            <div key={s.k} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{s.k}</div>
              <div className="mt-1 font-bold text-navy-800">{s.v}</div>
            </div>
          ))}
        </div>

        <section className="mt-8 flex flex-wrap items-center gap-2 text-sm">
          <Link href={`/sternzeichen/${prev.slug}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">← {prev.symbol} {prev.name}</Link>
          <Link href="/sternzeichen" className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Alle Sternzeichen</Link>
          <Link href={`/sternzeichen/${next.slug}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">{next.symbol} {next.name} →</Link>
        </section>

        <SeoProse
          blocks={[
            {
              h2: `${z.name}: Datum und Einordnung`,
              p: [
                `Wer im Zeitraum ${z.zeitraum} geboren ist, hat das Sternzeichen ${z.name}. Als ${z.element}-Zeichen unter dem Einfluss von ${z.planet} werden ihm Eigenschaften wie ${z.eigenschaften.join(", ")} nachgesagt. Diese Zuschreibungen sind traditionell und dienen der Unterhaltung, nicht der Vorhersage.`,
              ],
            },
          ]}
        />
        <Faq items={faq} />
      </PageWithSidebar>
    </main>
  );
}
