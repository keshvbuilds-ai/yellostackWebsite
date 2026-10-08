'use client';
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import Image, { type ImageProps } from 'next/image';
import type { SiteContent } from '@/lib/cms/types';
import { translate, type Locale } from '@/lib/i18n';
import { defaultContent } from '@/lib/cms/defaults';
const LocaleContext=createContext<Locale>('en');
export function useLocale(){return useContext(LocaleContext);}
export function useTranslate(){const locale=useLocale();const content=useContent();return (text:string)=>translate(text,locale,content.copy);}
export function LocalText({text}:{text:string}){return useTranslate()(text);}
const ContentContext = createContext<SiteContent>(defaultContent);
export function ContentProvider({ content, children, locale='en' }: { content: SiteContent; children: ReactNode;locale?:Locale }) {
  return <LocaleContext.Provider value={locale}><ContentContext.Provider value={content}>{children}</ContentContext.Provider></LocaleContext.Provider>;
}
export function useContent() { return useContext(ContentContext); }
export function useSiteData() { return useContent().site; }
export function useEditedList<T extends Record<string, string>>(prefix: string, defaults: T[]): T[] {
  const content = useContent();const locale=useLocale();
  return useMemo(()=>defaults.map((item,index)=>Object.fromEntries(Object.entries(item).map(([key,value])=>[key,key==='image' ? content.media[value]||value : translate(content.copy[`${prefix}.${index}.${key}`]??value,locale,content.copy)])) as T),[content,prefix,defaults,locale]);
}
export function CmsText({ id, fallback }: { id: string; fallback: string }) {
  const content=useContent();return useTranslate()(content.copy[id] ?? fallback);
}
export function CmsImage(props: ImageProps) {
  const content = useContent();
  const src = typeof props.src === 'string' ? content.media[props.src] || props.src : props.src;
  return <Image {...props} src={src} unoptimized={typeof src === 'string' && src.startsWith('https://') || props.unoptimized} />;
}
