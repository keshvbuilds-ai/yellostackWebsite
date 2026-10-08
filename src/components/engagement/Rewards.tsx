'use client';
import { LocalText, useLocale } from '@/components/cms/ContentProvider';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Ticket from './TearTicket';
import './engagement.css';

export function RewardTicket({onTear,greeting=false}:{onTear:()=>void;greeting?:boolean}) {
 return <Ticket className="ys-reward-ticket" width={460} height={210} stubSize={125} background="#ffcf00" color="#11150d" stubBackground="#eeeedd" rotate={0} recenter={false} onTear={onTear} ariaLabel={greeting?'Tear ticket to begin your project':'Tear ticket to unlock your 15% offer'} stub={<div className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center font-mono text-xs"><span><LocalText text={"YELLOSTACK"}/></span><strong className="text-3xl">↗</strong><span><LocalText text={"DRAG TO TEAR"}/><br/><LocalText text={"OR PRESS ENTER"}/></span></div>}><div className="flex h-full flex-col justify-between p-7"><span className="font-mono text-xs"><LocalText text={greeting?'YOUR NEXT CHAPTER':'YOU FOUND THE EASTER EGG'}/></span><strong className="text-5xl tracking-tighter"><LocalText text={greeting?'Hello, you.':'15% off.'}/></strong><span className="text-sm"><LocalText text={greeting?'Big ideas start with a conversation.':'A little curiosity. A rewarding discovery.'}/></span></div></Ticket>;
}
export function LeadForm({offer=false,mode=false}:{offer?:boolean;mode?:boolean}) {
 const locale=useLocale();
 const [status,setStatus]=useState('');const [busy,setBusy]=useState(false);const [sent,setSent]=useState(false);const [name,setName]=useState('');const id=useRef('');
 return <form className="grid gap-4" onSubmit={async e=>{e.preventDefault();if(busy||sent)return;setBusy(true);setStatus('');const data=new FormData(e.currentTarget);id.current ||= crypto.randomUUID();try{const response=await fetch('/api/enquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:id.current,email:data.get('email'),name:data.get('name')||'',message:data.get('message')||'',website:data.get('website')||'',consent:data.get('consent')==='on',kind:offer?'offer':'contact',mode})});const result=await response.json();if(!response.ok)throw new Error(result.error||'Please try again.');setSent(true);setStatus(offer?'Your 15% offer request is saved. Quote YELLO15 when discussing your project.':'Thank you. Your project enquiry is saved for our team.');}catch(error){setStatus(error instanceof Error?error.message:'Unable to submit. Please try again.');}finally{setBusy(false);}}}>
 {!offer&&<label><LocalText text={"Your name"}/><input name="name" autoComplete="name" required maxLength={100} value={name} onChange={e=>setName(e.target.value)} className="ys-field"/></label>}
 {mode&&!offer&&<p className="text-[#ffcf00]" aria-live="polite">{name?(locale==='ar'?`أهلاً ${name}. لنكتب الفصل القادم لفكرتك.`:`Hello, ${name}. Let’s give your idea its next chapter.`):'Yellostack mode is on. Your ideas have our full attention.'}</p>}
 <label><LocalText text={"Email address"}/><input name="email" type="email" autoComplete="email" required maxLength={254} className="ys-field" placeholder="you@company.com"/></label>
 {!offer&&<label><LocalText text={"What would you like to build?"}/><textarea name="message" required minLength={10} maxLength={4000} rows={4} className="ys-field"/></label>}
 <div hidden aria-hidden="true"><label><LocalText text={"Website"}/><input name="website" tabIndex={-1} autoComplete="off"/></label></div>
 <label className="flex items-start gap-3 text-sm text-white/75"><input name="consent" type="checkbox" required className="mt-1"/><span><LocalText text={"I agree that Yellostack may contact me about"}/>{" "}<LocalText text={offer?'this offer':'my enquiry'}/>.</span></label>
 <button disabled={busy||sent} className="rounded-lg bg-[#ffcf00] px-6 py-4 font-mono text-sm text-black disabled:opacity-50"><LocalText text={busy?'SAVING…':sent?'RECEIVED ✓':offer?'CLAIM MY 15% OFFER ↗':'LET’S BUILD TOGETHER ↗'}/></button>
 <p role="status" className="text-sm leading-relaxed"><LocalText text={status}/></p>
 </form>;
}
export default function EasterEgg(){
 const [open,setOpen]=useState(true);const [torn,setTorn]=useState(false);const reduced=useReducedMotion();const close=useRef<HTMLButtonElement>(null);
 useEffect(()=>{if(open)close.current?.focus({preventScroll:true});},[open]);
 if(!open)return <button className="absolute bottom-24 right-5 z-40 rounded-full bg-[#ffcf00] px-5 py-3 text-black" onClick={()=>setOpen(true)}><LocalText text={"Your 15% discovery ↗"}/></button>;
 return <aside aria-label="Your Easter egg reward" data-hero-interactive className="absolute inset-x-3 bottom-6 z-50 mx-auto max-h-[85svh] max-w-[510px] overflow-auto rounded-2xl border border-white/20 bg-[#11150d]/95 p-5 text-white shadow-2xl backdrop-blur-xl md:inset-x-auto md:right-8 md:p-6" onKeyDown={e=>{if(e.key==='Escape')setOpen(false);}} data-lenis-prevent>
 <div className="mb-3 flex items-center justify-between"><span className="font-mono text-xs text-[#ffcf00]"><LocalText text={"CURIOSITY REWARDED / 100%"}/></span><button ref={close} onClick={()=>setOpen(false)} aria-label="Close reward" className="p-2">✕</button></div>
 <div className="relative mx-auto mb-3 h-16 w-14" aria-hidden="true">{[0,1].map(i=><motion.div key={i} initial={{x:0,rotate:0}} animate={{x:reduced?0:i?16:-16,rotate:reduced?0:i?20:-20}} transition={{delay:.25,duration:.8}} className="absolute inset-0 rounded-[50%_50%_45%_45%] bg-gradient-to-br from-yellow-100 via-yellow-400 to-amber-600" style={{clipPath:i?'polygon(0 48%,25% 58%,50% 43%,75% 58%,100% 48%,100% 100%,0 100%)':'polygon(0 0,100% 0,100% 48%,75% 58%,50% 43%,25% 58%,0 48%)'}}/>)}</div>
 <h2 className="mb-2 text-2xl tracking-tight"><LocalText text={"Congratulations. You found it."}/></h2><p className="mb-5 text-sm text-white/70"><LocalText text={"You’ve unlocked a 15% offer. Tear your ticket, then leave your email to claim it."}/></p>
 <RewardTicket onTear={()=>setTorn(true)}/>{torn&&<motion.div initial={{opacity:0}} animate={{opacity:1}} className="mt-5"><LeadForm offer/></motion.div>}
 </aside>;
}
