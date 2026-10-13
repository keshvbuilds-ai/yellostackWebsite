'use client';
import { useEffect,useRef } from 'react';
import { Network, CodeXml, ClipboardCheck, ShieldCheck, UserRoundCheck } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEditedList, CmsText } from '@/components/cms/ContentProvider';
import './medical-services.css';
gsap.registerPlugin(ScrollTrigger);
const services=[
 {title:'Mapping Services',body:'Accurately map medical codes across coding systems to ensure consistency, accuracy, and compliance.'},
 {title:'Clinical Coding Services',body:'Accurate clinical coding of diagnoses and procedures to support compliant healthcare documentation and billing.'},
 {title:'Claim Auditing Services',body:'Review healthcare claims for coding accuracy, compliance, errors, and potential revenue loss.'},
 {title:'DRG Assignment Services',body:'Accurate DRG assignment to support proper reimbursement, compliance, and optimized revenue.'},
 {title:'Medical Transcription Services',body:'Accurately convert clinical audio and notes into clear, structured medical documentation.'}
];
const icons=[Network,CodeXml,ClipboardCheck,ShieldCheck,UserRoundCheck];
function point(radius:number,angle:number){const rad=angle*Math.PI/180;return [260+radius*Math.cos(rad),260+radius*Math.sin(rad)];}
function sector(start:number,end:number){const a=point(230,start),b=point(230,end),c=point(145,end),d=point(145,start);return `M${a} A230 230 0 0 1 ${b} L${c} A145 145 0 0 0 ${d} Z`;}
export default function MedicalServices(){
 const items=useEditedList('medical.services',services);const root=useRef<HTMLElement>(null);
 useEffect(()=>{
  const mm=gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)',()=>{
   const ctx=gsap.context(()=>{
    const cards=gsap.utils.toArray<HTMLElement>('.medical-service-card');
    const segments=gsap.utils.toArray<SVGPathElement>('.medical-arc-segment');
    cards.forEach((card,i)=>{
     const tl=gsap.timeline({scrollTrigger:{trigger:card,start:'top 90%',end:'top 55%',scrub:.5}});
     tl.fromTo(card,{'--service-fill':'0%',y:18},{'--service-fill':'100%',y:0,ease:'none'},0);
     tl.fromTo(segments[i],{fill:'#ffe583'},{fill:'#ffcc02',ease:'none'},0);
    });
   },root);return()=>ctx.revert();
  });return()=>mm.revert();
 },[]);
 return <section ref={root} className="medical-services" data-no-gradient>
  <div className="medical-services-art">
   <div className="medical-services-orbit" aria-hidden="true"><svg viewBox="0 0 520 520">{items.map((_,i)=>{const angle=-103+i*41;const [x,y]=point(188,angle+19);const Icon=icons[i];return <g key={i}><path className="medical-arc-segment" d={sector(angle,angle+40)} fill="#ffcc02"/><foreignObject x={x-20} y={y-20} width="40" height="40"><Icon size={40} strokeWidth={1.5}/></foreignObject></g>;})}</svg></div>
   <div className="medical-services-title"><p className="medical-service-kicker">YELLOSTACK / HEALTHCARE</p><h2><CmsText id="medical.services.referenceTitle" fallback="Medical Coding & Healthcare Technology"/></h2><p><CmsText id="medical.services.intro" fallback="YelloStack combines accurate medical coding with intelligent healthcare technology."/></p></div>
  </div>
  <div className="medical-services-list">{items.map((item,i)=>{const Icon=icons[i];return <article key={i} className="medical-service-card"><span className="medical-card-number">0{i+1}</span><div><h3>{item.title}</h3><p>{item.body}</p></div><Icon className="medical-card-icon" size={25} strokeWidth={1.5} aria-hidden="true"/></article>;})}</div>
 </section>;
}
