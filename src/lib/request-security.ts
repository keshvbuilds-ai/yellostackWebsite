/** Explicit public origins avoid trusting client-supplied proxy headers. */
export function isAllowedOrigin(request:Request){
 const origin=request.headers.get('origin');
 if(!origin||origin==='null')return false;
 const configured=process.env.SITE_ALLOWED_ORIGINS;
 if(!configured)return origin===new URL(request.url).origin;
 return configured.split(',').some(value=>{
  const candidate=value.trim();
  try{const url=new URL(candidate);return url.protocol==='https:'&&url.origin===candidate&&candidate===origin;}catch{return false;}
 });
}

/** Bound streamed bodies before parsers allocate memory. Works without Content-Length. */
export class RequestError extends Error { constructor(message:string,public status=400){super(message);} }
export async function readLimitedBody(request:Request,maxBytes:number){
 const declared=request.headers.get('content-length');
 if(declared&&Number(declared)>maxBytes)throw new RequestError('Request too large',413);
 const reader=request.body?.getReader();if(!reader)throw new RequestError('Empty request');
 const chunks:Uint8Array[]=[];let size=0;
 try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>maxBytes){await reader.cancel();throw new RequestError('Request too large',413);}chunks.push(value);}}finally{reader.releaseLock();}
 return Buffer.concat(chunks);
}
export async function readLimitedJson(request:Request,maxBytes:number){
 if(request.headers.get('content-type')?.split(';')[0].trim()!=='application/json')throw new RequestError('Use application/json',415);
 const bytes=await readLimitedBody(request,maxBytes);
 try{return JSON.parse(bytes.toString('utf8'));}catch{throw new RequestError('Invalid JSON');}
}
