'use client';
import { LocalText } from '@/components/cms/ContentProvider';

import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { makeAnatomicalArm } from './anatomical-arm';

function disposeObject(root:THREE.Object3D){
 const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>();
 root.traverse(obj=>{if(obj instanceof THREE.Mesh){geometries.add(obj.geometry);(Array.isArray(obj.material)?obj.material:[obj.material]).forEach(m=>materials.add(m));}});
 geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());
}

// Elliptical lofts give the wrist, palm and fingers continuous tapered contours.
function loft(rings:number[][]){
 const vertices:number[]=[],indices:number[]=[],uv:number[]=[],segments=40;
 const curve=new THREE.CatmullRomCurve3(rings.map(r=>new THREE.Vector3(r[0],r[1],r[2])));
 const samples=curve.getPoints(Math.max(24,rings.length*8));
 samples.forEach((r,i)=>{for(let j=0;j<=segments;j++){const a=j/segments*Math.PI*2;vertices.push(r.x,Math.cos(a)*Math.max(.001,r.y),Math.sin(a)*Math.max(.001,r.z));uv.push(i/(samples.length-1),j/segments);}});
 for(let i=0;i<samples.length-1;i++)for(let j=0;j<segments;j++){const a=i*(segments+1)+j,b=a+segments+1;indices.push(a,a+1,b,b,a+1,b+1);}
 // Close both ends, with outward-facing triangles.
 const first=vertices.length/3;vertices.push(samples[0].x,0,0);uv.push(0,.5);
 const last=vertices.length/3;vertices.push(samples.at(-1)!.x,0,0);uv.push(1,.5);
 for(let j=0;j<segments;j++){indices.push(first,j+1,j);const end=(samples.length-1)*(segments+1);indices.push(last,end+j,end+j+1);}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();return geo;
}

export default function HandshakeScene({progress}:{progress:MutableRefObject<{value:number}>}){
 const host=useRef<HTMLDivElement>(null);const [failed,setFailed]=useState(false);
 useEffect(()=>{
  const mount=host.current;if(!mount)return;let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{setFailed(true);return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.setClearColor(0xffffff,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;mount.appendChild(renderer.domElement);
  const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(32,1,.1,50);camera.position.set(0,.8,9);camera.lookAt(0,0,0);
  scene.add(new THREE.HemisphereLight(0xffffff,0xd6c8ab,1.65));const key=new THREE.DirectionalLight(0xffefdc,2.4);key.position.set(-3,5,5);scene.add(key);const fill=new THREE.DirectionalLight(0xffffff,1.3);fill.position.set(4,2,-3);scene.add(fill);
  let customer:ReturnType<typeof makeAnatomicalArm>|undefined,employee:ReturnType<typeof makeAnatomicalArm>|undefined;
  const loader=new GLTFLoader();
  loader.load('/contact/hand-posable.glb',gltf=>{if(disposed){disposeObject(gltf.scene);return;}
   try{customer=makeAnatomicalArm(clone(gltf.scene),false,loft);employee=makeAnatomicalArm(clone(gltf.scene),true,loft);scene.add(customer.root,employee.root);draw();}catch{setFailed(true);disposeObject(gltf.scene);}
  },undefined,()=>{if(!disposed)setFailed(true);});
  const mq=matchMedia('(prefers-reduced-motion: reduce)');let visible=false,raf=0,disposed=false;
  const resize=()=>{const w=mount.clientWidth,h=mount.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;const tangent=Math.tan(THREE.MathUtils.degToRad(camera.fov/2));camera.position.set(0,.35,Math.max(3.7,2.1/(tangent*camera.aspect)));camera.lookAt(0,0,0);camera.updateProjectionMatrix();draw();};
  const customerAnchor=new THREE.Vector3(),employeeAnchor=new THREE.Vector3();
  const draw=()=>{if(disposed)return;if(!customer||!employee){renderer.render(scene,camera);return;}const p=mq.matches?1:progress.current.value;const enter=THREE.MathUtils.smoothstep(p,0,.29);const meet=THREE.MathUtils.smoothstep(p,.32,.65);const grip=THREE.MathUtils.smoothstep(p,.57,.77);const wave=THREE.MathUtils.smoothstep(p,.79,.97);const shake=Math.sin(wave*Math.PI*4)*.065*Math.sin(wave*Math.PI);
   const edge=Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*camera.position.z*camera.aspect+1.8;
   customer.root.visible=p>.005;employee.root.visible=p>.32;
   customer.root.rotation.z=-.10*(1-meet);employee.root.rotation.z=.10*(1-meet);
   customerAnchor.copy(customer.contactAnchor).applyQuaternion(customer.root.quaternion);
   employeeAnchor.copy(employee.contactAnchor).applyQuaternion(employee.root.quaternion);
   customer.root.position.set(edge*(1-enter)+.20*(1-meet),shake,.105).sub(customerAnchor);
   employee.root.position.set(-edge*(1-meet),shake,-.105).sub(employeeAnchor);
   customer.pose(grip);employee.pose(grip);renderer.render(scene,camera);
  };
  const tick=()=>{raf=0;if(!visible||document.hidden||disposed)return;draw();if(!mq.matches)raf=requestAnimationFrame(tick);};
  const wake=()=>{if(!raf&&visible&&!document.hidden)raf=requestAnimationFrame(tick);};
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;wake();});observer.observe(mount);const ro=new ResizeObserver(resize);ro.observe(mount);resize();document.addEventListener('visibilitychange',wake);mq.addEventListener('change',wake);
  const lost=(e:Event)=>{e.preventDefault();setFailed(true);visible=false;};renderer.domElement.addEventListener('webglcontextlost',lost);
  return()=>{disposed=true;cancelAnimationFrame(raf);observer.disconnect();ro.disconnect();document.removeEventListener('visibilitychange',wake);mq.removeEventListener('change',wake);renderer.domElement.removeEventListener('webglcontextlost',lost);const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>();scene.traverse(o=>{if(o instanceof THREE.Mesh){geometries.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));}});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();};
 },[progress]);
 return <div ref={host} className="contact-hands-webgl" aria-hidden="true">{failed&&<div className="contact-hands-fallback"><LocalText text={"Your ambition."}/><br/><strong><LocalText text={"Our commitment."}/></strong></div>}</div>;
}
