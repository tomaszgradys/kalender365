import { serializeJsonLd } from "@/lib/jsonLd";

export type Faq = { q: string; a: string };

// Sekcja FAQ z danymi strukturalnymi FAQPage (SEO).
export default function FaqSection({ items, heading = "Najczęstsze pytania" }: { items: Faq[]; heading?: string }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <section className="mt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(ld) }} />
      <h2 className="mb-3 text-xl font-bold text-navy-800">{heading}</h2>
      <div className="space-y-3">
        {items.map((f) => (
          <div key={f.q} className="rounded-2xl border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-navy-800">{f.q}</h3>
            <p className="mt-1 text-sm text-slate-600">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
