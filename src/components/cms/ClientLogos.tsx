'use client';
import { useId } from 'react';
import { useContent, LocalText } from './ContentProvider';
export default function ClientLogos({home=false}:{home?:boolean}){
 const clients=useContent().clients;const titleId=useId();
 if(!clients.length)return null;
 return <section className={home?'profile-clients profile-clients-home':'profile-clients'} aria-labelledby={titleId}>
  <div data-site-reveal><p className="profile-clients-eyebrow"><LocalText text="THE PEOPLE WE BUILD WITH"/></p><h2 id={titleId}><LocalText text="Our clients."/></h2><p className="profile-clients-intro"><LocalText text="Relationships across industries. A shared commitment to progress."/></p></div>
  <div className="profile-client-grid">{clients.map(client=><div className="profile-client-tile" key={client.id}>{client.url?<a href={client.url} target="_blank" rel="noopener noreferrer" aria-label={client.name}><img src={client.image} alt={client.name} loading="lazy" width={260} height={130}/></a>:<img src={client.image} alt={client.name} loading="lazy" width={260} height={130}/>}</div>)}</div>
 </section>;
}
