"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { yellostackData } from "@/content/yellostack";
import DecryptedText from "./animations/DecryptedText";

gsap.registerPlugin(ScrollTrigger);
export default function Services() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const context = gsap.context(() => {
      const articles = gsap.utils.toArray<HTMLElement>(".service-story");
      articles.forEach((article, index) => {
        ScrollTrigger.create({ trigger: article, start: "top 40%", end: "bottom 40%", onToggle: self => { if (self.isActive) setActive(index); } });
      });
    }, root);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const animation = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(".service-story").forEach(article => {
          const core = article.querySelector(".diagram-core");
          const nodes = article.querySelectorAll(".diagram-node");
          const orbit = article.querySelector(".orbit-b");
          const timeline = gsap.timeline({scrollTrigger:{trigger:article,start:"top 88%",end:"top 18%",scrub:.8}});
          timeline.fromTo(core,{scale:.65,rotation:-35},{scale:1.3,rotation:12,ease:"power2.out",duration:1},0);
          timeline.fromTo(nodes,{y:35,autoAlpha:.15},{y:0,autoAlpha:1,stagger:.1,duration:.6,ease:"power2.out"},.15);
          timeline.fromTo(orbit,{rotation:-35,scale:.8},{rotation:65,scale:1.1,duration:1,ease:"none"},0);
        });
      }, root);
      return () => animation.revert();
    });
    const observer = new ResizeObserver(() => ScrollTrigger.refresh());
    if (root.current) observer.observe(root.current);
    return () => { observer.disconnect(); media.revert(); context.revert(); };
  }, []);
  return <section ref={root} id="services" className="scroll-services">
    <header className="services-intro"><p>From your first idea<br />to your next stage of growth.</p><h2>Intelligence. Experience.<br /><em>Real-world impact.</em></h2></header>
    <div className="services-story-layout">
      <nav className="services-sticky-index" aria-label="Explore our capabilities">
        <span className="section-index">● WHY YELLOSTACK</span>
        {yellostackData.capabilities.map((service, i) => <a key={service.id} href={`#story-${service.id}`} aria-current={active === i ? "location" : undefined} className={active === i ? "is-active" : ""}><small>0{i + 1}</small><span>{service.title}</span><span className="service-active-arrow" aria-hidden="true">↗</span></a>)}
        <p className="services-index-note">STRATEGY. DESIGN. DEVELOPMENT.</p>
      </nav>
      <div className="services-stories">{yellostackData.capabilities.map((service, i) => <article key={service.id} id={`story-${service.id}`} className="service-story" aria-labelledby={`story-title-${service.id}`}>
        <div className={`capability-diagram story-art diagram-${service.id}`} aria-hidden="true"><span className="diagram-label">{service.label}</span><span className="story-number">0{i + 1}</span><div className="diagram-orbit orbit-a"/><div className="diagram-orbit orbit-b"/><div className="diagram-core"><i/><i/><i/></div>{service.items.map((item, n) => <span className={`diagram-node node-${n}`} key={item}><i/>{item}</span>)}</div>
        <div className="story-copy"><h3 id={`story-title-${service.id}`}>{service.title}</h3><p>{service.description}</p><ul>{service.items.map(item => <li key={item}>{item}</li>)}</ul><a href="#contact"><DecryptedText text="LET’S BUILD YOUR NEXT CHAPTER"/><span aria-hidden="true">↗</span></a></div>
      </article>)}</div>
    </div>
  </section>;
}


