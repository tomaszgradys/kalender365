import Link from "next/link";
import { SITE_URL } from "@/lib/de/site";
import { serializeJsonLd, breadcrumbLd } from "@/lib/de/jsonLd";

// Gemeinsame Breadcrumb-Komponente: rendert die sichtbare Navigation UND das
// schema.org BreadcrumbList-JSON-LD aus einer einzigen Quelle. So bleiben Optik
// und strukturierte Daten garantiert synchron und jede Hub-/Detailseite bekommt
// Breadcrumb-Rich-Results in der Google-Suche.
//
// `url` ist für jeden Krümel ein interner Pfad (z. B. "/feiertage/2026"); die
// letzte Position ist die aktuelle Seite und wird sichtbar als Text (kein Link)
// dargestellt, im JSON-LD aber weiterhin mit ihrer kanonischen URL geführt.

export type Crumb = { name: string; url: string };

export default function Breadcrumbs({ items, className = "" }: { items: Crumb[]; className?: string }) {
  const ld = breadcrumbLd(items, SITE_URL);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(ld) }} />
      <nav className={`mb-4 text-sm text-slate-500 ${className}`.trim()} aria-label="Breadcrumb">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <span key={c.url}>
              {i > 0 && <span className="mx-1">/</span>}
              {last ? (
                <span className="text-navy-700">{c.name}</span>
              ) : (
                <Link href={c.url} className="hover:text-navy-600">
                  {c.name}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}
