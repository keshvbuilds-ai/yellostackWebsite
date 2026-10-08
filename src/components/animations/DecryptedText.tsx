"use client";

import { useEffect, useRef, useState } from "react";
import { useContent, useTranslate, useLocale } from "@/components/cms/ContentProvider";
import { motion } from "framer-motion";

/** Adapted from the supplied DecryptedText: stable layout, parent hover and focus. */
export default function DecryptedText({ text: originalText, speed = 38, maxIterations = 14, characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>_", className = "", parentClassName = "", encryptedClassName = "", animateOn = "hover" }: {
  text: string; speed?: number; maxIterations?: number; characters?: string;
  className?: string; parentClassName?: string; encryptedClassName?: string;
  animateOn?: "hover" | "view" | "inViewHover";
}) {
  const t=useTranslate();const locale=useLocale();
  const text = t(useContent().copy["label:"+originalText] ?? originalText);
  const root = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    setDisplay(text);
    const target = element.closest("a, button, summary") ?? element;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout> | undefined;
    let hovered = false, focused = false, alive = true;
    const letters = Array.from(text), alphabet = Array.from(characters || "ABC123");
    const clear = () => { if (timer) clearTimeout(timer); timer = undefined; };
    const reset = () => { clear(); if (alive) setDisplay(text); };
    const play = () => {
      clear();
      if (locale==='ar' || preference.matches || document.hidden) { reset(); return; }
      let iteration = 0;
      const frame = () => {
        if (!alive) return;
        iteration++;
        const progress = iteration / Math.max(1, maxIterations);
        setDisplay(letters.map((char, i) => /\s|[↗↺↓’']/u.test(char) || i / letters.length < progress - .16 ? char : alphabet[Math.floor(Math.random() * alphabet.length)]).join(""));
        if (iteration < maxIterations) timer = setTimeout(frame, Math.max(24, speed));
        else { setDisplay(text); if (hovered) timer = setTimeout(play, 1100); }
      };
      frame();
    };
    const enter = (event: Event) => { if ((event as PointerEvent).pointerType === "touch") return; hovered = true; play(); };
    const leave = () => { hovered = false; reset(); };
    const focus = () => { focused = true; play(); };
    const blur = () => { focused = false; reset(); };
    const visibility = () => { if (document.hidden) reset(); else if (hovered || focused) play(); };
    const motionChange = () => { reset(); if (!preference.matches && (hovered || focused)) play(); };
    if (animateOn !== "view") {
      target.addEventListener("pointerenter", enter); target.addEventListener("pointerleave", leave);
      target.addEventListener("focus", focus); target.addEventListener("blur", blur);
    }
    let observer: IntersectionObserver | undefined;
    if (animateOn !== "hover") {
      observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { play(); observer?.disconnect(); } }, { threshold: .3 });
      observer.observe(element);
    }
    document.addEventListener("visibilitychange", visibility); preference.addEventListener("change", motionChange);
    return () => {
      alive = false; clear(); observer?.disconnect();
      target.removeEventListener("pointerenter", enter); target.removeEventListener("pointerleave", leave);
      target.removeEventListener("focus", focus); target.removeEventListener("blur", blur);
      document.removeEventListener("visibilitychange", visibility); preference.removeEventListener("change", motionChange);
    };
  }, [text, speed, maxIterations, characters, animateOn, locale]);
  return <motion.span ref={root} className={`decrypt-text ${parentClassName}`}>
    <span className="sr-only">{text}</span>
    <span className="decrypt-size" aria-hidden="true">{text}</span>
    <span className={`decrypt-display ${display === text ? className : encryptedClassName}`} aria-hidden="true">{display}</span>
  </motion.span>;
}
