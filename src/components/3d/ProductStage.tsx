"use client";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

function Phone({active,reduced}:{active:number;reduced:boolean}) {
  const rig=useRef<THREE.Group>(null);
  const [texture,setTexture]=useState<THREE.CanvasTexture|null>(null);
  useEffect(()=>{
    const canvas=document.createElement("canvas");canvas.width=512;canvas.height=1024;
    const ctx=canvas.getContext("2d");if(!ctx)return;
    const titles=["Fresh picks.","Keep learning.","Your workspace.","Care, connected.","Find your table."];
    const labels=[["Fresh produce","Pantry essentials","Your basket"],["Your courses","Design foundations","Continue learning"],["Your projects","Team activity","Weekly overview"],["Appointments","Care services","Your documents"],["Nearby dining","Your reservations","Explore places"]];
    ctx.fillStyle="#eff0e7";ctx.fillRect(0,0,512,1024);
    ctx.fillStyle="#11190e";ctx.font="500 23px sans-serif";ctx.fillText("YELLO / DIGITAL",36,94);
    ctx.font="600 44px sans-serif";ctx.fillText(titles[active],36,179);
    ctx.fillStyle="#77806b";ctx.font="21px sans-serif";ctx.fillText("A little more possibility, every day.",36,218);
    ctx.fillStyle="#ffcf00";ctx.beginPath();ctx.roundRect(30,262,452,262,22);ctx.fill();
    ctx.strokeStyle="#26341e";ctx.lineWidth=2;
    for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(256,363+i*27,110,47,-.22,0,Math.PI*2);ctx.stroke();}
    labels[active].forEach((label,i)=>{const y=559+i*116;ctx.fillStyle="#ffffff";ctx.beginPath();ctx.roundRect(30,y,452,96,14);ctx.fill();ctx.fillStyle="#dddcc7";ctx.beginPath();ctx.roundRect(48,y+20,55,55,10);ctx.fill();ctx.fillStyle="#283222";ctx.font="500 23px sans-serif";ctx.fillText(label,124,y+45);ctx.fillStyle="#91987f";ctx.font="17px sans-serif";ctx.fillText("Explore your possibilities",124,y+72);});
    ctx.fillStyle="#182111";ctx.beginPath();ctx.roundRect(30,936,452,58,29);ctx.fill();ctx.fillStyle="#fff7cc";ctx.font="19px sans-serif";ctx.fillText("Home        Explore        Account",66,973);
    const next=new THREE.CanvasTexture(canvas);next.colorSpace=THREE.SRGBColorSpace;next.anisotropy=4;setTexture(next);
    return()=>next.dispose();
  },[active]);
  useFrame(({pointer,clock},delta)=>{
    if(!rig.current)return;const dt=Math.min(delta,.05);
    rig.current.rotation.y=THREE.MathUtils.damp(rig.current.rotation.y,reduced?.12:.12+(active-2)*.1+pointer.x*.18,3,dt);
    rig.current.rotation.x=THREE.MathUtils.damp(rig.current.rotation.x,reduced?0:-.06+pointer.y*.08,3,dt);
    rig.current.position.y=reduced?0:Math.sin(clock.elapsedTime*.6)*.07;
  });
  return <>
    <ambientLight intensity={1.5}/><directionalLight position={[4,5,6]} intensity={3}/>
    <Environment resolution={128}><Lightformer position={[-4,2,4]} scale={[2,8,1]} intensity={5}/><Lightformer position={[4,4,0]} scale={[3,6,1]} intensity={4} color="#ffe19a"/></Environment>
    <group ref={rig} rotation={[-.06,.12,-.04]}>
      <RoundedBox args={[2.65,5.12,.28]} radius={.22} smoothness={5}><meshPhysicalMaterial color="#313829" metalness={.85} roughness={.23} clearcoat={.6}/></RoundedBox>
      <RoundedBox args={[2.46,4.93,.035]} radius={.17} position={[0,0,.158]}><meshBasicMaterial color="#0c100a"/></RoundedBox>
      <mesh position={[0,0,.18]}><planeGeometry args={[2.3,4.6]}/><meshBasicMaterial map={texture} color={texture?"white":"#eff0e7"} toneMapped={false}/></mesh>
      <RoundedBox args={[.65,.13,.025]} radius={.055} position={[0,2.29,.2]}><meshBasicMaterial color="#12190f"/></RoundedBox>
      <RoundedBox args={[.05,.45,.09]} radius={.02} position={[1.34,.8,0]}><meshStandardMaterial color="#ffcf00" metalness={.8} roughness={.25}/></RoundedBox>
    </group>
    <mesh position={[0,-3,0]}><cylinderGeometry args={[2.8,3,.2,64]}/><meshStandardMaterial color="#d0d4bf" metalness={.3} roughness={.55}/></mesh>
  </>;
}
class StageBoundary extends Component<{children:ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true};}render(){return this.state.failed?<div className="product-stage-fallback">Digital experiences.<br/>Built around people.</div>:this.props.children;}}
export default function ProductStage({active,reduced}:{active:number;reduced:boolean}){
  const root=useRef<HTMLDivElement>(null);const [visible,setVisible]=useState(false);
  useEffect(()=>{const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{rootMargin:"100px"});if(root.current)observer.observe(root.current);return()=>observer.disconnect();},[]);
  return <div ref={root} className="product-stage"><StageBoundary><Canvas style={{touchAction:"pan-y"}} camera={{position:[0,.3,9.8],fov:40}} dpr={[1,1.5]} frameloop={visible?"always":"never"}><Phone active={active} reduced={reduced}/></Canvas></StageBoundary><span className="product-concept-label">INTERFACE STUDY / {String(active+1).padStart(2,"0")}<br/><small>Concept visualization</small></span></div>;
}
