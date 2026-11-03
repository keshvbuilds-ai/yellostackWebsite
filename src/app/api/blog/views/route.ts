import {cookies} from 'next/headers';
import {createHash,randomBytes} from 'node:crypto';
import {getSiteContent} from '@/lib/cms/server';
import {localMode,transaction,blogViewCounts} from '@/lib/cms/local-store';
import {isAllowedOrigin,readLimitedJson} from '@/lib/request-security';
export const runtime='nodejs';
const reply=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(){try{const posts=(await getSiteContent()).posts;const counts=localMode()?await blogViewCounts(posts.map(p=>p.slug)):{};return reply({counts});}catch{return reply({error:'View counts unavailable'},503);}}
export async function POST(request:Request){
 if(!isAllowedOrigin(request))return reply({error:'Forbidden origin'},403);
 try{const body=await readLimitedJson(request,1024);if(typeof body.slug!=='string'||!(await getSiteContent()).posts.some(p=>p.slug===body.slug))return reply({error:'Article not found'},404);if(!localMode())return reply({error:'View tracking requires the Node.js CMS'},503);
 const jar=await cookies();let visitor=jar.get('ys-blog-reader')?.value;if(!visitor||! /^[a-f0-9]{32}$/.test(visitor)){visitor=randomBytes(16).toString('hex');jar.set('ys-blog-reader',visitor,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/api/blog',maxAge:86400});}
 const day=new Date().toISOString().slice(0,10);const key=createHash('sha256').update(visitor+':'+body.slug).digest('hex');
 const count=await transaction(s=>{s.blogViews??={};if(s.blogSeen?.day!==day)s.blogSeen={day,keys:{}};const seen=s.blogSeen!;if(!seen.keys[key]){if(Object.keys(seen.keys).length>=20000)throw Error('Daily limit');seen.keys[key]=true;s.blogViews![body.slug]=Math.min(Number.MAX_SAFE_INTEGER,(typeof s.blogViews![body.slug]==='number'?s.blogViews![body.slug]:0)+1);}return s.blogViews![body.slug]??0;});return reply({count});
 }catch{return reply({error:'Unable to record view'},400);}
}
