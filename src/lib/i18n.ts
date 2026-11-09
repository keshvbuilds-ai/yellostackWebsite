import arabic from '@/content/arabic.json';
import type { SiteContent } from './cms/types';
const normalizedArabic=Object.fromEntries(Object.entries(arabic).map(([key,value])=>[key.toLowerCase(),value]));
export type Locale='en'|'ar';
export function translate(text:string,locale:Locale,copy:Record<string,string>={}):string{
 if(locale==='en')return text;
 const custom=copy['ar:'+text.trim()];
 const value=custom&&!/\?{2,}/.test(custom)?custom:(arabic as Record<string,string>)[text.trim()]??normalizedArabic[text.trim().toLowerCase()];
 if(!value&&text.includes('\n'))return text.split(/(\n+)/).map(part=>/^\n+$/.test(part)?part:translate(part,locale,copy)).join('');
 return (value?text.replace(text.trim(),value):text).replaceAll('الخبر','الدمام').replaceAll('الحسيني','الحصيني');
}
const preserved=new Set(['playStoreUrl','appStoreUrl','id','slug','kind','source','image','coverImage','layout','email','telephone','telephoneHref','applyEmail','url','date','number','service','category','sector','whatsappNumber','salesEmail','salesPhone','mapUrl','offerCode','offerExpires']);
export function localizeContent(content:SiteContent,locale:Locale):SiteContent{
 if(locale==='en')return content;
 const walk=(value:unknown,key=''):unknown=>{
  if(preserved.has(key)||key==='media')return value;
  if(typeof value==='string')return translate(value,locale,content.copy);
  if(Array.isArray(value))return value.map(v=>walk(v));
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,walk(v,k)]));
  return value;
 };
 const localized=walk(content) as SiteContent;
 localized.posts=localized.posts.map(post=>({...post,language:'ar'}));
 return localized;
}

/** Apply Arabic text changes without overwriting the English source. Structural edits remain shared. */
export function mergeArabicEdits(source:SiteContent, edited:SiteContent):SiteContent {
 const shown=localizeContent(source,'ar');const translations:Record<string,string>={};
 const merge=(original:unknown,before:unknown,after:unknown,key=''):unknown=>{
  if(key==='language')return after===before?original:after;
  if(key==='media'||preserved.has(key))return after;
  if(typeof after==='string'){
   if(after===before)return original??after;
   if(typeof original==='string'&&/^[-+]?\d+(\.\d+)?$/.test(original)&&/^[-+]?\d+(\.\d+)?$/.test(after))return after;
   if(typeof original==='string'&&original.trim()) {translations['ar:'+original.trim()]=after;return original;}
   return after;
  }
  if(Array.isArray(after))return after.map((item,index)=>{
   const identity=item&&typeof item==='object'?(item.id??item.slug):undefined;
   const old=Array.isArray(original)?original:[],view=Array.isArray(before)?before:[];
   const i=identity?old.findIndex(v=>v&&(v.id??v.slug)===identity):index;
   return merge(old[i],view[i],item);
  });
  if(after&&typeof after==='object')return Object.fromEntries(Object.entries(after).filter(([k,v])=>{if(key==='copy'&&k.startsWith('label:')&&!(original as Record<string,unknown>)?.[k]){if(v!==(before as Record<string,unknown>)?.[k])translations['ar:'+k.slice(6)]=String(v);return false;}return true;}).map(([k,v])=>[k,k.startsWith('ar:')?v:merge((original as Record<string,unknown>)?.[k],(before as Record<string,unknown>)?.[k],v,k)]));
  return after;
 };
 const result=merge(source,shown,edited) as SiteContent;
 result.copy={...result.copy,...translations};return result;
}
