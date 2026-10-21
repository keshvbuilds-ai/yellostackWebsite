import {appCategories} from '@/content/work-catalogue';
import type { SiteContent } from './types';
import { defaultContent } from './defaults';
const object = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x);
function shape(value: unknown, sample: unknown, path: string): void {
  if (Array.isArray(sample)) {
    if (!Array.isArray(value) || value.length > 200) throw new Error(`${path}: expected an array with at most 200 items`);
    if (sample.length) value.forEach((item,index)=>shape(item,sample[0],`${path}.${index}`));
  } else if (object(sample)) {
    if (!object(value)) throw new Error(`${path}: expected an object`);
    for (const [key, expected] of Object.entries(sample)) shape(value[key], expected, `${path}.${key}`);
  } else if (typeof value !== typeof sample || typeof value === 'string' && value.length > 30000) throw new Error(`${path}: invalid value`);
}
export function safeUrl(url: string, image = false) {
  if (!url) return true;
  if (/^\/(?!\/)[^\s\\]*$/.test(url)) return true;
  try { const parsed=new URL(url); return parsed.protocol==='https:' || !image && ['mailto:','tel:'].includes(parsed.protocol); } catch { return false; }
}
export function validateContent(value: unknown): asserts value is SiteContent {
  if (!object(value)) throw new Error('Expected site content');
  const {whatsappNumber: _whatsappDefault,...legacyContact}=defaultContent.site.contact;
  shape(value.site,{...defaultContent.site,contact:legacyContact},'site');
  for (const key of ['copy','media']) {
    if (!object(value[key])) throw new Error(`Missing ${key}`);
    for (const [id,text] of Object.entries(value[key])) {
      if (['__proto__','constructor','prototype'].includes(id) || typeof text!=='string' || text.length>30000) throw new Error(`Invalid ${key} entry`);
      if (key==='media' && !safeUrl(text,true)) throw new Error('Media must use a local path or HTTPS URL');
    }
  }
  const templates = {
    pages: {slug:'',title:'',eyebrow:'',intro:'',kind:'',source:'',sections:[{title:'',body:''}]},
    posts: {slug:'',title:'',date:'',category:'',summary:'',paragraphs:[''],source:''},
    roles: {id:'',title:'',location:'',type:'',description:'',applyEmail:'',open:true},
    clients: {id:'',name:'',image:'',url:''},
  };
  for (const [key, sample] of Object.entries(templates)) shape(value[key],[sample],key);
  const additional={teamMembers:{id:'',name:'',role:'',bio:'',image:'',demo:false},products:{id:'',title:'',description:'',image:'',features:[''],url:''},workProjects:{id:'',title:'',description:'',image:'',service:'',url:''},industryEntries:{id:'',title:'',category:'',headline:'',body:'',use1:'',use2:'',use3:'',service:'',solution:'',image:''}};
  for(const [key,sample] of Object.entries(additional))if(value[key]!==undefined){shape(value[key],[sample],key);const rows=value[key] as Record<string,unknown>[];if(new Set(rows.map(row=>row.id)).size!==rows.length)throw new Error('Use unique item IDs');for(const row of rows){if(key==='workProjects'&&!row.service)throw new Error(`Work project "${row.title||'Untitled'}": choose a service category`);if(typeof row.image!=='string'||!safeUrl(row.image,true))throw new Error('Invalid image URL');if(row.url!==undefined&&(typeof row.url!=='string'||!safeUrl(row.url)))throw new Error(`${key} / ${row.title||row.name||row.id}: destination link must be a full HTTPS address (for example https://qnc.sa), or leave it empty`);if(typeof row.service==='string'&&row.service&&!/^[a-z0-9-]+$/.test(row.service))throw new Error('Choose a valid service');}}
  const content = value as unknown as SiteContent;
  if(content.workProjectsManaged!==undefined&&typeof content.workProjectsManaged!=='boolean')throw new Error('Invalid project publishing mode');
  for(const project of content.workProjects??[]){
   if(project.category && !appCategories.some(c=>c.slug===project.category))throw new Error('Choose a valid app category');
   if(content.workProjectsManaged&&project.service==='mobile-application-development-company-saudi-arabia'&&!project.category)throw new Error(`${project.title}: choose an app category so visitors can find it`);
  }
  for(const list of [content.pages, content.posts]) {
    const slugs = new Set<string>();
    for(const item of list) {
      if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug) || slugs.has(item.slug)) throw new Error('Use unique lowercase slugs with hyphens');
      slugs.add(item.slug);
      if(!safeUrl(item.source)) throw new Error('Invalid source URL');
    }
  }
  for(const page of content.pages) {
    if(['admin','api','careers','blog'].includes(page.slug)) throw new Error('Reserved page slug');
    if(!['company','service','directory','contact','portfolio'].includes(page.kind)) throw new Error('Invalid page kind');
    if(page.group!==undefined && typeof page.group!=='string') throw new Error('Invalid service group');
    page.sections.forEach(section=>{if(section.items!==undefined)shape(section.items,[''],'section.items');if(section.image!==undefined&&(typeof section.image!=='string'||!safeUrl(section.image,true)))throw new Error('Invalid section image');if(section.imageAlt!==undefined&&typeof section.imageAlt!=='string')throw new Error('Invalid image description');});
  }
  for(const post of content.posts) {if(!/^\d{4}-\d{2}-\d{2}$/.test(post.date)||!Number.isFinite(Date.parse(post.date)))throw new Error('Use valid YYYY-MM-DD dates');if(post.coverImage!==undefined&&(typeof post.coverImage!=='string'||!safeUrl(post.coverImage,true)))throw new Error('Invalid cover image');if(post.galleryImages!==undefined){shape(post.galleryImages,[{image:'',imageAlt:''}],'galleryImages');if(post.galleryImages.length>12)throw new Error('Use at most 12 gallery images');for(const image of post.galleryImages)if(!safeUrl(image.image,true))throw new Error('Invalid gallery image');}if(post.galleryImages!==undefined){shape(post.galleryImages,[{image:'',imageAlt:''}],'galleryImages');if(post.galleryImages.length>12)throw new Error('Use at most 12 gallery images');for(const image of post.galleryImages)if(!safeUrl(image.image,true))throw new Error('Invalid gallery image');}}
  for(const client of content.clients) {
    if(!safeUrl(client.image,true)||!client.image||!safeUrl(client.url))throw new Error('Invalid client logo or link');
    if(client.sector!==undefined && !['','Enterprise','Healthcare','Oil & Gas','Transport','Retail','Government'].includes(client.sector))throw new Error('Choose a valid client sector');
    if(client.recent!==undefined && typeof client.recent!=='boolean')throw new Error('Invalid recent client flag');
    if(client.projectSummary!==undefined && (typeof client.projectSummary!=='string'||client.projectSummary.length>2000))throw new Error('Invalid client project summary');
    if(client.recent&&!client.projectSummary?.trim())throw new Error('Add a project summary before featuring a recent client');
  }
  for(const role of content.roles) if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(role.applyEmail))throw new Error('Invalid role application email');
  if(!safeUrl(content.site.contact.telephoneHref))throw new Error('Invalid telephone link');
  const whatsapp=content.site.contact.whatsappNumber;
  if(whatsapp!==undefined&&whatsapp!==''&&(typeof whatsapp!=='string'||!/^\+?[\d ()-]+$/.test(whatsapp)||! /^[1-9]\d{6,14}$/.test(whatsapp.replace(/\D/g,''))))throw new Error('Enter a valid WhatsApp number including country code, or leave it blank');
  // These three stages are tied to the camera choreography.
  if(content.site.hero.words.length!==3)throw new Error('Hero journey requires exactly three words');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content.site.contact.email))throw new Error('Invalid contact email');
  for(const list of [content.roles,content.clients])if(new Set(list.map(item=>item.id)).size!==list.length)throw new Error('Use unique item IDs');
}
