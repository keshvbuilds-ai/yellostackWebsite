import arabic from '@/content/arabic.json';
import type { SiteContent } from './cms/types';
const normalizedArabic=Object.fromEntries(Object.entries(arabic).map(([key,value])=>[key.toLowerCase(),value]));
export type Locale='en'|'ar';
export function translate(text:string,locale:Locale,copy:Record<string,string>={}){
 if(locale==='en')return text;
 const value=copy['ar:'+text.trim()]??(arabic as Record<string,string>)[text.trim()]??normalizedArabic[text.trim().toLowerCase()];
 return value?text.replace(text.trim(),value):text;
}
const preserved=new Set(['id','slug','kind','source','image','imageAlt','coverImage','email','telephone','telephoneHref','applyEmail','url','date','number','name']);
export function localizeContent(content:SiteContent,locale:Locale):SiteContent{
 if(locale==='en')return content;
 const walk=(value:unknown,key=''):unknown=>{
  if(preserved.has(key)||key==='media')return value;
  if(typeof value==='string')return translate(value,locale,content.copy);
  if(Array.isArray(value))return value.map(v=>walk(v));
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,walk(v,k)]));
  return value;
 };
 return walk(content) as SiteContent;
}
