import {readMedia} from '@/lib/cms/local-store';
export const runtime='nodejs';
export async function GET(_request:Request,{params}:{params:Promise<{filename:string}>}){
 const {filename}=await params;if(!/^[a-f0-9-]+\.(png|jpg|webp|avif)$/.test(filename))return new Response(null,{status:404});
 try{const bytes=await readMedia(filename);const types:Record<string,string>={png:'image/png',jpg:'image/jpeg',webp:'image/webp',avif:'image/avif'};return new Response(bytes,{headers:{'Content-Type':types[filename.split('.').pop()!],'Cache-Control':'public, max-age=31536000, immutable','X-Content-Type-Options':'nosniff'}});}catch{return new Response(null,{status:404});}
}
