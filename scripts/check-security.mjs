import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ts from 'typescript';
const source=await fs.readFile('src/lib/request-security.ts','utf8');
const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const {readLimitedJson,readLimitedBody,isAllowedOrigin}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const request=(body,headers={'content-type':'application/json'})=>new Request('https://example.com/api',{method:'POST',headers,body});
assert.deepEqual(await readLimitedJson(request('{"ok":true}'),100),{ok:true});
await assert.rejects(readLimitedJson(request('{'),100),e=>e.status===400);
await assert.rejects(readLimitedJson(request('{}',{'content-type':'text/plain'}),100),e=>e.status===415);
await assert.rejects(readLimitedBody(request('123456'),5),e=>e.status===413);
await assert.rejects(readLimitedBody(request('x',{'content-length':'100'}),5),e=>e.status===413);
const stream=new ReadableStream({start(c){c.enqueue(new Uint8Array(4));c.enqueue(new Uint8Array(4));c.close();}});
await assert.rejects(readLimitedBody(new Request('https://example.com',{method:'POST',body:stream,duplex:'half'}),5),e=>e.status===413);
const sharp=(await import('sharp')).default;
const png=await sharp({create:{width:2,height:2,channels:3,background:'#ffcc00'}}).png().toBuffer();
const clean=await sharp(png,{limitInputPixels:25_000_000}).rotate().webp({quality:88}).toBuffer();
assert.equal((await sharp(clean).metadata()).format,'webp');
await assert.rejects(sharp(Buffer.from([137,80,78,71]),{limitInputPixels:25_000_000}).webp().toBuffer());
console.log('PASS: JSON parsing, content types, declared/streamed limits, valid image re-encoding and malformed image rejection.');

const oldOrigins=process.env.SITE_ALLOWED_ORIGINS;
try{
 delete process.env.SITE_ALLOWED_ORIGINS;
 assert.equal(isAllowedOrigin(new Request('https://example.com/api',{headers:{origin:'https://example.com'}})),true);
 process.env.SITE_ALLOWED_ORIGINS='https://yellostack.com,https://preview.yellostack.com';
 for(const origin of ['https://yellostack.com','https://preview.yellostack.com'])assert.equal(isAllowedOrigin(new Request('http://127.0.0.1:3000/api',{headers:{origin}})),true);
 for(const origin of ['null','https://attacker.example','http://yellostack.com','https://yellostack.com.attacker.example'])assert.equal(isAllowedOrigin(new Request('http://127.0.0.1:3000/api',{headers:{origin,'x-forwarded-host':'yellostack.com','x-forwarded-proto':'https'}})),false);
 assert.equal(isAllowedOrigin(new Request('http://127.0.0.1:3000/api')),false);
 console.log('PASS: explicit HTTPS proxy origins accepted; missing, spoofed and cross-site origins rejected.');
}finally{if(oldOrigins===undefined)delete process.env.SITE_ALLOWED_ORIGINS;else process.env.SITE_ALLOWED_ORIGINS=oldOrigins;}
