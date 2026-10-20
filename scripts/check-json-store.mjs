import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
process.env.UPSTASH_REDIS_REST_URL='https://storage.test';process.env.UPSTASH_REDIS_REST_TOKEN='test';
const values=new Map(),media=new Map();let conflict=false;
globalThis.fetch=async(_url,options)=>{
 const [op,...args]=JSON.parse(options.body);let result=null;
 if(op==='GET')result=values.get(args[0])??null;
 if(op==='HSET'){media.set(args[1],args[2]);result=1;}
 if(op==='HGET')result=media.get(args[1])??null;
 if(op==='HKEYS')result=[...media.keys()];
 if(op==='EVAL'){
  const [script,count,key,...rest]=args;
  if(count===1){const [old,next]=rest;if(conflict){values.set(key,JSON.stringify({count:5}));conflict=false;result=0;}else if((values.get(key)??'')===old){values.set(key,next);result=1;}else result=0;}
  else{const [,old,name]=rest;if((values.get(key)??'')===old){media.delete(name);result=1;}else result=0;}
 }
 return Response.json({result});
};
const source=fs.readFileSync('src/lib/cms/json-store.ts','utf8').replace("import 'server-only';",'');
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const store=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
assert.deepEqual(await store.remoteRead(()=>({count:0})),{count:0});
await store.remoteTransaction(()=>({count:0}),s=>++s.count);
conflict=true;assert.equal(await store.remoteTransaction(()=>({count:0}),s=>++s.count),6);
const bytes=Buffer.from([0,255,12,73]);await store.remoteUpload('test.jpg',bytes);assert.deepEqual(await store.remoteMedia('test.jpg'),bytes);assert.equal((await store.remoteList()).length,1);
values.set('yellostack:cms:state',JSON.stringify({content:{image:'/api/media/test.jpg'},published:{}}));
await assert.rejects(()=>store.remoteDelete('/api/media/test.jpg'),/used in saved content/);
values.set('yellostack:cms:state',JSON.stringify({content:{},published:{}}));await store.remoteDelete('/api/media/test.jpg');assert.equal((await store.remoteList()).length,0);
globalThis.fetch=async()=>Response.json({error:'denied'});await assert.rejects(()=>store.remoteRead(()=>({})),/rejected/);
console.log('PASS: JSON storage initialization, concurrent write retry, binary media, reference protection, deletion and failure handling (mock REST).');
