'use client';
import {useEffect,useRef} from 'react';
import Link from 'next/link';
import {ArrowUpRight,Check,ArrowDown,Layers3} from 'lucide-react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {LocalText} from '@/components/cms/ContentProvider';
import './work.css';
gsap.registerPlugin(ScrollTrigger);
type Section={title:string;body:string;items?:string[];image?:string;imageAlt?:string};
const visuals=['/banners/retail.svg','/banners/mobile.svg','/banners/medical.svg','/banners/web.svg','/banners/travel.svg'];
const features=[['Mobile commerce','Customer journeys','Connected operations'],['Learning experiences','Accessible interfaces','Content management'],['Service discovery','Appointment experiences','Connected healthcare'],['Custom workflows','Responsive interfaces','Business integration'],['Service discovery','Booking experiences','Mobile applications']];
export default function WorkExperience({title,intro,sections}:{title:string;intro:string;sections:Section[]}){
 const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{const media=gsap.matchMedia();media.add('(prefers-reduced-motion: no-preference)',()=>{const ctx=gsap.context(()=>{
 gsap.from('.work-opening-content>*',{y:32,opacity:0,duration:1,stagger:.12,ease:'power3.out'});
 gsap.to('.work-outline-stack',{y:100,rotation:8,ease:'none',scrollTrigger:{trigger:'.work-opening',start:'top top',end:'bottom top',scrub:1}});
 gsap.utils.toArray<HTMLElement>('.work-chapter').forEach(section=>{gsap.from(section.querySelector('.work-chapter-copy'),{y:42,opacity:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:section,start:'top 80%',once:true}});gsap.fromTo(section.querySelector('.work-visual-inner'),{y:35,scale:.94},{y:-20,scale:1.03,ease:'none',scrollTrigger:{trigger:section,start:'top bottom',end:'bottom top',scrub:1.2}});});
 }, root.current!);return()=>ctx.revert();});return()=>media.revert();},[]);
 return <div ref={root} className="work-experience">
 <section className="work-opening"><div className="work-outline-stack" aria-hidden="true"><i/><i/><i/><i/></div><div className="work-opening-content"><span className="work-pill"><Layers3 size={15}/><LocalText text="YELLOSTACK / WORK & POSSIBILITIES"/></span><h1>{title}</h1><p>{intro}</p><div className="work-jump-links">{sections.map((s,i)=><a key={i} href={`#work-area-${i}`}><span>0{i+1}</span>{s.title}<ArrowUpRight size={15}/></a>)}</div><a className="work-down" href="#work-area-0" aria-label="Explore application areas"><ArrowDown size={22}/></a></div></section>
 <div className="work-chapters">{sections.map((section,i)=><section id={`work-area-${i}`} className="work-chapter" key={i}><div className="work-chapter-copy"><span className="work-eyebrow">0{i+1} / <LocalText text="APPLICATION EXPERIENCES"/></span><h2>{section.title}</h2><p>{section.body}</p><ul>{(section.items||features[i%features.length]).map(item=><li key={item}><Check size={17}/><LocalText text={item}/></li>)}</ul><Link className="work-link" href="/contact"><LocalText text="Let’s build something like this"/><ArrowUpRight size={20}/></Link></div><div className={`work-visual work-visual-${i%3}`}><div className="work-visual-inner"><div className="work-browser-top"><span/><span/><span/><small>YELLOSTACK / DIGITAL</small></div><img src={section.image||visuals[i%visuals.length]} alt={section.imageAlt||''} width={650} height={520} loading="lazy"/><div className="work-visual-caption"><span>{section.title}</span><ArrowUpRight size={24}/></div></div><span className="work-concept"><LocalText text="APPLICATION CONCEPT"/></span></div></section>)}</div>
 <section className="work-approach"><div><span className="work-eyebrow"><LocalText text="THE YELLOSTACK APPROACH"/></span><h2><LocalText text="One team. From idea to experience."/></h2></div><div className="work-approach-grid">{[['Understand','Start with your people, your goals and the way your business works.'],['Design','Connect thoughtful interfaces with clear, practical customer journeys.'],['Build','Bring software, applications and integrations into one connected experience.']].map(([heading,body],i)=><article key={heading}><span>0{i+1}</span><h3><LocalText text={heading}/></h3><p><LocalText text={body}/></p></article>)}</div></section>
 <section className="work-contact"><span className="work-eyebrow"><LocalText text="YOUR NEXT CHAPTER"/></span><h2><LocalText text="Let’s shape what comes next."/></h2><p><LocalText text="Bring us your idea. We’ll explore the right experience, technology and path forward together."/></p><Link href="/contact" className="work-link"><LocalText text="Start a conversation"/><ArrowUpRight size={22}/></Link></section>
 </div>;
}
