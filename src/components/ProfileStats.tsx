'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CmsText, useContent, useTranslate } from '@/components/cms/ContentProvider';
import './profile.css';
export default function ProfileStats() {
 const section = useRef<HTMLElement>(null);
 const { copy } = useContent(); const t = useTranslate();
 const stats = [9,200,4.8,300].map((fallback,i) => {
  const raw = Number(copy['profile.stats.'+i+'.value'] ?? fallback);
  return { value: Number.isFinite(raw) && raw >= 0 ? raw : fallback, suffix: copy['profile.stats.'+i+'.suffix'] ?? (i===2?'':'+'), label: t(copy['profile.stats.'+i+'.label'] ?? ['Years of experience','Clients','Google rating','Projects'][i]) };
 });
 const signature = JSON.stringify(stats);
 useEffect(() => {
  const el=section.current; if(!el)return;
  const media=gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)',()=>{
   const numbers=Array.from(el.querySelectorAll<HTMLElement>('[data-counter]'));
   const tweens:gsap.core.Tween[]=[];
   numbers.forEach(node=>{node.textContent='0';});
   const observer=new IntersectionObserver(entries=>{
    if(!entries.some(entry=>entry.isIntersecting))return;
    observer.disconnect();
    numbers.forEach((node,i)=>{
     const target=Number(node.dataset.counter), state={value:0};
     tweens.push(gsap.to(state,{value:target,duration:1.8,delay:i*.1,ease:'power2.out',onUpdate:()=>{node.textContent=state.value.toFixed(target%1?1:0);}}));
    });
   },{threshold:.2});observer.observe(el);
   return()=>{observer.disconnect();tweens.forEach(tween=>tween.kill());numbers.forEach(node=>{node.textContent=node.dataset.counter??'';});};
  });
  return()=>media.revert();
 },[signature]);
 return <section ref={section} className="profile-stats" aria-label={t('Yellostack in numbers')}>
  <div className="profile-stats-heading"><p><CmsText id="profile.stats.title" fallback="Experience that moves you forward."/></p><small><CmsText id="profile.stats.note" fallback="Company profile figures"/></small></div>
  <dl>{stats.map((stat,i)=><div key={i}><dt>{stat.label}</dt><dd><span className="sr-only">{stat.value}{stat.suffix}</span><span aria-hidden="true" dir="ltr"><span data-counter={stat.value}>{stat.value}</span><span className="profile-stat-suffix">{stat.suffix}</span></span></dd></div>)}</dl>
 </section>;
}
