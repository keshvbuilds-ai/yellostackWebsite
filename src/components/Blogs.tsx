'use client';
import BlogViews,{BlogViewCounts} from './blog/BlogViews';
import './blog/journal.css';
import { pageMedia } from '@/content/media';
import { CmsText, LocalText } from "@/components/cms/ContentProvider";
import { useContent, useLocale, CmsImage } from '@/components/cms/ContentProvider';
import Link from 'next/link';
import { blogDirection,blogLanguage,formatBlogDate } from '@/content/blog';
import { companyLinks } from '@/content/inner-pages';

export default function Blogs() {
  const content=useContent(),locale=useLocale();
  const blogPosts = [...content.posts].sort((a,b)=>b.date.localeCompare(a.date));
  return <section id="blog" aria-labelledby="home-blog-title" className="relative bg-[#eeefe4] px-[4%] py-20 text-[#171c11] md:py-28">
    <div className="mx-auto max-w-[1700px]">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-8">
        <div><p className="mb-5 font-mono text-xs uppercase tracking-widest"><CmsText id="Blogs.text.0" fallback="The Yellostack journal"/></p><h2 id="home-blog-title" className="text-[clamp(40px,5vw,80px)] leading-tight tracking-tight"><CmsText id="Blogs.text.1" fallback="Ideas worth building on."/></h2></div>
        <Link href="/blog" className="border-b border-current py-4 font-mono text-xs"><CmsText id="Blogs.text.2" fallback="EXPLORE ALL BLOGS ↗"/></Link>
      </div>
      <BlogViewCounts><div className="grid gap-8 md:grid-cols-3">{blogPosts.slice(0,3).map(post=><article dir={blogDirection(post)} lang={blogLanguage(post)} key={post.slug} data-site-reveal className="group border-t border-black/25 pt-6"><Link href={`/blog/${post.slug}`} className="block"><div className="relative"><BlogViews slug={post.slug}/><CmsImage cmsPath={['posts',String(content.posts.findIndex(item=>item.slug===post.slug)),'coverImage']} src={post.coverImage || pageMedia(post.slug).src} alt="" width={600} height={380} className="mb-7 aspect-[16/9] w-full rounded object-cover" /></div><div className="flex justify-between gap-3 font-mono text-[10px] uppercase text-[#626851]"><span><LocalText text={post.category}/></span><time dateTime={post.date}>{formatBlogDate(post.date,locale)}</time></div><h3 className="mt-4 text-2xl leading-tight tracking-tight">{post.title}</h3><p className="mt-4 text-sm leading-7 text-[#626851]">{post.summary}</p><p className="mt-6 font-mono text-xs"><CmsText id="Blogs.text.3" fallback="READ OVERVIEW ↗"/></p></Link></article>)}</div></BlogViewCounts>
      <nav aria-label="Explore Yellostack" className="mt-14 flex flex-wrap gap-x-7 gap-y-4 border-t border-black/20 pt-7 text-sm">{companyLinks.map(([label,href])=><Link key={href} href={href} className="py-2 hover:underline"><LocalText text={label}/> ↗</Link>)}</nav>
    </div>
  </section>;
}
