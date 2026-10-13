'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CmsImage, CmsText, LocalText } from '@/components/cms/ContentProvider';
import './team-experience.css';

export default function TeamExperience() {
 const root=useRef<HTMLElement>(null);
 useEffect(()=>{
  gsap.registerPlugin(ScrollTrigger);
  const media=gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)',()=>{
   const ctx=gsap.context(()=>{
    const timeline=gsap.timeline({scrollTrigger:{trigger:root.current,start:'top top',end:()=>`+=${window.innerHeight*2.8}`,pin:true,scrub:1,invalidateOnRefresh:true}});
    timeline.fromTo('.team-id-assembly',{yPercent:-45,rotationZ:-12,rotationY:-22,opacity:0},{yPercent:0,rotationZ:0,rotationY:0,opacity:1,duration:1,ease:'power2.out'})
     .to('.team-id-assembly',{rotationZ:3,duration:.4})
     .to('.team-id-assembly',{rotationZ:0,duration:.4})
     .to('.team-portal-intro',{opacity:0,duration:.4})
     .to('.team-id-assembly',{scale:7,rotationY:0,duration:1.5,ease:'power2.in'},'<')
     .to('.team-id-assembly',{opacity:0,duration:.35},'-=.35')
     .fromTo('.team-portal-destination',{autoAlpha:0,y:35},{autoAlpha:1,y:0,duration:.7})
     .to({}, {duration:.65});
   },root);return()=>ctx.revert();
  });return()=>media.revert();
 },[]);
 return <section ref={root} className="team-portal" data-no-gradient aria-label="Inside Yellostack">
  <div className="team-portal-intro"><p><LocalText text="YELLOSTACK / THE PEOPLE BEHIND THE IDEAS"/></p><h2><LocalText text="Great work starts"/><br/><em><LocalText text="with people."/></em></h2><p><LocalText text="SCROLL TO STEP INSIDE"/> ↓</p></div>
  <div className="team-id-assembly" aria-hidden="true"><div className="team-id-strap"><CmsImage src="/logoyelostack.png" alt="" width={140} height={60}/><span>YELLOSTACK</span></div><div className="team-id-clip"/><div className="team-id-card"><div className="team-id-slot"/><div className="team-id-brand"><CmsImage src="/logoyelostack.png" alt="" width={140} height={60}/><span>PEOPLE & CULTURE</span></div><div className="team-id-symbol"><i/><i/><i/></div><p>SAUDI-BORN. AI-DRIVEN.</p><h3>One team.<br/>Many possibilities.</h3><div className="team-id-bottom"><span>YELLOSTACK / ACCESS ALL IDEAS</span><span>01</span></div></div></div>
  <div id="team-profile-space" className="team-portal-destination"><p className="team-portal-kicker"><LocalText text="INSIDE YELLOSTACK"/></p><h2><CmsText id="team.portal.title" fallback="The people. The possibilities."/></h2><p><CmsText id="team.portal.body" fallback="Engineers, designers and technology specialists. Different perspectives, working together to build intelligent technology."/></p><div className="team-profile-frame"><span aria-hidden="true">Y / S</span><div><h3><CmsText id="team.portal.profileTitle" fallback="Our people, in focus."/></h3><p><CmsText id="team.portal.profileBody" fallback="Meet the team behind your next chapter."/></p></div></div></div>
  <p className="team-portal-scroll"><LocalText text="SCROLL TO STEP INSIDE"/> ↓</p>
 </section>;
}
