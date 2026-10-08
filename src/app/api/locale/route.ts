import { cookies } from 'next/headers';
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Invalid origin'},{status:403});
 const body=await request.text();if(body.length>64)return Response.json({error:'Invalid locale'},{status:400});
 let locale;try{locale=JSON.parse(body).locale;}catch{return Response.json({error:'Invalid locale'},{status:400});}
 if(locale!=='en'&&locale!=='ar')return Response.json({error:'Invalid locale'},{status:400});
 (await cookies()).set('ys-locale',locale,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:31536000});
 return Response.json({ok:true},{headers:{'Cache-Control':'no-store'}});
}
