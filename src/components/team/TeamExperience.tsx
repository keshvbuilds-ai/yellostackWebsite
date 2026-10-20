'use client';
import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CmsImage, CmsText, LocalText, useContent } from '@/components/cms/ContentProvider';
import './team-experience.css';
import {defaultContent} from '@/lib/cms/defaults';

export default function TeamExperience() {
 const content=useContent();
 const root=useRef<HTMLElement>(null);const people=useRef<HTMLElement>(null);
 useLayoutEffect(()=>{
  gsap.registerPlugin(ScrollTrigger);
  const media=gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)',()=>{
   const ctx=gsap.context(()=>{
    const timeline=gsap.timeline({scrollTrigger:{trigger:root.current,start:'top top',end:()=>`+=${window.innerHeight*2.8}`,pin:true,scrub:1,invalidateOnRefresh:true}});
    timeline.fromTo('.team-id-assembly',{yPercent:-45,rotationZ:-12,rotationY:-22,autoAlpha:0},{yPercent:0,rotationZ:0,rotationY:0,autoAlpha:1,duration:1,ease:'power2.out'})
     .to('.team-id-assembly',{rotationZ:3,duration:.4})
     .to('.team-id-assembly',{rotationZ:0,duration:.4})
     .to('.team-portal-intro',{opacity:0,duration:.4})
     .to('.team-id-assembly',{left:'50%',xPercent:-50,scale:9,rotationY:0,duration:1.5,ease:'power2.in'},'<')
     .fromTo('.team-portal-wash',{opacity:0},{opacity:1,duration:.35},'-=.55')
     .to('.team-id-assembly',{opacity:0,duration:.35},'-=.35')
     .to('.team-portal-wash',{backgroundColor:'#11180f',duration:.7},'-=.15')
     .to({}, {duration:.65});
   }, root.current!);return()=>ctx.revert();
  });return()=>media.revert();
 },[]);
 useEffect(()=>{
  const section=people.current;if(!section)return;
  const mm=gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)',()=>{
   const ctx=gsap.context(()=>{
    const cards=gsap.utils.toArray<HTMLElement>('.team-people-grid article');
    const track=section.querySelector<HTMLElement>('.team-people-grid');if(!track||!cards.length)return;
    const state={position:0};
    let cardWidth=0,center=0,step=0;
    const setters=cards.map(card=>({x:gsap.quickSetter(card,'x','px'),z:gsap.quickSetter(card,'z','px'),rotate:gsap.quickSetter(card,'rotationY','deg'),opacity:gsap.quickSetter(card,'opacity'),depth:gsap.quickSetter(card,'zIndex'),image:gsap.quickSetter(card.querySelector('img'),'xPercent'),blur:gsap.quickSetter(card.querySelector('.team-person-photo'),'filter'),caption:gsap.quickSetter(card.querySelector('.team-person-info'),'opacity'),captionY:gsap.quickSetter(card.querySelector('.team-person-info'),'y','px')}));
    gsap.set(cards,{force3D:true,transformPerspective:1200});
    const render=()=>{
     cards.forEach((card,i)=>{
      const offset=i-state.position,absolute=Math.abs(offset),distance=Math.min(1,absolute);
      // A continuous depth curve keeps neighboring portraits alive during travel.
      const focus=Math.exp(-absolute*absolute*2.8);
      setters[i].x(center-cardWidth/2+offset*step);
      setters[i].z(-240*(1-focus));
      setters[i].rotate(-Math.max(-1,Math.min(1,offset))*19);
      setters[i].opacity(1-distance*.28);
      setters[i].depth(Math.round(focus*100)+1);
      setters[i].image(-offset*2);
      setters[i].blur(`blur(${(1-focus)*5}px)`);
      const reveal=gsap.utils.clamp(0,1,(focus-.22)/.78);
      setters[i].caption(reveal);setters[i].captionY((1-reveal)*22);
     });
    };
    const measure=()=>{cardWidth=cards[0].offsetWidth;center=section.clientWidth/2;step=cardWidth*(section.clientWidth<760?1.12:1.8);render();};
    measure();if(cards.length===1)return;
    const tween=gsap.to(state,{position:cards.length-1,ease:'none',onUpdate:render,scrollTrigger:{trigger:section,start:'top top',end:()=>`+=${innerHeight*(cards.length-1)*1.15}`,pin:true,scrub:1.25,invalidateOnRefresh:true,onRefresh:measure}});
    const resize=new ResizeObserver(measure);resize.observe(section);
    return()=>{resize.disconnect();tween.scrollTrigger?.kill();tween.kill();};
   },section);return()=>ctx.revert();
  });return()=>mm.revert();
 },[content.teamMembers?.length]);
 return <><section ref={root} className="team-portal" data-no-gradient aria-label="Inside Yellostack">
  <div className="team-portal-intro"><p><CmsText id="team.entrance.label" fallback="YELLOSTACK / THE PEOPLE BEHIND THE IDEAS"/></p><h2><CmsText id="team.entrance.heading" fallback="Great work starts"/><br/><em><CmsText id="team.entrance.accent" fallback="with people."/></em></h2><p><LocalText text="SCROLL TO STEP INSIDE"/> ↓</p></div>
  <div className="team-id-assembly" aria-hidden="true"><div className="team-id-strap"><CmsImage src="/logoyelostack.png" alt="" width={140} height={60}/><span>YELLOSTACK</span></div><div className="team-id-clip"/><div className="team-id-card"><div className="team-id-slot"/><div className="team-id-brand"><CmsImage src="/logoyelostack.png" alt="" width={140} height={60}/><span>PEOPLE & CULTURE</span></div><div className="team-id-symbol"><i/><i/><i/></div><p>SAUDI-BORN. AI-DRIVEN.</p><h3>One team.<br/>Many possibilities.</h3><div className="team-id-bottom"><span>YELLOSTACK / ACCESS ALL IDEAS</span><span>01</span></div></div></div>
  <div className="team-portal-wash" aria-hidden="true"/>

  <p className="team-portal-scroll"><LocalText text="SCROLL TO STEP INSIDE"/> ↓</p>
 </section>  <div id="team-profile-space" className="team-portal-destination"><p className="team-portal-kicker"><LocalText text="INSIDE YELLOSTACK"/></p><h2><CmsText id="team.portal.title" fallback="The people. The possibilities."/></h2><p><CmsText id="team.portal.body" fallback="Engineers, designers and technology specialists. Different perspectives, working together to build intelligent technology."/></p></div><section ref={people} className="team-people team-people-slider" data-no-gradient><header><p>YELLOSTACK / OUR PEOPLE</p><h2><CmsText id="team.people.heading" fallback="People who make it possible."/></h2></header><div className="team-people-grid">{(content.teamMembers??defaultContent.teamMembers!).map((person,i)=><article key={i} className={i===0?'team-person-featured':'team-person-secondary'}><div className="team-person-photo"><CmsImage cmsPath={['teamMembers',String(i),'image']} src={person.image||'/team/placeholder-saudi.svg'} alt={person.demo?'Illustrated placeholder portrait':person.name} width={406} height={419}/>{person.demo&&<span>DEMO PROFILE</span>}</div><div className="team-person-info"><span className="team-person-index">0{i+1} / {person.demo?'PREVIEW':'LEADERSHIP'}</span><p className="team-person-role"><span data-cms-path={JSON.stringify(['teamMembers',String(i),'role'])}>{person.role}</span></p><h3><span data-cms-path={JSON.stringify(['teamMembers',String(i),'name'])}>{person.name}</span></h3><p><span data-cms-path={JSON.stringify(['teamMembers',String(i),'bio'])}>{person.bio}</span></p></div></article>)}</div></section></>;
}
