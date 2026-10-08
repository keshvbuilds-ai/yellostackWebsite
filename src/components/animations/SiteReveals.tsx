'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
export default function SiteReveals(){
 const pathname=usePathname();
 useEffect(()=>{
  if(pathname.startsWith('/admin'))return;
  const mm=gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)',()=>{
   const animations:gsap.core.Tween[]=[];const seen=new WeakSet<Element>();
   const io=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;const node=entry.target;io.unobserve(node);animations.push(gsap.fromTo(node,{opacity:.1,translateY:24},{opacity:1,translateY:0,duration:.8,ease:'power3.out',clearProps:'opacity,translateY'}));}},{threshold:.08});
   const discover=()=>{document.querySelectorAll('.ys-inner-detail > div, .ys-inner-body article, [data-site-reveal], footer > div, .ys-contact-form > div').forEach(node=>{if(seen.has(node))return;seen.add(node);io.observe(node);});};
   discover();const observer=new MutationObserver(discover);observer.observe(document.body,{childList:true,subtree:true});
   return()=>{observer.disconnect();io.disconnect();animations.forEach(a=>a.revert());};
  });return()=>mm.revert();
 },[pathname]);return null;
}
