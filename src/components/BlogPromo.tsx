import Link from "next/link";

// Delikatne zaproszenie na bloga (i opcjonalnie planer urlopu) wplatane w treść
// kalkulatorów i narzędzi. Ma zachęcać, nie przeszkadzać.
export default function BlogPromo({ planerYear }: { planerYear?: number }) {
  return (
    <aside className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
      📚 Zajrzyj na{" "}
      <Link href="/blog" className="font-semibold text-navy-600 hover:text-brand-green-600">nasz blog</Link>{" "}
      — praktyczne poradniki o świętach, dniach wolnych i planowaniu roku.
      {planerYear && (
        <>
          {" "}Planujesz urlop? Wypróbuj{" "}
          <Link href={`/planer-urlopu/${planerYear}`} className="font-semibold text-navy-600 hover:text-brand-green-600">
            planer urlopu
          </Link>{" "}
          i ułóż wolne na cały rok.
        </>
      )}
    </aside>
  );
}
