'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContent, CmsImage as Image } from '@/components/cms/ContentProvider';
import DecryptedText from './animations/DecryptedText';
import './navigation.css';

export default function Navigation({ solid = false }: { solid?: boolean }) {
 const content=useContent(); const servicePages=content.pages.filter(page=>page.kind==='service'); const groups=[...new Set(servicePages.map(page=>page.group||'Services'))];
 const [open,setOpen]=useState(false); const [scrolled,setScrolled]=useState(false);
 const ref=useRef<HTMLElement>(null); const toggle=useRef<HTMLButtonElement>(null); const pathname=usePathname();
 function close(){setOpen(false);ref.current?.querySelectorAll('details[open]').forEach(el=>el.removeAttribute('open'));}
 useEffect(()=>{const update=()=>setScrolled(window.scrollY>40);update();window.addEventListener('scroll',update,{passive:true});return()=>window.removeEventListener('scroll',update);},[]);
 useEffect(()=>{function outside(e:PointerEvent){if(!ref.current?.contains(e.target as Node))close();}function escape(e:KeyboardEvent){if(e.key==='Escape'){close();toggle.current?.focus();}}document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape);return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape);};},[]);
 const link=(label:string,href:string)=><Link href={href} onClick={close} aria-current={pathname===href?'page':undefined}><DecryptedText text={label}/></Link>;
 return <header ref={ref} className={'site-navigation ys-nav '+(solid||scrolled||open?'ys-nav-solid':'')}><div className="ys-nav-bar"><Link href="/" onClick={close} aria-label="Yellostack home" className="ys-nav-logo"><Image src="/logoyelostack.png" alt="Yellostack" width={140} height={60} priority/></Link><button ref={toggle} type="button" className="ys-nav-toggle" aria-expanded={open} aria-controls="ys-main-menu" onClick={()=>setOpen(!open)}>{open?'CLOSE −':'MENU +'}</button><nav id="ys-main-menu" aria-label="Main navigation" className={'ys-main-menu '+(open?'is-open':'')} data-lenis-prevent><div className="ys-nav-links">{link('Home','/')}<details name="ys-navigation-group" className="ys-nav-services"><summary><DecryptedText text="Services"/> <span aria-hidden="true">+</span></summary><div className="ys-mega"><div className="ys-mega-intro"><span>WHAT WE DO</span><Link href="/services" onClick={close}>Every capability.<br/>Connected. ↗</Link></div><div className="ys-mega-grid">{groups.map(group=><div key={group}><p>{group}</p>{servicePages.filter(page=>(page.group||'Services')===group).map(page=><Link href={'/'+page.slug} key={page.slug} onClick={close}>{page.title} <span aria-hidden="true">↗</span></Link>)}</div>)}</div></div></details>{link('Work','/portfolio')}<details name="ys-navigation-group" className="ys-nav-company"><summary><DecryptedText text="About"/> <span aria-hidden="true">+</span></summary><div className="ys-company-panel">{link('About us','/about-us')}{link('Our team','/team')}{link('Clients','/clients')}</div></details>{link('Careers','/careers')}{link('Blog','/blog')}{link('Contact us','/contact')}</div><Link href="/contact" className="ys-nav-contact" onClick={close}><DecryptedText text="Let’s talk"/> <span aria-hidden="true">↗</span></Link></nav></div></header>;
}
