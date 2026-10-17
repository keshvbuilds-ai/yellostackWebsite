"use client";
import { CmsText } from "@/components/cms/ContentProvider";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { useSiteData } from "@/components/cms/ContentProvider";
export default function WhyYellostack() {
  const yellostackData = useSiteData();
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const mm=gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)',()=>{
      const context=gsap.context(()=>{
        gsap.utils.toArray<HTMLElement>('.process-list article').forEach(row=>{
          gsap.fromTo(row,{'--process-fill':'0%'},{'--process-fill':'100%',ease:'none',scrollTrigger:{trigger:row,start:'top 78%',end:'top 43%',scrub:.55,invalidateOnRefresh:true}});
        });
      }, root.current!);return()=>context.revert();
    });return()=>mm.revert();
  },[]);
  return <section ref={root} className="business-section process-section"><div className="section-heading"><span className="section-index"><CmsText id="WhyYellostack.text.0" fallback="04 / OUR APPROACH"/></span><h2><CmsText id="WhyYellostack.text.1" fallback="A clear process."/><br /><em><CmsText id="WhyYellostack.text.2" fallback="A shared ambition."/></em></h2></div><div className="process-list">{yellostackData.process.map((step, i) => <article key={step.step}><div className="process-row-content"><span>0{i + 1}</span><h3>{step.step}</h3><p>{step.details}</p><span aria-hidden="true">↗</span></div><div className="process-row-content process-row-ink" aria-hidden="true"><span>0{i + 1}</span><h3>{step.step}</h3><p>{step.details}</p><span aria-hidden="true">↗</span></div></article>)}</div></section>;
}
