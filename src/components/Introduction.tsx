"use client";
import { CmsText } from "@/components/cms/ContentProvider";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSiteData } from "@/components/cms/ContentProvider";

gsap.registerPlugin(ScrollTrigger);
export default function Introduction() {
  const yellostackData = useSiteData();
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.fromTo(".intro-statement", { y: 70, opacity: .2 }, { y: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: section.current, start: "top 85%", end: "top 30%", scrub: .6 } });
        gsap.fromTo(".intro-line", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: section.current, start: "top 90%", end: "top 35%", scrub: .6 } });
      }, section);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);
  return <section id="about" ref={section} className="brand-introduction">
    <div className="intro-line" /><div className="intro-kicker"><span><CmsText id="Introduction.text.0" fallback="01 / THE WAY WE THINK"/></span><span><CmsText id="Introduction.text.1" fallback="YELLOSTACK®"/></span></div>
    <div className="intro-statement"><h2><CmsText id="Introduction.text.2" fallback="Your ambition."/><br /><CmsText id="Introduction.text.3" fallback="Our "/><em><CmsText id="Introduction.text.4" fallback="shared purpose."/></em></h2><div><p>{yellostackData.brand.description}</p><a href="#services"><CmsText id="Introduction.text.5" fallback="DISCOVER OUR CAPABILITIES "/><span>&#8599;</span></a></div></div>
    <div className="intro-disciplines"><span><CmsText id="Introduction.text.6" fallback="STRATEGY"/></span><i>&#8599;</i><span><CmsText id="Introduction.text.7" fallback="DESIGN"/></span><i>&#8599;</i><span><CmsText id="Introduction.text.8" fallback="DEVELOPMENT"/></span></div>
  </section>;
}

