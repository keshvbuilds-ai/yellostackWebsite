"use client";
import { CmsText, useEditedList } from "@/components/cms/ContentProvider";
import { Component, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GlobeSection from "./Globe";


gsap.registerPlugin(ScrollTrigger);
const defaultstories = [
  { title: "Designed around people.", tag: "01 / BRAND & EXPERIENCE", body: "Yellostack brings brand identity, UI/UX and mobile experiences together. Every interaction starts with the people who will use it.", image: "/layer-experience.svg", detail: "UI/UX · BRAND IDENTITY · MOBILE DESIGN" },
  { title: "Ideas become working products.", tag: "02 / APPLICATIONS & AI", body: "From mobile apps and ecommerce to AI assistants and workflow automation, we connect your ideas to the way your business works.", image: "/layer-intelligence.svg", detail: "APPLICATIONS · AI · AUTOMATION" },
  { title: "Connected behind the scenes.", tag: "03 / SOFTWARE & HEALTHCARE", body: "Enterprise software, cloud services and medical coding workflows. Connected capabilities that support your teams and your next stage of growth.", image: "/layer-operations.svg", detail: "ENTERPRISE · CLOUD · MEDICAL CODING" },
];
type Playhead = { progress: number; active: number; x: number; y: number };
const ease = (x: number) => { const t = THREE.MathUtils.clamp(x, 0, 1); return t * t * (3 - 2 * t); };
function Cards({ playhead, destination }: { playhead: RefObject<Playhead>; destination: RefObject<HTMLDivElement | null> }) {
  const stories = useEditedList("LayerGallery.stories", defaultstories);
  const cards = useRef<(THREE.Group | null)[]>([]);
  const assembled = useRef<THREE.Group>(null);
  const glow = useRef<THREE.ShaderMaterial>(null);
  const hover = useRef(0);
  const faces = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const [maps, setMaps] = useState<THREE.Texture[]>([]);
  useEffect(() => {
    let alive = true;
    const textures: THREE.Texture[] = [];
    const loader = new THREE.TextureLoader();
    stories.forEach((story, i) => {
      const texture = loader.load(story.image, () => { if (alive) setMaps([...textures]); });
      texture.colorSpace = THREE.SRGBColorSpace;
      textures[i] = texture;
    });
    return () => { alive = false; textures.forEach(texture => texture.dispose()); };
  }, [stories]);
  useFrame(({ viewport, size, gl }, delta) => {
    const state = playhead.current;
    const p = state.progress;
    const open = ease(p / .16);
    const travel = THREE.MathUtils.clamp((p - .18) / .46, 0, 1) * 2;
    const reunion = ease((p - .70) / .13);
    const docking = ease((p - .84) / .12);
    hover.current = THREE.MathUtils.damp(hover.current,p > .96 ? state.active : 0,4,Math.min(delta,.05));
    const h=hover.current;
    const width=viewport.width;
    const target=destination.current?.querySelector('.stack-globe-art')?.getBoundingClientRect();
    const canvas=gl.domElement.getBoundingClientRect();
    let targetX=0,targetY=0,targetScale=.55;
    if(target){
      const z=Math.max(7.8,7.8*target.height/Math.max(target.width,1));
      const pixelsPerUnit=target.height/(2*z*Math.tan(THREE.MathUtils.degToRad(21)));
      targetX=(target.left+target.width/2-canvas.left-size.width/2)/size.width*viewport.width;
      targetY=-(target.top+target.height/2+pixelsPerUnit-canvas.top-size.height/2)/size.height*viewport.height;
      targetScale=.53*pixelsPerUnit*viewport.height/size.height;
    }
    const origin=new THREE.Vector3(targetX*docking,THREE.MathUtils.lerp(viewport.height*.1,targetY,docking),0);
    const assemblyScale=THREE.MathUtils.lerp(.8,targetScale,docking);
    const orientation=new THREE.Quaternion().setFromEuler(new THREE.Euler(.42-.22*docking-state.y*h*.12,.48+state.x*h*.2,0));
    const flat=new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI/2,0,0));
    const finalRotation=orientation.clone().multiply(flat);
    cards.current.forEach((card,i)=>{
      if(!card)return;
      const cardScale=Math.min(viewport.height*.39/4.8,width*.65/4.8);
      const initial=new THREE.Vector3((i-travel)*width*open,THREE.MathUtils.lerp((1-i)*.65+viewport.height*.1,viewport.height*.12,open),0);
      const joined=new THREE.Vector3(0,(1-i)*(1.02+h*.25),0).applyQuaternion(orientation).multiplyScalar(assemblyScale).add(origin);
      card.position.copy(initial).lerp(joined,reunion);
      const startRotation=new THREE.Quaternion().setFromEuler(new THREE.Euler(-1.05*(1-open),.15*(1-open),-.55*(1-open)));
      card.quaternion.copy(startRotation).slerp(finalRotation,reunion);
      card.scale.setScalar(THREE.MathUtils.lerp(THREE.MathUtils.lerp(.8,cardScale,open),assemblyScale,reunion));
      if(faces.current[i])faces.current[i]!.opacity=ease((p-.1)/.08)*(1-reunion);
    });
    if(assembled.current){
      assembled.current.visible=p>.84;
      assembled.current.position.set(targetX,targetY,0);
      assembled.current.scale.setScalar(targetScale/.53*(.92+.08*docking));
      assembled.current.rotation.set(.2,.48,0);
      assembled.current.children.forEach(child=>{if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial)child.material.opacity=.22*docking;});
    }
    if(glow.current){glow.current.uniforms.strength.value=docking*(.65+h*.45);}
  });
  return <>
    <ambientLight intensity={1.5}/><directionalLight position={[3,5,7]} intensity={4}/>
    <Environment resolution={128}><Lightformer position={[0,5,4]} scale={[8,4,1]} intensity={4}/><Lightformer position={[-5,1,3]} scale={[2,8,1]} intensity={3} color="#ffe08c"/></Environment>
    {stories.map((story, i) => <group key={story.tag} ref={node => { cards.current[i] = node; }}>
      <RoundedBox args={[4.8,4.8,.2]} radius={.12} smoothness={4}><meshPhysicalMaterial color="#ffcf00" metalness={.65} roughness={.27}/></RoundedBox>
      <mesh position={[0,0,.112]}><planeGeometry args={[4.55,4.55]}/><meshBasicMaterial ref={node => {faces.current[i]=node;}} map={maps[i]} transparent opacity={0} toneMapped={false}/></mesh>
    </group>)}
    <group ref={assembled} visible={false}>
      <mesh><sphereGeometry args={[2.35,64,48]}/><shaderMaterial ref={glow} transparent depthWrite={false} blending={THREE.AdditiveBlending} uniforms={{strength:{value:0}}} vertexShader={`varying vec3 n;varying vec3 v;void main(){vec4 p=modelViewMatrix*vec4(position,1.);n=normalize(normalMatrix*normal);v=normalize(-p.xyz);gl_Position=projectionMatrix*p;}`} fragmentShader={`varying vec3 n;varying vec3 v;uniform float strength;void main(){float rim=pow(1.-abs(dot(normalize(n),normalize(v))),3.);gl_FragColor=vec4(1.,.78,.2,(.035+rim*.65)*strength);}`}/></mesh>
      {[0,1].map(i=><mesh key={i} rotation={[1.1+i*.4,.3,-.5+i]}><torusGeometry args={[2.4,.006,8,160]}/><meshBasicMaterial color="#ffe396" transparent opacity={.22}/></mesh>)}
    </group>
  </>;
}
class GalleryBoundary extends Component<{children: ReactNode}, {failed:boolean}> {
  state={failed:false}; static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed ? <div className="layer-gallery-fallback">{defaultstories.map(story=><img key={story.tag} src={story.image} alt=""/>)}</div> : this.props.children;}
}
export default function LayerGallery() {
 const stories = useEditedList("LayerGallery.stories", defaultstories);
  const root=useRef<HTMLElement>(null);
  const stage=useRef<HTMLDivElement>(null);
  const destination=useRef<HTMLDivElement>(null);
  const playhead=useRef({progress:0,active:0,x:0,y:0});
  const [visible,setVisible]=useState(false);
  const [animated,setAnimated]=useState(false);
  useEffect(()=>{
    const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{rootMargin:"100px"});
    if(root.current)observer.observe(root.current);
    const media=gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference) and (min-width: 801px)",()=>{
      setAnimated(true);
      const context=gsap.context(()=>{
        const timeline=gsap.timeline({scrollTrigger:{trigger:root.current,start:"top top",end:()=>`+=${innerHeight*5}`,pin:stage.current,scrub:.85,anticipatePin:1,invalidateOnRefresh:true}});
        timeline.to(playhead.current,{progress:1,ease:"none",duration:1},0);
        timeline.to(".layer-gallery-intro",{autoAlpha:0,y:-25,duration:.1},.1);
        timeline.fromTo(".layer-gallery-track",{autoAlpha:0},{autoAlpha:1,duration:.08},.1);
        timeline.to(".layer-gallery-track",{x:()=>-2*stage.current!.clientWidth,ease:"none",duration:.46},.18);
        timeline.to(".layer-gallery-track",{autoAlpha:0,duration:.05},.68);
        timeline.to(".layer-gallery-stage>header, .layer-gallery-bottom",{autoAlpha:0,duration:.06},.77);
        timeline.fromTo(".layer-gallery-destination",{autoAlpha:0},{autoAlpha:1,duration:.12},.82);
        
        timeline.to(".layer-gallery-progress i",{scaleX:1,ease:"none",duration:1},0);
      },root);
      return()=>{context.revert();setAnimated(false);};
    });
    let alive=true;document.fonts.ready.then(()=>{if(alive)ScrollTrigger.refresh();});
    return()=>{alive=false;media.revert();observer.disconnect();};
  },[]);
  return <section ref={root} className="layer-gallery" aria-label="Three layers of Yellostack">
    <div ref={stage} className="layer-gallery-stage">
      <header><span><CmsText id="LayerGallery.text.0" fallback="YELLOSTACK / INSIDE EVERY LAYER"/></span><a href="#contact"><CmsText id="LayerGallery.text.1" fallback="LET’S MAKE IT HAPPEN ↗"/></a></header>
      <div className="layer-gallery-intro"><span><CmsText id="LayerGallery.text.2" fallback="ONE SYMBOL. MANY POSSIBILITIES."/></span><h2><CmsText id="LayerGallery.text.3" fallback="There’s more"/><br/><CmsText id="LayerGallery.text.4" fallback="inside every layer."/></h2><p><CmsText id="LayerGallery.text.5" fallback="Scroll to unfold the story →"/></p></div>
      <div className="layer-gallery-canvas" aria-hidden="true"><GalleryBoundary>{animated && <Canvas camera={{position:[0,0,10],fov:42}} dpr={[1,1.5]} frameloop={visible?"always":"never"} style={{touchAction:"pan-y"}}><Cards playhead={playhead} destination={destination}/></Canvas>}</GalleryBoundary></div>
      <div className="layer-gallery-track">{stories.map(story=><article key={story.tag} className="layer-gallery-panel"><img src={story.image} alt="Yellostack capability illustration"/><div><span>{story.tag}</span><h3>{story.title}</h3><p>{story.body}</p><small>{story.detail}</small></div></article>)}</div>
      <div className="layer-gallery-bottom"><span><CmsText id="LayerGallery.text.6" fallback="THREE LAYERS / ONE CONNECTED PARTNER"/></span><span><CmsText id="LayerGallery.text.7" fallback="SCROLL TO EXPLORE ←"/></span><div className="layer-gallery-progress"><i/></div></div>
      <div ref={destination} className="layer-gallery-destination"><GlobeSection handoff={animated ? playhead : undefined} externalScene={animated}/></div>
    </div>
  </section>;
}
