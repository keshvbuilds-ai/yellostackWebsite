'use client';
import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {CmsImage,LocalText,useContent} from '@/components/cms/ContentProvider';
import './oracle-apex.css';
export default function OracleApex(){
 const content=useContent(),index=content.pages.findIndex(p=>p.slug==='oracle-apex'),page=content.pages[index];
 if(!page)return null;
 const path=(...parts:string[])=>JSON.stringify(['pages',String(index),...parts]);
 return <main id="page-content" className="oracle-page" data-no-gradient>
 <section className="oracle-hero"><div><p className="oracle-kicker" data-cms-path={path('eyebrow')}>{page.eyebrow}</p><h1 data-cms-path={path('title')}>{page.title}</h1><p className="oracle-intro" data-cms-path={path('intro')}>{page.intro}</p><Link href="/contact?interest=Oracle%20APEX" className="oracle-button"><LocalText text="Discuss your Oracle APEX project"/><ArrowUpRight size={22}/></Link></div><div className="oracle-brand"><CmsImage src="/oracle-logo.svg" alt="Oracle" width={324} height={68} priority/><span>APEX</span><p><LocalText text="Enterprise applications. Simplified."/></p><div className="oracle-brand-grid" aria-hidden="true"><i/><i/><i/><i/><i/><i/></div></div></section>
 <div className="oracle-sections">{page.sections.map((section,i)=><section className="oracle-section" key={i}><div><span className="oracle-number">{String(i+1).padStart(2,'0')}</span><h2 data-cms-path={path('sections',String(i),'title')}>{section.title}</h2></div><div><p data-cms-path={path('sections',String(i),'body')}>{section.body}</p>{section.items&&<ul>{section.items.map((item,j)=><li key={j} data-cms-path={path('sections',String(i),'items',String(j))}>{item}</li>)}</ul>}{section.image&&<CmsImage cmsPath={['pages',String(index),'sections',String(i),'image']} src={section.image} alt={section.imageAlt||section.title} width={1000} height={650}/>}</div></section>)}</div>
 {page.partner&&<aside className="oracle-partner"><div><p className="oracle-kicker"><LocalText text="OUR PARTNER"/></p><h2 data-cms-path={path('partner','title')}>{page.partner.title}</h2><p data-cms-path={path('partner','body')}>{page.partner.body}</p></div><a className="oracle-button" href={page.partner.url} target="_blank" rel="noopener noreferrer"><span data-cms-path={path('partner','buttonLabel')}>{page.partner.buttonLabel}</span><ArrowUpRight size={22} aria-hidden="true"/></a></aside>}
 </main>;
}
