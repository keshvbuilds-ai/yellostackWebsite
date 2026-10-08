'use client';
import { LocalText } from '@/components/cms/ContentProvider';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CmsText } from '@/components/cms/ContentProvider';
import './golden-horizon.css';
gsap.registerPlugin(ScrollTrigger);

/** A procedural model and a screen-space light field share one scroll playhead. */
export default function GoldenHorizon(){
  const root=useRef<HTMLElement>(null);const mount=useRef<HTMLDivElement>(null);const heading=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const host=mount.current,section=root.current;if(!host||!section)return;
    let renderer:THREE.WebGLRenderer;
    try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{return;}
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0,0);host.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('aria-hidden','true');
    const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(38,1,.1,100);camera.position.set(0,0,12);
    const state={progress:0,x:0,y:0};const pointer=new THREE.Vector2();const pointerTarget=new THREE.Vector2();
    const uniforms={uProgress:{value:0},uTime:{value:0},uAspect:{value:1},uPointer:{value:new THREE.Vector2()}};
    const background=new THREE.ShaderMaterial({depthTest:false,depthWrite:false,uniforms,
      vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.999,1.);}',
      fragmentShader:`varying vec2 vUv;uniform float uProgress;uniform float uTime;uniform float uAspect;uniform vec2 uPointer;
      void main(){vec2 uv=vUv;float p=smoothstep(0.,1.,uProgress);vec2 center=vec2(.5+uPointer.x*.016,-.34+p*.27);vec2 d=(uv-center)*vec2(.62,1.);float radius=length(d);float edge=.49+p*.13;float wave=sin(uv.x*5.+uTime*.13)*.009;float band=exp(-pow((radius-edge+wave)/.14,2.));float inside=1.-smoothstep(edge-.13,edge+.035,radius);vec3 paper=vec3(.969,.969,.946);vec3 gold=vec3(1.,.79,.01);vec3 ink=vec3(.041,.049,.030);vec3 color=mix(paper,gold,band*.97);color=mix(color,ink,inside*.98);float grain=(fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)-.5)/255.;gl_FragColor=vec4(color+grain,1.);}`});
    const planeGeometry=new THREE.PlaneGeometry(2,2);const plane=new THREE.Mesh(planeGeometry,background);plane.frustumCulled=false;plane.renderOrder=-10;scene.add(plane);
    const rig=new THREE.Group();scene.add(rig);
    const shape=new THREE.Shape();const h=1.15,r=.13;
    shape.moveTo(-h+r,-h);shape.lineTo(h-r,-h);shape.quadraticCurveTo(h,-h,h,-h+r);shape.lineTo(h,h-r);shape.quadraticCurveTo(h,h,h-r,h);shape.lineTo(-h+r,h);shape.quadraticCurveTo(-h,h,-h,h-r);shape.lineTo(-h,-h+r);shape.quadraticCurveTo(-h,-h,-h+r,-h);
    const geometry=new THREE.ExtrudeGeometry(shape,{depth:.12,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.035,bevelThickness:.035,curveSegments:8});geometry.center();
    const plates:THREE.Mesh[]=[];const materials:THREE.MeshPhysicalMaterial[]=[];
    for(let i=0;i<3;i++){const material=new THREE.MeshPhysicalMaterial({color:'#ffd000',metalness:.62,roughness:.24,clearcoat:.8,transparent:true});materials.push(material);const plate=new THREE.Mesh(geometry,material);rig.add(plate);plates.push(plate);}
    scene.add(new THREE.AmbientLight('#fff4cf',2));const key=new THREE.DirectionalLight('#fff9e8',5);key.position.set(-3,5,6);scene.add(key);const rim=new THREE.PointLight('#ffba00',35);rim.position.set(4,-2,3);scene.add(rim);
    const orbitGeometry=new THREE.TorusGeometry(2.3,.006,5,140);const orbitMaterial=new THREE.MeshBasicMaterial({color:'#a88819',transparent:true,opacity:.3});const orbit=new THREE.Mesh(orbitGeometry,orbitMaterial);rig.add(orbit);
    const preference=matchMedia('(prefers-reduced-motion: reduce)');let reduced=preference.matches,visible=false,frame=0,last=0,elapsed=0,alive=true;
    function resize(){const width=host!.clientWidth,height=host!.clientHeight;renderer.setSize(width,height,false);camera.aspect=width/Math.max(height,1);camera.updateProjectionMatrix();uniforms.uAspect.value=camera.aspect;render(0);}
    function render(delta:number){
      const p=reduced?.65:state.progress;uniforms.uProgress.value=p;uniforms.uTime.value=reduced?0:elapsed;
      pointer.lerp(pointerTarget.set(state.x,state.y),1-Math.exp(-delta*4));uniforms.uPointer.value.copy(pointer);
      const spread=Math.sin(Math.min(1,p/.65)*Math.PI);rig.position.set(0,1.25-p*3.5,0);rig.rotation.set(-.7+pointer.y*.09,.25+pointer.x*.13,-.5+p*.5);rig.scale.setScalar(camera.aspect<.8?.66:1);
      plates.forEach((plate,i)=>{plate.position.set((i-1)*spread*.45,(i-1)*spread*.2,(i-1)*(.42+spread*.65));plate.rotation.z=(i-1)*spread*.18;materials[i].opacity=1-THREE.MathUtils.smoothstep(p,.57,.84);plate.visible=p<.85;});orbit.rotation.set(.5+p,.2,p*.5);orbitMaterial.opacity=.25*(1-THREE.MathUtils.smoothstep(p,.5,.8));renderer.render(scene,camera);
    }
    function tick(time:number){if(!alive||!visible||document.hidden||reduced){frame=0;return;}const delta=Math.min((time-last)/1000||.016,.05);last=time;elapsed+=delta;render(delta);frame=requestAnimationFrame(tick);}
    function resume(){if(visible&&!document.hidden&&!reduced&&!frame)frame=requestAnimationFrame(tick);else if(reduced)render(0);}
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;resume();},{rootMargin:'100px'});observer.observe(section);
    const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
    const media=gsap.matchMedia();media.add('(prefers-reduced-motion: no-preference)',()=>{
      const timeline=gsap.timeline({scrollTrigger:{trigger:section,start:'top bottom',end:'bottom bottom',scrub:.8,invalidateOnRefresh:true}});
      timeline.to(state,{progress:1,ease:'none',duration:1},0);
      timeline.fromTo(heading.current,{y:60,autoAlpha:0},{y:0,autoAlpha:1,duration:.25},.08).to(heading.current,{y:-35,autoAlpha:0,duration:.16},.6);
      return()=>{gsap.set(heading.current,{clearProps:'all'});};
    });
    const change=()=>{reduced=preference.matches;resume();};const move=(event:PointerEvent)=>{if(reduced)return;const rect=host.getBoundingClientRect();state.x=(event.clientX-rect.left)/rect.width*2-1;state.y=(event.clientY-rect.top)/rect.height*2-1;};const leave=()=>{state.x=0;state.y=0;};
    section.addEventListener('pointermove',move);section.addEventListener('pointerleave',leave);preference.addEventListener('change',change);document.addEventListener('visibilitychange',resume);
    const lost=(event:Event)=>{event.preventDefault();renderer.domElement.style.opacity='0';};renderer.domElement.addEventListener('webglcontextlost',lost);
    resize();
    return()=>{alive=false;cancelAnimationFrame(frame);observer.disconnect();resizeObserver.disconnect();media.revert();section.removeEventListener('pointermove',move);section.removeEventListener('pointerleave',leave);preference.removeEventListener('change',change);document.removeEventListener('visibilitychange',resume);renderer.domElement.removeEventListener('webglcontextlost',lost);geometry.dispose();materials.forEach(m=>m.dispose());orbitGeometry.dispose();orbitMaterial.dispose();planeGeometry.dispose();background.dispose();renderer.dispose();renderer.domElement.remove();};
  },[]);
  return <section ref={root} className="golden-horizon" aria-label="Yellostack connected future"><div className="golden-horizon-stage"><div ref={mount} className="golden-horizon-canvas"/><div className="golden-horizon-grid" aria-hidden="true">{[0,1,2,3,4].map(i=><span key={i}>·</span>)}</div><div ref={heading} className="golden-horizon-copy"><p><CmsText id="horizon.eyebrow" fallback="EVERY IDEA HAS A NEXT CHAPTER"/></p><h2><CmsText id="horizon.heading" fallback="Make yours extraordinary."/></h2><a href="/contact"><CmsText id="horizon.link" fallback="LET’S CREATE IT TOGETHER"/> <span aria-hidden="true">↗</span></a></div><div className="golden-horizon-caption"><span><LocalText text={"YELLOSTACK / CONNECTED POSSIBILITIES"}/></span><span><LocalText text={"SCROLL INTO WHAT’S NEXT ↓"}/></span></div></div></section>;
}
