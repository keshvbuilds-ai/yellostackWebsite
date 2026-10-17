'use client';
import { useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export default function SmoothScroll({children}:{children:ReactNode}) {
 const pathname=usePathname();
 useEffect(()=>{
  if(pathname.startsWith('/admin'))return;
  const media=gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)',()=>{
   const lenis=new Lenis({duration:1.05,anchors:{offset:-110},easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)),smoothWheel:true,wheelMultiplier:.95,syncTouch:false});
   const jump=(event:Event)=>{const y=(event as CustomEvent<{y:number}>).detail.y;event.preventDefault();lenis.resize();lenis.scrollTo(y,{duration:1.2,force:true});};
   window.addEventListener('ys:page-jump',jump);
   lenis.on('scroll',ScrollTrigger.update);
   const tick=(seconds:number)=>lenis.raf(seconds*1000);
   gsap.ticker.add(tick);
   let alive=true;
   document.fonts.ready.then(()=>{if(alive){lenis.resize();ScrollTrigger.refresh();}});
   return()=>{window.removeEventListener('ys:page-jump',jump);alive=false;gsap.ticker.remove(tick);lenis.off('scroll',ScrollTrigger.update);lenis.destroy();};
  });return()=>media.revert();
 },[pathname]);
 return <>{children}</>;
}
