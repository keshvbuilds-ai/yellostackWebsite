"use client";
import { CmsText } from "@/components/cms/ContentProvider";
import { motion, useReducedMotion } from "framer-motion";
import { useSiteData } from "@/components/cms/ContentProvider";
export default function WhyYellostack() {
  const yellostackData = useSiteData();
  const reduced = useReducedMotion();
  return <section className="business-section process-section"><div className="section-heading"><span className="section-index"><CmsText id="WhyYellostack.text.0" fallback="04 / OUR APPROACH"/></span><h2><CmsText id="WhyYellostack.text.1" fallback="A clear process."/><br /><em><CmsText id="WhyYellostack.text.2" fallback="A shared ambition."/></em></h2></div><div className="process-list">{yellostackData.process.map((step, i) => <motion.article key={step.step} initial={reduced ? false : { opacity: .3, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .5 }} transition={{ duration: .6 }}><span>0{i + 1}</span><h3>{step.step}</h3><p>{step.details}</p><span aria-hidden="true">↗</span></motion.article>)}</div></section>;
}
