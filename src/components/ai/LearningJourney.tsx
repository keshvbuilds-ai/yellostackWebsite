'use client';
import { useLayoutEffect, useRef, type RefObject } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SolutionImage from './SolutionImage';
import { journeyProgress } from './journey-progress';
import { CmsText, LocalText } from '@/components/cms/ContentProvider';
gsap.registerPlugin(ScrollTrigger);
export default function LearningJourney({progress}:{progress:RefObject<number>}){
 const root=useRef<HTMLElement>(null);
 useLayoutEffect(()=>{const el=root.current;if(!el)return;const mm=gsap.matchMedia();mm.add('(prefers-reduced-motion: no-preference)',()=>{
  const fracture=el.querySelector<HTMLElement>('.ai-fracture-space')!;
  const knowledge=el.querySelector<HTMLElement>('.ai-knowledge-copy')!;
  const opening=el.querySelector<HTMLElement>('.ai-brain-opening')!;
  let frame=0;
  const sync=()=>{
   frame=0;
   const bounds=el.getBoundingClientRect();
   progress.current=journeyProgress(-bounds.top,innerHeight,fracture.getBoundingClientRect().top-bounds.top,knowledge.getBoundingClientRect().top-bounds.top);
   const p=progress.current;
   const reveal=gsap.utils.clamp(0,1,(p-.69)/.14);
   const fade=1-gsap.utils.clamp(0,1,(p-.92)/.08);
   gsap.set(opening,{opacity:reveal*fade,clipPath:`inset(0 ${(1-reveal)*50}% 0 ${(1-reveal)*50}%)`});
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(sync);};
  // Native page position is the source of truth, including restored scroll and fast jumps.
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule);
  const resize=new ResizeObserver(schedule);resize.observe(el);
  ScrollTrigger.addEventListener('refresh',schedule);
  sync();
  // Content is always in normal flow: never gate accessibility on a WebGL frame.
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);resize.disconnect();gsap.set(opening,{clearProps:'opacity,clipPath'});ScrollTrigger.removeEventListener('refresh',schedule);progress.current=0;};});return()=>mm.revert();},[progress]);
 return <section ref={root} className="ai-learning-journey" id="machine-learning"><div className="ai-learning-copy ai-journey-copy"><p className="ai-kicker">03 / <LocalText text="CONNECTED INTELLIGENCE"/></p><h2><CmsText id="ai.ml.title" fallback="Machine learning"/></h2><h3><CmsText id="ai.ml.subtitle" fallback="Patterns become understanding."/></h3><p><CmsText id="ai.ml.body" fallback="Turn your operational data into models that forecast demand, identify anomalies and support better decisions. We prepare the data, test the model and measure its usefulness against your business goals."/></p><ul><li><CmsText id="ai.ml.point1" fallback="Demand forecasting and predictive analytics"/></li><li><CmsText id="ai.ml.point2" fallback="Anomaly detection and decision support"/></li><li><CmsText id="ai.ml.point3" fallback="Model evaluation, monitoring and human review"/></li></ul><SolutionImage kind="learning"/><span className="ai-journey-hint"><LocalText text="Scroll to connect knowledge"/> ↓</span></div><div className="ai-fracture-space" aria-hidden="true"><div className="ai-brain-opening"><span><CmsText id="ai.kb.title" fallback="Knowledge base"/></span><p><CmsText id="ai.kb.subtitle" fallback="Your expertise. Within reach."/></p></div></div><div className="ai-knowledge-copy ai-journey-copy" id="knowledge-base"><p className="ai-kicker">04 / <LocalText text="KNOWLEDGE, CONNECTED"/></p><h2><CmsText id="ai.kb.title" fallback="Knowledge base"/></h2><h3><CmsText id="ai.kb.subtitle" fallback="Your expertise. Within reach."/></h3><p><CmsText id="ai.kb.body" fallback="Connect approved documents, policies and business systems in one searchable knowledge layer. Give your team grounded answers with source references, access controls and a clear path to human review."/></p><ul><li><CmsText id="ai.kb.point1" fallback="Search across approved enterprise content"/></li><li><CmsText id="ai.kb.point2" fallback="Retrieval-augmented assistants with citations"/></li><li><CmsText id="ai.kb.point3" fallback="Permissions, content refresh and feedback loops"/></li></ul><SolutionImage kind="knowledge"/><Link href="/contact"><LocalText text="LET’S BUILD TOGETHER"/> ↗</Link></div></section>;
}
