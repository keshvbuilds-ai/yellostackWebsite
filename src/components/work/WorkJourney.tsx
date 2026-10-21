'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import {motion} from 'framer-motion';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {CmsImage,CmsText,LocalText,useContent,useVisualEditing} from '../cms/ContentProvider';
import {journeyPlan,phase,smooth} from './journey-motion';
import './work-journey.css';
import publishedWork from '@/content/published-work.json';
gsap.registerPlugin(ScrollTrigger);
type DepthFrame={depth:number;visibility:number;finale?:number};
const show=(element:HTMLElement,opacity:number)=>{element.style.opacity=String(opacity);element.style.visibility=opacity>.001?'visible':'hidden';};

export default function WorkJourney(){
 const content=useContent(),editing=useVisualEditing();
 const [listView,setListView]=useState(false);
 const root=useRef<HTMLElement>(null),stage=useRef<HTMLDivElement>(null),canvas=useRef<HTMLDivElement>(null);
 const depthFrame=useRef<DepthFrame>({depth:0,visibility:0});
 const draw=useRef<(frame:DepthFrame)=>void>(()=>{});
 // Public portfolio is bundled so publishing does not require a CMS backend.
 const projects=useMemo(()=>editing?(content.workProjects??publishedWork):publishedWork,[editing,content.workProjects]);
 const groups=useMemo(()=>Array.from(new Set((projects).map(p=>p.service))).map(service=>({service,title:content.pages.find(p=>p.slug===service)?.title??service.replaceAll('-',' '),items:(projects).map((project,index)=>({project,index})).filter(({project})=>project.service===service)})),[projects,content.pages]);
 const plan=useMemo(()=>journeyPlan(groups.map(group=>group.items.length)),[groups]);
 useEffect(()=>{
  const sectionRef=root.current,viewportRef=stage.current;if(!sectionRef||!viewportRef||!groups.length||editing||listView)return;
  const section=sectionRef,viewport=viewportRef;
  const media=gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)',()=>{
   section.classList.add('is-animated');
   const find=(selector:string)=>section.querySelector<HTMLElement>(selector)!;
   const question=find('.y-question'),anchor=find('.y-question-anchor'),floating=find('.y-flight-center'),glyph=find('.y-flight-glyph');
   const intro=find('.y-intro'),white=find('.y-white-world'),outro=find('.y-outro'),brandAnchor=find('.y-brand-anchor'),brandLetter=find('.y-brand-letter'),suffix=find('.y-brand-rest'),invitation=find('.y-invitation');
   const tools=find('.y-tools'),progress=find('.y-scroll-progress'),sheet=find('.y-services'),goldSheet=find('.y-gold-sheet');
   const ornaments=Array.from(section.querySelectorAll<HTMLElement>('.y-question-orbit'));
   const disappearing=Array.from(section.querySelectorAll<HTMLElement>('.y-question-vanish,.y-intro-note'));
   const panels=Array.from(section.querySelectorAll<HTMLElement>('.y-service')).map(element=>({element,track:element.querySelector<HTMLElement>('.y-project-track')!,cards:Array.from(element.querySelectorAll<HTMLElement>('.y-project'))}));
   let width=0,height=0,fromX=0,fromY=0,brandX=0,brandY=0,alive=true;
   const playhead={time:0};
   function measure(){
    const box=viewport.getBoundingClientRect(),origin=anchor.getBoundingClientRect(),destination=brandAnchor.getBoundingClientRect();width=box.width;height=box.height;
    fromX=origin.left+origin.width/2-box.left-width/2;fromY=origin.top+origin.height/2-box.top-height/2;
    brandX=width/2-(destination.left+destination.width/2-box.left);brandY=height/2-(destination.top+destination.height/2-box.top);
    floating.style.width=`${origin.width}px`;floating.style.height=`${origin.height}px`;floating.style.fontSize=getComputedStyle(anchor).fontSize;
    section.style.height=`${height+plan.total*Math.max(420,height*.6)}px`;
   }
   function render(){
    const t=playhead.time,isolate=smooth(phase(t,.45,1.65)),enter=smooth(phase(t,2.05,4.3)),leave=smooth(phase(t,plan.exit,plan.exit+2.9));
    const world=smooth(phase(t,2.8,4.2));
    show(white,world);show(intro,1-phase(t,4.15,4.3));
    show(sheet,smooth(phase(t,4.15,4.65))*(1-smooth(phase(t,plan.exit,plan.exit+.75))));
    show(goldSheet,0);
    disappearing.forEach((el,i)=>{show(el,1-isolate);el.style.transform=`translate3d(${i===0?-isolate*55:isolate*55}px,${-isolate*15}px,${-isolate*180}px)`;el.style.filter=`blur(${isolate*8}px)`;});
    glyph.style.transform=`translate3d(${fromX*(1-isolate)}px,${fromY*(1-isolate)}px,${enter*200}px)`;
    show(floating,1-smooth(phase(t,1.35,2.05)));
    show(question,1-phase(t,1.6,1.75));
    ornaments.forEach((el,i)=>{show(el,1-smooth(phase(t,1.8,2.8)));el.style.transform=`translateZ(${isolate*420}px) rotate(${(i?-1:1)*isolate*100}deg)`;});
    panels.forEach(({element,track,cards},i)=>{
     const score=plan.groups[i],incoming=smooth(phase(t,score.enter,score.ready));
     const outgoing=i<panels.length-1?smooth(phase(t,plan.groups[i+1].enter,plan.groups[i+1].ready)):smooth(phase(t,plan.exit,plan.exit+1.5));
     const alpha=incoming*(1-outgoing)*smooth(phase(t,4.5,4.95));show(element,alpha);
     const y=(i?height*.72*(1-incoming):0)-(i<panels.length-1?height*.65*outgoing:0);
     const z=0;
     element.style.transform=`translate3d(0,${y}px,${z}px)`;
     const settle=smooth(phase(t,score.ready+.5,score.ready+1.8));
     const heading=element.querySelector<HTMLElement>('.y-service-title')!;
     heading.style.transform=`translateY(${(1-settle)*height*.25}px) scale(${1.15-.15*settle})`;
     const window=element.querySelector<HTMLElement>('.y-project-window')!;show(window,settle);
     window.style.transform=`translateY(${(1-settle)*45}px)`;
     let slide=0;score.slides.forEach(interval=>{slide+=smooth(phase(t,interval.start,interval.end));});
     track.style.transform=`translate3d(${-slide*track.clientWidth}px,0,0)`;
     element.inert=alpha<.55;element.setAttribute('aria-hidden',String(alpha<.55));
     cards.forEach((card,j)=>{card.inert=element.inert||settle<.9||Math.abs(slide-j)>.55;});
    });
    const reveal=smooth(phase(t,plan.exit+2.2,plan.exit+3.2));show(outro,reveal);
    brandLetter.style.transform=`translate3d(0,${(1-leave)*30}px,0)`;
    const join=smooth(phase(t,plan.exit+2.35,plan.exit+3.45));show(suffix,join);suffix.style.transform=`translate3d(${(1-join)*width*.65}px,0,0)`;
    const invite=smooth(phase(t,plan.exit+3.15,plan.exit+3.95));show(invitation,invite);invitation.style.transform=`translateY(${(1-invite)*24}px)`;invitation.inert=invite<.8;
    // Hide navigation only during the fast part of the camera travel.
    const rush=phase(t,2.1,2.8)*(1-phase(t,3.6,4.3));show(tools,1-rush*.85);
    progress.style.transform=`scaleX(${t/plan.total})`;
    const visibility=Math.max(smooth(phase(t,2.1,2.75))*(1-smooth(phase(t,3.45,4.35))),smooth(phase(t,plan.exit,plan.exit+.65))*(1-smooth(phase(t,plan.exit+2,plan.exit+3))));
    depthFrame.current={depth:enter+leave*.65,visibility:Math.max(visibility,smooth(phase(t,plan.exit+.2,plan.exit+1))),finale:leave};draw.current(depthFrame.current);
    section.dataset.journeyTime=t.toFixed(4);
   }
   measure();render();
   // Native sticky owns positioning; a single scalar playhead owns every visual state.
   // No direction-dependent callbacks, pin transforms, delayed sets or overlapping tweens.
   const tween=gsap.to(playhead,{time:plan.total,ease:'none',paused:true,onUpdate:render});
   const trigger=ScrollTrigger.create({id:'work-y-journey',trigger:section,start:'top top',end:'bottom bottom',animation:tween,scrub:.65,invalidateOnRefresh:false,onRefreshInit:measure,onRefresh:render});
   const refresh=()=>{if(alive){measure();ScrollTrigger.refresh();}};
   document.fonts.ready.then(refresh);
   return()=>{alive=false;trigger.kill();tween.kill();section.classList.remove('is-animated');section.style.removeProperty('height');delete section.dataset.journeyTime;[...ornaments,...Array.from(section.querySelectorAll<HTMLElement>('.y-service-title,.y-project-window')),sheet,goldSheet,intro,white,question,floating,glyph,brandLetter,suffix,invitation,outro,tools,progress,...disappearing,...panels.flatMap(p=>[p.element,p.track])].forEach(el=>el.removeAttribute('style'));section.querySelectorAll<HTMLElement>('[inert],[aria-hidden]').forEach(el=>{if(!el.classList.contains('y-canvas')&&!el.classList.contains('y-flight')){el.inert=false;if(el.classList.contains('y-service'))el.removeAttribute('aria-hidden');}});};
  });return()=>media.revert();
 },[groups,plan,editing,listView]);
 useEffect(()=>{
  const host=canvas.current;if(!host||editing||listView||!groups.length||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  let disposed=false,cleanup=()=>{};
  import('./work-world').then(({createWorkWorld})=>{
   if(disposed)return;
   try{const world=createWorkWorld(host);draw.current=world.render;world.render(depthFrame.current);cleanup=()=>{draw.current=()=>{};world.dispose();};}catch{host.style.opacity='0';}
  }).catch(()=>{});return()=>{disposed=true;cleanup();};
 },[editing,listView,groups.length]);
 if(!groups.length)return null;
 return <section id="selected-work" className="y-journey" ref={root} data-no-gradient data-duration={plan.total} data-exit={plan.exit} aria-label="Selected work: why choose Yellostack">
  <div ref={stage} className="y-stage">
   <div className="y-tools"><span>YELLOSTACK / <LocalText text="SELECTED WORK"/></span><button type="button" onClick={()=>{setListView(v=>!v);requestAnimationFrame(()=>{const el=root.current;if(el)window.dispatchEvent(new CustomEvent('ys:page-jump',{detail:{y:el.getBoundingClientRect().top+scrollY}}));});}}>{listView?'Scroll experience':'View all projects'}</button><a href="#after-y-journey"><LocalText text="Skip to next section"/> ↓</a></div>
   <div className="y-white-world" aria-hidden="true"/>
   <div className="y-intro"><span className="y-question-orbit left" aria-hidden="true">?</span><span className="y-question-orbit right" aria-hidden="true">?</span><div className="y-intro-copy"><p className="y-intro-note"><CmsText id="work.projects.heading" fallback="Ideas, brought to life."/></p><h2 className="y-question" aria-label="Why choose us?"><span className="y-question-first"><span className="y-question-vanish">Wh</span><span className="y-question-anchor">y</span></span><span className="y-question-vanish y-question-end">choose us?</span></h2><div className="y-intro-note y-intro-description"><CmsText id="work.projects.invite" fallback="The answer is in what we build."/><span><LocalText text="Scroll. Step inside. See for yourself."/> ↓</span></div></div></div>
   <div className="y-flight" aria-hidden="true"><div className="y-flight-center"><span className="y-flight-glyph">y</span></div></div>
   <div ref={canvas} className="y-canvas" aria-hidden="true"/>
   <div className="y-sheet-space"><div className="y-gold-sheet" aria-hidden="true"/><div className="y-services">{groups.map((group,gi)=><section className="y-service" key={group.service} aria-label={group.title}>
    <header className="y-service-heading"><span className="y-service-number">{String(gi+1).padStart(2,'0')}<i>/ {String(groups.length).padStart(2,'0')}</i></span><div className="y-service-kicker"><LocalText text="APPLICATION EXPERIENCES"/><span>{group.title}</span></div><motion.a whileHover={{y:-2}} href={`/${group.service}`}><LocalText text="Explore service"/> <span>↗</span></motion.a></header>
    <h3 className="y-service-title">{group.title}</h3><div className="y-project-window"><div className="y-project-track">{group.items.map(({project,index},pi)=><article key={project.id} className="y-project">
     <div className="y-project-copy"><span className="y-project-index"><i/>{String(pi+1).padStart(2,'0')} / {String(group.items.length).padStart(2,'0')} — <LocalText text="SELECTED PROJECT"/></span><h4 data-cms-path={JSON.stringify(['workProjects',String(index),'title'])}>{project.title}</h4><p data-cms-path={JSON.stringify(['workProjects',String(index),'description'])}>{project.description}</p>{project.url&&<motion.a whileHover={{x:5}} transition={{duration:.2}} href={project.url} target="_blank" rel="noopener noreferrer"><LocalText text="View project"/> <span>↗</span></motion.a>}</div>
     {project.image&&<figure className="y-project-image"><CmsImage cmsPath={['workProjects',String(index),'image']} src={project.image} alt={project.title} width={900} height={600}/><figcaption>{String(pi+1).padStart(2,'0')} — {project.title}</figcaption></figure>}
    </article>)}</div></div>
    <div className="y-service-footer"><span>{group.items.length>1?'SCROLL TO EXPLORE PROJECTS →':'SCROLL TO CONTINUE ↓'}</span><span>{gi+1<groups.length?`NEXT / ${groups[gi+1].title}`:'YOUR NEXT CHAPTER STARTS HERE.'}</span></div>
   </section>)}</div></div>
   <div className="y-outro" aria-label="YelloStack"><div className="y-wordmark" aria-hidden="true"><span className="y-brand-anchor"><span className="y-brand-letter">Y</span></span><span className="y-brand-rest">elloStack</span></div><div className="y-invitation"><p className="y-outro-caption"><CmsText id="work.projects.closing" fallback="You have seen what we build. What could we build for you?"/></p><motion.a className="y-outro-cta" href="/contact" whileHover={{scale:1.035}} whileTap={{scale:.98}}><CmsText id="work.projects.cta" fallback="Contact us"/><span>↗</span></motion.a></div></div>
   <div className="y-scroll-progress" aria-hidden="true"/>
  </div><div id="after-y-journey" tabIndex={-1}/>
 </section>;
}
