'use client';
import {useState} from 'react';
import type {SiteContent} from '@/lib/cms/types';
import {defaultContent} from '@/lib/cms/defaults';
import {stockMedia,pageMedia} from '@/content/media';
import {industries} from '@/content/industries';
import {serviceBanners} from '@/content/service-banners';
import {Field,type Value} from './ContentField';
import ImageField from './ImageField';
type Section={title:string;prefixes?:string[];data?:string;images?:{key:string;label:string;fallback?:string}[];pageIndex?:number;sectionIndex?:number;hero?:boolean};
const pageNames:Record<string,string>={'about-us':'About us','team':'Our team','portfolio':'Work','contact':'Contact us','services':'Services','products':'Products','clients':'Clients','website-design-company':'Web development','mobile-application-development-company-saudi-arabia':'Mobile app development','artificial-intelligence':'AI & automation','medical-coding':'Medical coding'};
const photo=(key:string,label:string,fallback?:string)=>({key,label,fallback});
const home:Section[]=[
 {title:'Banner — Building intelligent technology',prefixes:['hero.','HeroAtmosphere.'],data:'site.hero'},
 {title:'Experience & company statistics',prefixes:['profile.stats.']},
 {title:'Our capabilities — services & images',prefixes:['Services.'],data:'site.capabilities',images:Object.entries(stockMedia).map(([name,item])=>photo(item.src,name+' image (shared)'))},
 {title:'Every layer matters — animated stack',prefixes:['ScrollAssembly.']},
 {title:'Other services — card gallery',prefixes:['LayerGallery.'],images:['experience','intelligence','operations'].map(name=>photo('/layer-'+name+'.svg',name+' card'))},
 {title:'Our story, mission & vision',prefixes:['Introduction.','profile.eyebrow','profile.summary','profile.mission.','profile.vision.']},
 {title:'Our approach — A clear process',prefixes:['WhyYellostack.'],data:'site.process'},
 {title:'Journal — latest blog articles',prefixes:['Blogs.'],data:'posts'},
 {title:'Instagram',prefixes:['instagram.']},
 {title:'Let’s work together',prefixes:['CTA.']},
 {title:'Client logos',prefixes:['clients.'],data:'clients'},
];
const footer:Section={title:'Footer & office contact — shared across pages',prefixes:['Footer.','FooterSignature.'],data:'site.contact',images:[photo('/logoyelostack.png','Yellostack logo (shared)')]};
function getAt(content:SiteContent,path:string):Value{return path.split('.').reduce((v,k)=>(v as Record<string,unknown>)[k],content as unknown) as Value;}
function setAt(content:SiteContent,path:string,value:Value){const next=structuredClone(content);const keys=path.split('.');let node=next as unknown as Record<string,unknown>;for(const key of keys.slice(0,-1))node=node[key] as Record<string,unknown>;node[keys.at(-1)!]=value;return next;}
export default function PageStudio({content,onChange,busy,previewVersion,initialPage='home'}:{initialPage?:string;content:SiteContent;onChange:(content:SiteContent)=>void;busy:boolean;previewVersion:number}){
 const [page,setPage]=useState(initialPage),[active,setActive]=useState(0),[preview,setPreview]=useState(false),[mobile,setMobile]=useState(false),[language,setLanguage]=useState('en');
 const index=content.pages.findIndex(p=>p.slug===page),entry=content.pages[index];
 let sections:Section[]=[];
 if(page==='home'){sections=home.map(s=>({...s}));sections[2].images=content.site.capabilities.map(item=>photo('capability.'+item.id,item.title+' image',({ai:stockMedia.engineering,'medical-coding':stockMedia.healthcare,applications:stockMedia.engineering,software:stockMedia.collaboration,web:stockMedia.design,branding:stockMedia.design,marketing:stockMedia.analytics,cloud:stockMedia.cloud} as Record<string,{src:string}>)[item.id]?.src||stockMedia.collaboration.src));}
 else if(page==='blog')sections=[{title:'Blog articles — newest date appears first',data:'posts'}];
 else if(page==='careers')sections=[{title:'Careers introduction',prefixes:['CareersList.','CareersMarquee.']},{title:'Open positions',data:'roles'}];
 else if(page==='industries-we-serve')sections=[{title:'Industries banner',prefixes:['industries.hero.']},{title:'Industry explorer',prefixes:['industries.explorer.'],data:'industryEntries'},{title:'Connected solutions',prefixes:['industries.solutions.']},{title:'Let’s talk about your industry',prefixes:['industries.cta.']}];
 else if(entry){
 sections.push({title:'Page banner',hero:true,pageIndex:index,images:serviceBanners[page]?[photo(serviceBanners[page],'Banner artwork')]:[]});
 if(page==='about-us')sections.push({title:'Three perspectives. One direction.',prefixes:['convergence.']},{title:'General Manager message',prefixes:['gm.'],images:[photo('/team/hassan-majrashi.png','General Manager portrait (shared)')]});
 if(page==='team')sections.push({title:'Lanyard & ID card entrance',prefixes:['team.entrance.']},{title:'The people. The possibilities.',prefixes:['team.portal.title','team.portal.body']},{title:'Our people — profiles in slider order',prefixes:['team.people.'],images:[0,1,2].map(i=>photo('team.people.'+i+'.image','Profile '+(i+1)+' portrait',i===0?'/team/hassan-majrashi.png':'/team/placeholder-saudi.svg'))});
 if(page==='artificial-intelligence')sections.push({title:'AI experience',prefixes:['ai.'],images:['vision-inspection','learning-model','knowledge-search'].map(key=>photo('/banners/'+key+'.svg',key+' image'))});
 if(page==='medical-coding')sections.push({title:'Connected healthcare — 3D experience',prefixes:['medical.scene.']},{title:'Medical coding services',prefixes:['medical.services.']});
 if(page==='website-design-company'||page==='mobile-application-development-company-saudi-arabia')sections.push({title:'Interactive development experience',prefixes:[page==='website-design-company'?'development.web.':'development.mobile.']});
 if(!['team','medical-coding','artificial-intelligence','portfolio','clients','products'].includes(page)&&entry.kind!=='contact')sections.push({title:'Editorial photo / film',images:[photo('page.'+page+'.photo','Section photograph',pageMedia(page).src)]});
 if(page!=='artificial-intelligence')entry.sections.forEach((s,i)=>sections.push({title:s.title||'Content section '+(i+1),data:`pages.${index}.sections.${i}`,pageIndex:index,sectionIndex:i}));
 if(page==='clients')sections.push({title:'Our clients',data:'clients'});
 if(entry.kind==='directory')sections.push({title:'Service / product cards — edit linked page content',data:'pages'});
 if(page==='products')sections.push({title:'Product showcase',data:'products'});
 if(page==='portfolio')sections.push({title:'Selected work ? grouped by service',data:'workProjects'},{title:'Our approach',prefixes:['work.approach.']},{title:'Start a conversation',prefixes:['work.contact.']});
 if(entry.kind==='contact')sections.push({title:'Handshake story',prefixes:['contact.story.']},{title:'Project form & office contact',prefixes:['contact.form.'],data:'site.contact'});
 if(page==='mobile-application-development-company-saudi-arabia')sections.push({title:'Real life. Reimagined. — applications',prefixes:['Portfolio.'],data:'site.services'});
 }
 sections.push(footer);
 const selected=sections[Math.min(active,sections.length-1)];
 const availableCopy={...defaultContent.copy,...content.copy};
 const keys=Object.keys(availableCopy).filter(key=>selected.prefixes?.some(prefix=>key.startsWith(prefix)));
 const route=page==='home'?'/':'/'+page;
 function updateCopy(key:string,value:string){onChange({...content,copy:{...content.copy,[key]:value}});}
 return <div className="studio"><aside className="studio-sidebar"><label className="cms-field"><span>1. Choose a page</span><select aria-label="Choose a page" value={page} onChange={e=>{setPage(e.target.value);setActive(0);}}><option value="home">Home</option>{content.pages.map(p=><option key={p.slug} value={p.slug}>{pageNames[p.slug]||p.slug.split('-').map(word=>word.charAt(0).toUpperCase()+word.slice(1)).join(' ')}</option>)}<option value="industries-we-serve">Industries we serve</option><option value="blog">Blog / Journal</option><option value="careers">Careers</option></select></label><p className="studio-step">2. Choose a section</p><p className="studio-hint">Top to bottom, just like the website.</p><nav aria-label="Page sections">{sections.map((section,i)=><button key={i} aria-current={active===i?'step':undefined} onClick={()=>setActive(i)}><small>{String(i+1).padStart(2,'0')}</small><span>{section.title}</span></button>)}</nav></aside><div className="studio-body"><header className="studio-section-header"><div><span className="studio-step">SECTION {String(active+1).padStart(2,'0')}</span><h2>{selected.title}</h2></div><div className="cms-row"><button onClick={()=>setPreview(!preview)}>{preview?'Hide':'Show'} live website</button><a href={route} target="_blank" rel="noreferrer">Open page</a></div></header><p className="studio-hint">Edit below, save your draft, then publish. Uploading an image places it directly in this section; no URL copying needed.</p>{preview&&<div className="studio-preview"><div className="cms-row"><strong>Published website preview</strong><button onClick={()=>setMobile(!mobile)}>{mobile?'Desktop':'Mobile'} view</button><span>Refreshes after publishing. Unsaved drafts are not shown.</span></div><iframe key={page+'-'+previewVersion} src={route} title="Published website preview" style={{width:mobile?390:'100%',maxWidth:'100%'}}/></div>}<fieldset disabled={busy} className="studio-fields">
 {selected.hero&&entry&&<>{['eyebrow','title','intro'].map(key=><label className="cms-field" key={key}><span>{key==='eyebrow'?'Small label above heading':key==='title'?'Main heading':'Introduction'}</span><textarea value={String(entry[key as keyof typeof entry])} onChange={e=>onChange(setAt(content,`pages.${index}.${key}`,e.target.value))}/></label>)}</>}
 {selected.images?.map(item=><ImageField key={item.key} label={item.label} value={content.media[item.key]||item.fallback||item.key} onChange={value=>onChange({...content,media:{...content.media,[item.key]:value}})}/>)}
 {keys.length>0&&<><label className="cms-field"><span>Text language</span><select value={language} onChange={e=>setLanguage(e.target.value)}><option value="en">English</option><option value="ar">Arabic translation</option></select></label>{keys.map((key,i)=>{const english=availableCopy[key];const target=language==='ar'?'ar:'+english.trim():key;return <label className="cms-field studio-copy" key={key}><span>{/\.text\.\d+$/.test(key)?'Text '+(i+1):key.split('.').slice(-2).join(' ').replace(/\b\d+\b/g,n=>String(Number(n)+1))}</span><small>{english}</small><textarea dir={language==='ar'?'rtl':'ltr'} rows={english.length>100?4:2} value={content.copy[target]??(language==='en'?english:defaultContent.copy[target]??'')} onChange={e=>updateCopy(target,e.target.value)}/></label>;})}</>}
 {selected.data&&<Field value={getAt(content,selected.data)} path={selected.data} onChange={value=>onChange(setAt(content,selected.data!,value))}/>}

 {selected.data==='posts'&&<p>Publication order follows each article’s date. The homepage shows the latest articles.</p>}
 </fieldset><div className="cms-row"><button disabled={active===0} onClick={()=>setActive(active-1)}>Previous section</button><button disabled={active>=sections.length-1} onClick={()=>setActive(active+1)}>Next section</button></div></div></div>;
}
