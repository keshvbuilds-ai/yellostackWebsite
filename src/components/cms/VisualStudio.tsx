'use client';
import {useEffect,useRef,useState} from 'react';
import type {SiteContent} from '@/lib/cms/types';
import ImageField from './ImageField';
import PageStudio from './PageStudio';
import {defaultContent} from '@/lib/cms/defaults';
type Target={path:string[];value:string;kind:'text'|'image';label:string};
const names:Record<string,string>={'about-us':'About us',team:'Our team',portfolio:'Work',contact:'Contact us',services:'Services',products:'Products',clients:'Clients','website-design-company':'Web development','mobile-application-development-company-saudi-arabia':'Mobile app development','artificial-intelligence':'AI & automation','medical-coding':'Medical coding'};
const read=(content:SiteContent,path:string[])=>path.reduce<unknown>((node,key)=>node&&typeof node==='object'?(node as Record<string,unknown>)[key]:undefined,content);
function write(content:SiteContent,path:string[],value:string){const next=structuredClone(content);let node=next as unknown as Record<string,unknown>;for(const key of path.slice(0,-1))node=node[key] as Record<string,unknown>;node[path.at(-1)!]=value;return next;}
export default function VisualStudio({content,onChange,busy}:{content:SiteContent;onChange:(content:SiteContent)=>void;busy:boolean}){
 const frame=useRef<HTMLIFrameElement>(null),latest=useRef(content),published=useRef<SiteContent|null>(null),cleanup=useRef<()=>void>(()=>{});
 const [sectionEditor,setSectionEditor]=useState(false),[expanded,setExpanded]=useState(false);
 const [route,setRoute]=useState('/'),[mobile,setMobile]=useState(false),[editing,setEditing]=useState(true),[selection,setSelection]=useState<Target|null>(null),[ready,setReady]=useState(false),[notice,setNotice]=useState('Scroll the website. Click any highlighted text or image to change it.');
 const mode=useRef(editing);mode.current=editing;
 latest.current=content;
 useEffect(()=>{fetch('/api/cms/public').then(r=>r.json()).then(data=>{published.current=data;window.dispatchEvent(new Event('ys-visual-update'));}).catch(()=>{});},[]);
 const send=()=>frame.current?.contentWindow?.postMessage({type:'ys-cms-preview',content:latest.current,editing:mode.current},window.location.origin);
 useEffect(()=>{send();},[content]);
 useEffect(()=>{const receive=(event:MessageEvent)=>{if(event.origin===location.origin&&event.source===frame.current?.contentWindow&&event.data?.type==='ys-cms-ready')connect();};window.addEventListener('message',receive);return()=>window.removeEventListener('message',receive);},[]);
 useEffect(()=>()=>cleanup.current(),[]);
 function connect(){
 const editing=mode.current;
 cleanup.current();const doc=frame.current?.contentDocument,win=frame.current?.contentWindow;if(!doc||!win||!doc.documentElement.dataset.cmsHydrated)return;
 // This is the real site, isolated from editor controls. Never submit its forms from a preview.
 const guardLink=(event:MouseEvent)=>{if(editing)return;const anchor=(event.target as HTMLElement).closest?.('a');if(!anchor)return;const url=new URL(anchor.href,doc.location.href);if(url.origin!==location.origin||url.pathname.startsWith('/admin')){event.preventDefault();event.stopImmediatePropagation();setNotice('Use the public website for external links.');}};doc.addEventListener('click',guardLink,true);
 const preventSubmit=(event:Event)=>{event.preventDefault();setNotice('Forms are disabled in this private preview.');};doc.addEventListener('submit',preventSubmit,true);
 const style=doc.createElement('style');style.textContent='[data-cms-hover]{outline:2px solid #ffcc02!important;outline-offset:5px!important;cursor:pointer!important}.brand-curtain{display:none!important}.cms-editing canvas,.cms-editing .industry-hover-preview{pointer-events:none!important}.cms-editing [data-cms-copy],.cms-editing [data-cms-path]{pointer-events:auto!important}.cms-editing .premium-cursor,.cms-editing .industry-hover-preview{display:none!important}.cms-editing .industry-row-reveal{grid-template-rows:1fr!important;visibility:visible!important}';doc.head.appendChild(style);
 const bound=new Map<Text,Target>();const images=new Map<HTMLImageElement,Target>();let hovering:HTMLElement|null=null;let timer:ReturnType<typeof setTimeout>|undefined;
 const records=()=>{
 const all:Target[]=[];
 const walk=(node:unknown,path:string[])=>{if(typeof node==='string'&&node.trim()&& !/^(id|slug|kind|source|href|url|date|imageAlt)$/.test(path.at(-1)!))all.push({path,value:node,kind:/^(image|coverImage)$/.test(path.at(-1)!)?'image':'text',label:path.at(-1)!});else if(Array.isArray(node))node.forEach((item,i)=>walk(item,[...path,String(i)]));else if(node&&typeof node==='object')Object.entries(node).forEach(([key,value])=>walk(value,[...path,key]));};
 const current=latest.current;const slug=(doc.location?.pathname||'/').slice(1);const index=current.pages.findIndex(p=>p.slug===slug);if(index>=0)walk(current.pages[index],['pages',String(index)]);
 if(slug.startsWith('blog/')){const i=current.posts.findIndex(p=>p.slug===slug.slice(5));if(i>=0)walk(current.posts[i],['posts',String(i)]);}
 walk(current.teamMembers,['teamMembers']);walk(current.products,['products']);walk(current.workProjects,['workProjects']);walk(current.industryEntries,['industryEntries']);walk(current.site,['site']);walk(current.roles,['roles']);walk(current.clients,['clients']);walk(current.posts,['posts']);
 Object.entries({...defaultContent.copy,...current.copy}).filter(([key])=>!key.startsWith('ar:')).forEach(([key,value])=>all.push({path:['copy',key],value,kind:'text',label:'Text'}));return all.flatMap(item=>{const previous=published.current?read(published.current,item.path):undefined;return typeof previous==='string'&&previous!==item.value?[item,{...item,value:previous}]:[item];});
 };
 const scan=()=>{if(frame.current?.contentDocument!==doc)return;
 const candidates=records();const walker=doc.createTreeWalker(doc.body,4);let node:Node|null;
 while((node=walker.nextNode())){const text=node as Text;const parent=text.parentElement;if(!parent||parent.closest('script,style,noscript,textarea,input,svg,[data-cms-copy]'))continue;
 let target=bound.get(text);if(!target){target=candidates.find(r=>r.kind==='text'&&r.value.trim()===text.textContent?.trim());if(target)bound.set(text,target);}
 if(target){const updated=read(latest.current,target.path);if(typeof updated==='string'&&text.textContent?.trim()!==updated.trim())text.textContent=updated;}
 }
 for(const [image,target] of images){if(!image.isConnected){images.delete(image);continue;}const value=read(latest.current,target.path);if(typeof value==='string'&&value&&image.getAttribute('src')!==value){image.removeAttribute('srcset');image.setAttribute('src',value);}}
 for(const node of bound.keys())if(!node.isConnected)bound.delete(node);
 };
 const observer=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(scan,150);});observer.observe(doc.body,{childList:true,subtree:true,characterData:true});scan();
 const targetFor=(element:HTMLElement):Target|null=>{
 const explicit=element.closest<HTMLElement>('[data-cms-path]');if(explicit){try{const path=JSON.parse(explicit.dataset.cmsPath!);const value=read(latest.current,path);return {path,value:typeof value==='string'&&value?value:explicit.getAttribute('src')||explicit.textContent||'',kind:explicit.tagName==='IMG'?'image':'text',label:explicit.tagName==='IMG'?'Replace image':'Edit text'};}catch{return null;}}
 const copy=element.closest<HTMLElement>('[data-cms-copy]');if(copy){const key=copy.dataset.cmsCopy!;return {path:['copy',key],value:String(latest.current.copy[key]??copy.textContent??''),kind:'text',label:'Edit text'};}
 const img=element.closest<HTMLImageElement>('img');if(img){const source=img.dataset.cmsImage;let key=source;
 if(source){const matching=Object.entries(latest.current.media).filter(([,value])=>value===source);if(matching.length===1)key=matching[0][0];return {path:['media',key!],value:String(latest.current.media[key!]||(source.startsWith('/')||source.startsWith('https:')?source:img.getAttribute('src')||'')),kind:'image',label:img.alt||'Replace image'};}
 const raw=img.getAttribute('src')||'';const match=records().find(r=>r.kind==='image'&&r.value===raw);if(match)return match;
 const chapter=img.closest('.work-chapter');const pageIndex=latest.current.pages.findIndex(p=>p.slug==='portfolio');if(chapter&&pageIndex>=0){const i=Array.from(doc.querySelectorAll('.work-chapter')).indexOf(chapter);return {path:['pages',String(pageIndex),'sections',String(i),'image'],value:raw,kind:'image',label:'Project image'};}
 }
 for(const [text,target] of bound)if(element===text.parentElement&&!/^\d+$/.test(text.textContent?.trim()||'')){return {...target,value:String(read(latest.current,target.path)??target.value),label:'Edit text'};}return null;
 };
 const hover=(event:MouseEvent)=>{if(hovering)hovering.removeAttribute('data-cms-hover');const el=event.target as HTMLElement;if(!el?.closest)return;const target=targetFor(el);if(target){hovering=el.closest('[data-cms-copy]')?.parentElement||el;hovering?.setAttribute('data-cms-hover','');}};
 const blockPointer=(event:Event)=>{event.stopImmediatePropagation();};
 const click=(event:MouseEvent)=>{const el=event.target as HTMLElement;if(!el?.closest)return;const target=targetFor(el);if(target){event.preventDefault();event.stopImmediatePropagation();const clickedImage=el.closest<HTMLImageElement>('img');if(clickedImage)images.set(clickedImage,target);setSelection(target);setNotice('Your changes appear here immediately. Publish when you are ready.');}else if(el.closest('a')){event.preventDefault();event.stopImmediatePropagation();setNotice('Switch to Browse to follow links, or choose a page above.');}};
 doc.documentElement.classList.toggle('cms-editing',editing);
 if(editing){doc.addEventListener('pointerdown',blockPointer,true);doc.addEventListener('pointermove',blockPointer,true);doc.addEventListener('mousemove',hover);doc.addEventListener('click',click,true);}
 const restore=()=>{send();scan();};window.addEventListener('ys-visual-update',restore);
 setReady(true);send();
 cleanup.current=()=>{clearTimeout(timer);observer.disconnect();style.remove();hovering?.removeAttribute('data-cms-hover');doc.removeEventListener('pointerdown',blockPointer,true);doc.removeEventListener('pointermove',blockPointer,true);doc.removeEventListener('mousemove',hover);doc.removeEventListener('click',click,true);doc.removeEventListener('submit',preventSubmit,true);doc.removeEventListener('click',guardLink,true);window.removeEventListener('ys-visual-update',restore);};
 }
 useEffect(()=>{if(ready)connect();/* Rebind interaction without reloading the page. */},[editing]); // eslint-disable-line react-hooks/exhaustive-deps
 useEffect(()=>{window.dispatchEvent(new Event('ys-visual-update'));},[content]);
 const selectedValue=selection?String(read(content,selection.path)??selection.value):'';
 const pages=[{path:'/',name:'Home'},...content.pages.map(p=>({path:'/'+p.slug,name:names[p.slug]||p.eyebrow||p.title})),{path:'/industries-we-serve',name:'Industries we serve'},{path:'/blog',name:'Blog'},{path:'/careers',name:'Careers'}];
 return <section className={'visual-studio'+(expanded?' is-expanded':'')}><div className="visual-controls"><label>Page<select aria-label="Website page" value={route} onChange={e=>{setRoute(e.target.value);setSelection(null);setReady(false);}}>{pages.map(p=><option key={p.path} value={p.path}>{p.name}</option>)}</select></label><div className="visual-toggle"><button aria-pressed={editing} onClick={()=>setEditing(true)}>Click to edit</button><button aria-pressed={!editing} onClick={()=>{setEditing(false);setSelection(null);}}>Browse</button></div><button onClick={()=>setMobile(!mobile)}>{mobile?'Desktop view':'Mobile view'}</button><button onClick={()=>{setSectionEditor(!sectionEditor);setSelection(null);}}>{sectionEditor?'Back to website':'Edit section text & images'}</button><button onClick={()=>setExpanded(!expanded)}>{expanded?'Exit full screen':'Full screen'}</button><span className="visual-private">Private draft preview</span></div><p className="visual-help" role="status">{notice}</p>{sectionEditor?<PageStudio content={content} onChange={onChange} busy={busy} previewVersion={0} initialPage={route==='/'?'home':route.slice(1)}/>:<div className={'visual-workspace'+(selection?' has-selection':'')}><div className="visual-canvas">{!ready&&<div className="visual-loading">Opening your website…</div>}<iframe ref={frame} src={route+'?cmsVisual=1'} onLoad={connect} title="Click your website to edit" style={{width:mobile?'390px':'100%'}}/></div>{selection&&<aside className="visual-inspector"><header><h2>{selection.kind==='image'?'Change this image':'Change this text'}</h2><button aria-label="Close editor" onClick={()=>setSelection(null)}>×</button></header><fieldset disabled={busy}>{selection.kind==='image'?<ImageField label={selection.label} value={selectedValue} onChange={value=>onChange(write(content,selection.path,value))}/>:<><label className="cms-field"><span>Text shown on your website</span><textarea autoFocus aria-label="Selected website text" rows={8} value={selectedValue} onChange={e=>onChange(write(content,selection.path,e.target.value))}/></label><button onClick={()=>onChange(write(content,selection.path,selection.value))}>Undo this edit</button></>}</fieldset><p>Look at the website to see your change. Use <strong>Publish</strong> above when it is ready for visitors.</p><button className="visual-done" onClick={()=>setSelection(null)}>Done editing</button></aside>}</div>}</section>;
}
