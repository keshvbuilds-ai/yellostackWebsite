'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './scroll-text-gradient.css';
gsap.registerPlugin(ScrollTrigger);

export default function ScrollTextGradient(){
 const pathname=usePathname();
 useEffect(()=>{
  if(pathname.startsWith('/admin'))return;
  const media=gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference) and (forced-colors: none)',()=>{
   const entries=new Map<HTMLElement,gsap.core.Tween>();
   // Preserve interactive controls, yellow panels and scene-owned text rendering.
   const exclude='nav,form,button,a,label,[role=button],.process-list,.profile-purpose,.journey-words,.journey-end,.layer-gallery-track,.convergence-copy,.team-id-card,.team-person-featured,.gm-message,.medical-service-card,.client-invitation,.industry-cta,.work-opening';
   const discover=()=>{
    for(const [node,tween] of entries)if(!node.isConnected){tween.scrollTrigger?.kill();tween.kill();entries.delete(node);}
    document.querySelectorAll<HTMLElement>('main h1,main h2,main h3,main p,footer h2,footer h3,footer p').forEach(node=>{
     if(entries.has(node)||node.closest(exclude)||!node.textContent?.trim()||node.querySelector('a,button,input,canvas,svg,img'))return;
     const color=getComputedStyle(node).color;
     // Dark text receives a deeper amber accent, retaining contrast on pale surfaces.
     const rgb=color.match(/[\d.]+/g)?.slice(0,3).map(Number)||[240,240,240];
     const dark=rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722<145;
     node.style.setProperty('--text-base',color);
     node.style.setProperty('--text-gold',dark?'#806000':'#ffcc02');
     node.style.setProperty('--text-highlight',dark?'#936c00':'#ffe985');
     node.classList.add('scroll-gold-text');
     const tween=gsap.fromTo(node,{'--gold-position':'100%'},{'--gold-position':'0%',ease:'none',scrollTrigger:{trigger:node,start:'top 95%',end:'bottom 20%',scrub:.65,invalidateOnRefresh:true}});
     entries.set(node,tween);
    });
   };
   discover();let frame=0;
   const observer=new MutationObserver(records=>{
    if(frame||!records.some(record=>[...record.addedNodes,...record.removedNodes].some(node=>node.nodeType===1)))return;
    frame=requestAnimationFrame(()=>{frame=0;discover();});
   });observer.observe(document.body,{childList:true,subtree:true});
   return()=>{cancelAnimationFrame(frame);observer.disconnect();entries.forEach((tween,node)=>{tween.scrollTrigger?.kill();tween.kill();node.classList.remove('scroll-gold-text');['--text-base','--text-gold','--text-highlight','--gold-position'].forEach(key=>node.style.removeProperty(key));});};
  });return()=>media.revert();
 },[pathname]);
 return null;
}
