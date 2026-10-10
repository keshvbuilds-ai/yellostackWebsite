'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import './premium-cursor.css';

/** One composited overlay; existing WebGL scenes keep ownership of pointer events. */
export default function PremiumCursor(){
 const root=useRef<HTMLDivElement>(null),dot=useRef<HTMLDivElement>(null),ring=useRef<HTMLDivElement>(null);
 const pathname=usePathname();
 useEffect(()=>{
  if(pathname.startsWith('/admin'))return;
  const media=gsap.matchMedia();
  media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',()=>{
   const el=root.current,d=dot.current,r=ring.current;if(!el||!d||!r)return;
   let initialized=false,mode='',visible=false,px=0,py=0;
   const context=gsap.context(()=>{gsap.set([d,r],{xPercent:-50,yPercent:-50});},el);
   const x=gsap.quickTo(r,'x',{duration:.28,ease:'power3.out'}),y=gsap.quickTo(r,'y',{duration:.28,ease:'power3.out'});
   const dx=gsap.quickSetter(d,'x','px'),dy=gsap.quickSetter(d,'y','px');
   const hide=()=>{visible=false;el.style.opacity='0';document.documentElement.classList.remove('ys-cursor-active');};
   const classify=(target:Element|null)=>{
    // Native text selection, embedded controls and the hero's hold cursor remain intact.
    if(!target||target.closest('input,textarea,select,[contenteditable=true],iframe,video,.journey-hero,dialog,[data-native-cursor]')){hide();return;}
    if(!visible){visible=true;el.style.opacity='1';document.documentElement.classList.add('ys-cursor-active');}
    const next=target.closest('a,button,summary,[role=button]')?'link':target.closest('canvas,[data-cursor=explore]')?'scene':'default';
    if(mode!==next){mode=next;el.dataset.mode=next;gsap.to(r,{scale:next==='link'?1.55:next==='scene'?1.9:1,duration:.3,ease:'power3.out',overwrite:'auto'});}
   };
   const move=(event:PointerEvent)=>{
    if(event.pointerType!=='mouse'){hide();return;}
    if(!initialized){gsap.set([d,r],{x:event.clientX,y:event.clientY});initialized=true;}
    px=event.clientX;py=event.clientY;dx(event.clientX);dy(event.clientY);x(event.clientX);y(event.clientY);classify(event.target as Element);
   };
   const scroll=()=>{if(initialized)classify(document.elementFromPoint(px,py));};
   const down=()=>{if(visible)gsap.to(d,{scale:2,duration:.16,overwrite:'auto'});};
   const up=()=>gsap.to(d,{scale:1,duration:.25,overwrite:'auto'});
   const key=()=>hide();
   const leave=(event:PointerEvent)=>{if(!event.relatedTarget)hide();};
   const visibility=()=>{if(document.hidden)hide();};
   window.addEventListener('pointermove',move,{passive:true});window.addEventListener('pointerdown',down,{passive:true});window.addEventListener('pointerup',up,{passive:true});window.addEventListener('blur',hide);window.addEventListener('keydown',key);
   window.addEventListener('scroll',scroll,{passive:true});
   document.addEventListener('pointerout',leave);document.addEventListener('visibilitychange',visibility);
   return()=>{hide();window.removeEventListener('scroll',scroll);window.removeEventListener('pointermove',move);window.removeEventListener('pointerdown',down);window.removeEventListener('pointerup',up);window.removeEventListener('blur',hide);window.removeEventListener('keydown',key);document.removeEventListener('pointerout',leave);document.removeEventListener('visibilitychange',visibility);x.tween.kill();y.tween.kill();gsap.killTweensOf([d,r]);context.revert();initialized=false;};
  });return()=>media.revert();
 },[pathname]);
 return <div ref={root} className="premium-cursor" aria-hidden="true"><div ref={ring} className="premium-cursor-ring"><span>↗</span></div><div ref={dot} className="premium-cursor-dot"/></div>;
}
