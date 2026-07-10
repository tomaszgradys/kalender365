import Link from "next/link";

// Kontextuelle „Weiter geht's"-Verlinkung für Tool-/Rechner-Seiten. Wandelt
// Ergebnis-Sackgassen in einen nächsten Schritt: verwandte Rechner plus die
// eigentliche Wertaktion (Kalender/PDF, Feiertage). Bewusst als interner Link,
// kein Formular — die Seite hat keine Lead-Ziele.

export type RelatedLink = { href: string; emoji: string; label: string; desc?: string };

export default function RelatedLinks({
  title = "Weiter geht's",
  items,
  className = "",
}: {
  title?: string;
  items: RelatedLink[];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section className={`mt-10 ${className}`} aria-label={title}>
      <h2 className="mb-3 text-xl font-bold text-navy-800">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-md"
          >
            <span aria-hidden="true" className="text-2xl leading-none">{t.emoji}</span>
            <span className="min-w-0">
              <span className="block font-bold text-navy-800">{t.label}</span>
              {t.desc && <span className="mt-0.5 block text-sm text-slate-500">{t.desc}</span>}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
