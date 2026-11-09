"use client";
import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {useContent,CmsImage,LocalText,useTranslate} from '@/components/cms/ContentProvider';
import {appCategories,workServices,workProjects} from '@/content/work-catalogue';
import './project-collection.css';
export default function ProjectCollection({collection,category}:{collection:string;category?:string}){
 const t=useTranslate();const content=useContent(),service=workServices.find(s=>s.slug===collection)!;
 const mobile=collection==='mobile-apps';
 const all=workProjects(content).filter(p=>p.service===service.service);
 const projects=all.filter(p=>!category||p.category===category);
 return <main className={`project-collection ${mobile?'app-collection':''}`} id="page-content" data-no-gradient>
 <header className="collection-intro"><Link href="/portfolio"><LocalText text="Back to Work"/></Link><p className="collection-eyebrow">YELLOSTACK / <LocalText text="SELECTED PROJECTS"/></p><h1><LocalText text={service.title}/></h1><p><LocalText text={service.description}/></p></header>
 {mobile&&<nav className="app-filters" aria-label={t("App categories")}>{[{slug:'',title:'All'},...appCategories].map(c=><Link key={c.slug} href={'/portfolio/projects/mobile-apps'+(c.slug?'/'+c.slug:'')} scroll={false} aria-current={(category||'')===c.slug?'page':undefined}><LocalText text={c.title}/><span>{c.slug?all.filter(p=>p.category===c.slug).length:all.length}</span></Link>)}</nav>}
 <div className="collection-grid">{projects.map(p=><article className="collection-card" key={p.id}><div className="collection-card-art">{p.image&&<CmsImage src={p.image} alt={p.title} width={900} height={600}/>}</div><div className="collection-card-copy"><p className="app-category-label"><LocalText text={appCategories.find(c=>c.slug===p.category)?.title??service.title}/></p><h2><LocalText text={p.title}/></h2><p><LocalText text={mobile?(p.shortDescription||p.description):p.description}/></p>{mobile?<Link className="work-project-link" href={'/portfolio/projects/mobile-apps/app/'+encodeURIComponent(p.id)}><LocalText text="See more"/><ArrowUpRight size={20} aria-hidden="true"/></Link>:p.url?<a href={p.url} target="_blank" rel="noopener noreferrer" className="work-project-link"><LocalText text="View project"/><ArrowUpRight size={20}/></a>:<Link className="work-project-link" href="/contact"><LocalText text="Discuss your project"/><ArrowUpRight size={20}/></Link>}</div></article>)}</div>
 {!projects.length&&<section className="collection-empty" role="status"><h2><LocalText text="Your next idea could be here."/></h2><p><LocalText text="No projects have been published in this category yet."/></p></section>}
 </main>;
}
