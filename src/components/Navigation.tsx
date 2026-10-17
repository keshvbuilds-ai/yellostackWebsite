'use client';
import { LocalText } from '@/components/cms/ContentProvider';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CmsImage as Image } from '@/components/cms/ContentProvider';
import DecryptedText from './animations/DecryptedText';
import './navigation.css';
import { capabilityLinks } from '@/content/catalogue';
const previewImages=['/banners/learning-model.svg','/banners/medical.svg','/banners/mobile.svg','/banners/enterprise.svg','/banners/web.svg','/banners/cloud.svg','/banners/ux.svg','/banners/communication.svg','/banners/devops.svg'];
import LanguageToggle from './LanguageToggle';

export default function Navigation({ solid = false }: { solid?: boolean }) {
 const [preview,setPreview]=useState(0); const previewImage=previewImages[preview];
 const [open,setOpen]=useState(false); const [scrolled,setScrolled]=useState(false);
 const ref=useRef<HTMLElement>(null); const toggle=useRef<HTMLButtonElement>(null); const pathname=usePathname();
 function close(){setOpen(false);ref.current?.querySelectorAll('details[open]').forEach(el=>el.removeAttribute('open'));}
 useEffect(()=>{const update=()=>setScrolled(window.scrollY>40);update();window.addEventListener('scroll',update,{passive:true});return()=>window.removeEventListener('scroll',update);},[]);
 useEffect(()=>{function outside(e:PointerEvent){if(!ref.current?.contains(e.target as Node))close();}function escape(e:KeyboardEvent){if(e.key==='Escape'){close();toggle.current?.focus();}}document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape);return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape);};},[]);
 useEffect(()=>{setOpen(false);ref.current?.querySelectorAll('details[open]').forEach(el=>el.removeAttribute('open'));},[pathname]);
 const link=(label:string,href:string)=><Link href={href} onClick={close} aria-current={pathname===href?'page':undefined}><DecryptedText text={label}/></Link>;
 return <header ref={ref} className={'site-navigation ys-nav '+(pathname==='/'&&!scrolled&&!open?'ys-nav-home-rest ':'')+(solid||scrolled||open?'ys-nav-solid':'')}><div className="ys-nav-bar"><Link href="/" onClick={close} aria-label="Yellostack home" className="ys-nav-logo"><Image src="/logoyelostack.png" alt="Yellostack" width={140} height={60} priority/></Link><button ref={toggle} type="button" className="ys-nav-toggle" aria-expanded={open} aria-controls="ys-main-menu" onClick={()=>setOpen(!open)}><LocalText text={open?'CLOSE −':'MENU +'}/></button><nav id="ys-main-menu" aria-label="Main navigation" className={'ys-main-menu '+(open?'is-open':'')} data-lenis-prevent><div className="ys-nav-links">{link('Home','/')}<details name="ys-navigation-group" className="ys-nav-services"><summary><DecryptedText text="Services"/> <span aria-hidden="true">+</span></summary><div className="ys-mega"><div className="ys-mega-intro"><span><LocalText text="WHAT WE DO"/></span><Link href="/services" onClick={close}><LocalText text="Every capability."/><br/><LocalText text="Connected. ↗"/></Link><Link className="ys-explore-products" href="/products" onClick={close}><LocalText text="Explore products"/> ↗</Link></div><div className="ys-mega-grid">{capabilityLinks.map((item,i)=><Link href={'/'+item.slug} key={item.slug} onClick={close} onMouseEnter={()=>setPreview(i)} onFocus={()=>setPreview(i)} className={preview===i?'is-preview':''}><LocalText text={item.title}/><span aria-hidden="true">↗</span></Link>)}</div><figure className="ys-mega-preview"><Image key={previewImage} src={previewImage} alt="" width={480} height={500}/><figcaption><LocalText text={capabilityLinks[preview].title}/></figcaption></figure></div></details>{link('Products','/products')}{link('Industries we serve','/industries-we-serve')}{link('Work','/portfolio')}<details name="ys-navigation-group" className="ys-nav-company"><summary><DecryptedText text="About"/> <span aria-hidden="true">+</span></summary><div className="ys-company-panel">{link('About us','/about-us')}{link('Our team','/team')}{link('Clients','/clients')}{link('Careers','/careers')}</div></details>{link('Blog','/blog')}{link('Contact us','/contact')}<LanguageToggle/></div><Link href="/contact" className="ys-nav-contact" onClick={close}><DecryptedText text="Let’s talk"/> <span aria-hidden="true">↗</span></Link></nav></div></header>;
}
