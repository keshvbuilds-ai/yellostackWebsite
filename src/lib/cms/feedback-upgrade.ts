import changes from '@/content/feedback-copy-migration.json';
import { defaultContent } from './defaults';
import type { SiteContent } from './types';
/** Upgrade bundled legacy values without replacing custom editor copy. Idempotent. */
export function upgradeFeedback(content:SiteContent):SiteContent {
 const copy={...defaultContent.copy,...content.copy};
 for(const [key,[before,after]] of Object.entries(changes))if(copy[key]===before)copy[key]=after;
 const pages=content.pages.map(page=>page.slug==='clients'?{...page,
 title:page.title==='Built on relationships.'?'Trusted across the Kingdom.':page.title,
 intro:page.intro==='Close collaboration, considered solutions and a commitment to the people behind each business.'?defaultContent.pages.find(p=>p.slug==='clients')!.intro:page.intro}:page);
 if(!pages.some(page=>page.slug==='products'))pages.push(defaultContent.pages.find(page=>page.slug==='products')!);
 const legacyCapabilities=content.site.capabilities.map(item=>item.id).join(',')==='ai,medical-coding,applications,software,branding,marketing,cloud';
 return {...content,pages,copy,site:{...content.site,
 contact:{...defaultContent.site.contact,...content.site.contact},
 hero:{...content.site.hero,words:content.site.hero.words.join(',')==='Discover,Strategize,Execute'?defaultContent.site.hero.words:content.site.hero.words},
 capabilities:legacyCapabilities?defaultContent.site.capabilities:content.site.capabilities},
 clients:content.clients.map(client=>({sector:defaultContent.clients.find(item=>item.id===client.id)?.sector||'',recent:false,projectSummary:'',...client}))};
}
