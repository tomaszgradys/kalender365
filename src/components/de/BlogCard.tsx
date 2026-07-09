import Link from "next/link";
import Image from "next/image";
import { CATEGORY_GRADIENT, categorySlug, type BlogPost } from "@/lib/de/blog";
import { formatLongDE } from "@/lib/de/locale";
import EventArt from "@/components/de/EventArt";

// Kachel für einen Blogbeitrag. `featured` = großer Kachel (neuester Beitrag).
// Die ganze Kachel verlinkt den Beitrag (Stretched-Link über den Titel), das
// Kategorie-Label ist ein eigener Link zum Themen-Hub (liegt per z-Index oben) —
// so bekommt jeder Themen-Cluster interne Links aus jeder Beitragskachel, ohne
// verschachtelte <a> (ungültiges HTML).
export default function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  const gradient = CATEGORY_GRADIENT[post.category];
  const hub = `/blog/kategorie/${categorySlug(post.category)}`;
  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-md ${
        featured ? "sm:col-span-2 sm:flex-row" : ""
      }`}
    >
      <div
        className={`relative overflow-hidden aspect-[40/21] ${
          featured ? "sm:aspect-auto sm:w-1/2" : "w-full"
        }`}
      >
        {post.cover?.src ? (
          <Image src={post.cover.src} alt={post.cover.alt} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
        ) : post.art ? (
          <EventArt motif={post.art} uid={`bc-${post.slug}`} rounded={false} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${gradient}`}>
            <span className="px-4 text-center text-sm font-semibold uppercase tracking-widest text-white/90">
              {post.category}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <Link href={hub} className="relative z-10 self-start text-xs font-semibold uppercase tracking-wide text-brand-green-600 hover:underline">
          {post.category}
        </Link>
        <h3 className={`mt-1 font-bold text-navy-800 ${featured ? "text-xl" : "text-base"}`}>
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {post.title}
          </Link>
        </h3>
        <p className="mt-1.5 line-clamp-3 text-sm text-slate-600">{post.excerpt}</p>
        <p className="mt-auto pt-3 text-xs text-slate-400">{formatLongDE(post.publishedAt)}</p>
      </div>
    </div>
  );
}
