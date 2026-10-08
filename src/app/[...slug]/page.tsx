import AIExperience from '@/components/ai/AIExperience';
import MediaPanel from '@/components/MediaPanel';
import { pageMedia } from '@/content/media';

import { LocalText } from '@/components/cms/ContentProvider';
import ContactExperience from '@/components/engagement/ContactExperience';
import { getLocalizedContent as getSiteContent } from '@/lib/locale-server';
import ClientLogos from '@/components/cms/ClientLogos';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CmsImage as Image } from '@/components/cms/ContentProvider';
import Navigation from '@/components/Navigation';
import InnerHero from '@/components/inner/InnerHero';
import { notFound, permanentRedirect } from 'next/navigation';
import { companyLinks, innerPages as defaultPages, routeAliases } from '@/content/inner-pages';
import { blogPosts as defaultPosts, formatBlogDate } from '@/content/blog';

type Props = { params: Promise<{ slug: string[] }> };

export function generateStaticParams() {
  return [...defaultPages.map(p=>p.slug), 'blog', ...defaultPosts.map(p=>`blog/${p.slug}`), ...Object.keys(routeAliases)].map(path=>({slug:path.split('/')}));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const content = await getSiteContent();
  const innerPages = content.pages;
  const blogPosts = [...content.posts].sort((a,b)=>b.date.localeCompare(a.date));
  const path = (await params).slug.join('/');
  const page = innerPages.find(p=>p.slug===path);
  const post = blogPosts.find(p=>`blog/${p.slug}`===path);
  return { title: `${page?.title ?? post?.title ?? 'Journal'} | Yellostack`, description: page?.intro ?? post?.summary ?? 'Ideas and insights from the Yellostack journal.' };
}

