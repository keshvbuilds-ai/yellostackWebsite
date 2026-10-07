"use client";
import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
/** One section-level rhythm; nested components retain their own interaction transforms. */
export default function HomeChoreography({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.to(progress.current, { scaleX: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: .25 } });
        const services = root.current?.querySelector(".scroll-services");
        if (services) {
          const entrance = gsap.timeline({scrollTrigger:{trigger:services,start:"top 95%",end:"top 25%",scrub:.8}});
          entrance.fromTo(services.querySelector(".services-intro>p"),{y:35,opacity:.5},{y:0,opacity:1,duration:1},0);
          entrance.fromTo(services.querySelector(".services-intro h2"),{y:65,opacity:.5},{y:0,opacity:1,duration:1,ease:"power2.out"},.1);
        }
        // Section boundaries reveal before their content; pinned/sticky parents stay untransformed.
        gsap.utils.toArray<HTMLElement>(".scroll-services, .stack-globe-section, .brand-introduction, .business-section, .business-contact").forEach(section => {
          gsap.fromTo(section,{"--handoff":0},{"--handoff":1,ease:"none",scrollTrigger:{trigger:section,start:"top 95%",end:"top 50%",scrub:.6}});
        });
        const globe = root.current?.querySelector(".stack-globe-section");
        if (globe && !globe.closest(".layer-gallery")) {
          const arrival = gsap.timeline({scrollTrigger:{trigger:globe,start:"top 90%",end:"top 15%",scrub:1}});
          arrival.fromTo(globe.querySelector(".stack-globe-art"),{scale:.78,rotation:-8},{scale:1,rotation:0,duration:1,ease:"power2.out"},0);
          arrival.fromTo(globe.querySelector(".stack-globe-heading"),{y:60,opacity:.45},{y:0,opacity:1,duration:.8},.05);
          arrival.fromTo(globe.querySelectorAll(".stack-globe-details>div"),{y:45,opacity:.3},{y:0,opacity:1,stagger:.12,duration:.65},.15);
        }
        const sections = gsap.utils.toArray<HTMLElement>(".business-section, .business-contact, .globe-section");
        sections.forEach(section => {
          // The timeline owns section headings and wrappers, not nested Motion items.
          const heading = section.querySelector(".section-heading, .globe-heading, .business-contact > div:first-child");
          const body = section.querySelector(".capability-workspace, .application-grid, .process-list, .globe-stage, .contact-details");
          const timeline = gsap.timeline({ scrollTrigger: { trigger: section, start: "top 92%", end: "top 28%", scrub: .65, invalidateOnRefresh: true } });
          if (heading) timeline.fromTo(heading, { y: 42, opacity: .45 }, { y: 0, opacity: 1, ease: "power2.out", duration: 1 }, 0);
          if (body) timeline.fromTo(body, { y: 55, opacity: .5 }, { y: 0, opacity: 1, ease: "power2.out", duration: 1 }, .16);
          gsap.fromTo(section, { "--section-line": 0 }, { "--section-line": 1, ease: "none", scrollTrigger: { trigger: section, start: "top 95%", end: "top 55%", scrub: .5 } });
        });
      }, root);
      return () => context.revert();
    });
    let alive = true;
    document.fonts.ready.then(() => { if (alive) ScrollTrigger.refresh(); });
    return () => { alive = false; media.revert(); };
  }, []);
  return <div ref={root} className="home-choreography"><div ref={progress} className="home-scroll-progress" aria-hidden="true" />{children}</div>;
}


