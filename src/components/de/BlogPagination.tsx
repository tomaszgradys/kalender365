import Link from "next/link";
import { blogPagePath } from "@/lib/de/blogPaging";

// Serverseitige Paginierung mit echten <a>-Links (crawlbar). Kein rel=prev/next
// mehr (von Google abgekündigt) — normale Links genügen. Fenster von ±2 Seiten
// um die aktuelle, mit erster/letzter Seite und Ellipsen.
export default function BlogPagination({ page, totalPages }: { page: number; totalPages: number }) {
  if (totalPages <= 1) return null;

  const from = Math.max(1, page - 2);
  const to = Math.min(totalPages, page + 2);
  const nums: number[] = [];
  for (let i = from; i <= to; i++) nums.push(i);

  const link = "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-slate-200 px-3 text-sm font-medium text-navy-700 hover:border-navy-300 hover:bg-slate-50";
  const current = "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-navy-600 bg-navy-600 px-3 text-sm font-semibold text-white";
  const dots = "inline-flex h-9 items-center justify-center px-1 text-slate-400";

  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-1.5" aria-label="Blog-Seiten">
      {page > 1 && (
        <Link href={blogPagePath(page - 1)} className={link} aria-label="Vorherige Seite">← Zurück</Link>
      )}

      {from > 1 && (
        <>
          <Link href={blogPagePath(1)} className={link}>1</Link>
          {from > 2 && <span className={dots}>…</span>}
        </>
      )}

      {nums.map((p) =>
        p === page ? (
          <span key={p} aria-current="page" className={current}>{p}</span>
        ) : (
          <Link key={p} href={blogPagePath(p)} className={link}>{p}</Link>
        ),
      )}

      {to < totalPages && (
        <>
          {to < totalPages - 1 && <span className={dots}>…</span>}
          <Link href={blogPagePath(totalPages)} className={link}>{totalPages}</Link>
        </>
      )}

      {page < totalPages && (
        <Link href={blogPagePath(page + 1)} className={link} aria-label="Nächste Seite">Weiter →</Link>
      )}
    </nav>
  );
}
