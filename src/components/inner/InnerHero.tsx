'use client';
import { LocalText } from '@/components/cms/ContentProvider';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import HeroArtwork from './HeroArtwork';
import { motion, useReducedMotion } from 'framer-motion';
import './inner-pages.css';

export default function InnerHero({title, intro, eyebrow, article=false}: {title:string;intro:string;eyebrow:string;article?:boolean}) {
  const reduce=useReducedMotion();
  const pathname=usePathname();
  return <section className={'ys-inner-hero '+(article?'ys-article-hero':'')}>
    <HeroArtwork slug={pathname}/>
    <div className="ys-inner-hero-content"><div className="ys-inner-breadcrumb"><Link href="/"><LocalText text={"HOME"}/></Link><span>/</span><span><LocalText text={eyebrow}/></span></div>
      <motion.h1 initial={false} animate={{opacity:1,y:0}} transition={{duration:reduce?0:.8}}><LocalText text={title}/></motion.h1>
      <div className="ys-inner-hero-bottom"><p><LocalText text={intro}/></p>{!article && <Link href="/contact" className="ys-inner-button"><LocalText text={"LET’S BUILD TOGETHER"}/><span aria-hidden="true">↗</span></Link>}</div>
      <div className="ys-inner-hero-caption"><span><LocalText text={"STRATEGY. DESIGN. TECHNOLOGY."}/></span><span><LocalText text={"EXPLORE BELOW ↓"}/></span></div>
    </div>
  </section>;
}
