import {readLimitedJson,RequestError} from '@/lib/request-security';
import { cookies } from 'next/headers';
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Invalid origin'},{status:403});
 let locale;try{locale=(await readLimitedJson(request,64)).locale;}catch(error){return Response.json({error:'Invalid locale'},{status:error instanceof RequestError?error.status:400});}
 if(locale!=='en'&&locale!=='ar')return Response.json({error:'Invalid locale'},{status:400});
 (await cookies()).set('ys-locale',locale,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:31536000});
 return Response.json({ok:true},{headers:{'Cache-Control':'no-store'}});
}
