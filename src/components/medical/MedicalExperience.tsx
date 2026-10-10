'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CmsText } from '@/components/cms/ContentProvider';
import './medical.css';
gsap.registerPlugin(ScrollTrigger);
export default function MedicalExperience(){
 const root=useRef<HTMLElement>(null),host=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const section=root.current,el=host.current;if(!section||!el)return;let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});}catch{return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.toneMapping=THREE.ACESFilmicToneMapping;el.appendChild(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1,.1,80);camera.position.z=10;
  scene.add(new THREE.HemisphereLight(0xffffff,0x53606a,3));const light=new THREE.DirectionalLight(0xffffff,5);light.position.set(-3,5,6);scene.add(light);
  const gold=new THREE.MeshPhysicalMaterial({color:0xffcc00,metalness:.3,roughness:.22,clearcoat:1,side:THREE.DoubleSide});
  const white=new THREE.MeshPhysicalMaterial({color:0xf7f5ed,metalness:.12,roughness:.25,clearcoat:1,side:THREE.DoubleSide});
  const capsule=new THREE.Group();scene.add(capsule);const halves:THREE.Group[]=[];
  for(let i=0;i<2;i++){const part=new THREE.Group();const points=[new THREE.Vector2(.69,0),new THREE.Vector2(.69,.85)];for(let j=1;j<=20;j++){const a=j/20*Math.PI/2;points.push(new THREE.Vector2(.69*Math.cos(a),.85+.69*Math.sin(a)));}part.add(new THREE.Mesh(new THREE.LatheGeometry(points,64),i?white:gold));if(i)part.rotation.z=Math.PI;capsule.add(part);halves.push(part);}
  const pellets=new THREE.InstancedMesh(new THREE.SphereGeometry(.075,12,8),gold,70);scene.add(pellets);const dummy=new THREE.Object3D();
  const cross=new THREE.Group();scene.add(cross);const crossMaterial=new THREE.MeshStandardMaterial({color:0xffcf00,metalness:.3,roughness:.3});
  for(const size of [[.4,1.7,.3],[1.7,.4,.3]])cross.add(new THREE.Mesh(new THREE.BoxGeometry(...size as [number,number,number]),crossMaterial));
  const ring=new THREE.Mesh(new THREE.TorusGeometry(1.3,.028,10,90),white);cross.add(ring);
  const state={p:0};const reduced=matchMedia('(prefers-reduced-motion: reduce)');const mm=gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)',()=>{const t=gsap.to(state,{p:1,ease:'none',scrollTrigger:{trigger:section,start:'top top',end:'bottom bottom',scrub:.8}});return()=>{t.scrollTrigger?.kill();t.revert();};});
  const resize=()=>{renderer.setSize(el.clientWidth,el.clientHeight);camera.aspect=el.clientWidth/Math.max(1,el.clientHeight);camera.position.z=camera.aspect<1?12:10;camera.updateProjectionMatrix();};const ro=new ResizeObserver(resize);ro.observe(el);resize();let frame=0,visible=true;
  const io=new IntersectionObserver(e=>visible=e[0].isIntersecting);io.observe(el);
  const tick=()=>{frame=requestAnimationFrame(tick);if(!visible||document.hidden)return;const p=reduced.matches?.35:state.p;const open=THREE.MathUtils.smoothstep(p,.15,.48),exit=THREE.MathUtils.smoothstep(p,.5,.75);
   capsule.rotation.set(.18,p*.7,-.6);capsule.position.set(0,.5-exit*3,0);capsule.scale.setScalar(1-exit);halves[0].position.y=open*1.1;halves[1].position.y=-open*1.1;
   for(let i=0;i<70;i++){const fall=THREE.MathUtils.clamp((p-.2-i*.002)*3,0,1);const a=i*2.39996;dummy.position.set(Math.cos(a)*(.12+fall*1.6),.2-fall*7+(i%7)*.1,Math.sin(a)*.4);dummy.scale.setScalar(open*(1-THREE.MathUtils.smoothstep(p,.6,.8)));dummy.updateMatrix();pellets.setMatrixAt(i,dummy.matrix);}pellets.instanceMatrix.needsUpdate=true;
   cross.scale.setScalar(THREE.MathUtils.smoothstep(p,.65,.85));cross.position.set(camera.aspect<1?0:2.25,camera.aspect<1?.65:-.45,0);cross.rotation.set(.08,Math.sin(p*Math.PI)*.22,-.04);renderer.render(scene,camera);
  };tick();return()=>{cancelAnimationFrame(frame);mm.revert();ro.disconnect();io.disconnect();const geos=new Set<THREE.BufferGeometry>(),mats=new Set<THREE.Material>();scene.traverse(o=>{if(o instanceof THREE.Mesh){geos.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>mats.add(m));}});geos.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();};
 },[]);
 return <section className="medical-story" ref={root}><div className="medical-stage" ref={host} aria-hidden="true"/><div className="medical-intro"><p><CmsText id="medical.scene.eyebrow" fallback="HEALTHCARE / CONNECTED WITH CARE"/></p><h2><CmsText id="medical.scene.title" fallback="Clarity. From the inside out."/></h2><span><CmsText id="medical.scene.scroll" fallback="SCROLL TO OPEN THE POSSIBILITIES"/> ↓</span></div><div className="medical-arrival"><h2><CmsText id="medical.scene.next" fallback="Better information. Connected workflows."/></h2><p><CmsText id="medical.scene.body" fallback="Bring your documentation, coding requirements and existing systems into one focused conversation. We start with your organisation’s needs and the people behind the process."/></p></div></section>;
}
