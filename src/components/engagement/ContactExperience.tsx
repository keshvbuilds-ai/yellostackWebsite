'use client';
import OfficeMap from '../OfficeMap';
import { LocalText,CmsText } from '@/components/cms/ContentProvider';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import dynamic from 'next/dynamic';
const HandshakeScene=dynamic(()=>import('./HandshakeScene'),{ssr:false});
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LeadForm, RewardTicket } from './Rewards';
import { useSiteData } from '../cms/ContentProvider';
import './engagement.css';
import './contact-story.css';
gsap.registerPlugin(ScrollTrigger);

export default function ContactExperience(){
 const progress=useRef({value:0});
 const section=useRef<HTMLElement>(null);const form=useRef<HTMLElement>(null);
 const [mode,setMode]=useState(false);const [greeted,setGreeted]=useState(false);const site=useSiteData();
 useEffect(()=>{try{setMode(localStorage.getItem('yellostack-mode')==='on');}catch{}},[]);
 useEffect(()=>{
  const mm=gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)',()=>{
   const context=gsap.context(()=>{
    gsap.set('.contact-story-copy',{autoAlpha:0,y:22});
    gsap.set('.contact-story-progress span',{scaleX:0,transformOrigin:'left'});
    const tl=gsap.timeline({scrollTrigger:{trigger:section.current,start:'top top',end:'bottom bottom',scrub:.65,invalidateOnRefresh:true}});
    tl.to(progress.current,{value:1,duration:6,ease:'none'},0)
      .fromTo('.contact-story-copy:nth-child(1)',{x:32,y:15,autoAlpha:0},{x:0,y:0,autoAlpha:1,duration:.5},.55)
      .to('.contact-story-copy:nth-child(1)',{autoAlpha:0,y:-18,duration:.35},1.8)
      .fromTo('.contact-story-copy:nth-child(2)',{x:-32,y:15,autoAlpha:0},{x:0,y:0,autoAlpha:1,duration:.5},2.35)
      .to('.contact-story-copy:nth-child(2)',{autoAlpha:0,y:-18,duration:.3},4.2)
      .to('.contact-story-copy:nth-child(3)',{autoAlpha:1,y:0,duration:.6},4.5)
      .to('.contact-story-seal',{autoAlpha:1,scale:1,duration:.5},5.1)
      .to('.contact-story-progress span',{scaleX:1,duration:6,ease:'none'},0);
    gsap.from(form.current,{y:35,opacity:.4,duration:.7,scrollTrigger:{trigger:form.current,start:'top 95%',toggleActions:'play none none reverse'}});
   }, section.current!);
   return()=>context.revert();
  });
  return()=>mm.revert();
 },[]);
 return <><section ref={section} className="contact-story" aria-label="Your challenge, our shared solution"><div className="contact-story-stage">
 <div className="contact-story-top"><span><i/><CmsText id="contact.story.0" fallback="PEOPLE FIRST. ALWAYS."/></span><span><CmsText id="contact.story.1" fallback="THE START OF SOMETHING GOOD"/></span></div>
 <div className="contact-story-headings">
  <div className="contact-story-copy"><span className="contact-story-step"><CmsText id="contact.story.2" fallback="01 / YOUR CHALLENGE"/></span><h2><em><CmsText id="contact.story.3" fallback="I have a challenge."/></em><br/><CmsText id="contact.story.4" fallback="I need an engineered solution."/></h2><p><CmsText id="contact.story.5" fallback="Your ambition deserves more than a quick fix."/></p></div>
  <div className="contact-story-copy"><span className="contact-story-step"><CmsText id="contact.story.6" fallback="02 / OUR COMMITMENT"/></span><h2><em><CmsText id="contact.story.7" fallback="You’re in good hands."/></em><br/><CmsText id="contact.story.8" fallback="We’ll solve it, together."/></h2><p><CmsText id="contact.story.9" fallback="We listen first. Then design and engineer a way forward."/></p></div>
  <div className="contact-story-copy"><span className="contact-story-step"><CmsText id="contact.story.10" fallback="03 / BETTER, TOGETHER"/></span><h2><em><CmsText id="contact.story.11" fallback="Your challenge. Our commitment."/></em><br/><CmsText id="contact.story.12" fallback="A partnership built on trust."/></h2><p><CmsText id="contact.story.13" fallback="Let’s turn the next conversation into real progress."/></p></div>
 </div>
 <HandshakeScene progress={progress}/>
 <div className="contact-story-seal" aria-hidden="true"><CmsText id="contact.story.14" fallback="YELLOSTACK"/><br/><strong><CmsText id="contact.story.15" fallback="Built on trust."/></strong></div>
 <div className="contact-story-bottom"><span><CmsText id="contact.story.16" fallback="SCROLL TO CONNECT ↓"/></span><a href="#project-form"><CmsText id="contact.story.17" fallback="LET’S TALK ABOUT YOUR IDEA ↗"/></a></div><div className="contact-story-progress" aria-hidden="true"><span/></div>
 </div></section>
 <section ref={form} id="project-form" className="ys-contact-form scroll-mt-28"><div className="grid gap-12 md:grid-cols-2"><div><p className="mb-6 font-mono text-xs text-[#ffcf00]"><CmsText id="contact.form.18" fallback="LET’S START SOMETHING"/></p><h2 className="text-4xl tracking-tight md:text-6xl"><CmsText id="contact.form.19" fallback="Your next chapter"/><br/><CmsText id="contact.form.20" fallback="starts here."/></h2><button type="button" role="switch" aria-checked={mode} className="ys-mode-switch mt-8" onClick={()=>{const next=!mode;setMode(next);setGreeted(false);try{localStorage.setItem('yellostack-mode',next?'on':'off');}catch{}}}><i aria-hidden="true"/><CmsText id="contact.form.21" fallback="YELLOSTACK MODE"/><LocalText text={mode?'ON':'OFF'}/></button>{mode&&!greeted&&<div className="my-6"><RewardTicket greeting onTear={()=>setGreeted(true)}/></div>}{mode&&greeted&&<p className="my-6 text-[#ffcf00]" role="status"><CmsText id="contact.form.22" fallback="Welcome inside. Let’s put your idea in motion."/></p>}<a className="mt-8 block break-all underline" href={`mailto:${site.contact.email}`}>{site.contact.email}</a><a className="mt-4 block" href={site.contact.telephoneHref}>{site.contact.telephone}</a><OfficeMap/></div><LeadForm mode={mode}/></div></section></>;
}
