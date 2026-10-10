'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CmsText } from '@/components/cms/ContentProvider';
import './stack-convergence.css';
gsap.registerPlugin(ScrollTrigger);
export default function StackConvergence(){
 const root=useRef<HTMLElement>(null),host=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const section=root.current,el=host.current;if(!section||!el)return;
  const media=gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)',()=>{
   let renderer:THREE.WebGLRenderer;
   try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});}catch{return;}
   renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));renderer.setClearColor(0,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;el.appendChild(renderer.domElement);section.dataset.webgl='true';
   const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(36,1,.1,80);camera.position.set(0,0,12);
   scene.add(new THREE.HemisphereLight(0xfff9df,0x302105,3));
   for(const [x,y,z,power] of [[-5,6,5,90],[5,2,3,70],[0,-3,4,35]]){const light=new THREE.PointLight(0xffe4a0,power);light.position.set(x,y,z);scene.add(light);}
   const shape=new THREE.Shape(),r=.18,h=1.5;
   shape.moveTo(-h+r,-h);shape.lineTo(h-r,-h);shape.quadraticCurveTo(h,-h,h,-h+r);shape.lineTo(h,h-r);shape.quadraticCurveTo(h,h,h-r,h);shape.lineTo(-h+r,h);shape.quadraticCurveTo(-h,h,-h,h-r);shape.lineTo(-h,-h+r);shape.quadraticCurveTo(-h,-h,-h+r,-h);
   const geo=new THREE.ExtrudeGeometry(shape,{depth:.15,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.055,bevelThickness:.055});geo.center();
   const material=new THREE.MeshPhysicalMaterial({color:0xffcc00,metalness:.6,roughness:.24,clearcoat:1});
   const group=new THREE.Group();scene.add(group);
   const plates=[0,1,2].map(()=>{const mesh=new THREE.Mesh(geo,material);group.add(mesh);return mesh;});
   const ringGeo=new THREE.RingGeometry(1,1.014,96),ringMat=new THREE.MeshBasicMaterial({color:0xffcf00,transparent:true,opacity:0,side:THREE.DoubleSide});const ring=new THREE.Mesh(ringGeo,ringMat);ring.position.z=-1;scene.add(ring);
   const state={p:0};const tween=gsap.to(state,{p:1,ease:'none',scrollTrigger:{trigger:section,start:'top top',end:'bottom bottom',scrub:.8,invalidateOnRefresh:true}});
   const resize=()=>{const w=el.clientWidth,h=el.clientHeight;renderer.setSize(w,h);camera.aspect=w/Math.max(h,1);camera.position.z=w<700?16:12;camera.updateProjectionMatrix();};const ro=new ResizeObserver(resize);ro.observe(el);resize();
   let visible=false,raf=0;const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;});io.observe(section);
   const smooth=THREE.MathUtils.smoothstep;
   const tick=()=>{raf=requestAnimationFrame(tick);if(!visible||document.hidden)return;const p=state.p,join=smooth(p,.08,.62),exit=smooth(p,.8,1);const width=2*camera.position.z*Math.tan(THREE.MathUtils.degToRad(18))*camera.aspect;
    plates.forEach((plate,i)=>{const side=i-1;plate.position.set(side*width*.56*(1-join),(1-i)*.53*join+(i===1?.28:0)*(1-join),-Math.abs(side)*2*(1-join));plate.rotation.set(-.95,0,THREE.MathUtils.lerp(side*.5,.5,join));plate.scale.setScalar(camera.aspect<.8?.66:1);});
    group.rotation.y=.18*join;group.position.y=-exit*1.3;group.scale.setScalar(1-exit*.18);
    const pulse=smooth(p,.59,.72);ring.scale.setScalar(1+pulse*4);ringMat.opacity=Math.sin(pulse*Math.PI)*.22;
    el.style.opacity=String(1-exit);section.style.setProperty('--converge-copy',String(smooth(p,.55,.72)*(1-exit)));renderer.render(scene,camera);
   };tick();
   return()=>{cancelAnimationFrame(raf);io.disconnect();ro.disconnect();tween.scrollTrigger?.kill();tween.kill();geo.dispose();material.dispose();ringGeo.dispose();ringMat.dispose();renderer.dispose();renderer.domElement.remove();delete section.dataset.webgl;el.style.opacity='';section.style.removeProperty('--converge-copy');};
  });return()=>media.revert();
 },[]);
 return <section className="stack-convergence" ref={root} aria-label="Three layers become one Yellostack"><div className="convergence-stage"><div className="convergence-meta"><span><CmsText id="convergence.eyebrow" fallback="THREE PERSPECTIVES. ONE DIRECTION."/></span><span aria-hidden="true">01 — 03</span></div><div className="convergence-scene" ref={host} aria-hidden="true"/><div className="convergence-fallback" aria-hidden="true"><i/><i/><i/></div><div className="convergence-copy"><h2><CmsText id="convergence.title" fallback="Better, together."/></h2><p><CmsText id="convergence.body" fallback="Strategy, design and technology. Moving as one."/></p></div><span className="convergence-scroll" aria-hidden="true">↓</span></div></section>;
}
