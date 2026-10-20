'use client';
import { useEffect,useRef,useState } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LocalText, CmsText } from '@/components/cms/ContentProvider';
import './development.css';
export default function DevelopmentExperience({kind}:{kind:'mobile'|'web'}){
 const root=useRef<HTMLElement>(null),host=useRef<HTMLDivElement>(null);const [layered,setLayered]=useState(false);const target=useRef(0);
 useEffect(()=>{target.current=layered?1:0;},[layered]);
 useEffect(()=>{
  const el=host.current;if(!el)return;let renderer:THREE.WebGLRenderer;try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});}catch{return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(el.clientWidth,el.clientHeight);el.appendChild(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,50);camera.position.z=9;
  scene.add(new THREE.HemisphereLight(0xffffff,0x665511,3));const light=new THREE.DirectionalLight(0xffffff,4);light.position.set(3,4,6);scene.add(light);
  const group=new THREE.Group();scene.add(group);const mobile=kind==='mobile';const width=mobile?2.2:4.7,height=mobile?4:3;
  const add=(w:number,h:number,d:number,color:number,x:number,y:number,z:number)=>{const mesh=new THREE.Mesh(new RoundedBoxGeometry(w,h,d,3,.06),new THREE.MeshStandardMaterial({color,roughness:.3,metalness:.2}));mesh.position.set(x,y,z);group.add(mesh);return mesh;};
  add(width+.16,height+.16,.18,0x252d24,0,0,0);add(width,height,.08,0xf4f5ea,0,0,.13);
  const panels:THREE.Mesh[]=[];panels.push(add(width-.3,.65,.06,0xffcc02,0,height/2-.6,.23));
  for(let i=0;i<3;i++)panels.push(add(mobile?width-.4:1.25,mobile?.62:1.35,.06,i===1?0xc9d2bd:0x344232,mobile?0:(i-1)*1.4,mobile?.15-i*.83:-.35,.25));
  if(mobile)add(.55,.1,.025,0x111811,0,height/2-.12,.23);else for(let i=0;i<3;i++)add(.08,.08,.03,0x87917b,-width/2+.2+i*.16,height/2-.14,.22);
  const pointer={x:0,y:0},state={scroll:0};let spread=0,visible=true,raf=0;const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  gsap.registerPlugin(ScrollTrigger);const mm=gsap.matchMedia();mm.add('(prefers-reduced-motion: no-preference)',()=>{const tween=gsap.to(state,{scroll:1,ease:'none',scrollTrigger:{trigger:root.current,start:'top bottom',end:'bottom top',scrub:.8}});return()=>{tween.scrollTrigger?.kill();tween.kill();};});
  const move=(e:PointerEvent)=>{const r=el.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width-.5;pointer.y=(e.clientY-r.top)/r.height-.5;};const leave=()=>{pointer.x=pointer.y=0;};el.addEventListener('pointermove',move);el.addEventListener('pointerleave',leave);
  const resize=()=>{const w=Math.max(1,el.clientWidth),h=Math.max(1,el.clientHeight);renderer.setSize(w,h);camera.aspect=w/h;camera.position.z=Math.max(8,(width+1)/(2*Math.tan(Math.PI*35/360)*camera.aspect));camera.updateProjectionMatrix();};const ro=new ResizeObserver(resize);ro.observe(el);resize();const io=new IntersectionObserver(([e])=>visible=e.isIntersecting);io.observe(el);
  const draw=()=>{raf=requestAnimationFrame(draw);if(!visible||document.hidden)return;spread=THREE.MathUtils.lerp(spread,target.current,.07);group.rotation.y=reduced.matches?-.15:(state.scroll-.5)*.75+pointer.x*.3;group.rotation.x=reduced.matches?0:.08-pointer.y*.15;panels.forEach((panel,i)=>panel.position.z=.25+spread*(.4+i*.3));renderer.render(scene,camera);};draw();
  return()=>{cancelAnimationFrame(raf);mm.revert();ro.disconnect();io.disconnect();el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave);group.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();(o.material as THREE.Material).dispose();}});renderer.dispose();renderer.domElement.remove();};
 },[kind]);
 return <section ref={root} className="development-experience" data-no-gradient><div><p className="development-kicker">YELLOSTACK / {kind==='mobile'?'MOBILE':'WEB'}</p><h2><CmsText id={'development.'+kind+'.title'} fallback={kind==='mobile'?'Built for the way you move.':'Every layer. Working together.'}/></h2><p><CmsText id={'development.'+kind+'.body'} fallback={kind==='mobile'?'Thoughtful interfaces, connected services and mobile experiences for everyday moments.':'From a clear interface to connected applications, we build websites around your business and the people who use them.'}/></p><button onClick={()=>setLayered(!layered)} aria-pressed={layered}><LocalText text={layered?'Bring it together':'Explore the layers'}/> ↗</button></div><div ref={host} className="development-model" role="img" aria-label={kind==='mobile'?'Interactive 3D phone interface':'Interactive 3D browser interface'}><span className="development-model-fallback">{kind==='mobile'?'MOBILE / UI / EXPERIENCE':'WEB / DESIGN / DEVELOPMENT'}</span></div></section>;
}
