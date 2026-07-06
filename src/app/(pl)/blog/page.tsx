import type { Metadata } from "next";
import Link from "next/link";
import PageWithSidebar from "@/components/PageWithSidebar";
import BlogCard from "@/components/blog/BlogCard";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { getPublishedSummaries, nonEmptyCategories, CATEGORY_META } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";
import { serializeJsonLd } from "@/lib/jsonLd";

// Nowe wpisy pojawiają się automatycznie w dniu publikacji (ISR).
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog kalendarz.pro — dni wolne, urlop i planowanie roku",
  description:
    "Poradniki o świętach, dniach wolnych, długich weekendach, feriach, wakacjach i planowaniu urlopu. Praktyczna wiedza kalendarzowa aktualizowana na bieżąco.",
  alternates: { canonical: "/blog" },
};

export default async function BlogIndex() {
  const posts = await getPublishedSummaries();
  const [featured, ...rest] = posts;
  const categories = await nonEmptyCategories();

  const ld = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blog`,
    name: "Blog kalendarz.pro",
    url: `${SITE_URL}/blog`,
    inLanguage: "pl-PL",
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.publishedAt,
    })),
  };

  return (
    <PageWithSidebar>
      <BreadcrumbJsonLd items={[{ name: "Kalendarz.pro", path: "/" }, { name: "Blog", path: "/blog" }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(ld) }} />

      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-navy-600">Kalendarz.pro</Link> / Blog
      </nav>
      <h1 className="text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">Blog kalendarz.pro</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Praktyczne poradniki o świętach, dniach wolnych, długich weekendach, feriach i planowaniu urlopu.
      </p>

      {posts.length === 0 ? (
        <p className="mt-8 rounded-2xl bg-slate-50 p-6 text-slate-500">Pierwsze wpisy pojawią się wkrótce.</p>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c}
                href={`/blog/kategoria/${c}`}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:border-navy-300 hover:text-navy-700"
              >
                {CATEGORY_META[c].label}
              </Link>
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {featured && <BlogCard post={featured} featured />}
            {rest.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </>
      )}
    </PageWithSidebar>
  );
}
