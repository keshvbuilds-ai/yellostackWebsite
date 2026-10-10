'use client';
import { useEffect, useRef, type RefObject } from 'react';
import * as THREE from 'three';

export default function NeuralScene({progress, nervesOnly=false,travel}:{progress:RefObject<number>;nervesOnly?:boolean;travel?:RefObject<number>}){
 const host=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const el=host.current;if(!el)return;let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});}catch{return;}
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));el.appendChild(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(42,1,.1,100);camera.position.z=9;
  scene.add(new THREE.HemisphereLight(0xffefc1,0x283a50,3));const key=new THREE.DirectionalLight(0xffeee0,4);key.position.set(2,4,5);camera.add(key);camera.add(key.target);key.target.position.set(0,0,-7);scene.add(camera);
  const brain=new THREE.Group();scene.add(brain);
  const tissue=new THREE.MeshStandardMaterial({color:0xc89484,metalness:0,roughness:.57});
  const glow=new THREE.MeshBasicMaterial({color:0xffcf00,transparent:true,opacity:.45});

  const cortexPaths:{curve:THREE.CatmullRomCurve3;parent:THREE.Group}[]=[];
  const halves:THREE.Group[]=[];
  // Solid cerebral hemispheres with irregular folds and a central fissure.
  for(const side of [-1,1]){
   const half=new THREE.Group();half.position.x=side*.53;brain.add(half);halves.push(half);
   const surface=(theta:number,phi:number,lift=0)=>{const fold=.028*Math.sin(phi*8+Math.sin(theta*7)*1.5)*Math.sin(theta*11+Math.sin(phi*5));return new THREE.Vector3(Math.sin(theta)*Math.cos(phi)*(.73+fold+lift),Math.cos(theta)*(1.02+fold+lift),Math.sin(theta)*Math.sin(phi)*(1.4+fold+lift));};
   const geo=new THREE.SphereGeometry(1,112,80);const attr=geo.attributes.position;
   for(let i=0;i<attr.count;i++){const v=new THREE.Vector3().fromBufferAttribute(attr,i).normalize();const q=surface(Math.acos(THREE.MathUtils.clamp(v.y,-1,1)),Math.atan2(v.z,v.x));attr.setXYZ(i,q.x,q.y,q.z);}geo.computeVertexNormals();half.add(new THREE.Mesh(geo,tissue));
   for(let row=0;row<14;row++){const points=[];for(let j=0;j<=65;j++){const phi=-Math.PI+j/65*Math.PI*2;points.push(surface(.22+row*.195+.075*Math.sin(phi*4+row*1.3)+.035*Math.sin(phi*9-row),phi,.035));}half.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),100,.045,6,false),tissue));if(row%3===0){const signalPoints=points.map(v=>v.clone().multiplyScalar(1.045));const path=new THREE.CatmullRomCurve3(signalPoints);cortexPaths.push({curve:path,parent:half});half.add(new THREE.Mesh(new THREE.TubeGeometry(path,80,.009,4,false),new THREE.MeshBasicMaterial({color:0xf3c624,transparent:true,opacity:.55})));}}
  }
  const cortexSignals=cortexPaths.map(({curve,parent})=>{const mesh=new THREE.Mesh(new THREE.SphereGeometry(.033,8,6),new THREE.MeshBasicMaterial({color:0xffdf47}));parent.add(mesh);return {curve,mesh};});
  const stem=new THREE.Mesh(new THREE.CapsuleGeometry(.15,.65,8,16),tissue);stem.position.set(0,-1.25,-.65);stem.rotation.x=-.3;brain.add(stem);
  const cerebellum=new THREE.Mesh(new THREE.SphereGeometry(.5,32,24),tissue);cerebellum.position.set(0,-.85,-.8);cerebellum.scale.set(1.3,.65,.9);brain.add(cerebellum);
  const curves:THREE.CatmullRomCurve3[]=[];const network=new THREE.Group();scene.add(network);
  for(let i=0;i<30;i++){
   const angle=i/30*Math.PI*2;const points=[];
   for(let j=0;j<=24;j++){const radius=2.5+.45*Math.sin(j*.43+i);points.push(new THREE.Vector3(Math.cos(angle+j*.035)*radius+.22*Math.sin(j+i),Math.sin(angle+j*.035)*radius+.15*Math.cos(j*1.8+i),5-j*2.4));}
   const curve=new THREE.CatmullRomCurve3(points);curves.push(curve);network.add(new THREE.Mesh(new THREE.TubeGeometry(curve,100,.022,5,false),glow));
   for(let b=0;b<4;b++){const start=points[4+b*5];const twig=new THREE.CatmullRomCurve3([start,start.clone().add(new THREE.Vector3(Math.cos(angle+.4)*.4,Math.sin(angle+.4)*.4,-.7)),start.clone().add(new THREE.Vector3(Math.cos(angle+.7)*1.1,Math.sin(angle+.7)*1.1,-2)),start.clone().add(new THREE.Vector3(Math.cos(angle+1)*1.6,Math.sin(angle+1)*1.6,-3.5))]);curves.push(twig);network.add(new THREE.Mesh(new THREE.TubeGeometry(twig,20,.008,4,false),glow));}
  }
  const sparks=new THREE.InstancedMesh(new THREE.SphereGeometry(.026,6,4),new THREE.MeshBasicMaterial({color:0xffdf49}),144);network.add(sparks);const dummy=new THREE.Object3D();
  const fragments=new THREE.Group();brain.add(fragments);
  for(let i=0;i<72;i++){const f=new THREE.Mesh(new THREE.IcosahedronGeometry(.14+(i%5)*.035,0),i%4===0?new THREE.MeshBasicMaterial({color:0xffcf00}):tissue);fragments.add(f);}
  const media=matchMedia('(prefers-reduced-motion: reduce)');let visible=true,frame=0,displayProgress=progress.current,lastTime=0;
  const resize=()=>{const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.position.z=w<h?12:9;camera.updateProjectionMatrix();};const ro=new ResizeObserver(resize);ro.observe(el);resize();
  const io=new IntersectionObserver(e=>{visible=e[0].isIntersecting;});io.observe(el);
  const render=(time:number)=>{frame=requestAnimationFrame(render);if(!visible||document.hidden)return;const dt=Math.min((time-lastTime)/1000,.05);lastTime=time;displayProgress=THREE.MathUtils.damp(displayProgress,progress.current,14,dt);const p=media.matches ? .32 : displayProgress;const enter=THREE.MathUtils.smoothstep(p,0,.2),approach=THREE.MathUtils.smoothstep(p,.48,.67),crack=THREE.MathUtils.smoothstep(p,.66,.85),clear=THREE.MathUtils.smoothstep(p,.88,.995);const small=el.clientWidth<800;
   brain.visible=!nervesOnly&&p>.001&&p<.995;
   if(nervesOnly){camera.position.set(0,0,8-THREE.MathUtils.smoothstep(p,.72,1)*27);network.position.z=0;glow.opacity=.4;}
   else{camera.position.set(0,0,(small?11:8)-enter*1.2);brain.position.set((small?0:2.05)*(1-approach),small?1.7:0,-7*(1-enter));brain.rotation.set(.18+enter*.16,-.7+enter*.35+approach*.15,-approach*.04);brain.scale.setScalar((small?.9:1.2));
    halves.forEach((h,i)=>{const side=i===0?-1:1;h.position.set(side*(.53+crack*4.8),crack*(i===0?.6:-.5),0);h.rotation.set(crack*.4,side*crack*.85,side*crack*.3);h.scale.setScalar(1-THREE.MathUtils.smoothstep(p,.7,.86));});stem.scale.setScalar(1-crack);cerebellum.visible=crack<.4;
    fragments.children.forEach((f,i)=>{const a=i*2.39996;f.position.set(Math.cos(a)*(.5+crack*7),Math.sin(a)*(.5+crack*4),-(i%3)*.25);f.scale.setScalar(THREE.MathUtils.smoothstep(p,.66,.74)*(1-clear));f.rotation.set(crack*i*.2,crack*i*.13,0);});network.position.z=enter*24;network.visible=true;glow.opacity=.3;
   }
   if(travel&&!media.matches){const cameraZ=8-travel.current*36;const relative=brain.position.z-camera.position.z;camera.position.z=cameraZ;brain.position.z=cameraZ+relative;network.position.z=0;network.visible=true;glow.opacity=.32;}
   cortexSignals.forEach(({curve,mesh},i)=>mesh.position.copy(curve.getPoint((i*.17+(media.matches?0:time*.00012)+p*.7)%1)));
   for(let i=0;i<144;i++){const phase=(i/144+(media.matches?0:time*.000045)+p*.8)%1;dummy.position.copy(curves[i%curves.length].getPoint(phase));dummy.scale.setScalar(.6+(i%4)*.25);dummy.updateMatrix();sparks.setMatrixAt(i,dummy.matrix);}sparks.instanceMatrix.needsUpdate=true;
   renderer.render(scene,camera);
  };frame=requestAnimationFrame(render);
  return()=>{cancelAnimationFrame(frame);ro.disconnect();io.disconnect();const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>();scene.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.LineSegments){geometries.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));}});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();};
 },[progress,nervesOnly,travel]);
 return <div ref={host} className="ai-neural-canvas" aria-hidden="true"/>;
}
