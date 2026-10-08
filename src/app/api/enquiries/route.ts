import { createHmac } from 'node:crypto';
import { validateEnquiry } from '@/lib/enquiries';
export const runtime='nodejs';
const reply=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return reply({error:'Invalid origin.'},403);
 const url=process.env.SUPABASE_URL?.replace(/\/$/,'');const secret=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!secret)return reply({error:'Online submissions are not available yet. Please contact hello@yellostack.com.'},503);
 try{
  if(!request.headers.get('content-type')?.includes('application/json'))return reply({error:'Invalid content type.'},415);
  const reader=request.body?.getReader();if(!reader)return reply({error:'Empty request.'},400);let size=0;const parts:Uint8Array[]=[];
  while(true){const chunk=await reader.read();if(chunk.done)break;size+=chunk.value.byteLength;if(size>16000){await reader.cancel();return reply({error:'Message is too long.'},413);}parts.push(chunk.value);}
  const data=validateEnquiry(JSON.parse(Buffer.concat(parts).toString('utf8')));
  // Vercel overwrites this header; do not trust client-supplied forwarded headers.
  const ip=process.env.VERCEL?request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim()||'unknown':'local';
  const fingerprint=createHmac('sha256',secret).update(ip).digest('hex');
  const response=await fetch(url+'/rest/v1/rpc/submit_enquiry',{method:'POST',headers:{apikey:secret,Authorization:`Bearer ${secret}`,'Content-Type':'application/json'},body:JSON.stringify({payload:data,visitor_hash:fingerprint}),cache:'no-store',signal:AbortSignal.timeout(12000)});
  if(!response.ok){const error=await response.json().catch(()=>({}));if(error.message==='Please wait before submitting again.')return reply({error:error.message},429);return reply({error:'We couldn’t save your enquiry. Please try again or email hello@yellostack.com.'},503);}
  return reply({ok:true});
 }catch(error){if(error instanceof SyntaxError)return reply({error:'Invalid request.'},400);if(error instanceof Error&&error.name!=='TimeoutError'&&error.name!=='TypeError')return reply({error:error.message},400);return reply({error:'Connection interrupted. Please try again.'},503);}
}
