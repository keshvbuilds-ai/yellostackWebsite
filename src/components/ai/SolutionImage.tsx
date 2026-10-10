'use client';
import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CmsImage, LocalText } from '@/components/cms/ContentProvider';
gsap.registerPlugin(ScrollTrigger);
const images={vision:{src:'/banners/vision-inspection.svg',caption:'Computer vision / inspection workflow'},learning:{src:'/banners/learning-model.svg',caption:'Machine learning / from data to prediction'},knowledge:{src:'/banners/knowledge-search.svg',caption:'Knowledge base / connected information'}};
export default function SolutionImage({kind}:{kind:keyof typeof images}){
 const ref=useRef<HTMLElement>(null);const item=images[kind];
 useLayoutEffect(()=>{const el=ref.current;if(!el)return;const mm=gsap.matchMedia();mm.add('(prefers-reduced-motion: no-preference)',()=>{const t=gsap.fromTo(el.querySelector('img'),{rotateX:7,rotateY:-5,y:16,scale:.95},{rotateX:-2,rotateY:3,y:-8,scale:1,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:.8}});return()=>{t.scrollTrigger?.kill();t.revert();};});return()=>mm.revert();},[]);
 return <figure ref={ref} className="ai-solution-image"><CmsImage src={item.src} width={800} height={440} alt={item.caption}/><figcaption><LocalText text={item.caption}/></figcaption></figure>;
}
