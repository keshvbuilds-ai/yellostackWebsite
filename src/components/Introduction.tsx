"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { yellostackData } from "@/content/yellostack";

gsap.registerPlugin(ScrollTrigger);
export default function Introduction() {
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
    <div className="intro-line" /><div className="intro-kicker"><span>01 / THE WAY WE THINK</span><span>YELLOSTACK&reg;</span></div>
    <div className="intro-statement"><h2>Your ambition.<br />Our <em>shared purpose.</em></h2><div><p>{yellostackData.brand.description}</p><a href="#services">DISCOVER OUR CAPABILITIES <span>&#8599;</span></a></div></div>
    <div className="intro-disciplines"><span>STRATEGY</span><i>&#8599;</i><span>DESIGN</span><i>&#8599;</i><span>DEVELOPMENT</span></div>
  </section>;
}

