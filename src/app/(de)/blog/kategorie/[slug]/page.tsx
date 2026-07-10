import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogCard from "@/components/de/BlogCard";
import PageWithSidebar from "@/components/de/PageWithSidebar";
import Breadcrumbs from "@/components/de/Breadcrumbs";
import { berlinNow } from "@/lib/de/now";
import { ogMeta } from "@/lib/de/ogMeta";
import {
  BLOG_CATEGORIES,
  BLOG_CATEGORY_META,
  categoryBySlug,
  categorySlug,
  getPostsByCategory,
} from "@/lib/de/blog";

export const revalidate = 600;

// Themen-Hub pro Blog-Kategorie: bündelt alle Ratgeber eines Clusters und
// verlinkt in die passenden Werkzeug-/Money-Pages. Signalisiert Google ein
// klar organisiertes Themen-Silo (Topical Authority).

export function generateStaticParams() {
  return BLOG_CATEGORIES.map((c) => ({ slug: categorySlug(c) }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = categoryBySlug(slug);
  if (!cat) return {};
  const meta = BLOG_CATEGORY_META[cat];
  return {
    title: `${meta.title} – Ratgeber & Wissen`,
    description: meta.metaDescription,
    alternates: { canonical: `/blog/kategorie/${meta.slug}` },
    openGraph: ogMeta(`/blog/kategorie/${meta.slug}`, { defaultImage: true }),
  };
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = categoryBySlug(slug);
  if (!cat) notFound();

  const meta = BLOG_CATEGORY_META[cat];
  const posts = await getPostsByCategory(cat);
  const y = berlinNow().year;
  const resolve = (href: string) => href.replaceAll("{y}", String(y));

  return (
    <div className="flex-1">
      <PageWithSidebar>
        <Breadcrumbs
          items={[
            { name: "Start", url: "/" },
            { name: "Blog", url: "/blog" },
            { name: meta.title, url: `/blog/kategorie/${meta.slug}` },
          ]}
        />

        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">{meta.title}</h1>
        <p className="mt-2 max-w-2xl text-slate-600">{meta.intro}</p>

        {/* Andere Themen-Cluster */}
        <nav className="mt-5 flex flex-wrap gap-2" aria-label="Blog-Themen">
          <Link
            href="/blog"
            className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:border-navy-300 hover:text-navy-700"
          >
            Alle Beiträge
          </Link>
          {BLOG_CATEGORIES.map((c) => {
            const active = c === cat;
            return (
              <Link
                key={c}
                href={`/blog/kategorie/${categorySlug(c)}`}
                aria-current={active ? "page" : undefined}
                className={`rounded-full border px-3 py-1 text-sm ${
                  active
                    ? "border-navy-600 bg-navy-600 text-white"
                    : "border-slate-200 text-slate-600 hover:border-navy-300 hover:text-navy-700"
                }`}
              >
                {c}
              </Link>
            );
          })}
        </nav>

        {posts.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        ) : (
          <p className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            In diesem Themenbereich erscheinen bald neue Beiträge. Sehen Sie sich in der Zwischenzeit
            unsere{" "}
            <Link href="/blog" className="font-semibold text-navy-700 hover:underline">
              neuesten Ratgeber
            </Link>{" "}
            an.
          </p>
        )}

        {/* Brücken in die passenden Werkzeug-/Money-Pages */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-lg font-bold text-navy-800">Passende Seiten & Werkzeuge</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {meta.bridges.map((b) => (
              <li key={b.href}>
                <Link
                  href={resolve(b.href)}
                  className="inline-block rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-navy-700 hover:border-navy-300 hover:shadow-sm"
                >
                  {resolve(b.label)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </PageWithSidebar>
    </div>
  );
}
