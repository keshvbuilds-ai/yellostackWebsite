'use client';
import {useEffect,useRef} from 'react';
import Link from 'next/link';
import {ArrowUpRight,ArrowDown,Layers3} from 'lucide-react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {LocalText,CmsText} from '@/components/cms/ContentProvider';
import './work.css';
import WorkJourney from './WorkJourney';
gsap.registerPlugin(ScrollTrigger);
type Section={title:string;body:string;items?:string[];image?:string;imageAlt?:string};
export default function WorkExperience({title,intro,sections}:{title:string;intro:string;sections:Section[]}){
 const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{const media=gsap.matchMedia();media.add('(prefers-reduced-motion: no-preference)',()=>{const ctx=gsap.context(()=>{
 gsap.from('.work-opening-content>*',{y:32,opacity:0,duration:1,stagger:.12,ease:'power3.out'});
 gsap.to('.work-outline-stack',{y:100,rotation:8,ease:'none',scrollTrigger:{trigger:'.work-opening',start:'top top',end:'bottom top',scrub:1}});
 }, root.current!);return()=>ctx.revert();});return()=>media.revert();},[]);
 return <div ref={root} className="work-experience">
 <section className="work-opening"><div className="work-outline-stack" aria-hidden="true"><i/><i/><i/><i/></div><div className="work-opening-content"><span className="work-pill"><Layers3 size={15}/><CmsText id="work.labels.0" fallback="YELLOSTACK / WORK & POSSIBILITIES"/></span><h1>{title}</h1><p>{intro}</p><div className="work-jump-links">{sections.map((s,i)=><a key={i} href={`/portfolio/projects/mobile-apps/${['grocery-delivery','education','healthcare','custom-web-applications','booking-on-demand'][i]}`}><span>0{i+1}</span>{s.title}<ArrowUpRight size={15}/></a>)}</div><a className="work-down" href="#selected-work" aria-label="Explore selected work"><ArrowDown size={22}/></a></div></section>
 <WorkJourney/>
 <section className="work-approach"><div><span className="work-eyebrow"><CmsText id="work.approach.4" fallback="THE YELLOSTACK APPROACH"/></span><h2><CmsText id="work.approach.5" fallback="One team. From idea to experience."/></h2></div><div className="work-approach-grid">{[['Understand','Start with your people, your goals and the way your business works.'],['Design','Connect thoughtful interfaces with clear, practical customer journeys.'],['Build','Bring software, applications and integrations into one connected experience.']].map(([heading,body],i)=><article key={heading}><span>0{i+1}</span><h3><LocalText text={heading}/></h3><p><LocalText text={body}/></p></article>)}</div></section>
 <section className="work-contact"><span className="work-eyebrow"><CmsText id="work.contact.6" fallback="YOUR NEXT CHAPTER"/></span><h2><CmsText id="work.contact.7" fallback="Let’s shape what comes next."/></h2><p><CmsText id="work.contact.8" fallback="Bring us your idea. We’ll explore the right experience, technology and path forward together."/></p><Link href="/contact" className="work-link"><CmsText id="work.contact.9" fallback="Start a conversation"/><ArrowUpRight size={22}/></Link></section>
 </div>;
}
