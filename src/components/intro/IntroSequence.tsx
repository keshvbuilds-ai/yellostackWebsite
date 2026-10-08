"use client";
import { LocalText } from '@/components/cms/ContentProvider';

import { useEffect, useRef } from "react";
import gsap from "gsap";

/** A short brand curtain; it never locks scrolling or waits on remote assets. */
export default function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const curtain = useRef<HTMLDivElement>(null);
  const complete = useRef(onComplete);
  useEffect(() => { complete.current = onComplete; }, [onComplete]);
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tween = gsap.to(curtain.current, { opacity: 0, duration: reduced ? 0 : .65, delay: reduced ? 0 : .15, ease: "power2.out", onComplete: () => complete.current() });
    return () => { tween.kill(); };
  }, []);
  return <div ref={curtain} className="brand-curtain" aria-hidden="true"><span><LocalText text={"Yellostack"}/><span>®</span></span></div>;
}
