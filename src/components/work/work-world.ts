import * as THREE from 'three';
export type WorldFrame={depth:number;visibility:number;finale?:number};
/** One continuous, reversible camera flight through a modelled architectural Y gallery. */
export function createWorkWorld(host:HTMLElement){
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0xfafaf7,1);
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;
 host.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
 const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xfafaf7,18,70);
 const camera=new THREE.PerspectiveCamera(48,1,.1,100);
 scene.add(new THREE.HemisphereLight(0xffffff,0x8d8065,3));
 const key=new THREE.DirectionalLight(0xfff3cf,5);key.position.set(4,7,7);scene.add(key);
 const fill=new THREE.DirectionalLight(0xffffff,3);fill.position.set(-5,3,-15);scene.add(fill);
 const white=new THREE.MeshStandardMaterial({color:0xf5f4ea,roughness:.32,metalness:.12});
 const gold=new THREE.MeshStandardMaterial({color:0xffcc02,roughness:.26,metalness:.65});
 const ink=new THREE.MeshStandardMaterial({color:0x22291c,roughness:.5,metalness:.2});
 const geometries:THREE.BufferGeometry[]=[];
 const box=new THREE.BoxGeometry(1,1,1);geometries.push(box);
 const stacks:{group:THREE.Group;layers:THREE.Mesh[];offset:number}[]=[];
 function stack(x:number,y:number,z:number,size:number,offset:number){
  const group=new THREE.Group();group.position.set(x,y,z);group.scale.setScalar(size);group.rotation.x=.42;scene.add(group);
  const layers:THREE.Mesh[]=[];
  for(let i=0;i<3;i++){const layer=new THREE.Mesh(box,i===1?white:gold);layer.scale.set(2,.15,2);layer.rotation.y=Math.PI/4;group.add(layer);layers.push(layer);}
  stacks.push({group,layers,offset});return group;
 }
 // Offset brand sculptures provide foreground parallax on both sides of the forward flight.
 for(let i=0;i<9;i++)for(const side of [-1,1])stack(side*(4.2+(i%2)*.7),Math.sin(i)*.7,-i*6, .8+(i%3)*.15,i*.7+side);
 const destination=stack(0,1.1,-73,1.35,0);
 const floorGeometry=new THREE.PlaneGeometry(40,130);geometries.push(floorGeometry);
 const floor=new THREE.Mesh(floorGeometry,white);floor.rotation.x=-Math.PI/2;floor.position.set(0,-3,-35);scene.add(floor);
 for(const side of [-1,1]){const rail=new THREE.Mesh(box,gold);rail.scale.set(.025,.025,110);rail.position.set(side*2,-2.98,-35);scene.add(rail);}
 let current:WorldFrame={depth:0,visibility:0};
 let raf=0,visible=true;
 const paint=(time:number)=>{
  raf=0;if(!visible||!current.visibility)return;
  const end=current.finale??0;
  destination.visible=end>0;
  destination.scale.setScalar(camera.aspect<.8?.62:camera.aspect>2? .85:1.35);
  destination.position.x=camera.aspect>2?-3:0;
  stacks.forEach(({group,layers,offset})=>{
   if(group!==destination)group.visible=end<.98;
   const cycle=time*.00023+offset;
   layers.forEach((layer,i)=>{
    const position=((cycle+i/3)%1+1)%1;
    // Bottom layer travels around the outside to the top while the others descend.
    if(position<.72){layer.position.set(0,.8-position/ .72*1.6,0);}
    else {const u=(position-.72)/.28;layer.position.set(Math.sin(u*Math.PI)*1.8,-.8+u*1.6,Math.sin(u*Math.PI)*.45);}
   });
   group.rotation.y=Math.sin(time*.00018+offset)*.12;
  });
  camera.position.set(Math.sin(current.depth*Math.PI)*.35,.4,12-current.depth*46);
  camera.lookAt(0,.3,camera.position.z-12);camera.rotateZ(Math.sin(current.depth*Math.PI)*.025);
  renderer.render(scene,camera);raf=requestAnimationFrame(paint);
 };
 const render=(frame:WorldFrame)=>{current=frame;host.style.opacity=String(frame.visibility);if(frame.visibility&&!raf&&visible)raf=requestAnimationFrame(paint);};
 const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible&&current.visibility&&!raf)raf=requestAnimationFrame(paint);},{threshold:0});intersection.observe(host);
 const resize=new ResizeObserver(()=>{const {width,height}=host.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height);camera.aspect=width/height;camera.fov=width<600?60:48;camera.updateProjectionMatrix();render(current);});resize.observe(host);
 const lost=(event:Event)=>{event.preventDefault();host.style.opacity='0';};renderer.domElement.addEventListener('webglcontextlost',lost);
 return {render,dispose(){cancelAnimationFrame(raf);intersection.disconnect();resize.disconnect();geometries.forEach(g=>g.dispose());[white,gold,ink].forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();}};
}
