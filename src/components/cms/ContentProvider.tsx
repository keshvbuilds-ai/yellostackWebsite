'use client';
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import Image, { type ImageProps } from 'next/image';
import type { SiteContent } from '@/lib/cms/types';
import { defaultContent } from '@/lib/cms/defaults';
const ContentContext = createContext<SiteContent>(defaultContent);
export function ContentProvider({ content, children }: { content: SiteContent; children: ReactNode }) {
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}
export function useContent() { return useContext(ContentContext); }
export function useSiteData() { return useContent().site; }
export function useEditedList<T extends Record<string, string>>(prefix: string, defaults: T[]): T[] {
  const content = useContent();
  return useMemo(()=>defaults.map((item,index)=>Object.fromEntries(Object.entries(item).map(([key,value])=>[key,key==='image' ? content.media[value]||value : content.copy[`${prefix}.${index}.${key}`]??value])) as T),[content,prefix,defaults]);
}
export function CmsText({ id, fallback }: { id: string; fallback: string }) {
  return useContent().copy[id] ?? fallback;
}
export function CmsImage(props: ImageProps) {
  const content = useContent();
  const src = typeof props.src === 'string' ? content.media[props.src] || props.src : props.src;
  return <Image {...props} src={src} unoptimized={typeof src === 'string' && src.startsWith('https://') || props.unoptimized} />;
}
