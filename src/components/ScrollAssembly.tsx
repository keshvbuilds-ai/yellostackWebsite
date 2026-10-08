"use client";
import { CmsText, useEditedList } from "@/components/cms/ContentProvider";

import { Component, useEffect, useRef, useState, type MutableRefObject, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { YellostackLogo3D } from "./3d/YellostackLogo3D";
import DecryptedText from "./animations/DecryptedText";

gsap.registerPlugin(ScrollTrigger);
// Adapted from https://www.yellostack.com/services and the published company homepage.
const defaultchapters = [
  { label: "EXPERIENCE", title: "Your brand.\nBrought to life.", description: "Yellostack brings together brand identity, UI/UX, responsive web design and mobile app design to shape how people experience your business.", detail: "LAYER 01 / BRAND IDENTITY + UI/UX" },
  { label: "APPLICATIONS", title: "Your business.\nIn their hands.", description: "Connect with customers through mobile applications and web experiences. Bring AI assistants and automation into the workflows that support your business.", detail: "LAYER 02 / MOBILE + WEB + AI" },
  { label: "SOFTWARE", title: "Your operations.\nConnected.", description: "Connect enterprise software, cloud services and healthcare workflows, including medical coding and documentation review, around the way your teams work.", detail: "LAYER 03 / SOFTWARE + CLOUD + MEDICAL CODING" },
  { label: "ONE STACK", title: "Three layers.\nOne Yellostack.", description: "From Al Khobar, we work closely with clients to define, design and develop digital experiences across platforms. Let’s create your next chapter together.", detail: "DESIGN + DEVELOPMENT + DIGITAL TRANSFORMATION" },
];
type SceneState = { progress: number; reduced: boolean; pointerX: number };
class SceneBoundary extends Component<{children: ReactNode}, {failed: boolean}> {
  state = {failed: false};
  static getDerivedStateFromError() { return {failed: true}; }
  render() { return this.state.failed ? <div className="build-scene-fallback" aria-hidden="true"><i/><i/><i/></div> : this.props.children; }
}
function AssemblyScene({ journey }: {journey: MutableRefObject<SceneState>}) {
  const rig = useRef<THREE.Group>(null);
  const orbit = useRef<THREE.Group>(null);
  const look = useRef(new THREE.Vector3());
  useFrame(({camera, pointer, size}, delta) => {
    const p = journey.current.reduced ? 1 : journey.current.progress;
    const smooth = THREE.MathUtils.smoothstep(p, 0, 1);
    const dt = Math.min(delta,.05);
    journey.current.pointerX = journey.current.reduced ? 0 : pointer.x;
    if (rig.current) {
      rig.current.rotation.y = -.35 + smooth * .7;
      rig.current.rotation.z = Math.sin(p*Math.PI)*.035;
      rig.current.position.y = Math.sin(p*Math.PI*2)*.25;
    }
    if (orbit.current) {
      orbit.current.rotation.y = p * Math.PI;
      orbit.current.rotation.z = .25 + p*.8;
    }
    // Camera, assembly and chapter changes share the same scrubbed playhead.
    const narrow = size.width / size.height < .85;
    const distance = narrow ? 19 : 15;
    const targetX = Math.sin(p*Math.PI*2)*.55;
    camera.position.x = THREE.MathUtils.damp(camera.position.x,targetX,5,dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y,6.4+Math.sin(p*Math.PI)*.6,5,dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z,distance-Math.sin(p*Math.PI)*1.5,5,dt);
    look.current.set(0,0,0); camera.lookAt(look.current);
  });
  return <>
    <ambientLight intensity={1.1}/><directionalLight position={[4,8,5]} intensity={3.5} color="#fff7dc"/><pointLight position={[-5,1,1]} intensity={22} color="#ffcc00"/>
    <Environment resolution={128}><Lightformer position={[0,7,4]} scale={[10,3,1]} intensity={4}/><Lightformer position={[-6,1,0]} rotation={[0,Math.PI/2,0]} scale={[3,9,1]} intensity={3}/></Environment>
    <group ref={rig}><YellostackLogo3D journey={journey} story/></group>
    <group ref={orbit} rotation={[.2,0,.25]}>{[3.7,4.3].map((radius,i)=><mesh key={radius} rotation={[Math.PI/2+i*.45,i*.3,0]}><torusGeometry args={[radius,.008,6,160]}/><meshBasicMaterial color={i ? "#ffffff" : "#ffcf00"} transparent opacity={i?.16:.45}/></mesh>)}</group>
    <gridHelper args={[36,36,"#665920","#242a1b"]} position={[0,-3.4,0]}/>
    <fog attach="fog" args={["#0b0f09",16,36]}/>
  </>;
}
export default function ScrollAssembly() {
 const chapters = useEditedList("ScrollAssembly.chapters", defaultchapters);
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const journey = useRef<SceneState>({progress:0,reduced:false,pointerX:0});
  const [visible,setVisible] = useState(false);
  const [active,setActive] = useState(0);
  const [reducedMotion,setReducedMotion] = useState(false);
  useEffect(() => {
    const media = gsap.matchMedia();
    const observer = new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{rootMargin:"120px"});
    if(section.current) observer.observe(section.current);
    media.add({ animated:"(prefers-reduced-motion: no-preference)", reduced:"(prefers-reduced-motion: reduce)" }, context => {
      const reduced = !!context.conditions?.reduced;
      journey.current.reduced = reduced;
      setReducedMotion(reduced);
      const panels = gsap.utils.toArray<HTMLElement>(".build-chapter",section.current);
      if(reduced) { journey.current.progress=1; return; }
      gsap.set(panels.slice(1),{autoAlpha:0,y:45});
      const timeline = gsap.timeline({onUpdate:()=>setActive(Math.min(3,Math.floor(journey.current.progress*4))),scrollTrigger:{id:"yellostack-build",trigger:section.current,start:"top top",end:()=>`+=${window.innerHeight*4.2}`,pin:stage.current,pinSpacing:true,scrub:1,anticipatePin:1,invalidateOnRefresh:true}});
      timeline.to(journey.current,{progress:1,duration:4,ease:"none"},0);
      timeline.to(".build-progress-fill",{scaleX:1,duration:4,ease:"none"},0);
      panels.forEach((panel,i)=>{
        if(i>0) timeline.to(panel,{autoAlpha:1,y:0,duration:.3,ease:"power2.out"},i);
        if(i<3) timeline.to(panel,{autoAlpha:0,y:-35,duration:.22,ease:"power2.in"},i+.78);
      });
      timeline.fromTo(".build-oversized-word",{xPercent:8},{xPercent:-15,duration:4,ease:"none"},0);
      return ()=>{ gsap.set(panels,{clearProps:"all"}); };
    },section);
    let alive=true;
    document.fonts.ready.then(()=>{if(alive) ScrollTrigger.refresh();});
    return ()=>{alive=false;observer.disconnect();media.revert();};
  },[]);
  const goTo = (index:number) => {
    const trigger=ScrollTrigger.getById("yellostack-build");
    if(trigger) window.scrollTo({top:trigger.start+(trigger.end-trigger.start)*((index+.18)/4),behavior:"smooth"});
    else document.getElementById(`build-chapter-${index}`)?.scrollIntoView({behavior:"smooth",block:"center"});
  };
  return <section ref={section} id="inside-the-stack" className="scroll-assembly" aria-label="How Yellostack builds digital experiences">
    <div ref={stage} className="build-stage">
      <div className="build-oversized-word" aria-hidden="true"><CmsText id="ScrollAssembly.text.0" fallback="EVERY LAYER MATTERS"/></div>
      <div className="build-scene" aria-hidden="true"><SceneBoundary><Canvas style={{touchAction:"pan-y"}} dpr={[1,1.5]} frameloop={visible?"always":"never"} camera={{position:[0,5.4,12],fov:40}} gl={{alpha:true,antialias:true}}><AssemblyScene journey={journey}/></Canvas></SceneBoundary></div>
      <header className="build-header"><span><CmsText id="ScrollAssembly.text.1" fallback="YELLOSTACK / THE MAKING OF YOUR NEXT"/></span><a href="#work"><DecryptedText text="EXPLORE OUR WORK"/><span aria-hidden="true">↗</span></a></header>
      <div className="build-chapters">{chapters.map((chapter,i)=><article key={chapter.label} id={`build-chapter-${i}`} className="build-chapter" aria-hidden={!reducedMotion && active!==i ? true : undefined}><span className="build-eyebrow">0{i+1} / {chapter.label}</span><h2>{chapter.title}</h2><p>{chapter.description}</p><span className="build-detail">{chapter.detail}</span></article>)}</div>
      <div className="build-bottom"><nav aria-label="Build sequence">{chapters.map((chapter,i)=><button key={chapter.label} onClick={()=>goTo(i)} aria-current={active===i?"step":undefined}><span>0{i+1}</span>{chapter.label}</button>)}</nav><span className="build-scroll-hint"><CmsText id="ScrollAssembly.text.2" fallback="SCROLL TO EXPLORE EACH LAYER ↓"/></span><div className="build-progress"><div className="build-progress-fill"/></div></div>
    </div>
  </section>;
}



