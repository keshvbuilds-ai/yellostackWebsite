"use client";
import { LocalText } from '@/components/cms/ContentProvider';
import { CmsText } from "@/components/cms/ContentProvider";

import { Component, useCallback, useEffect, useRef, useState, type ReactNode, type PointerEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { CmsImage as Image } from "@/components/cms/ContentProvider";
import type { Journey } from "./WebGLTunnelExperience";
import { useSiteData } from "@/components/cms/ContentProvider";
import DecryptedText from "../animations/DecryptedText";
import EasterEgg from "../engagement/Rewards";
import HeroAtmosphere from "./HeroAtmosphere";

const JourneyCanvas = dynamic(() => import("./WebGLTunnelExperience"), { ssr: false });
class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}
const clamp = (n: number) => Math.max(0, Math.min(1, n));
gsap.registerPlugin(ScrollTrigger);

export default function Hero({ isIntroDone }: { isIntroDone: boolean }) {
  const yellostackData = useSiteData();
  const container = useRef<HTMLElement>(null);
  const journey = useRef<Journey>({ progress: 0, active: false, reduced: false, scroll: 0, pointerX: 0, pointerY: 0 });
  const ring = useRef<SVGCircleElement>(null);
  const words = useRef<(HTMLDivElement | null)[]>([]);
  const copy = useRef<HTMLDivElement>(null);
  const holdControl = useRef<HTMLButtonElement>(null);
  const end = useRef<HTMLDivElement>(null);
  const percentage = useRef<HTMLSpanElement>(null);
  const completed = useRef(false);
  const velocity = useRef(0);
  const choreography = useRef<gsap.core.Timeline | null>(null);
  const cursorTo = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc } | null>(null);
  const overLink = useRef(false);
  const [done, setDone] = useState(false);
  const [holding, setHolding] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => { setFailed(true); setReady(true); }, []);
  const stop = useCallback(() => { journey.current.active = false; setHolding(false); }, []);
  const reset = useCallback(() => {
    completed.current = false; velocity.current = 0;
    if (journey.current.reduced) journey.current.progress = 0;
    setDone(false); stop();
  }, [stop]);
  const start = () => {
    if (!ready || completed.current) return;
    if (reduced || failed) { journey.current.progress = 1; completed.current = true; setDone(true); return; }
    journey.current.active = true; setHolding(true);
  };

  const followPointer = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch" && !journey.current.active) return;
    const hero = container.current;
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    journey.current.pointerX = clamp(x / rect.width) * 2 - 1;
    journey.current.pointerY = 1 - clamp(y / rect.height) * 2;
    overLink.current = !journey.current.active && !!(e.target as HTMLElement).closest("a, button, [data-hero-interactive]");
    if (e.pointerType === "mouse" || journey.current.active) {
      // Keep the entire ring and its label inside the hero, even during capture.
      const radius = (holdControl.current?.offsetWidth ?? 130) / 2;
      cursorTo.current?.x(Math.max(radius + 8, Math.min(rect.width - radius - 8, x)));
      cursorTo.current?.y(Math.max(radius + 8, Math.min(rect.height - radius - 40, y)));
      hero.dataset.cursor = overLink.current ? "link" : "following";
    }
  };

  useEffect(() => {
    const hero = container.current, control = holdControl.current;
    if (!hero || !control) return;
    const context = gsap.context(() => {
      gsap.set(control, { xPercent: -50, yPercent: -50 });
      cursorTo.current = {
        x: gsap.quickTo(control, "x", { duration: reduced ? 0 : .22, ease: "power3.out" }),
        y: gsap.quickTo(control, "y", { duration: reduced ? 0 : .22, ease: "power3.out" }),
      };
      const timeline = gsap.timeline({ paused: true });
      timeline.fromTo(copy.current, { opacity: 1, y: 0 }, { opacity: 0, y: -36, duration: .13, ease: "power2.out" }, 0);
      words.current.forEach((word, i) => {
        const at = .17 + i * .2;
        timeline.fromTo(word, { autoAlpha: 0, scale: .85, filter: "blur(10px)", y: 22 }, { autoAlpha: 1, scale: 1, filter: "blur(0px)", y: 0, duration: .055, ease: "power3.out" }, at)
          .to(word, { autoAlpha: 0, scale: 1.14, filter: "blur(8px)", y: -22, duration: .075, ease: "power2.in" }, at + .085);
      });
      timeline.fromTo(end.current, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: .1, ease: "power2.out" }, .9);
      choreography.current = timeline;
      ScrollTrigger.create({ trigger: hero, start: "top top", end: "bottom top", onUpdate: self => { journey.current.scroll = self.progress; } });
    }, hero);
    const place = () => {
      delete hero.dataset.cursor;
      gsap.set(control, { x: hero.clientWidth * (hero.clientWidth < 900 ? .66 : .44), y: hero.clientHeight * .29 });
    };
    place();
    const observer = new ResizeObserver(place); observer.observe(hero);
    return () => { observer.disconnect(); context.revert(); choreography.current = null; cursorTo.current = null; };
  }, [reduced]);

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const preference = () => { journey.current.reduced = mq.matches; setReduced(mq.matches); };
    preference(); mq.addEventListener("change", preference);
    const observer = new IntersectionObserver(([entry]) => { setVisible(entry.isIntersecting); if (!entry.isIntersecting) stop(); }, { threshold: .05 });
    if (container.current) observer.observe(container.current);
    const blur = () => stop();
    const visibility = () => { if (document.hidden) stop(); };
    window.addEventListener("blur", blur); document.addEventListener("visibilitychange", visibility);
    return () => { observer.disconnect(); mq.removeEventListener("change", preference); window.removeEventListener("blur", blur); document.removeEventListener("visibilitychange", visibility); };
  }, [stop]);

  useEffect(() => {
    if (!visible) return;
    let raf = 0, previous = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - previous) / 1000, .05); previous = now;
      const j = journey.current;
      if (!completed.current) {
        const desired = j.active ? 1 / 8 : -1 / 3.8;
        velocity.current += (desired - velocity.current) * (1 - Math.exp(-7 * dt));
        j.progress = clamp(j.progress + velocity.current * dt);
        if (j.progress === 0) velocity.current = 0;
      }
      if (j.progress >= 1 && !completed.current) { completed.current = true; j.active = false; setDone(true); setHolding(false); }
      const p = j.progress;
      if (ring.current) ring.current.style.strokeDashoffset = `${339.292 * (1 - p)}`;
      if (percentage.current) percentage.current.textContent = `${Math.round(p * 100).toString().padStart(2, "0")}`;
      choreography.current?.progress(p);
      if (copy.current) copy.current.inert = p > .06;
      if (holdControl.current) holdControl.current.style.opacity = `${clamp((1 - p) * 12) * (overLink.current ? .15 : 1)}`;
      container.current?.style.setProperty("--journey-progress", `${p}`);
      document.documentElement.style.setProperty("--hero-nav-opacity", `${clamp(1 - p * 7 + j.scroll * 7)}`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); document.documentElement.style.removeProperty("--hero-nav-opacity"); };
  }, [visible]);

  return <section ref={container} className={`journey-hero ${isIntroDone ? "is-entered" : ""} ${done ? "is-complete" : ""}`} aria-label="Yellostack interactive introduction"
    onPointerMove={followPointer}
    onPointerLeave={() => { journey.current.pointerX = 0; journey.current.pointerY = 0; overLink.current = false; if (container.current) delete container.current.dataset.cursor; }}
    onPointerDown={e => {
      if (!e.isPrimary || e.pointerType !== "mouse" || e.button !== 0 || (e.target as HTMLElement).closest("a, button, input, textarea, [data-hero-interactive]")) return;
      e.currentTarget.setPointerCapture(e.pointerId); start(); followPointer(e);
    }} onPointerUp={stop} onPointerCancel={stop} onLostPointerCapture={stop}>
    <div className="journey-ambient" />
    <div className="journey-canvas" aria-hidden="true">
      {!failed && <SceneBoundary onFailure={onFailure}><JourneyCanvas journey={journey} visible={visible} onReady={onReady} onFailure={onFailure} /></SceneBoundary>}
      {failed && <div className="journey-fallback"><Image src="/StackLogo.jpeg" alt="" width={1280} height={547} /></div>}
    </div>
    <div className="journey-shade" /><div className="journey-grain" />
    <HeroAtmosphere />
    <div className="journey-copy" ref={copy}>
      <div className="journey-heading"><p className="journey-eyebrow"><span /> <CmsText id="hero.Hero.text.0" fallback=" STRATEGY. DESIGN. DEVELOPMENT."/></p><h1><CmsText id="hero.Hero.text.1" fallback="Digital products"/><br /><CmsText id="hero.Hero.text.2" fallback="that people"/><br /><em><CmsText id="hero.Hero.text.3" fallback="love to use."/></em></h1></div>
      <div className="journey-support"><p>{yellostackData.hero.description}</p><div className="journey-actions"><a className="journey-primary" href="#contact"><DecryptedText text="LET’S BUILD" /><span aria-hidden="true">↗</span></a><a className="journey-secondary" href="#work"><DecryptedText text="OUR WORK" /><span aria-hidden="true">↗</span></a></div></div>
    </div>
    <button ref={holdControl} className={`journey-hold ${holding ? "is-holding" : ""}`} disabled={!ready || done} aria-label={reduced || failed ? "Reveal Yellostack symbol" : "Hold to explore Yellostack. Hold Space or Enter on keyboard."}
      onPointerDown={e => { if (!e.isPrimary || e.button !== 0) return; e.stopPropagation(); e.currentTarget.setPointerCapture(e.pointerId); start(); followPointer(e); }}
      onPointerUp={stop} onPointerCancel={stop} onLostPointerCapture={stop} onBlur={stop}
      onKeyDown={e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); if (!e.repeat) start(); } if (e.key === "Escape") reset(); }}
      onKeyUp={e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); stop(); } }}>
      <motion.span className="journey-cursor-shell" animate={{ scale: holding ? .82 : 1, rotate: holding ? 8 : 0 }} transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 170, damping: 23 }}>
      <svg viewBox="0 0 120 120" aria-hidden="true"><circle className="journey-ring-base" cx="60" cy="60" r="54" /><circle ref={ring} className="journey-ring-fill" cx="60" cy="60" r="54" /></svg>
      <span className="journey-ring-marks"><i /><span ref={percentage}>00</span><i /></span>
      </motion.span>
      <span className="journey-hold-label"><LocalText text={!ready ? "PREPARING EXPERIENCE" : reduced || failed ? "REVEAL THE STACK" : holding ? "KEEP HOLDING" : "CLICK AND HOLD"}/></span>
    </button>
    <div className="journey-words" aria-hidden="true">{yellostackData.hero.words.map((word, i) => <div key={word} ref={el => { words.current[i] = el; }}><span>0{i + 1} <CmsText id="hero.Hero.text.4" fallback=" / THE YELLOSTACK APPROACH"/></span><strong>{word}<b>.</b></strong></div>)}</div>
    <div ref={end} className="journey-end" inert={!done}><p><CmsText id="hero.Hero.text.5" fallback="EVERY LAYER. ONE VISION."/></p><h2><CmsText id="hero.Hero.text.6" fallback="Yellostack"/><span>®</span></h2><div><a href="#services"><DecryptedText text="EXPLORE WHAT WE BUILD" /> ↗</a><button onClick={reset}><DecryptedText text="REPLAY" /> ↺</button></div></div>
    {done && <EasterEgg />}
    <div className="journey-bottom"><span><CmsText id="hero.Hero.text.7" fallback="BUILT ON IDEAS. ENGINEERED FOR IMPACT."/></span><a href="#about"><CmsText id="hero.Hero.text.8" fallback="SCROLL TO DISCOVER "/><span>↓</span></a></div>
    <span className="sr-only" role="status"><LocalText text={done ? "You found the Yellostack Easter egg and unlocked a 15% offer. Tear the reward ticket to claim it." : ""}/></span>
  </section>;
}
