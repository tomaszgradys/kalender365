import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, getSeedPosts } from "@/lib/de/blog";
import { formatLongDE } from "@/lib/de/locale";
import { SITE_URL, SITE_NAME } from "@/lib/de/site";

export const revalidate = 600;

// Prerender seed posts; AI posts render on-demand (ISR).
export function generateStaticParams() {
  return getSeedPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title}`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.excerpt },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = (await getAllPosts()).filter((p) => p.slug !== post.slug).slice(0, 3);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    articleSection: post.category,
    inLanguage: "de-DE",
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };

  return (
    <main className="flex-1">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <div className="mx-auto w-full max-w-2xl px-4 py-8">
        <nav className="mb-4 text-sm text-slate-500"><Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span> <Link href="/blog" className="hover:text-navy-600">Blog</Link> <span className="mx-1">/</span> <span className="text-navy-700">{post.category}</span></nav>

        <span className="text-xs font-semibold uppercase tracking-wide text-brand-green-600">{post.category}</span>
        <h1 className="mt-1 text-2xl font-black text-navy-800 sm:text-3xl">{post.title}</h1>
        <p className="mt-2 text-sm text-slate-400">{formatLongDE(post.publishedAt)}</p>

        <article
          className="mt-6 space-y-4 text-[15px] leading-relaxed text-slate-700 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-navy-800 [&_a]:font-medium [&_a]:text-navy-600 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_p]:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
        />

        {related.length > 0 && (
          <section className="mt-10 border-t border-slate-100 pt-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Weiterlesen</h2>
            <ul className="space-y-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/blog/${r.slug}`} className="font-medium text-navy-700 hover:underline">{r.title}</Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
