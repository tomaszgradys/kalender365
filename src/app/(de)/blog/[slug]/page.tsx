import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, getSeedPosts, CATEGORY_GRADIENT } from "@/lib/de/blog";
import { formatLongDE } from "@/lib/de/locale";
import { SITE_URL, SITE_NAME } from "@/lib/de/site";
import { serializeJsonLd } from "@/lib/de/jsonLd";
import PageWithSidebar from "@/components/de/PageWithSidebar";
import Faq from "@/components/de/Faq";
import EventArt from "@/components/de/EventArt";
import { berlinNow } from "@/lib/de/now";

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
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      images: post.cover ? [{ url: post.cover.src }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = (await getAllPosts()).filter((p) => p.slug !== post.slug).slice(0, 3);

  // Evergreen-Beiträge dürfen {jahr} in Links/Text verwenden → beim Rendern auf
  // das laufende Jahr aufgelöst, damit z. B. der Feiertage-Leitfaden immer auf
  // den aktuellen Jahrgang (/feiertage/JAHR) zeigt, ohne veraltete Hardcodings.
  const bodyHtml = post.bodyHtml.replaceAll("{jahr}", String(berlinNow().year));

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    articleSection: post.category,
    inLanguage: "de-DE",
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    ...(post.cover ? { image: [post.cover.src] } : {}),
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/png/web/mark-calendar-color-512.png` },
    },
  };

  return (
    <main className="flex-1">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleLd) }} />
      <PageWithSidebar>
        <nav className="mb-4 text-sm text-slate-500"><Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span> <Link href="/blog" className="hover:text-navy-600">Blog</Link> <span className="mx-1">/</span> <span className="text-navy-700">{post.category}</span></nav>

        <span className="text-xs font-semibold uppercase tracking-wide text-brand-green-600">{post.category}</span>
        <h1 className="mt-1 text-2xl font-black text-navy-800 sm:text-3xl">{post.title}</h1>
        <p className="mt-2 text-sm text-slate-400">{formatLongDE(post.publishedAt)}</p>

        <div className="mt-6 overflow-hidden rounded-2xl">
          {post.cover?.src ? (
            <Image
              src={post.cover.src}
              alt={post.cover.alt}
              width={1216}
              height={640}
              priority
              sizes="(min-width: 1024px) 832px, 100vw"
              className="aspect-[40/21] w-full object-cover"
            />
          ) : post.art ? (
            <EventArt motif={post.art} uid={`bh-${post.slug}`} rounded={false} className="aspect-[40/21] w-full" />
          ) : (
            <div className={`flex aspect-[40/21] w-full items-center justify-center bg-gradient-to-br ${CATEGORY_GRADIENT[post.category]}`}>
              <span className="px-4 text-center text-sm font-semibold uppercase tracking-widest text-white/90">
                {post.category}
              </span>
            </div>
          )}
        </div>

        <article
          className="mt-6 space-y-4 text-[15px] leading-relaxed text-slate-700 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-navy-800 [&_a]:font-medium [&_a]:text-navy-600 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_p]:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />

        {post.faq && post.faq.length > 0 && <Faq items={post.faq} />}

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
      </PageWithSidebar>
    </main>
  );
}
