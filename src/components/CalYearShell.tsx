import Link from "next/link";
import { isNavigableYear } from "@/lib/months";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import PageWithSidebar from "@/components/PageWithSidebar";
import ExportPdfButton from "@/components/ExportPdfButton";
import TypeSeoBlock from "@/components/TypeSeoBlock";

// Wspólny szkielet dla kalendarzy rocznych: breadcrumb, hero z gradientem,
// treść i nawigacja poprzedni/następny rok.

export default function CalYearShell({
  slug,
  label,
  year,
  title,
  subtitle,
  gradient = "from-navy-600 to-navy-800",
  children,
}: {
  slug: string;
  label: string;
  year: number;
  title: string;
  subtitle: string;
  gradient?: string;
  children: React.ReactNode;
}) {
  const prev = year - 1;
  const next = year + 1;
  return (
    <PageWithSidebar relatedExclude={[slug]}>
      <BreadcrumbJsonLd
        items={[
          { name: "Kalendarz.pro", path: "/" },
          { name: "Kalendarze", path: "/kalendarze" },
          { name: `${label} ${year}`, path: `/${slug}/${year}` },
        ]}
      />
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-navy-600">
          Kalendarz.pro
        </Link>{" "}
        /{" "}
        <Link href="/kalendarze" className="hover:text-navy-600">
          Kalendarze
        </Link>{" "}
        / {label} {year}
      </nav>

      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-8 text-white shadow-lg`}>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-black">{title}</h1>
          <div className="flex shrink-0 items-center gap-2 no-print">
            {isNavigableYear(prev) && (
              <Link href={`/${slug}/${prev}`} aria-label={`${label} ${prev}`} className="rounded-lg bg-white/15 px-3 py-1.5 text-sm font-semibold ring-1 ring-white/25 backdrop-blur hover:bg-white/25">
                ← {prev}
              </Link>
            )}
            {isNavigableYear(next) && (
              <Link href={`/${slug}/${next}`} aria-label={`${label} ${next}`} className="rounded-lg bg-white/15 px-3 py-1.5 text-sm font-semibold ring-1 ring-white/25 backdrop-blur hover:bg-white/25">
                {next} →
              </Link>
            )}
          </div>
        </div>
        <p className="mt-2 max-w-xl text-white/90">{subtitle}</p>
        <div className="mt-5 no-print">
          <ExportPdfButton
            filename={`${slug}-${year}`}
            className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/25 backdrop-blur hover:bg-white/25 disabled:opacity-60"
          />
        </div>
      </div>

      {children}

      <TypeSeoBlock slug={slug} year={year} />

      <div className="mt-10 flex items-center justify-between">
        {isNavigableYear(prev) ? (
          <Link
            href={`/${slug}/${prev}`}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:border-navy-300 hover:text-navy-600"
          >
            ← {label} {prev}
          </Link>
        ) : (
          <span />
        )}
        <Link href="/kalendarze" className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200">
          Wszystkie kalendarze
        </Link>
        {isNavigableYear(next) ? (
          <Link
            href={`/${slug}/${next}`}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:border-navy-300 hover:text-navy-600"
          >
            {label} {next} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </PageWithSidebar>
  );
}

export function DataTable({ rows }: { rows: { label: string; value: string; highlight?: boolean }[] }) {
  return (
    <ul className="mt-6 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200">
      {rows.map((r, i) => (
        <li
          key={i}
          className={`flex items-center justify-between px-4 py-3 text-sm ${r.highlight ? "bg-navy-50/60" : ""}`}
        >
          <span className={`text-slate-700 ${r.highlight ? "font-semibold" : ""}`}>{r.label}</span>
          <span className="font-mono text-slate-600">{r.value}</span>
        </li>
      ))}
    </ul>
  );
}