export default async function Page({params}: Props) {
  const content = await getSiteContent();
  const innerPages = content.pages;
  const servicePages = innerPages.filter(page=>page.kind==='service');
  const blogPosts = [...content.posts].sort((a,b)=>b.date.localeCompare(a.date));
  const path = (await params).slug.join('/');
  if (routeAliases[path]) permanentRedirect(`/${routeAliases[path]}`);
  const page = innerPages.find(p=>p.slug===path);
  const post = blogPosts.find(p=>`blog/${p.slug}`===path);
  if (!page && !post && path!=='blog') notFound();
  const title = page?.title ?? post?.title ?? 'Ideas worth building on.';
  return <div className="ys-inner-page min-h-screen text-[#171c11]">
    <a href="#page-content" className="fixed left-4 top-4 z-50 -translate-y-24 bg-[#ffcf00] p-4 focus:translate-y-0"><LocalText text={"Skip to content"}/></a>
    <Navigation solid />
    <main id="page-content">
      {path==='artificial-intelligence' ? <AIExperience title={title} intro={page?.intro || ''}/> : <InnerHero title={title} intro={page?.intro ?? post?.summary ?? 'Explore design, technology and business perspectives from the Yellostack archive.'} eyebrow={page?.eyebrow ?? 'Journal'} article={!!post} />}
      <div className="ys-inner-body">
      {page && path!=='artificial-intelligence' && page.kind!=='contact' && <MediaPanel topic={page.slug} film={page.slug==='about-us'||page.slug==='team'}/> }
      {post && <p className="ys-inner-date">{post.category} / <time dateTime={post.date}>{formatBlogDate(post.date)}</time></p>}
      {path==='blog' && <div className="grid gap-x-10 gap-y-12 py-14 md:grid-cols-2 xl:grid-cols-3">{blogPosts.map((item,index)=><article key={item.slug} className="border-t border-black/20 pt-6"><Link href={'/blog/'+item.slug} tabIndex={-1} aria-hidden="true" className="mb-6 block overflow-hidden rounded-xl bg-[#e0e5d1]"><Image src={item.coverImage || pageMedia(item.slug).src} alt="" width={600} height={420} className="aspect-[16/10] w-full object-cover transition-transform duration-500 motion-safe:hover:scale-105" /></Link><div className="font-mono text-xs text-[#626851]">{item.category} · {formatBlogDate(item.date)}</div><Link href={`/blog/${item.slug}`} className="group"><h2 className="mt-4 text-2xl leading-tight group-hover:underline">{item.title}</h2><p className="mt-4 text-sm leading-7 text-[#626851]">{item.summary}</p><span className="mt-6 inline-block font-mono text-xs"><LocalText text={item.paragraphs.length?'READ OVERVIEW':'VIEW ARCHIVE ENTRY'}/> ↗</span></Link></article>)}</div>}
      {post && <article className="mx-auto max-w-3xl py-14">{post.coverImage && <Image src={post.coverImage} alt={post.title} width={1000} height={650} className="mb-10 w-full rounded-xl object-cover" />}<p className="mb-8 font-mono text-xs uppercase text-[#626851]">{post.paragraphs.length?(post.source?'Article overview':'Journal'):'From the archive'}</p>{post.paragraphs.length ? post.paragraphs.map(p=><p key={p} className="mb-6 text-lg leading-9">{p}</p>) : <p className="mb-8 text-lg leading-9"><LocalText text={"This entry preserves an article from Yellostack’s published archive. Its full text is not hosted here; you can visit the original publication using the link below."}/></p>}{post.source && <a href={post.source} target="_blank" rel="noreferrer" className="mt-6 inline-flex bg-[#171c11] px-7 py-5 font-mono text-xs text-[#ffcf00]"><LocalText text={"OPEN ORIGINAL PUBLICATION ↗"}/></a>}<p className="mt-8 text-sm text-[#626851]"><LocalText text={"Published content reflects its original date."}/></p><Link href="/blog" className="mt-10 block text-sm underline"><LocalText text={"← All articles"}/></Link></article>}
      {path!=='artificial-intelligence' && page?.sections.map((section,index)=><section key={section.title} className="ys-inner-detail"><div><p className="mb-5 font-mono text-xs text-[#626851]">{String(index+1).padStart(2,'0')}<LocalText text={"/ YELLOSTACK"}/></p><h2 className="max-w-md text-3xl leading-tight tracking-tight">{section.title}</h2></div><div>{section.image && <Image src={section.image} alt={section.imageAlt || section.title} width={900} height={600} className="mb-7 aspect-[3/2] w-full rounded-lg object-cover" />}<p className="max-w-2xl text-lg leading-8 text-[#535b46]">{section.body}</p>{section.items && <ul className="mt-7 grid gap-3 sm:grid-cols-2">{section.items.map(item=><li key={item} className="border-t border-black/15 pt-3 text-sm">{item}</li>)}</ul>}</div></section>)}
      {page?.slug==='clients' && <ClientLogos />}
      {page?.kind==='directory' && <div className="py-12">{[...new Set(servicePages.map(p=>p.group))].map(group=><section key={group} className="mb-14"><h2 className="mb-6 text-3xl">{group}</h2><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{servicePages.filter(p=>p.group===group).map(item=><Link key={item.slug} href={`/${item.slug}`} className="border border-black/20 p-7 transition-colors hover:bg-[#ffcf00]"><h3 className="text-xl">{item.title} ↗</h3><p className="mt-4 text-sm leading-7 text-[#535b46]">{item.intro}</p></Link>)}</div></section>)}</div>}
      {page?.kind==='contact' && <ContactExperience/>}
      {page?.kind==='service' && <div className="pt-12"><Link href="/services" className="font-mono text-xs underline"><LocalText text={"← EXPLORE ALL SERVICES"}/></Link></div>}
      </div>
    </main>
    <section className="bg-[#ffcf00] px-[4%] py-16"><div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-8"><h2 className="text-[clamp(32px,4vw,64px)] tracking-tight"><LocalText text={"Your next chapter starts here."}/></h2><Link href="/contact" className="bg-[#171c11] px-7 py-5 font-mono text-xs text-white"><LocalText text={"LET’S TALK ↗"}/></Link></div></section>
    <footer className="bg-[#10130d] px-[4%] py-14 text-white"><div className="mx-auto grid max-w-[1500px] gap-10 md:grid-cols-[1fr_1fr_2fr]"><div><Link href="/" className="text-3xl font-semibold"><LocalText text={"Yello"}/><span className="text-[#ffcf00]"><LocalText text={"Stack"}/></span></Link><p className="mt-5 text-sm leading-7 text-white/60"><LocalText text={"Strategy, design and technology."}/><br /><LocalText text={"Connected around your business."}/></p></div><nav aria-label="Company pages" className="grid gap-3 text-sm">{companyLinks.map(([label,href])=><Link key={href} href={href} className="hover:text-[#ffcf00]"><LocalText text={label}/></Link>)}</nav><nav aria-label="Service pages" className="grid gap-3 text-sm sm:grid-cols-2">{servicePages.map(item=><Link key={item.slug} href={`/${item.slug}`} className="text-white/70 hover:text-[#ffcf00]">{item.title}</Link>)}</nav></div></footer>
  </div>;
}
