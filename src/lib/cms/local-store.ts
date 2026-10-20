import 'server-only';
import { mkdir, readFile, writeFile, rename, readdir, unlink } from 'node:fs/promises';
import path from 'node:path';
import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import { defaultContent } from './defaults';
import type { SiteContent } from './types';
export const localMode = () => process.env.CMS_BACKEND !== 'supabase';
export const dataDirectory = () => path.resolve(/* turbopackIgnore: true */ process.env.CMS_DATA_DIR || '.cms-data');
type State = { content:SiteContent; published:SiteContent; revision:number; enquiries:Record<string,unknown>[]; sessions:Record<string,number>; attempts:number[] };
async function read():Promise<State>{try{return JSON.parse(await readFile(path.join(dataDirectory(),'store.json'),'utf8'));}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT')throw e;return {content:defaultContent,published:defaultContent,revision:0,enquiries:[],sessions:{},attempts:[]};}}
// An exclusive filesystem lock also serializes multiple Node workers on the same volume.
export async function transaction<T>(fn:(state:State)=>T|Promise<T>):Promise<T>{
 await mkdir(dataDirectory(),{recursive:true});const lock=path.join(dataDirectory(),'write.lock');let locked=false;
 for(let i=0;i<100;i++){try{await mkdir(lock);locked=true;break;}catch(e){if((e as NodeJS.ErrnoException).code!=='EEXIST')throw e;await new Promise(r=>setTimeout(r,50));}}
 if(!locked)throw new Error('Content store busy. Try again.');
 try{const state=await read();const result=await fn(state);const tmp=path.join(dataDirectory(),randomBytes(12).toString('hex')+'.tmp');await writeFile(tmp,JSON.stringify(state),{mode:0o600});await rename(tmp,path.join(dataDirectory(),'store.json'));return result;}finally{await import('node:fs/promises').then(fs=>fs.rmdir(lock));}
}
export async function localContent(published=false){const state=await read();const content=published?state.published:state.content;const expanded={...content};if(!content.teamMembers)expanded.teamMembers=defaultContent.teamMembers!.map((person,i)=>({...person,name:content.copy['team.people.'+i+'.name']??person.name,role:content.copy['team.people.'+i+'.role']??person.role,bio:content.copy['team.people.'+i+'.bio']??person.bio,image:content.media['team.people.'+i+'.image']??person.image}));if(!content.industryEntries)expanded.industryEntries=defaultContent.industryEntries!.map((item,i)=>Object.fromEntries(Object.entries(item).map(([key,value])=>[key,key==='image'?(content.media['industries.sectors.'+i+'.image']??value):(content.copy['industries.sectors.'+i+'.'+key]??value)])) as typeof item);return {content:{...defaultContent,...expanded,copy:{...defaultContent.copy,...content.copy},media:{...defaultContent.media,...content.media}},revision:state.revision};}
const digest=(token:string)=>createHash('sha256').update(token).digest('hex');
export const localConfigured=()=>!!process.env.CMS_ADMIN_USERNAME&&!!process.env.CMS_ADMIN_PASSWORD_HASH;
export async function localLogin(username:string,password:string){
 const allowed=await transaction(s=>{s.attempts=s.attempts.filter(t=>t>Date.now()-60000);if(s.attempts.length>=10)return false;s.attempts.push(Date.now());return true;});
 if(!allowed)throw new Error('Too many sign-in attempts. Wait one minute.');
 const [salt,hash]= (process.env.CMS_ADMIN_PASSWORD_HASH||'').split(':');
 if(!salt||!hash)throw new Error('Admin account is not configured');
 const actual=scryptSync(password,salt,64),expected=Buffer.from(hash,'hex');
 if(expected.length!==actual.length||!timingSafeEqual(actual,expected)||username!==process.env.CMS_ADMIN_USERNAME)throw new Error('Unauthorized');
 const token=randomBytes(32).toString('hex');await transaction(s=>{s.sessions=Object.fromEntries(Object.entries(s.sessions).filter(([,expiry])=>expiry>Date.now()));s.sessions[digest(token)]=Date.now()+3600000;});return token;
}
export async function localSession(token:string){const s=await read();return (s.sessions[digest(token)]||0)>Date.now();}
export async function localLogout(token:string){await transaction(s=>{delete s.sessions[digest(token)];});}
export async function saveLocal(content:SiteContent,revision:number,publish:boolean){return transaction(s=>{if(s.revision!==revision)throw new Error('Revision conflict: reload the saved draft before saving.');s.content=content;if(publish)s.published=content;return ++s.revision;});}
export async function uploadLocal(name:string,bytes:Uint8Array){await mkdir(path.join(dataDirectory(),'media'),{recursive:true});await writeFile(path.join(dataDirectory(),'media',name),bytes);return '/api/media/'+name;}
export async function listMedia(){try{return (await readdir(path.join(dataDirectory(),'media'))).filter(n=>/^[a-f0-9-]+\.(png|jpg|webp|avif)$/.test(n)).map(name=>({name,url:'/api/media/'+name}));}catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT')return [];throw e;}}
export async function deleteMedia(url:string){if(!/^\/api\/media\/[a-f0-9-]+\.(png|jpg|webp|avif)$/.test(url))throw new Error('Invalid media URL');await transaction(async s=>{if(JSON.stringify([s.content,s.published]).includes(url))throw new Error('This image is used in saved content. Replace it and publish before deleting.');await unlink(path.join(dataDirectory(),'media',path.basename(url)));});}
