'use client';
import { useLayoutEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ScanEye, Workflow, BrainCircuit, Bot, Network, FileSearch, ChartNoAxesCombined, Compass } from 'lucide-react';
import { CmsText, LocalText, useEditedList } from '@/components/cms/ContentProvider';
import { aiSolutions, visionSolutions } from '@/content/ai-solutions';
import './ai-experience.css';
const Scene=dynamic(()=>import('./IntelligenceScene'),{ssr:false});
const icons=[Compass,Workflow,BrainCircuit,Bot,Network,FileSearch,ChartNoAxesCombined];
gsap.registerPlugin(ScrollTrigger);

export default function AIExperience({title,intro}:{title:string;intro:string}){
 const root=useRef<HTMLDivElement>(null);const robotProgress=useRef(0);const eyeProgress=useRef(0);const reduce=useReducedMotion();
 const [active,setActive]=useState(0);const solutions=useEditedList('ai.solutions',aiSolutions);const vision=useEditedList('ai.vision',visionSolutions);
 // Expanded copy changes document height; keep the following pinned scene aligned.
 useLayoutEffect(()=>{const frame=requestAnimationFrame(()=>ScrollTrigger.refresh());return()=>cancelAnimationFrame(frame);},[active]);
 useLayoutEffect(()=>{
  const el=root.current;if(!el)return;const mm=gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)',()=>{
   const hero=el.querySelector('.ai-hero');const portal=el.querySelector('.ai-portal');const state={p:0};
   const heroTween=gsap.to(robotProgress,{current:1,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:1}});
   const timeline=gsap.timeline({scrollTrigger:{trigger:portal,start:'top top',end:()=>'+='+Math.round(window.innerHeight*2.2),pin:true,scrub:.8,invalidateOnRefresh:true}});
   timeline.to(state,{p:1,duration:1,ease:'none',onUpdate:()=>{eyeProgress.current=state.p;}},0)
    .to(el.querySelector('.ai-portal-intro'),{opacity:0,y:-35,duration:.2},.18)
    .fromTo(el.querySelector('.ai-portal-black'),{opacity:0},{opacity:1,duration:.18},.72)
    .fromTo(el.querySelector('.ai-portal-arrival'),{autoAlpha:0,y:28},{autoAlpha:1,y:0,duration:.18},.82);
   const cards=gsap.utils.toArray<HTMLElement>('.ai-solution-card',el);
   const reveals=cards.map(card=>gsap.fromTo(card,{y:45,opacity:.25},{y:0,opacity:1,duration:.8,ease:'power3.out',scrollTrigger:{trigger:card,start:'top 90%',once:true}}));
   return()=>{heroTween.scrollTrigger?.kill();heroTween.revert();timeline.scrollTrigger?.kill();timeline.revert();reveals.forEach(t=>{t.scrollTrigger?.kill();t.revert();});robotProgress.current=0;eyeProgress.current=0;};
  });return()=>mm.revert();
 },[]);
 const SelectedIcon=icons[active];
 return <div className="ai-experience" ref={root}>
  <section className="ai-hero">
   <div className="ai-grid" aria-hidden="true"/>
   <div className="ai-hero-copy"><div className="ai-kicker"><span/><LocalText text="YELLOSTACK / INTELLIGENCE"/></div>
    <h1>{title}<span><CmsText id="ai.hero.heading" fallback="Human ambition. Supercharged."/></span></h1>
    <p>{intro}</p><p className="ai-hero-description"><CmsText id="ai.hero.description" fallback="Practical intelligence. Thoughtful automation. Built for the way your business works."/></p>
    <div className="ai-actions"><Link href="/contact"><LocalText text="LET’S BUILD TOGETHER"/><ArrowUpRight size={18}/></Link><a href="#ai-solutions"><LocalText text="Explore solutions"/><span>↓</span></a></div>
   </div>
   <div className="ai-robot-stage"><Scene kind="robot" progress={robotProgress} active={active}/><span className="ai-model-label"><span/> YS—01 / <LocalText text="YOUR INTELLIGENCE PARTNER"/></span><p className="ai-model-hint"><LocalText text="Move your pointer. Meet your co-pilot."/></p></div>
   <div className="ai-hero-foot"><span><LocalText text="DESIGNED AROUND PEOPLE"/></span><span><LocalText text="SCROLL TO DISCOVER"/> ↓</span></div>
  </section>

  <section className="ai-solutions" id="ai-solutions">
   <header data-site-reveal><p className="ai-kicker"><LocalText text="01 / INTELLIGENCE IN ACTION"/></p><h2><CmsText id="ai.solutions.heading" fallback="Smarter business. Starts here."/></h2><p><CmsText id="ai.solutions.intro" fallback="Seven connected capabilities. One practical ambition: make AI useful for your people, processes and customers."/></p></header>
   <div className="ai-workbench">
    <div className="ai-console"><div className="ai-console-top"><span>YS / INTELLIGENCE ENGINE</span><span className="ai-status-dot"/></div><div className="ai-network" aria-hidden="true"><div className="ai-network-orbit"/><div className="ai-network-orbit second"/><motion.div key={active} initial={reduce?false:{scale:.85,rotate:-10}} animate={{scale:1,rotate:0}} className="ai-network-core"><SelectedIcon strokeWidth={1} size={76}/></motion.div>{[0,1,2,3].map(i=><span key={i} className={'ai-node ai-node-'+i}/>)}</div><div className="ai-console-text" aria-live="polite"><span>0{active+1} / 07</span><h3>{solutions[active].title}</h3><p>{solutions[active].signal}</p></div><div className="ai-console-bottom"><LocalText text="SELECT A CAPABILITY TO EXPLORE"/><span>↗</span></div></div>
    <div className="ai-solution-list">{solutions.map((item,i)=>{const Icon=icons[i];return <article className={'ai-solution-card '+(active===i?'is-active':'')} key={item.id}><button type="button" aria-expanded={active===i} aria-controls={'ai-detail-'+i} onClick={()=>setActive(i)} onFocus={()=>setActive(i)}><span className="ai-card-number">0{i+1}</span><Icon size={24} strokeWidth={1.3}/><h3>{item.title}</h3><span className="ai-card-plus">{active===i?'−':'+'}</span></button><div id={'ai-detail-'+i} hidden={active!==i}><p>{item.body}</p><Link href={'/contact?service='+encodeURIComponent(aiSolutions[i].title)}><LocalText text="Discuss this solution"/> <ArrowUpRight size={15}/></Link></div></article>;})}</div>
   </div>
  </section>

  <section className="ai-portal" aria-label="Computer vision introduction">
   <div className="ai-portal-intro"><p className="ai-kicker"><LocalText text="02 / A DIFFERENT WAY TO SEE"/></p><h2><CmsText id="ai.vision.portal" fallback="Beyond looking. Understanding."/></h2><p><LocalText text="Scroll into computer vision"/> ↓</p></div>
   <div className="ai-eye-stage"><Scene kind="eye" progress={eyeProgress}/></div>
   <div className="ai-portal-black" aria-hidden="true"/>
   <div className="ai-portal-arrival"><ScanEye size={40} strokeWidth={1}/><h2><CmsText id="ai.vision.arrival" fallback="From pixels to possibility."/></h2><p><LocalText text="Computer vision solutions"/></p><a href="#computer-vision"><LocalText text="Explore solutions"/> ↓</a></div>
  </section>

  <section className="ai-vision" id="computer-vision"><header data-site-reveal><p className="ai-kicker"><LocalText text="COMPUTER VISION"/></p><h2><CmsText id="ai.vision.heading" fallback="Give your operations a new perspective."/></h2><p><CmsText id="ai.vision.intro" fallback="Turn visual inputs into structured information. We design computer vision around your environment, data and the decisions your team needs to make."/></p></header>
   <div className="ai-vision-grid"><div className="ai-detection" aria-hidden="true"><span className="ai-demo-label"><LocalText text="ILLUSTRATIVE INSPECTION VIEW"/></span><div className="ai-scan-line"/><div className="ai-detected-object"><i/><i/><i/></div><div className="ai-detection-box"><span>OBJECT / 01</span><i/><i/><i/><i/></div><div className="ai-detection-coordinates">X: 024 · Y: 108<br/>VISION / YS</div></div><div>{vision.map((item,i)=><article data-site-reveal key={i}><span>0{i+1}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></div>
  </section>

  <section className="ai-industrial"><div data-site-reveal><p className="ai-kicker"><LocalText text="03 / CONNECTED OPERATIONS"/></p><h2><CmsText id="ai.industrial.heading" fallback="Intelligence that moves into action."/></h2><p><CmsText id="ai.industrial.body" fallback="Connect industrial systems, visual inspection and operational data. Build monitored workflows with clear human oversight, exception handling and a phased path from pilot to production."/></p><Link href="/contact"><LocalText text="Talk industrial automation"/> <ArrowUpRight size={20}/></Link></div><div className="ai-flow" aria-label="Industrial automation workflow">{['Sense','Understand','Act'].map((label,i)=><motion.div key={label} initial={reduce?false:{opacity:.2,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.5}} transition={{duration:.7,delay:i*.15}}><span>0{i+1}</span><Workflow size={42} strokeWidth={1}/><h3><LocalText text={label}/></h3></motion.div>)}</div></section>
 </div>;
}
