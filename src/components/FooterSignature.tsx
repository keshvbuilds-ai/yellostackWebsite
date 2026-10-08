"use client";
import { CmsText, useContent } from "@/components/cms/ContentProvider";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TechText from "./animations/TechText";
import DecryptedText from "./animations/DecryptedText";

gsap.registerPlugin(ScrollTrigger);
export default function FooterSignature() {
 const content = useContent();
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.fromTo(stage.current, { opacity: .6 }, { opacity: 1, ease: "power2.out", scrollTrigger: { trigger: section.current, start: "top 95%", end: "top 65%", scrub: .45 } });
      }, section);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);
  return <section ref={section} className="footer-signature" aria-label="YelloStack interactive brand signature">
    <motion.div className="signature-heading" initial={reduced ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: .7 }}>
      <span><i /> <CmsText id="FooterSignature.text.0" fallback=" IDEAS INTO EXPERIENCES."/></span><span className="signature-instruction"><CmsText id="FooterSignature.text.1" fallback="HOVER TO EXPLORE / DRAG A LETTER"/></span>
    </motion.div>
    <div ref={stage} className="relative h-[280px] w-full bg-[#111018] sm:h-[360px] lg:h-[480px]">
      <TechText
        style={{}}
        text={content.copy["label:YelloStack"] ?? "YelloStack"}
        fontWeight={600}
        fontSize={150}
        reveal="letter"
        dashLength={4}
        dashGap={2}
        specks={15}
        fontFamily=""
        color="#ffff00"
        accentColor="#ffffff"
        letterSpacing={-0.05}
        reach={200}
        softness={0.7}
        strokeWidth={1.5}
        speed={1}
        lineStyle="dashed"
        selection
        labels
        draggable
        sweep
      />
    </div>
    <div className="signature-bottom"><span><CmsText id="FooterSignature.text.2" fallback="THOUGHTFULLY DESIGNED. BUILT TO CONNECT."/></span><a href="mailto:hello@yellostack.com"><DecryptedText text="LET'S MAKE SOMETHING GREAT" /> <span aria-hidden="true">↗</span></a></div>
    <div className="signature-seam"><span><CmsText id="FooterSignature.text.3" fallback="YELLOSTACK®"/></span><span><CmsText id="FooterSignature.text.4" fallback="THE NEXT CHAPTER STARTS WITH YOU."/></span><span>↓</span></div>
  </section>;
}


