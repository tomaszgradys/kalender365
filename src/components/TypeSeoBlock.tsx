import { getTypeSeo } from "@/lib/typeSeo";
import FaqSection from "@/components/FaqSection";

// Blok treści SEO dla kalendarzy-typów: opis, sekcje H2 i FAQ (z JSON-LD FAQPage).
// Renderowany automatycznie przez CalYearShell na podstawie sluga; jeśli brak wpisu — null.
export default function TypeSeoBlock({ slug, year }: { slug: string; year: number }) {
  const seo = getTypeSeo(slug, year);
  if (!seo) return null;

  return (
    <>
      <section className="mt-12 max-w-3xl">
        {seo.intro.map((p, i) => (
          <p key={i} className={`text-slate-600 ${i > 0 ? "mt-3" : ""}`}>
            {p}
          </p>
        ))}

        {seo.sections.map((s, i) => (
          <div key={i} className="mt-8">
            <h2 className="text-xl font-bold text-navy-800">{s.h2}</h2>
            {s.body.map((p, j) => (
              <p key={j} className="mt-2 text-slate-600">
                {p}
              </p>
            ))}
          </div>
        ))}
      </section>

      {seo.faq.length > 0 && <FaqSection items={seo.faq} />}
    </>
  );
}
