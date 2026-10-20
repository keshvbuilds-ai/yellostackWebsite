'use client';
import { createContext, useContext, useMemo, useEffect, useState, type ReactNode } from 'react';
import {useRouter,usePathname} from 'next/navigation';
import Image, { type ImageProps } from 'next/image';
import type { SiteContent } from '@/lib/cms/types';
import { translate, type Locale } from '@/lib/i18n';
import { defaultContent } from '@/lib/cms/defaults';
const VisualEditingContext=createContext(false);
export function useVisualEditing(){return useContext(VisualEditingContext);}
const LocaleContext=createContext<Locale>('en');
export function useLocale(){return useContext(LocaleContext);}
export function useTranslate(){const locale=useLocale();const content=useContent();return (text:string)=>translate(text,locale,content.copy);}
export function LocalText({text}:{text:string}){const content=useContent();return <span data-cms-copy={'label:'+text} style={{display:'contents'}}>{useTranslate()(content.copy['label:'+text]??text)}</span>;}
const ContentContext = createContext<SiteContent>(defaultContent);
export function ContentProvider({ content, children, locale='en' }: { content: SiteContent; children: ReactNode;locale?:Locale }) {
  const router=useRouter();const pathname=usePathname();
  const [preview,setPreview]=useState<SiteContent|null>(null);const [editing,setEditing]=useState(false);
  useEffect(()=>{
    if(window.parent===window)return;
    const receive=(event:MessageEvent)=>{if(event.origin!==window.location.origin||event.source!==window.parent||event.data?.type!=='ys-cms-preview')return;setPreview(event.data.content);setEditing(event.data.editing===true);};
    window.addEventListener('message',receive);document.documentElement.dataset.cmsHydrated='true';window.parent.postMessage({type:'ys-cms-ready'},window.location.origin);
    return()=>window.removeEventListener('message',receive);
  },[]);
  useEffect(()=>{if(pathname.startsWith('/admin'))return;const refresh=(event:StorageEvent)=>{if(event.key==='ys-content-published')router.refresh();};window.addEventListener('storage',refresh);return()=>window.removeEventListener('storage',refresh);},[router,pathname]);
  return <LocaleContext.Provider value={preview?'en':locale}><ContentContext.Provider value={preview||content}><VisualEditingContext.Provider value={editing}>{children}</VisualEditingContext.Provider></ContentContext.Provider></LocaleContext.Provider>;
}
export function useContent() { return useContext(ContentContext); }
export function useSiteData() { return useContent().site; }
export function useEditedList<T extends Record<string, string>>(prefix: string, defaults: T[]): T[] {
  const content = useContent();const locale=useLocale();
  return useMemo(()=>defaults.map((item,index)=>Object.fromEntries(Object.entries(item).map(([key,value])=>[key,key==='image' ? content.media[`${prefix}.${index}.image`]||content.media[value]||value : translate(content.copy[`${prefix}.${index}.${key}`]??value,locale,content.copy)])) as T),[content,prefix,defaults,locale]);
}
export function CmsText({ id, fallback }: { id: string; fallback: string }) {
  const content=useContent();return <span data-cms-copy={id} style={{display:'contents'}}>{useTranslate()(content.copy[id] ?? fallback)}</span>;
}
export function CmsImage({cmsKey,cmsPath,...props}: ImageProps & {cmsKey?:string;cmsPath?:string[]}) {
  const content = useContent();
  const src = cmsKey&&content.media[cmsKey] ? content.media[cmsKey] : typeof props.src === 'string' ? content.media[props.src] || props.src : props.src;
  return <Image {...props} data-cms-path={cmsPath?JSON.stringify(cmsPath):undefined} data-cms-image={cmsKey||(typeof props.src==='string'?props.src:undefined)} src={src} unoptimized={typeof src === 'string' && src.startsWith('https://') || props.unoptimized} />;
}
