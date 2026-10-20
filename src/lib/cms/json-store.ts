import 'server-only';
/** Durable JSON storage over Redis REST. Credentials never reach the browser. */
export const remoteMode=()=>process.env.CMS_BACKEND==='json';
export const remoteConfigured=()=>!!(process.env.UPSTASH_REDIS_REST_URL&&process.env.UPSTASH_REDIS_REST_TOKEN);
const key=()=>`${process.env.CMS_STORAGE_PREFIX||'yellostack:cms'}:state`;
const mediaKey=()=>`${process.env.CMS_STORAGE_PREFIX||'yellostack:cms'}:media`;
export async function redis<T>(command:(string|number)[]):Promise<T>{
 if(!remoteConfigured())throw new Error('Connect persistent JSON storage in Vercel settings.');
 const response=await fetch(process.env.UPSTASH_REDIS_REST_URL!,{method:'POST',headers:{Authorization:`Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify(command),cache:'no-store',signal:AbortSignal.timeout(10000)});
 if(!response.ok)throw new Error('JSON storage unavailable. Try again.');
 const data=await response.json();if(data.error)throw new Error('JSON storage rejected the operation. Check its configuration.');return data.result;
}
export async function remoteRead<T>(initial:()=>T):Promise<T>{const raw=await redis<string|null>(['GET',key()]);return raw===null?initial():JSON.parse(raw);}
const compareAndSet="local current=redis.call('GET',KEYS[1]); if (current or '')~=ARGV[1] then return 0 end; redis.call('SET',KEYS[1],ARGV[2]); return 1";
/** Callbacks must be free of external side effects: a competing request may cause a retry. */
export async function remoteTransaction<S,T>(initial:()=>S,fn:(state:S)=>T|Promise<T>):Promise<T>{
 for(let attempt=0;attempt<6;attempt++){
  const raw=await redis<string|null>(['GET',key()]);const state:S=raw===null?initial():JSON.parse(raw);const result=await fn(state);
  if(await redis<number>(['EVAL',compareAndSet,1,key(),raw??'',JSON.stringify(state)]))return result;
 }
 throw new Error('Content store busy. Try again.');
}
export async function remoteUpload(name:string,bytes:Uint8Array){await redis(['HSET',mediaKey(),name,Buffer.from(bytes).toString('base64')]);return '/api/media/'+name;}
export async function remoteMedia(name:string){const value=await redis<string|null>(['HGET',mediaKey(),name]);if(value===null)throw new Error('Image not found');return Buffer.from(value,'base64');}
export async function remoteList(){return (await redis<string[]>(['HKEYS',mediaKey()])).map(name=>({name,url:'/api/media/'+name}));}
export async function remoteDelete(url:string){
 for(let attempt=0;attempt<6;attempt++){
  const raw=await redis<string|null>(['GET',key()]);
  if(raw){const state=JSON.parse(raw);if(JSON.stringify([state.content,state.published]).includes(url))throw new Error('This image is used in saved content. Replace it and publish before deleting.');}
  const script="if (redis.call('GET',KEYS[1]) or '')~=ARGV[1] then return 0 end; redis.call('HDEL',KEYS[2],ARGV[2]); return 1";
  if(await redis<number>(['EVAL',script,2,key(),mediaKey(),raw??'',url.split('/').pop()!]))return;
 }
 throw new Error('Content store busy. Try again.');
}
