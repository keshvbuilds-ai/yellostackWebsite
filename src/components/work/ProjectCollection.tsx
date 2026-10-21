"use client";
import Link from 'next/link';
import {useContent,CmsImage} from '@/components/cms/ContentProvider';
import {appCategories,workServices,workProjects} from '@/content/work-catalogue';
import './project-collection.css';
export default function ProjectCollection({collection,category}:{collection:string;category?:string}){
 const content=useContent();const service=workServices.find(s=>s.slug===collection)!;
 const selected=appCategories.find(c=>c.slug===category);
 const sections=content.pages.find(p=>p.slug==='portfolio')?.sections??[];
 const projects=workProjects(content).filter(p=>p.service===service.service&&(!category||p.category===category));
 const categories=collection==='mobile-apps'&&!category;
 return <main className="project-collection" id="page-content"><header className="collection-intro"><Link href={category?'/portfolio/projects/mobile-apps':'/portfolio'}>&#8592; {category?'All app experiences':'Back to Work'}</Link><p className="collection-eyebrow">YELLOSTACK / {categories?'APPLICATION EXPERIENCES':'SELECTED PROJECTS'}</p><h1>{selected?.title??service.title}</h1><p>{selected?sections[appCategories.indexOf(selected)]?.body:service.description}</p></header>
 {categories?<div className="collection-categories">{appCategories.map((c,i)=>{const section=sections[i];return <section className="collection-category" key={c.slug}><div><span className="collection-eyebrow">{String(i+1).padStart(2,'0')} / APPLICATION EXPERIENCES</span><h2>{c.title}</h2><p>{section?.body}</p><ul>{section?.items?.map(item=><li key={item}>{item}</li>)}</ul><Link className="work-project-link" href={`/portfolio/projects/mobile-apps/${c.slug}`}>Let&apos;s build something like this <span>&#8599;</span></Link></div><CmsImage src={section?.image||['/banners/retail.svg','/banners/mobile.svg','/banners/medical.svg','/banners/web.svg','/banners/travel.svg'][i]} alt={section?.imageAlt||c.title} width={650} height={480}/></section>})}</div>:<><div className="collection-grid">{projects.map((p,i)=><article className="collection-card" key={p.id}><div className="collection-card-art">{p.image&&<CmsImage src={p.image} alt={p.title} width={900} height={600}/>}<span>{String(i+1).padStart(2,'0')}</span></div><div className="collection-card-copy"><h2>{p.title}</h2><p>{p.description}</p>{p.url?<a href={p.url} target="_blank" rel="noopener noreferrer" className="work-project-link">View project <span>&#8599;</span></a>:<Link href={`/contact?interest=${encodeURIComponent(selected?.title??p.title)}`} className="work-project-link">Discuss this app <span>&#8599;</span></Link>}</div></article>)}</div>{!projects.length&&<section className="collection-empty"><h2>Your next idea could be here.</h2><p>No projects have been published in this category yet.</p><Link className="work-project-link" href={`/contact?interest=${encodeURIComponent(selected?.title??service.title)}`}>Discuss your project <span>&#8599;</span></Link></section>}</>}
 </main>;
}
