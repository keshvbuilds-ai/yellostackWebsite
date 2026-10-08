"use client";
import { CmsText, useEditedList } from "@/components/cms/ContentProvider";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const defaultChapters = [
  { number: "01", title: "Discover", detail: "Every great product starts with a question." },
  { number: "02", title: "Strategize", detail: "Turn research into a clear plan." },
  { number: "03", title: "Execute", detail: "Bring design and development together." },
];
export default function HeroAtmosphere() {
 const chapters = useEditedList("HeroAtmosphere.chapters",defaultChapters);
  const [chapter, setChapter] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(() => { if (!document.hidden && window.scrollY < window.innerHeight) setChapter(value => (value + 1) % chapters.length); }, 4800);
    return () => clearInterval(timer);
  }, [reduced]);
  return <div className="hero-atmosphere" aria-hidden="true">
    <div className="hero-drafting-grid" />
    <svg className="hero-signal-lines" viewBox="0 0 1600 900" preserveAspectRatio="none">
      <defs><linearGradient id="hero-signal" x1="0" y1="1" x2="1" y2="0"><stop stopColor="#ffcf00" stopOpacity="0" /><stop offset=".55" stopColor="#ffdf69" stopOpacity=".26" /><stop offset="1" stopColor="#ffffff" stopOpacity="0" /></linearGradient></defs>
      <path className="signal-track" d="M-100 380 C250 380 220 100 680 165 S1160 445 1720 90" />
      <path className="signal-packet" d="M-100 380 C250 380 220 100 680 165 S1160 445 1720 90" pathLength="100" />
      <path className="signal-track secondary" d="M-100 420 C250 420 220 140 680 205 S1160 485 1720 130" />
    </svg>
    <div className="hero-capabilities"><span><CmsText id="hero.HeroAtmosphere.text.0" fallback="UX / UI DESIGN"/></span><i /><span><CmsText id="hero.HeroAtmosphere.text.1" fallback="WEB & APPS"/></span><i /><span><CmsText id="hero.HeroAtmosphere.text.2" fallback="AI & AUTOMATION"/></span><i /><span><CmsText id="hero.HeroAtmosphere.text.3" fallback="MEDICAL CODING"/></span></div>
    <div className="hero-chapter">
      <div className="chapter-index"><span><CmsText id="hero.HeroAtmosphere.text.4" fallback="THE WAY WE BUILD"/></span><span>{chapters[chapter].number} / 03</span></div>
      <AnimatePresence mode="wait" initial={false}><motion.div key={chapter} initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .45 }}><strong>{chapters[chapter].title}<span>_</span></strong><p>{chapters[chapter].detail}</p></motion.div></AnimatePresence>
      <div className="chapter-progress">{chapters.map((item, i) => <span key={item.number} className={i === chapter ? "is-current" : ""} />)}</div>
    </div>
    <span className="hero-registration registration-one">+</span><span className="hero-registration registration-two">+</span>
  </div>;
}

