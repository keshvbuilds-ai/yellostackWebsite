'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LeadForm, RewardTicket } from './Rewards';
import { useSiteData } from '../cms/ContentProvider';
import './engagement.css';
import './contact-story.css';
gsap.registerPlugin(ScrollTrigger);

// Render each photograph from the supplied storyboard without modifying the original asset.
function HandFrame({frame,className}:{frame:number;className:string}) {
 return <div className={className}><svg viewBox={[5,924,1840][frame]+' 390 905 650'} aria-hidden="true" focusable="false"><image href="/contact/human-handshake.png" width="2752" height="1536"/></svg></div>;
}
export default function ContactExperience(){
 const section=useRef<HTMLElement>(null);const form=useRef<HTMLElement>(null);
 const [mode,setMode]=useState(false);const [greeted,setGreeted]=useState(false);const site=useSiteData();
 useEffect(()=>{try{setMode(localStorage.getItem('yellostack-mode')==='on');}catch{}},[]);
 useEffect(()=>{
  const mm=gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)',()=>{
   const context=gsap.context(()=>{
    gsap.set('.contact-customer',{xPercent:110,rotation:4,autoAlpha:1});
    gsap.set('.contact-employee',{xPercent:-110,rotation:-4,autoAlpha:1});
    gsap.set('.contact-handshake',{autoAlpha:0,scale:.97});
    gsap.set('.contact-story-copy:not(:first-child)',{autoAlpha:0,y:22});
    gsap.set('.contact-story-progress span',{scaleX:0,transformOrigin:'left'});
    const tl=gsap.timeline({scrollTrigger:{trigger:section.current,start:'top top',end:'bottom bottom',scrub:.65,invalidateOnRefresh:true}});
    tl.to('.contact-customer',{xPercent:0,rotation:0,duration:1.8,ease:'power2.out'},0)
      .to('.contact-story-copy:nth-child(1)',{autoAlpha:0,y:-18,duration:.35},1.8)
      .to('.contact-story-copy:nth-child(2)',{autoAlpha:1,y:0,duration:.45},2.05)
      .to('.contact-employee',{xPercent:0,rotation:0,duration:1.8,ease:'power2.out'},2)
      .to('.contact-customer',{xPercent:-9,duration:.65,ease:'power2.inOut'},3.6)
      .to('.contact-employee',{xPercent:9,duration:.65,ease:'power2.inOut'},3.6)
      .to(['.contact-customer','.contact-employee'],{autoAlpha:0,duration:.25},4.12)
      .to('.contact-handshake',{autoAlpha:1,scale:1,duration:.3},4.12)
      .to('.contact-story-copy:nth-child(2)',{autoAlpha:0,y:-18,duration:.3},4.2)
      .to('.contact-story-copy:nth-child(3)',{autoAlpha:1,y:0,duration:.4},4.5)
      .to('.contact-handshake',{y:-12,rotation:-1,duration:.25,ease:'sine.inOut'},4.55)
      .to('.contact-handshake',{y:10,rotation:1,duration:.4,ease:'sine.inOut'},4.8)
      .to('.contact-handshake',{y:0,rotation:0,duration:.4,ease:'sine.inOut'},5.2)
      .to('.contact-story-seal',{autoAlpha:1,scale:1,duration:.5},5.1)
      .to('.contact-story-progress span',{scaleX:1,duration:6,ease:'none'},0);
    gsap.from(form.current,{y:35,opacity:.4,duration:.7,scrollTrigger:{trigger:form.current,start:'top 95%',toggleActions:'play none none reverse'}});
   },section);
   return()=>context.revert();
  });
  return()=>mm.revert();
 },[]);
 return <><section ref={section} className="contact-story" aria-label="Your challenge, our shared solution"><div className="contact-story-stage">
 <div className="contact-story-top"><span><i/> PEOPLE FIRST. ALWAYS.</span><span>THE START OF SOMETHING GOOD</span></div>
 <div className="contact-story-headings">
  <div className="contact-story-copy"><span className="contact-story-step">01 / YOUR CHALLENGE</span><h2>Every great solution<br/>starts with <em>you.</em></h2><p>A challenge to solve. An idea to bring to life.<br/>Tell us what’s on your mind.</p></div>
  <div className="contact-story-copy"><span className="contact-story-step">02 / OUR COMMITMENT</span><h2>You bring the ambition.<br/>We bring <em>the team.</em></h2><p>We listen, understand and work alongside you.<br/>From the first question to the right solution.</p></div>
  <div className="contact-story-copy"><span className="contact-story-step">03 / BETTER, TOGETHER</span><h2>A shared vision.<br/>A real <em>partnership.</em></h2><p>Your challenges become our challenges.<br/>Let’s build what comes next, together.</p></div>
 </div>
 <div className="contact-story-art"><HandFrame frame={0} className="contact-customer"/><HandFrame frame={1} className="contact-employee"/><HandFrame frame={2} className="contact-handshake"/></div>
 <div className="contact-story-seal" aria-hidden="true">YELLOSTACK<br/><strong>Built on trust.</strong></div>
 <div className="contact-story-bottom"><span>SCROLL TO CONNECT ↓</span><a href="#project-form">LET’S TALK ABOUT YOUR IDEA ↗</a></div><div className="contact-story-progress" aria-hidden="true"><span/></div>
 </div></section>
 <section ref={form} id="project-form" className="ys-contact-form scroll-mt-28"><div className="grid gap-12 md:grid-cols-2"><div><p className="mb-6 font-mono text-xs text-[#ffcf00]">LET’S START SOMETHING</p><h2 className="text-4xl tracking-tight md:text-6xl">Your next chapter<br/>starts here.</h2><button type="button" role="switch" aria-checked={mode} className="ys-mode-switch mt-8" onClick={()=>{const next=!mode;setMode(next);setGreeted(false);try{localStorage.setItem('yellostack-mode',next?'on':'off');}catch{}}}><i aria-hidden="true"/>YELLOSTACK MODE {mode?'ON':'OFF'}</button>{mode&&!greeted&&<div className="my-6"><RewardTicket greeting onTear={()=>setGreeted(true)}/></div>}{mode&&greeted&&<p className="my-6 text-[#ffcf00]" role="status">Welcome inside. Let’s put your idea in motion.</p>}<a className="mt-8 block break-all underline" href={`mailto:${site.contact.email}`}>{site.contact.email}</a><a className="mt-4 block" href={site.contact.telephoneHref}>{site.contact.telephone}</a><p className="mt-5 max-w-sm text-sm leading-7 text-white/60">{site.contact.address}</p></div><LeadForm mode={mode}/></div></section></>;
}
