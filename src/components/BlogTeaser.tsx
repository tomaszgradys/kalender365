import Link from "next/link";
import { latestSummaries } from "@/lib/blog";
import BlogCard from "@/components/blog/BlogCard";

// Sekcja „Z bloga" na stronie głównej: najnowszy wpis wyróżniony + 2 kolejne.
export default async function BlogTeaser() {
  const posts = await latestSummaries(3);
  if (posts.length === 0) return null;
  const [featured, ...rest] = posts;

  return (
    <section className="mt-12">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy-800">Z bloga</h2>
          <p className="mt-1 text-sm text-slate-500">Poradniki o świętach, dniach wolnych i planowaniu roku.</p>
        </div>
        <Link href="/blog" className="shrink-0 text-sm font-semibold text-navy-600 hover:text-brand-green-600">
          Cały blog →
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {featured && <BlogCard post={featured} featured />}
        {rest.map((p) => (
          <BlogCard key={p.slug} post={p} />
        ))}
      </div>
    </section>
  );
}
