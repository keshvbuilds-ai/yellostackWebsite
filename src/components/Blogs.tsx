'use client';
import { CmsText } from "@/components/cms/ContentProvider";
import { useContent, CmsImage } from '@/components/cms/ContentProvider';
import Link from 'next/link';
import { formatBlogDate } from '@/content/blog';
import { companyLinks } from '@/content/inner-pages';

export default function Blogs() {
  const blogPosts = [...useContent().posts].sort((a,b)=>b.date.localeCompare(a.date));
  return <section id="blog" aria-labelledby="home-blog-title" className="relative bg-[#eeefe4] px-[4%] py-20 text-[#171c11] md:py-28">
    <div className="mx-auto max-w-[1700px]">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-8">
        <div><p className="mb-5 font-mono text-xs uppercase tracking-widest"><CmsText id="Blogs.text.0" fallback="The Yellostack journal"/></p><h2 id="home-blog-title" className="text-[clamp(40px,5vw,80px)] leading-tight tracking-tight"><CmsText id="Blogs.text.1" fallback="Ideas worth building on."/></h2></div>
        <Link href="/blog" className="border-b border-current py-4 font-mono text-xs"><CmsText id="Blogs.text.2" fallback="EXPLORE ALL BLOGS ↗"/></Link>
      </div>
      <div className="grid gap-8 md:grid-cols-3">{blogPosts.slice(0,3).map(post=><article key={post.slug} className="group border-t border-black/25 pt-6"><Link href={`/blog/${post.slug}`} className="block">{post.coverImage ? <CmsImage src={post.coverImage} alt="" width={600} height={380} className="mb-7 aspect-[16/9] w-full rounded object-cover" /> : <div aria-hidden="true" className="mb-7 flex aspect-[16/9] items-center justify-center overflow-hidden bg-[#171c11] text-[clamp(48px,6vw,100px)] font-semibold tracking-tighter text-[#ffcf00] transition-colors group-hover:bg-[#303924]">{post.category.toUpperCase()}</div>}<div className="flex justify-between gap-3 font-mono text-[10px] uppercase text-[#626851]"><span>{post.category}</span><time dateTime={post.date}>{formatBlogDate(post.date)}</time></div><h3 className="mt-4 text-2xl leading-tight tracking-tight">{post.title}</h3><p className="mt-4 text-sm leading-7 text-[#626851]">{post.summary}</p><p className="mt-6 font-mono text-xs"><CmsText id="Blogs.text.3" fallback="READ OVERVIEW ↗"/></p></Link></article>)}</div>
      <nav aria-label="Explore Yellostack" className="mt-14 flex flex-wrap gap-x-7 gap-y-4 border-t border-black/20 pt-7 text-sm">{companyLinks.map(([label,href])=><Link key={href} href={href} className="py-2 hover:underline">{label} ↗</Link>)}</nav>
    </div>
  </section>;
}
