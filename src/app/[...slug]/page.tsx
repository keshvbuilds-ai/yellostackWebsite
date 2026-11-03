import BlogJournal from '@/components/blog/BlogJournal';
import PublishedCollections from '@/components/cms/PublishedCollections';
import WorkExperience from '@/components/work/WorkExperience';
import { capabilityLinks, productSlugs } from '@/content/catalogue';
import DevelopmentExperience from '@/components/development/DevelopmentExperience';
import TeamExperience from '@/components/team/TeamExperience';
import GMMessage from '@/components/GMMessage';
import MedicalServices from '@/components/medical/MedicalServices';
import StackConvergence from '@/components/hero/StackConvergence';
import Portfolio from '@/components/Portfolio';
import MedicalExperience from '@/components/medical/MedicalExperience';
import Footer from '@/components/Footer';
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
import { innerPages as defaultPages, routeAliases } from '@/content/inner-pages';
import { blogPosts as defaultPosts } from '@/content/blog';

type Props = { params: Promise<{ slug: string[] }> };

export function generateStaticParams() {
  return [...defaultPages.map(p => p.slug), 'blog', ...defaultPosts.map(p => `blog/${p.slug}`), ...Object.keys(routeAliases)].map(path => ({ slug: path.split('/') }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const content = await getSiteContent();
  const innerPages = content.pages;
  const blogPosts = [...content.posts].sort((a, b) => b.date.localeCompare(a.date));
  const path = (await params).slug.join('/');
  const page = innerPages.find(p => p.slug === path);
  const post = blogPosts.find(p => `blog/${p.slug}` === path);
  return { title: `${page?.title ?? post?.title ?? 'Journal'} | Yellostack`, description: page?.intro ?? post?.summary ?? 'Ideas and insights from the Yellostack journal.' };
}

export default async function Page({ params }: Props) {
  const content = await getSiteContent();
  const innerPages = content.pages;
  const servicePages = innerPages.filter(page => page.kind === 'service');
  const blogPosts = [...content.posts].sort((a, b) => b.date.localeCompare(a.date));
  const path = (await params).slug.join('/');
  if (routeAliases[path]) permanentRedirect(`/${routeAliases[path]}`);
  const page = innerPages.find(p => p.slug === path);
  const post = blogPosts.find(p => `blog/${p.slug}` === path);
  if (!page && !post && path !== 'blog') notFound();
  if(path==='blog'||post)return <><Navigation solid/><main id="page-content"><BlogJournal posts={blogPosts} post={post}/></main><Footer/></>;
  if(path === 'portfolio' && page)return <><Navigation solid/><main id="page-content"><WorkExperience title={page.title} intro={page.intro} sections={page.sections}/></main><Footer/></>;
  const directoryPages = path === 'products' ? servicePages.filter(item=>productSlugs.includes(item.slug)) : capabilityLinks.map(item=>({...servicePages.find(page=>page.slug===item.slug)!,title:item.title})).filter(item=>item.slug);
  const title = page?.title ?? 'Ideas worth building on.';
  return <div className="ys-inner-page min-h-screen text-[#171c11]">
    <a href="#page-content" className="fixed left-4 top-4 z-50 -translate-y-24 bg-[#ffcf00] p-4 focus:translate-y-0"><LocalText text={"Skip to content"} /></a>
    <Navigation solid />
    <main id="page-content">
      {path === 'artificial-intelligence' ? <AIExperience title={title} intro={page?.intro || ''} /> : <InnerHero title={title} intro={page?.intro ?? 'Explore design, technology and business perspectives from the Yellostack archive.'} eyebrow={page?.eyebrow ?? 'Journal'} />}
      {path === 'about-us' && <><StackConvergence /><div className="gm-opening"><GMMessage /></div></>}
      {path === 'team' && <TeamExperience />}
      {path === 'mobile-application-development-company-saudi-arabia' && <DevelopmentExperience kind="mobile" />}
      {path === 'website-design-company' && <DevelopmentExperience kind="web" />}
      {path === 'medical-coding' && <><MedicalExperience /><MedicalServices /></>}
      {path !== 'artificial-intelligence' && <div className="ys-inner-body">
        {page && path !== 'team' && path !== 'medical-coding' && path !== 'artificial-intelligence' && page.kind !== 'contact' && page.slug !== 'clients' && page.slug !== 'products' && <MediaPanel topic={page.slug} film={page.slug === 'about-us' || page.slug === 'team'} />}
        {path !== 'artificial-intelligence' && page?.sections.map((section, index) => <section key={section.title} className="ys-inner-detail"><div><p className="mb-5 font-mono text-xs text-[#626851]">{String(index + 1).padStart(2, '0')}<LocalText text={"/ YELLOSTACK"} /></p><h2 className="max-w-md text-3xl leading-tight tracking-tight">{section.title}</h2></div><div>{section.image && <Image src={section.image} alt={section.imageAlt || section.title} width={900} height={600} className="mb-7 aspect-[3/2] w-full rounded-lg object-cover" />}<p className="max-w-2xl text-lg leading-8 text-[#535b46]">{section.body}</p>{section.items && <ul className="mt-7 grid gap-3 sm:grid-cols-2">{section.items.map(item => <li key={item} className="border-t border-black/15 pt-3 text-sm">{item}</li>)}</ul>}</div></section>)}
        {page?.slug === 'clients' && <ClientLogos />}
        {path==='products'&&<PublishedCollections kind="products"/>}
        {page?.kind === 'directory' && <div className="py-12">{[...new Set(directoryPages.map(p => p.group))].map(group => <section key={group} className="mb-14"><h2 className="mb-6 text-3xl">{group}</h2><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{directoryPages.filter(p => p.group === group).map(item => <Link key={item.slug} href={`/${item.slug}`} className="border border-black/20 p-7 transition-colors hover:bg-[#ffcf00]"><h3 className="text-xl">{item.title} ↗</h3><p className="mt-4 text-sm leading-7 text-[#535b46]">{item.intro}</p></Link>)}</div></section>)}</div>}
        {page?.kind === 'contact' && <ContactExperience />}
        {page?.kind === 'service' && <div className="pt-12"><Link href="/services" className="font-mono text-xs underline"><LocalText text={"← EXPLORE ALL SERVICES"} /></Link></div>}
      </div>}
      {path === 'mobile-application-development-company-saudi-arabia' && <Portfolio />}
    </main>
    <Footer />
  </div>;
}
