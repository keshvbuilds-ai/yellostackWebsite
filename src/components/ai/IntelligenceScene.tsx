'use client';
import { useEffect, useRef, useState, type RefObject } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

/** Original procedural model: no remote model, license, or texture dependencies. */
export default function IntelligenceScene({kind, progress, active=0}:{kind:'robot'|'eye';progress:RefObject<number>;active?:number}) {
 const host=useRef<HTMLDivElement>(null);const selection=useRef(active);
 useEffect(()=>{selection.current=active;},[active]);
 const [ready,setReady]=useState(false);
 useEffect(()=>{
  const el=host.current;if(!el)return;
  let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{return;}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.75));
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
  el.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
  const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(34,1,.05,80);camera.position.set(0,.2,8);
  scene.add(new THREE.HemisphereLight(0xfff9e6,0x343947,3));
  const key=new THREE.DirectionalLight(0xffffff,5);key.position.set(-3,4,5);scene.add(key);
  const rim=new THREE.DirectionalLight(0xffd000,7);rim.position.set(4,1,-2);scene.add(rim);
  const fill=new THREE.DirectionalLight(0xb8d0ff,2);fill.position.set(-4,-1,2);scene.add(fill);
  const gold=new THREE.MeshStandardMaterial({color:0xffcc00,metalness:.65,roughness:.28});
  const graphite=new THREE.MeshStandardMaterial({color:0x222732,metalness:.6,roughness:.3});
  const ivory=new THREE.MeshStandardMaterial({color:0xf3f0e6,metalness:.25,roughness:.24});
  const ink=new THREE.MeshStandardMaterial({color:0x06080c,metalness:.1,roughness:.18});
  const light=new THREE.MeshStandardMaterial({color:0xffdf30,emissive:0xffcc00,emissiveIntensity:2});
  const model=new THREE.Group();scene.add(model);
  const mesh=(geometry:THREE.BufferGeometry,material:THREE.Material,parent:THREE.Object3D=model,x=0,y=0,z=0)=>{const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);parent.add(m);return m;};
  const box=(w:number,h:number,d:number,material:THREE.Material,parent:THREE.Object3D,x=0,y=0,z=0,r=.15)=>mesh(new RoundedBoxGeometry(w,h,d,4,r),material,parent,x,y,z);
  const head=new THREE.Group();model.add(head);const gaze=new THREE.Group();head.add(gaze);
  let eyes:THREE.Mesh[]=[];const rings:THREE.Mesh[]=[];
  if(kind==='robot'){
   // Rounded industrial shell, inset glass visor, articulated shoulders and a stack core.
   head.position.y=.8;box(2.18,1.65,1.35,ivory,head);
   box(1.94,1.23,.26,graphite,head,0,-.01,.67);
   box(1.7,.95,.18,ink,head,0,.02,.83);
   gaze.position.set(0,.08,.94);
   eyes=[box(.3,.16,.055,light,gaze,-.45,0,0,.06),box(.3,.16,.055,light,gaze,.45,0,0,.06)];
   box(.35,.035,.04,gold,head,0,-.29,.94,.01);
   for(const x of [-1.14,1.14]){const ear=mesh(new THREE.CylinderGeometry(.3,.3,.18,32),gold,head,x,0,0);ear.rotation.z=Math.PI/2;}
   mesh(new THREE.CylinderGeometry(.12,.12,.35,20),graphite,head,0,1,0);mesh(new THREE.SphereGeometry(.12,20,16),light,head,0,1.2,0);
   mesh(new THREE.CylinderGeometry(.27,.34,.3,32),graphite,model,0,-.15,0);
   box(1.65,1.2,1,graphite,model,0,-.87,0,.2);
   box(1.18,.78,.13,ivory,model,0,-.85,.55);
   for(let i=0;i<3;i++){const plate=box(.48,.075,.34,gold,model,0,-.68-i*.14,.68,.025);plate.rotation.y=-.45;}
   for(const side of [-1,1]){mesh(new THREE.SphereGeometry(.27,24,16),gold,model,side*1,-.55,0);const arm=box(.42,.83,.48,ivory,model,side*1.18,-.95,0,.18);arm.rotation.z=side*.18;box(.35,.3,.38,graphite,model,side*1.25,-1.48,0,.12);}
   const halo=mesh(new THREE.TorusGeometry(2.23,.018,8,100),gold,model,0,0,-.6);halo.rotation.x=.35;rings.push(halo);
  }else{
   mesh(new THREE.SphereGeometry(1.35,64,48),ivory,head);
   const iris=mesh(new THREE.SphereGeometry(.69,48,32),gold,gaze,0,0,1.16);iris.scale.z=.28;
   const pupil=mesh(new THREE.SphereGeometry(.29,48,32),ink,gaze,0,0,1.36);pupil.scale.z=.22;
   for(let i=0;i<64;i++){const a=i/64*Math.PI*2;const fibre=box(.016,.27,.018,i%3===0?ivory:graphite,gaze,Math.sin(a)*.48,Math.cos(a)*.48,1.355,.003);fibre.rotation.z=-a;}
   const irisRing=mesh(new THREE.TorusGeometry(.66,.017,8,96),graphite,gaze,0,0,1.3);rings.push(irisRing);
   mesh(new THREE.SphereGeometry(.09,16,12),new THREE.MeshBasicMaterial({color:0xffffff}),gaze,-.17,.18,1.44);
   for(let i=0;i<2;i++){const orbit=mesh(new THREE.TorusGeometry(1.65+i*.17,.012,8,100),gold,model);orbit.rotation.set(.55+i*.8,.4,0);rings.push(orbit);}
  }
  const particleGeometry=new THREE.BufferGeometry();const positions=new Float32Array(120*3);
  for(let i=0;i<120;i++){const a=i*2.399963;const r=2.8+(i%9)*.12;positions[i*3]=Math.cos(a)*r;positions[i*3+1]=Math.sin(a)*r;positions[i*3+2]=-1-(i%7)*.3;}
  particleGeometry.setAttribute('position',new THREE.BufferAttribute(positions,3));const particles=new THREE.Points(particleGeometry,new THREE.PointsMaterial({color:0xffd600,size:.018,transparent:true,opacity:.65}));scene.add(particles);
  const pointer=new THREE.Vector2();const smooth=new THREE.Vector2();let visible=true,frame=0,last=0;
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const move=(event:PointerEvent)=>{const bounds=el.getBoundingClientRect();pointer.set(THREE.MathUtils.clamp((event.clientX-bounds.left)/bounds.width*2-1,-1,1),THREE.MathUtils.clamp(-((event.clientY-bounds.top)/bounds.height*2-1),-1,1));};
  const reset=()=>pointer.set(0,0);const surface=el.closest('section')||el;
  surface.addEventListener('pointermove',move as EventListener);surface.addEventListener('pointerleave',reset);
  const resize=()=>{const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();};
  const ro=new ResizeObserver(resize);ro.observe(el);resize();
  const render=(time:number)=>{
   frame=requestAnimationFrame(render);if(!visible||document.hidden)return;
   const dt=Math.min((time-last)/1000,.06);last=time;const t=time*.001;const p=motion.matches?0:progress.current;
   smooth.lerp(motion.matches?new THREE.Vector2():pointer,1-Math.exp(-dt*6));
   head.rotation.y=smooth.x*.3;head.rotation.x=-smooth.y*.18;
   if(kind==='robot'){
    model.rotation.y=-.16+p*.45;model.rotation.z=smooth.x*.035;model.position.y=motion.matches?0:Math.sin(t*.85)*.06-p*.22;
    gaze.position.x=smooth.x*.075;gaze.position.y=.08+smooth.y*.04;
    const blink=motion.matches?1:1-Math.pow(Math.max(0,Math.cos(t*.8)),80)*.9;eyes.forEach(eye=>eye.scale.y=blink);
    light.emissiveIntensity=1.6+(selection.current%3)*.3;
   }else{
    const focus=THREE.MathUtils.smoothstep(p,.2,.58);head.rotation.y*=1-focus;head.rotation.x=(1-focus)*(.2-smooth.y*.2);
    model.rotation.z=(1-focus)*-.28;const zoom=THREE.MathUtils.smoothstep(p,.5,1);model.scale.setScalar(1+zoom*18);model.position.z=zoom*2;
   }
   if(!motion.matches){particles.rotation.z=t*.025;rings.forEach((ring,i)=>{if(kind==='robot'||i>0)ring.rotation.z=t*.12*(i%2?-1:1);});}
   renderer.render(scene,camera);
  };frame=requestAnimationFrame(render);
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{rootMargin:'100px'});observer.observe(el);
  const lost=(event:Event)=>{event.preventDefault();setReady(false);};renderer.domElement.addEventListener('webglcontextlost',lost);
  setReady(true);
  return()=>{cancelAnimationFrame(frame);observer.disconnect();ro.disconnect();surface.removeEventListener('pointermove',move as EventListener);surface.removeEventListener('pointerleave',reset);renderer.domElement.removeEventListener('webglcontextlost',lost);const geometries=new Set<THREE.BufferGeometry>();const materials=new Set<THREE.Material>();scene.traverse(object=>{if(object instanceof THREE.Mesh||object instanceof THREE.Points){geometries.add(object.geometry);(Array.isArray(object.material)?object.material:[object.material]).forEach(m=>materials.add(m));}});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();};
 },[kind,progress]);
 return <div className={'ai-canvas '+(ready?'is-ready':'')} ref={host}><div className={'ai-scene-fallback '+kind} aria-hidden="true"><span/><i/><b/></div></div>;
}
