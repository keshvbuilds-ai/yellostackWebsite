'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

export default function SiteReveals() {
 const pathname = usePathname();
 useEffect(() => {
  if (pathname.startsWith('/admin')) return;
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
   const nodes = new Map<HTMLElement, { tween?: gsap.core.Tween; opacity: string; translate: string; filter: string; visible?: boolean }>();
   const protectedScene = '.ai-experience, .ai-neural-story, .medical-story, .layer-gallery, .handshake-story';
   const selector = '.story-copy, .ys-inner-detail > div, .ys-inner-body article, [data-site-reveal], .ys-contact-form > div, .business-section .section-heading h2, .business-section .section-heading p, .business-section .application-grid article, .business-section .process-list > li, .business-contact .contact-details > p, footer p, footer h3, footer nav';
   const animate = (node: HTMLElement, visible: boolean) => {
    const state = nodes.get(node); if (!state || state.visible === visible) return;
    state.visible = visible;
    state.tween?.kill();
    state.tween = gsap.to(node, { opacity: visible ? 1 : 0, translate: visible ? '0px 0px' : (node.getBoundingClientRect().top < window.innerHeight * .22 ? '0px 0px' : '0px 58px'), filter: visible ? 'blur(0px)' : 'blur(0px)', duration: visible ? 1.05 : .6, ease: visible ? 'power3.out' : 'power2.inOut', overwrite: 'auto' });
   };
   const headerBottom = Math.max(0, Math.round(document.querySelector('.site-navigation')?.getBoundingClientRect().bottom || 100));
   const observer = new IntersectionObserver(entries => {
    for (const entry of entries) { const node = entry.target as HTMLElement; animate(node, entry.isIntersecting || node.contains(document.activeElement)); }
   }, { threshold: 0, rootMargin: `-${headerBottom}px 0px 0px 0px` });
   const discover = () => {
    for (const [node, state] of nodes) if (!node.isConnected) { state.tween?.kill(); observer.unobserve(node); nodes.delete(node); }
    document.querySelectorAll<HTMLElement>(selector).forEach(node => {
     if (nodes.has(node) || node.closest(protectedScene) || node.parentElement?.closest(selector)) return;
     nodes.set(node, { opacity: node.style.opacity, translate: node.style.translate, filter: node.style.filter });
     const bounds = node.getBoundingClientRect();
     if (bounds.top >= window.innerHeight || bounds.bottom <= 0) gsap.set(node, { opacity: 0, translate: '0px 58px', filter: 'blur(4px)' });
     observer.observe(node);
    });
   };
   const focus = (event: FocusEvent) => { for (const node of nodes.keys()) if (node.contains(event.target as Node)) animate(node, true); };
   discover(); let discoveryFrame = 0;
   const mutations = new MutationObserver(records => {
    if(discoveryFrame || !records.some(record => [...record.addedNodes, ...record.removedNodes].some(node => node.nodeType === 1)))return;
    discoveryFrame = requestAnimationFrame(() => { discoveryFrame = 0; discover(); });
   });
   mutations.observe(document.body, { childList: true, subtree: true }); document.addEventListener('focusin', focus);
   return () => { cancelAnimationFrame(discoveryFrame); mutations.disconnect(); observer.disconnect(); document.removeEventListener('focusin', focus); nodes.forEach((state, node) => { state.tween?.kill(); node.style.opacity = state.opacity; node.style.translate = state.translate; node.style.filter = state.filter; }); };
  });
  return () => media.revert();
 }, [pathname]);
 return null;
}
