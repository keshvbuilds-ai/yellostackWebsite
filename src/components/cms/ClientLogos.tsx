"use client";
import { useId, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContent, LocalText, CmsText } from './ContentProvider';
const sectors=['All','Enterprise','Healthcare','Oil & Gas','Transport','Retail','Government'];
export default function ClientLogos({home=false}:{home?:boolean}){
 const clients=useContent().clients;const titleId=useId();const [sector,setSector]=useState('All');
 const filtered=clients.filter(client=>sector==='All'||client.sector===sector);
 const recent=clients.filter(client=>client.recent&&client.projectSummary?.trim()).slice(0,4);
 if(!clients.length)return null;
 return <>
 <section className={home?'profile-clients profile-clients-home':'profile-clients'} aria-labelledby={titleId}>
  <div><p className="profile-clients-eyebrow"><LocalText text="THE PEOPLE WE BUILD WITH"/></p><h2 id={titleId}><LocalText text={home?'Trusted across the Kingdom.':'Our clients.'}/></h2><p className="profile-clients-intro"><LocalText text="Since 2017, businesses across Saudi Arabia have trusted Yellostack to design, build and run the technology behind their growth, from AI automation to enterprise software."/></p></div>
  {!home&&<div className="client-filters" role="group" aria-label="Filter clients by industry">{sectors.map(item=><button type="button" key={item} aria-pressed={sector===item} onClick={()=>setSector(item)}><LocalText text={item}/></button>)}</div>}
  <div className="profile-client-grid">{filtered.map(client=><div className="profile-client-tile" key={client.id}>{client.url?<a href={client.url} target="_blank" rel="noopener noreferrer" aria-label={client.name}><img data-cms-path={JSON.stringify(['clients',String(clients.findIndex(item=>item.id===client.id)),'image'])} src={client.image} alt={client.name} loading="lazy" width={260} height={130}/></a>:<img data-cms-path={JSON.stringify(['clients',String(clients.findIndex(item=>item.id===client.id)),'image'])} src={client.image} alt={client.name} loading="lazy" width={260} height={130}/>}</div>)}</div>
  {!filtered.length&&<p role="status" className="client-empty"><LocalText text="Client profiles for this industry will be added soon."/></p>}
  {home&&<Link href="/clients" className="client-directory-link"><LocalText text="Meet our clients"/> ↗</Link>}
 </section>
 {!home&&recent.length>0&&<section className="recent-clients"><p className="profile-clients-eyebrow"><LocalText text="NEW CONNECTIONS"/></p><h2><CmsText id="clients.recent.title" fallback="Recently joined the stack."/></h2><p><CmsText id="clients.recent.intro" fallback="The newest businesses to build with Yellostack, and what we’re creating together."/></p><div className="recent-client-grid">{recent.map(client=><article key={client.id}><div><img data-cms-path={JSON.stringify(['clients',String(clients.findIndex(item=>item.id===client.id)),'image'])} src={client.image} alt={client.name} width={320} height={180} loading="lazy"/></div><small><LocalText text={client.sector||'Enterprise'}/></small><h3>{client.name}</h3><p><LocalText text={client.projectSummary||''}/></p></article>)}</div></section>}
 </>;
}
export function ClientInvitation(){
 const pathname=usePathname();if(pathname!=='/clients')return null;
 return <section className="client-invitation"><span>YELLOSTACK / YOUR NEXT CHAPTER</span><h2><CmsText id="clients.invitation.title" fallback="Your logo belongs here."/></h2><p><CmsText id="clients.invitation.body" fallback="Let’s build what’s next for your business, together."/></p><Link href="/contact"><LocalText text="LET’S BUILD TOGETHER"/> ↗</Link></section>;
}
