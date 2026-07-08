import { faqPageLd, serializeJsonLd, type QA } from "@/lib/de/jsonLd";

/**
 * Reusable FAQ block: renders the "Häufige Fragen" section as a native
 * <details> accordion AND emits the matching FAQPage JSON-LD. Drop `<Faq
 * items={…} />` at the bottom of any page to make it eligible for the FAQ rich
 * result in Google.
 */
export default function Faq({
  items,
  heading = "Häufige Fragen",
  className = "mt-10",
}: {
  items: QA[];
  heading?: string;
  className?: string;
}) {
  if (!items.length) return null;
  return (
    <section className={className}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqPageLd(items)) }} />
      <h2 className="mb-3 text-xl font-bold text-navy-800">{heading}</h2>
      <div className="space-y-3">
        {items.map((f) => (
          <details key={f.q} className="group rounded-2xl border border-slate-200 bg-white p-4">
            <summary className="flex cursor-pointer items-center justify-between gap-3 font-semibold text-navy-800">
              <span>{f.q}</span>
              <span aria-hidden="true" className="text-slate-400 transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
