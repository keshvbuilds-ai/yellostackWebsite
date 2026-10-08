import { cookies } from 'next/headers';
import { cmsConfig, getSiteContent, requireEditor, sessionCookie, supabase } from '@/lib/cms/server';
import { defaultContent } from '@/lib/cms/defaults';
import { validateContent } from '@/lib/cms/validate';
export const runtime = 'nodejs';
type Context = { params: Promise<{action:string}> };
const json = (body: unknown, status=200) => Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
function errorResponse(error: unknown) {
  const message=error instanceof Error?error.message:'Request failed';
  return json({error:message},message==='Unauthorized'?401:message==='Forbidden'?403:message.includes('conflict')?409:400);
}
async function readBody(request: Request) {
  const body=await request.text(); if(body.length>1_500_000)throw new Error('Content exceeds 1.5 MB'); return JSON.parse(body);
}
export async function GET(_request:Request, {params}:Context) {
  const {action}=await params;
  if(action==='public') return json(await getSiteContent());
  if(action==='status') return json({configured:!!cmsConfig()});
  try {
    const editor=await requireEditor();
    if(action==='session') return json({email:editor.email});
    if(action==='enquiries') {
      const offset=Math.min(100000,Math.max(0,Number(new URL(_request.url).searchParams.get('offset'))||0));
      const response=await supabase('/rest/v1/enquiries?select=id,kind,email,name,message,mode,offer_code,created_at&order=created_at.desc&limit=50&offset='+Math.floor(offset),{},editor.token);
      if(!response.ok)throw new Error('Inbox unavailable. Run migration 002_enquiries.sql.');
      return json({rows:await response.json()});
    }
    if(action==='content') {
      const response=await supabase('/rest/v1/cms_drafts?id=eq.site&select=content,revision',{},editor.token);
      if(!response.ok)throw new Error('Cannot read CMS draft. Check the database migration and editor membership.');
      const rows=await response.json();
      const draft=rows[0] || {content:defaultContent,revision:0};
      return json({...draft,content:{...draft.content,copy:{...defaultContent.copy,...draft.content.copy},media:{...defaultContent.media,...draft.content.media}}});
    }
    return json({error:'Not found'},404);
  } catch(error){return errorResponse(error);}
}
export async function POST(request:Request,{params}:Context) {
  // Browser writes must come from this deployment. No cross-origin mutation API.
  if(request.headers.get('origin')!==new URL(request.url).origin)return json({error:'Forbidden origin'},403);
  const {action}=await params;
  try {
    if(action==='login') {
      const body=await readBody(request);
      if(typeof body.email!=='string'||typeof body.password!=='string'||body.email.length>254||body.password.length>1024)throw new Error('Invalid credentials');
      const response=await supabase('/auth/v1/token?grant_type=password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:body.email,password:body.password})});
      if(!response.ok)return json({error:'Sign-in failed. Check your credentials or try again later.'},401);
      const session=await response.json();
      const membership=await supabase(`/rest/v1/cms_editors?user_id=eq.${encodeURIComponent(session.user.id)}&select=user_id`,{},session.access_token);
      if(!membership.ok || !(await membership.json()).length)return json({error:'This account is not a CMS editor.'},403);
      (await cookies()).set(sessionCookie,session.access_token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/api/cms',maxAge:Math.min(session.expires_in,3600)});
      return json({ok:true});
    }
    if(action==='logout') {
      const jar=await cookies();const token=jar.get(sessionCookie)?.value;
      if(token)await supabase('/auth/v1/logout',{method:'POST'},token).catch(()=>null);
      jar.set(sessionCookie,'',{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/api/cms',maxAge:0});return json({ok:true});
    }
    const {token}=await requireEditor();
    if(action==='save'||action==='publish') {
      const body=await readBody(request);validateContent(body.content);
      if(!Number.isInteger(body.revision)||body.revision<0)throw new Error('Invalid revision');
      const response=await supabase('/rest/v1/rpc/cms_save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({payload:body.content,expected_revision:body.revision,publish_now:action==='publish'})},token);
      if(!response.ok){const err=await response.json();throw new Error(err.message?.includes('conflict')?'Revision conflict: another editor saved changes. Export your changes before reloading.':'Save failed. Check database policies and configuration.');}
      return json({revision:await response.json(),published:action==='publish'});
    }
    if(action==='upload') {
      if(Number(request.headers.get('content-length'))>3_300_000)return json({error:'Image exceeds 3 MB'},413);
      const form=await request.formData();const file=form.get('file');
      if(!(file instanceof File)||file.size>3*1024*1024||file.size===0)throw new Error('Choose an image under 3 MB');
      const extensions:Record<string,string>={'image/png':'png','image/jpeg':'jpg','image/webp':'webp','image/avif':'avif'};
      if(!extensions[file.type])throw new Error('Use PNG, JPEG, WebP or AVIF images');
      const bytes=new Uint8Array(await file.arrayBuffer());
      const valid=file.type==='image/png'?bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71:file.type==='image/jpeg'?bytes[0]===255&&bytes[1]===216&&bytes[2]===255:file.type==='image/webp'?new TextDecoder().decode(bytes.slice(0,4))==='RIFF'&&new TextDecoder().decode(bytes.slice(8,12))==='WEBP':new TextDecoder().decode(bytes.slice(4,12))==='ftypavif';
      if(!valid)throw new Error('File contents do not match the image type');
      const path=`${crypto.randomUUID()}.${extensions[file.type]}`;
      const response=await supabase(`/storage/v1/object/site-media/${path}`,{method:'POST',headers:{'Content-Type':file.type},body:bytes},token);
      if(!response.ok)throw new Error('Upload failed. Check the storage bucket and policies.');
      return json({url:`${cmsConfig()!.url}/storage/v1/object/public/site-media/${path}`});
    }
    return json({error:'Not found'},404);
  } catch(error){return errorResponse(error);}
}
