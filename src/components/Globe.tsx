"use client";
import { Component, useEffect, useMemo, useRef, useState, type ReactNode, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { YellostackLogo3D } from "./3d/YellostackLogo3D";
import DecryptedText from "./animations/DecryptedText";

gsap.registerPlugin(ScrollTrigger);
class GlobeBoundary extends Component<{children: ReactNode}, {failed: boolean}> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <div className="globe-fallback"><img src="/logoyelostack.png" alt="Yellostack" /></div> : this.props.children; }
}
type GlobeInteraction = { active: number; x: number; y: number };
type Handoff = MutableRefObject<{progress:number; active?:number; x?:number; y?:number}>;
function GlassStack({ progress, reduced, interaction, handoff }: { progress: MutableRefObject<number>; reduced: boolean; interaction: MutableRefObject<GlobeInteraction>; handoff?: Handoff }) {
  const group = useRef<THREE.Group>(null);
  const logo = useRef<THREE.Group>(null);
  const orbit = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  const hover = useRef(0);
  const rim = useRef<THREE.ShaderMaterial>(null);
  const journey = useRef({progress:1,reduced,pointerX:0});
  useEffect(() => {journey.current.reduced = reduced;}, [reduced]);
  const uniforms = useMemo(() => ({uGlow:{value:.6},uHover:{value:0},uTime:{value:0}}), []);
  const positions = useMemo(() => {
    const points = new Float32Array(540);
    for(let i=0;i<180;i++) { const theta=i*2.399963; const y=1-(i/179)*2; const r=Math.sqrt(1-y*y); points.set([Math.cos(theta)*r*2.35,y*2.35,Math.sin(theta)*r*2.35],i*3); }
    return points;
  }, []);
  useFrame(({clock, size, camera}, delta) => {
    if (!group.current) return;
    const dt=Math.min(delta,.05);
    camera.position.z = Math.max(7.8, 7.8 * size.height / Math.max(size.width, 1));
    hover.current = THREE.MathUtils.damp(hover.current, interaction.current.active, 4, dt);
    const h = hover.current;
    if (logo.current) logo.current.visible = !handoff || handoff.current.progress >= .999;
    const arrival = handoff ? THREE.MathUtils.smoothstep(handoff.current.progress,.83,1) : 1;
    const x=reduced ? 0 : interaction.current.x * h, y=reduced ? 0 : interaction.current.y * h;
    journey.current.progress = reduced ? 1 : 1 - h * .27;
    journey.current.pointerX = x;
    group.current.scale.setScalar(reduced ? 1 : 1 + h * .035);
    if(light.current) light.current.intensity = 12 + h * 13;
    if(orbit.current && !reduced) { orbit.current.rotation.y += dt * (.035 + h * .18); orbit.current.rotation.z = progress.current * .3; }
    group.current.rotation.y=THREE.MathUtils.damp(group.current.rotation.y,.48+x*.38+(reduced || handoff ? 0 : progress.current*.25),3,dt);
    group.current.rotation.x=THREE.MathUtils.damp(group.current.rotation.x,.2-y*.22,3,dt);
    if(rim.current) {
      rim.current.uniforms.uGlow.value = .7 + h * .55 + (handoff ? Math.sin(arrival*Math.PI)*.6 : 0);
      rim.current.uniforms.uHover.value = h;
      rim.current.uniforms.uTime.value = reduced ? 0 : clock.elapsedTime;
    }
  });
  return <>
    <ambientLight intensity={1.4}/><directionalLight position={[4,6,5]} intensity={4} color="#fff5c8"/><pointLight position={[-3,1,2]} intensity={18} color="#ffcc00"/><pointLight ref={light} position={[2,-2,-1]} intensity={12} color="#ffdf73"/>
    <Environment resolution={128}><Lightformer position={[0,5,3]} intensity={4} scale={[8,3,1]} /><Lightformer position={[-5,0,2]} intensity={3} color="#ffe39a" scale={[2,7,1]} /></Environment>
    <group ref={group} rotation={[.2,.48,0]}>
      <group ref={logo}><YellostackLogo3D scale={.53} journey={journey}/></group>
      <mesh><sphereGeometry args={[2.35,64,48]}/><shaderMaterial ref={rim} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} vertexShader={`varying vec3 vNormal; varying vec3 vView; varying vec3 vPos; void main(){vPos=position;vec4 mv=modelViewMatrix*vec4(position,1.);vNormal=normalize(normalMatrix*normal);vView=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}`} fragmentShader={`varying vec3 vNormal; varying vec3 vView; varying vec3 vPos; uniform float uGlow; uniform float uHover; uniform float uTime; void main(){float sweep=pow(max(0.,1.-abs(vPos.y-sin(uTime*.8)*2.35)*5.),3.)*uHover;float rim=pow(1.-abs(dot(normalize(vNormal),normalize(vView))),3.2);gl_FragColor=vec4(vec3(1.,.76,.19),(.025+rim*.58+sweep*.17)*uGlow);}`}/></mesh>
      <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions,3]}/></bufferGeometry><pointsMaterial color="#ffe7a0" size={.014} transparent opacity={.48} depthWrite={false}/></points>
      <group ref={orbit}><mesh rotation={[1.12,.2,.3]}><torusGeometry args={[2.39,.003,8,180]}/><meshBasicMaterial color="#ffda65" transparent opacity={.35}/></mesh><mesh rotation={[.6,-.4,-.7]}><torusGeometry args={[2.43,.004,8,180]}/><meshBasicMaterial color="#fff1bd" transparent opacity={.18}/></mesh></group>
    </group>
  </>;
}
export default function GlobeSection({handoff,externalScene=false}:{handoff?:Handoff;externalScene?:boolean} = {}) {
  const section=useRef<HTMLElement>(null);
  const progress=useRef(0);
  const localInteraction=useRef<GlobeInteraction>({active:0,x:0,y:0});
  const interaction = externalScene && handoff ? handoff as MutableRefObject<GlobeInteraction & {progress:number}> : localInteraction;
  const [visible,setVisible]=useState(false);
  const [reduced,setReduced]=useState(false);
  useEffect(() => {
    const media=matchMedia("(prefers-reduced-motion: reduce)");
    const change=()=>setReduced(media.matches);change();media.addEventListener("change",change);
    const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{rootMargin:"100px"});
    if(section.current)observer.observe(section.current);
    const context=gsap.context(()=>{if(externalScene)return;gsap.to(progress,{current:1,ease:"none",scrollTrigger:{trigger:section.current,start:"top bottom",end:"bottom top",scrub:1}});},section);
    return()=>{observer.disconnect();media.removeEventListener("change",change);context.revert();};
  },[externalScene]);
  return <section ref={section} className="stack-globe-section" aria-labelledby="globe-title">
    <div className="stack-globe-art" tabIndex={0} role="img" aria-label="Interactive Yellostack globe. Hover, focus, or touch to illuminate and open the stack."
      onPointerEnter={() => {interaction.current.active=1;}}
      onPointerMove={event => {const rect=event.currentTarget.getBoundingClientRect();interaction.current.x=(event.clientX-rect.left)/rect.width*2-1;interaction.current.y=1-(event.clientY-rect.top)/rect.height*2;}}
      onPointerLeave={() => {interaction.current.active=0;}}
      onPointerDown={() => {interaction.current.active=1;}}
      onPointerUp={event => {if(event.pointerType!=="mouse")interaction.current.active=0;}}
      onPointerCancel={() => {interaction.current.active=0;}}
      onFocus={() => {interaction.current.active=1;}}
      onBlur={() => {interaction.current.active=0;}}>{!externalScene && <GlobeBoundary><Canvas style={{touchAction:"pan-y"}} dpr={[1,1.5]} frameloop={visible?"always":"never"} camera={{position:[0,1,7.8],fov:42}} gl={{alpha:true,antialias:true}}><GlassStack progress={progress} reduced={reduced} interaction={interaction} handoff={handoff}/></Canvas></GlobeBoundary>}<span className="globe-explore-hint" aria-hidden="true">HOVER TO CONNECT · EVERY LAYER RESPONDS</span></div>
    <div className="stack-globe-heading"><span className="section-index">● CONNECTED BY DESIGN</span><h2 id="globe-title">Every layer.<br /><em>One vision.</em></h2><p>Design, AI and technology. Connected around your business and the people you serve.</p><a href="#contact" className="globe-contact"><DecryptedText text="LET’S BUILD TOGETHER"/><span>↗</span></a></div>
    <div className="stack-globe-details"><div><span>01 / STRATEGY</span><h3>A clear direction.</h3><p>Connect your business goals with AI, automation and digital experiences that support the way your team works.</p></div><div><span>02 / DESIGN</span><h3>Built around people.</h3><p>Bring your brand to life with UI/UX design, mobile applications and connected customer experiences.</p></div><div><span>03 / TECHNOLOGY</span><h3>Ready for what’s next.</h3><p>Bring enterprise software, cloud and medical coding workflows together with clear processes for your next stage of growth.</p></div></div>
  </section>;
}



