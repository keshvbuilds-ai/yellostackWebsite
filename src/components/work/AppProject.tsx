"use client";
import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {useContent,CmsImage,LocalText} from '@/components/cms/ContentProvider';
import {appCategories,workProjects} from '@/content/work-catalogue';
import './project-collection.css';
export default function AppProject({id}:{id:string}){
 const project=workProjects(useContent()).find(p=>p.id===id);
 if(!project)return null;
 return <main className="project-collection app-detail" id="page-content" data-no-gradient><header className="app-detail-hero"><div><Link href="/portfolio/projects/mobile-apps"><LocalText text="All app experiences"/></Link><p className="collection-eyebrow"><LocalText text={appCategories.find(c=>c.slug===project.category)?.title??'Mobile app development'}/></p><h1><LocalText text={project.title}/></h1><p><LocalText text={project.description}/></p></div>{project.image&&<div className="app-detail-logo"><CmsImage src={project.image} alt={project.title} width={1000} height={800} priority/></div>}</header><div className="app-detail-content">{project.sections?.map((section,index)=><section key={index}>{section.heading&&<h2><LocalText text={section.heading}/></h2>}{section.body.split(/\n\s*\n/).filter(Boolean).map((paragraph,i)=><p key={i}><LocalText text={paragraph}/></p>)}{section.image&&<figure><CmsImage src={section.image} alt={section.imageAlt||project.title} width={1400} height={900}/>{section.imageAlt&&<figcaption><LocalText text={section.imageAlt}/></figcaption>}</figure>}</section>)}</div>{(project.playStoreUrl||project.appStoreUrl)&&<section className="app-store-panel"><div><p className="collection-eyebrow"><LocalText text="TAKE THE NEXT STEP"/></p><h2><LocalText text="Experience the app"/></h2></div><div className="app-store-links">{[[project.playStoreUrl,'Get it on Google Play'],[project.appStoreUrl,'Download on the App Store']].map(([url,label])=>url&&<a className="work-project-link" key={label} href={url} target="_blank" rel="noopener noreferrer"><LocalText text={label!}/><ArrowUpRight size={20}/></a>)}</div></section>}</main>;
}
