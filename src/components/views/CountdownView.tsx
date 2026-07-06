import Link from "next/link";
import { notFound } from "next/navigation";
import { getCountdown, daysUntil, COUNTDOWNS } from "@/lib/countdowns";
import { warsawToday } from "@/lib/now";
import { formatISOFullPL, formatISODatePL, weekdayPL } from "@/lib/format";
import PageWithSidebar from "@/components/PageWithSidebar";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import Countdown from "@/components/Countdown";

function isoOf(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

export default function CountdownView({ slug }: { slug: string }) {
  const def = getCountdown(slug);
  if (!def) notFound();

  const now = warsawToday();
  const target = def.target(now);
  const iso = isoOf(target);
  const days = daysUntil(target, now);
  const targetMs = target.getTime();

  const daysWord = days === 1 ? "dzień" : "dni";
  const faq = [
    { q: def.h1, a: `Do ${def.name} zostało ${days} ${daysWord} — wypada ${formatISOFullPL(iso)}.` },
    { q: `Kiedy wypada ${def.name}?`, a: `${def.name.charAt(0).toUpperCase()}${def.name.slice(1)} wypada ${formatISOFullPL(iso)}.` },
    { q: `W jaki dzień tygodnia wypada ${def.name}?`, a: `To ${weekdayPL(iso)}.` },
  ];
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  const others = COUNTDOWNS.filter((c) => c.slug !== slug).slice(0, 8);

  return (
    <PageWithSidebar relatedExclude={["kalkulator-dni"]}>
      <BreadcrumbJsonLd
        items={[
          { name: "Kalendarz.pro", path: "/" },
          { name: "Odliczania", path: "/odliczania" },
          { name: def.h1, path: `/${slug}` },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-navy-600">Kalendarz.pro</Link> /{" "}
        <Link href="/odliczania" className="hover:text-navy-600">Odliczania</Link> / {def.h1}
      </nav>

      {/* HERO z licznikiem */}
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-navy-600 to-navy-800 p-8 text-center text-white shadow-lg">
        <div className="text-4xl">{def.emoji}</div>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">{def.h1}</h1>
        <div className="mt-6">
          <Countdown targetMs={targetMs} initialDays={days} />
        </div>
        <p className="mt-6 text-white/90">
          {days > 0 ? (
            <>
              Zostało <strong>{days} {daysWord}</strong> — {def.name} wypada {formatISODatePL(iso)} ({weekdayPL(iso)}).
            </>
          ) : (
            <>To dziś! 🎉</>
          )}
        </p>
      </div>

      <p className="mt-6 text-slate-600">{def.about}</p>

      {/* FAQ */}
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-bold text-navy-800">Najczęstsze pytania</h2>
        <div className="space-y-3">
          {faq.map((f) => (
            <div key={f.q} className="rounded-2xl border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-navy-800">{f.q}</h3>
              <p className="mt-1 text-sm text-slate-600">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* inne odliczania */}
      <section className="mt-10">
        <h2 className="mb-3 text-lg font-bold text-navy-800">Inne odliczania</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {others.map((c) => {
            const dd = daysUntil(c.target(now), now);
            return (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-md"
              >
                <span className="text-2xl">{c.emoji}</span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-navy-800">{c.name}</span>
                  <span className="text-xs text-slate-500">za {dd} dni</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </PageWithSidebar>
  );
}
