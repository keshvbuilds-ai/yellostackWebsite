"use client";
import {useEffect,useRef} from 'react';
import gsap from 'gsap';
import './intro-sequence.css';
export default function IntroSequence({onComplete}:{onComplete:()=>void}){
 const curtain=useRef<HTMLDivElement>(null),complete=useRef(onComplete);
 useEffect(()=>{complete.current=onComplete;},[onComplete]);
 useEffect(()=>{
  let disposed=false;let exit:gsap.core.Tween|undefined;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const minimum=new Promise(resolve=>setTimeout(resolve,reduced?0:1000));
  const ready=Promise.all([document.fonts.ready,document.readyState==='complete'?Promise.resolve():new Promise<void>(resolve=>window.addEventListener('load',()=>resolve(),{once:true}))]);
  const cap=new Promise(resolve=>setTimeout(resolve,3500));
  Promise.all([minimum,Promise.race([ready,cap])]).then(()=>{if(disposed)return;exit=gsap.to(curtain.current,{opacity:0,yPercent:reduced?0:-5,duration:reduced?0:.55,ease:'power2.inOut',onComplete:()=>complete.current()});});
  return()=>{disposed=true;exit?.kill();};
 },[]);
 return <div ref={curtain} className="ys-loading-screen" role="status" aria-label="Loading YelloStack"><div className="ys-loading-center"><div className="ys-loading-stack" aria-hidden="true"><i/><i/><i/></div><div className="ys-loading-name">YelloStack</div><p>Ideas taking shape.</p><div className="ys-loading-track" aria-hidden="true"><span/></div></div></div>;
}
