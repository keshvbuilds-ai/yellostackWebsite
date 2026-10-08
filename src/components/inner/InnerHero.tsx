'use client';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import './inner-pages.css';

export default function InnerHero({title, intro, eyebrow, article=false}: {title:string;intro:string;eyebrow:string;article?:boolean}) {
  const reduce=useReducedMotion();
  return <section className={'ys-inner-hero '+(article?'ys-article-hero':'')}>
    <div className="ys-inner-orbit" aria-hidden="true"><div className="ys-inner-stack"><i/><i/><i/></div><span/><span/></div>
    <div className="ys-inner-hero-content"><div className="ys-inner-breadcrumb"><Link href="/">HOME</Link><span>/</span><span>{eyebrow}</span></div>
      <motion.h1 initial={false} animate={{opacity:1,y:0}} transition={{duration:reduce?0:.8}}>{title}</motion.h1>
      <div className="ys-inner-hero-bottom"><p>{intro}</p>{!article && <Link href="/contact" className="ys-inner-button">LET’S BUILD TOGETHER <span aria-hidden="true">↗</span></Link>}</div>
      <div className="ys-inner-hero-caption"><span>STRATEGY. DESIGN. TECHNOLOGY.</span><span>EXPLORE BELOW ↓</span></div>
    </div>
  </section>;
}
