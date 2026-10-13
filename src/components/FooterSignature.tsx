"use client";
import { CmsText, useContent } from "@/components/cms/ContentProvider";


import { motion, useReducedMotion } from "framer-motion";


import TechText from "./animations/TechText";
import DecryptedText from "./animations/DecryptedText";


export default function FooterSignature() {
 const content = useContent();


  const reduced = useReducedMotion();
  return <section className="footer-signature" aria-label="YelloStack interactive brand signature">
    <motion.div className="signature-heading" initial={reduced ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: .7 }}>
      <span><i /> <CmsText id="FooterSignature.text.0" fallback=" IDEAS INTO EXPERIENCES."/></span><span className="signature-instruction"><CmsText id="FooterSignature.text.1" fallback="HOVER TO EXPLORE / DRAG A LETTER"/></span>
    </motion.div>
    <div className="signature-stage bg-[#111018]">
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
        color="#ffcc02"
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


