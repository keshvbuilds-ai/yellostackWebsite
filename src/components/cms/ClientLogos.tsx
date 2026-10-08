'use client';
import { useContent } from './ContentProvider';
export default function ClientLogos(){
  const clients=useContent().clients;
  if(!clients.length)return null;
  return <section className="py-16" aria-labelledby="client-logo-title"><p className="mb-4 font-mono text-xs text-[#646d55]">THE PEOPLE WE BUILD WITH</p><h2 id="client-logo-title" className="mb-10 text-4xl tracking-tight">Our clients.</h2><div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-black/15 bg-black/15 md:grid-cols-3 lg:grid-cols-4">{clients.map(client=><div key={client.id} className="flex min-h-40 items-center justify-center bg-white p-7">{client.url?<a href={client.url} target="_blank" rel="noreferrer" aria-label={client.name} className="block w-full"><img src={client.image} alt={client.name} loading="lazy" className="mx-auto max-h-20 w-full object-contain"/></a>:<img src={client.image} alt={client.name} loading="lazy" className="max-h-20 w-full object-contain"/>}</div>)}</div></section>;
}
