'use client';
import {useEffect,useRef} from 'react';
import './footer-logo-atmosphere.css';
/** Uses the original logo pixels, cropping only the wordmark from the asset. */
export default function FooterLogoAtmosphere(){
 const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{const el=root.current;if(!el)return;let visible=false;const update=()=>{el.dataset.playing=String(visible&&!document.hidden);};const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;update();});observer.observe(el);document.addEventListener('visibilitychange',update);return()=>{observer.disconnect();document.removeEventListener('visibilitychange',update);};},[]);
 return <div className="footer-logo-atmosphere" ref={root} aria-hidden="true" data-playing="false"><div className="footer-logo-halo"/><div className="footer-logo-ripple"/><div className="footer-logo-ripple second"/><div className="footer-logo-drift"><svg className="footer-logo-watermark" viewBox="0 0 520 551" focusable="false"><image href="/logoyelostack.png" width="1289" height="551"/></svg></div></div>;
}
