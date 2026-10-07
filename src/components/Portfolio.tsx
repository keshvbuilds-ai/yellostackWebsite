"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { yellostackData } from "@/content/yellostack";
import DecryptedText from "./animations/DecryptedText";
import ProductStage from "./3d/ProductStage";

gsap.registerPlugin(ScrollTrigger);
export default function Portfolio() {
  const reduced = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const [active,setActive] = useState(0);
  useEffect(()=>{
    const context=gsap.context(()=>{
      gsap.utils.toArray<HTMLElement>(".application-item").forEach((item,i)=>ScrollTrigger.create({trigger:item,start:"top 60%",end:"bottom 60%",onToggle:self=>{if(self.isActive)setActive(i);}}));
    },root);
    return()=>context.revert();
  },[]);
  return <section ref={root} id="work" className="business-section applications-section">
    <div className="section-heading"><span className="section-index">04 / DIGITAL EXPERIENCES</span><h2>Real life.<br /><em>Reimagined.</em></h2><p>From a daily delivery to a new way to learn. Explore the application areas we build for.</p></div>
    <div className="product-showcase"><aside className="product-studio" aria-label="Application concept preview"><ProductStage active={active} reduced={!!reduced}/></aside>
    <div className="application-grid">{yellostackData.services.map((service, i) => <motion.a href={`mailto:${yellostackData.contact.email}?subject=${encodeURIComponent(service.title)}`} key={service.id} className={`application-item ${active===i?"is-active":""}`} onFocus={()=>setActive(i)} onMouseEnter={()=>setActive(i)} initial={reduced ? false : { opacity: .5 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .55 }}>
      <div className="application-top"><span>0{i + 1} / APPLICATIONS</span><span aria-hidden="true">↗</span></div>
      <h3>{service.title}</h3><p>{service.description}</p><span className="application-link"><DecryptedText text="LET'S TALK ABOUT IT" /></span>
    </motion.a>)}</div></div>
  </section>;
}
