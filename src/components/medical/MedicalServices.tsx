'use client';
import { useEffect,useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEditedList, LocalText } from '@/components/cms/ContentProvider';
import './medical-services.css';
gsap.registerPlugin(ScrollTrigger);
const services=[
 {title:'Mapping Services',body:'Accurately map medical codes across coding systems to ensure consistency, accuracy, and compliance.'},
 {title:'Clinical Coding Services',body:'Accurate clinical coding of diagnoses and procedures to support compliant healthcare documentation and billing.'},
 {title:'Claim Auditing Services',body:'Review healthcare claims for coding accuracy, compliance, errors, and potential revenue loss.'},
 {title:'DRG Assignment Services',body:'Accurate DRG assignment to support proper reimbursement, compliance, and optimized revenue.'},
 {title:'Medical Transcription Services',body:'Accurately convert clinical audio and notes into clear, structured medical documentation.'}
];
export default function MedicalServices(){
 const items=useEditedList('medical.services',services);const root=useRef<HTMLElement>(null),host=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const el=host.current,section=root.current;if(!el||!section)return;
  let renderer:THREE.WebGLRenderer;try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});}catch{return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.toneMapping=THREE.ACESFilmicToneMapping;el.appendChild(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,40);camera.position.set(0,0,9);
  scene.add(new THREE.HemisphereLight(0xffffff,0x8b783e,3));const light=new THREE.DirectionalLight(0xffffff,5);light.position.set(-3,5,7);scene.add(light);
  const group=new THREE.Group();scene.add(group);const segments:THREE.Mesh[]=[];
  for(let i=0;i<5;i++){const start=-Math.PI*.59+i*Math.PI*1.18/5,end=start+Math.PI*1.18/5-.04;const shape=new THREE.Shape();shape.absarc(0,0,2,start,end,false);shape.absarc(0,0,1.33,end,start,true);shape.closePath();const geo=new THREE.ExtrudeGeometry(shape,{depth:.26,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:2,steps:1,curveSegments:32});const mesh=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:0xe0e2d8,metalness:.3,roughness:.3}));group.add(mesh);segments.push(mesh);}
  const progress={value:0};const mm=gsap.matchMedia();let reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
  mm.add('(prefers-reduced-motion: no-preference)',()=>{reduced=false;const ctx=gsap.context(()=>{
   const rows=gsap.utils.toArray<HTMLElement>('.medical-service-card');rows.forEach((row,i)=>{gsap.fromTo(row,{'--service-fill':'0%'},{'--service-fill':'100%',ease:'none',scrollTrigger:{trigger:row,start:'top 78%',end:'top 46%',scrub:.6}});});
   gsap.to(progress,{value:5,ease:'none',scrollTrigger:{trigger:section,start:'top 65%',end:'bottom 70%',scrub:.6}});
  },section);return()=>{reduced=true;ctx.revert();};});
  const resize=()=>{renderer.setSize(el.clientWidth,el.clientHeight);camera.aspect=el.clientWidth/Math.max(1,el.clientHeight);camera.position.z=camera.aspect<.85?11:9;camera.updateProjectionMatrix();};const ro=new ResizeObserver(resize);ro.observe(el);resize();
  let raf=0,visible=true;const io=new IntersectionObserver(([entry])=>visible=entry.isIntersecting);io.observe(el);
  const tick=()=>{raf=requestAnimationFrame(tick);if(!visible||document.hidden)return;const p=reduced?5:progress.value;group.rotation.set(.08,-.18+Math.min(p,5)*.035,0);segments.forEach((mesh,i)=>{const fill=THREE.MathUtils.clamp(p-i,0,1);(mesh.material as THREE.MeshStandardMaterial).color.set(0xe0e2d8).lerp(new THREE.Color(0xffcc00),fill);mesh.position.z=Math.sin(fill*Math.PI)*.15;});renderer.render(scene,camera);};tick();
  return()=>{cancelAnimationFrame(raf);mm.revert();ro.disconnect();io.disconnect();segments.forEach(mesh=>{mesh.geometry.dispose();(mesh.material as THREE.Material).dispose();});renderer.dispose();renderer.domElement.remove();};
 },[]);
 return <section ref={root} className="medical-services" data-no-gradient><div className="medical-services-art"><p className="medical-service-kicker"><LocalText text="MEDICAL CODING & HEALTHCARE TECHNOLOGY"/></p><h2><LocalText text="Accuracy at every step."/></h2><div ref={host} className="medical-services-canvas" aria-hidden="true"/><p><LocalText text="YelloStack combines accurate medical coding with intelligent healthcare technology."/></p></div><div className="medical-services-list">{items.map((item,i)=><article key={item.title} className="medical-service-card"><span>0{i+1}</span><div><h3>{item.title}</h3><p>{item.body}</p></div></article>)}</div></section>;
}
