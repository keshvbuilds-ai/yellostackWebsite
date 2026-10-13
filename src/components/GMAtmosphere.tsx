'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
export default function GMAtmosphere(){
 const host=useRef<HTMLDivElement>(null);
 useEffect(()=>{const el=host.current;if(!el)return;const reduced=matchMedia('(prefers-reduced-motion: reduce)');if(reduced.matches)return;let renderer:THREE.WebGLRenderer;try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});}catch{return;}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.25));el.appendChild(renderer.domElement);const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(40,1,.1,30);camera.position.z=6;const group=new THREE.Group();scene.add(group);scene.add(new THREE.HemisphereLight(0xffffff,0xb08c00,3));for(let i=0;i<3;i++){const mesh=new THREE.Mesh(new THREE.BoxGeometry(2.3,.08,2.3),new THREE.MeshStandardMaterial({color:0xffcc02,roughness:.3,metalness:.4}));mesh.position.y=(i-1)*.45;group.add(mesh);}group.rotation.set(.4,.4,.3);gsap.registerPlugin(ScrollTrigger);const tween=gsap.to(group.rotation,{y:1.2,x:.7,ease:'none',scrollTrigger:{trigger:el.parentElement,start:'top bottom',end:'bottom top',scrub:1}});const resize=()=>{const w=Math.max(1,el.clientWidth),h=Math.max(1,el.clientHeight);renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();};const ro=new ResizeObserver(resize);ro.observe(el);resize();let visible=true,raf=0;const io=new IntersectionObserver(([e])=>visible=e.isIntersecting);io.observe(el);const tick=()=>{raf=requestAnimationFrame(tick);if(visible&&!document.hidden)renderer.render(scene,camera);};tick();return()=>{cancelAnimationFrame(raf);ro.disconnect();io.disconnect();tween.scrollTrigger?.kill();tween.kill();group.children.forEach(o=>{const mesh=o as THREE.Mesh;mesh.geometry.dispose();(mesh.material as THREE.Material).dispose();});renderer.dispose();renderer.domElement.remove();};
 },[]);
 return <div ref={host} aria-hidden="true" style={{position:'absolute',right:'-100px',bottom:'-90px',width:'450px',height:'400px',opacity:.12,pointerEvents:'none'}}/>;
}
