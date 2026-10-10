"use client";
import { stockMedia } from "@/content/media";
import { CmsImage } from "@/components/cms/ContentProvider";
import { CmsText } from "@/components/cms/ContentProvider";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSiteData } from "@/components/cms/ContentProvider";
import DecryptedText from "./animations/DecryptedText";

gsap.registerPlugin(ScrollTrigger);
const capabilityImages:Record<string, {src:string;alt:string}>={ai:stockMedia.robotics,'medical-coding':stockMedia.healthcare,applications:stockMedia.engineering,software:stockMedia.collaboration,branding:stockMedia.design,marketing:stockMedia.analytics,cloud:stockMedia.cloud};
export default function Services() {
  const yellostackData = useSiteData();
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const context = gsap.context(() => {
      const articles = gsap.utils.toArray<HTMLElement>(".service-story");
      articles.forEach((article, index) => {
        ScrollTrigger.create({ trigger: article, start: "top 40%", end: "bottom 40%", onToggle: self => { if (self.isActive) setActive(index); } });
      });
    }, root);
    const observer = new ResizeObserver(() => ScrollTrigger.refresh());
    if (root.current) observer.observe(root.current);
    return () => { observer.disconnect(); context.revert(); };
  }, []);
  return <section ref={root} id="services" className="scroll-services">
    <header className="services-intro"><p><CmsText id="Services.text.0" fallback="From your first idea"/><br /><CmsText id="Services.text.1" fallback="to your next stage of growth."/></p><h2><CmsText id="Services.text.2" fallback="Intelligence. Experience."/><br /><em><CmsText id="Services.text.3" fallback="Real-world impact."/></em></h2></header>
    <div className="services-story-layout">
      <nav className="services-sticky-index" aria-label="Explore our capabilities">
        <span className="section-index"><CmsText id="Services.text.4" fallback="● WHY YELLOSTACK"/></span>
        {yellostackData.capabilities.map((service, i) => <a key={service.id} href={`#story-${service.id}`} aria-current={active === i ? "location" : undefined} className={active === i ? "is-active" : ""}><small>0{i + 1}</small><span>{service.title}</span><span className="service-active-arrow" aria-hidden="true">↗</span></a>)}
        <p className="services-index-note"><CmsText id="Services.text.5" fallback="STRATEGY. DESIGN. DEVELOPMENT."/></p>
      </nav>
      <div className="services-stories">{yellostackData.capabilities.map((service) => <article key={service.id} id={`story-${service.id}`} className="service-story" aria-labelledby={`story-title-${service.id}`}>
        <figure className="capability-photo"><CmsImage src={(capabilityImages[service.id]||stockMedia.collaboration).src} alt={(capabilityImages[service.id]||stockMedia.collaboration).alt} fill sizes="(max-width: 800px) 88vw, 48vw"/><figcaption>{service.label}</figcaption></figure>
        <div className="story-copy" data-site-reveal><h3 id={`story-title-${service.id}`}>{service.title}</h3><p>{service.description}</p><ul>{service.items.map(item => <li key={item}>{item}</li>)}</ul><a href="#contact"><DecryptedText text="LET’S BUILD YOUR NEXT CHAPTER"/><span aria-hidden="true">↗</span></a></div>
      </article>)}</div>
    </div>
  </section>;
}


