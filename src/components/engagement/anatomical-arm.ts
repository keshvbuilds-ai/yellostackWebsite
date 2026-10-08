import * as THREE from 'three';

/** Normalize the imported rig by anatomical landmarks, preserving its skin binding. */
export function makeAnatomicalArm(model:THREE.Object3D,employee:boolean,loft:(rings:number[][])=>THREE.BufferGeometry){
 model.updateMatrixWorld(true);
 const point=(name:string)=>{const node=model.getObjectByName(name);if(!node)throw new Error('Missing hand landmark: '+name);return node.getWorldPosition(new THREE.Vector3());};
 const wrist=point('hand_r'),middle=point('middle_01_r');
 const x=middle.clone().sub(wrist).normalize();
 const across=point('index_01_r').sub(point('pinky_01_r'));
 const y=across.addScaledVector(x,-across.dot(x)).normalize();
 const z=new THREE.Vector3().crossVectors(x,y).normalize();
 const basis=new THREE.Matrix4().makeBasis(x,y,z).invert();
 const scale=.70/wrist.distanceTo(middle);
 const normalization=new THREE.Matrix4().makeScale(scale,scale,scale).multiply(basis).multiply(new THREE.Matrix4().makeTranslation(-wrist.x,-wrist.y,-wrist.z));
 const mount=new THREE.Group();mount.matrixAutoUpdate=false;mount.matrix.copy(normalization);mount.add(model);
 const root=new THREE.Group();root.add(mount);
 // Keep the asset's material and UVs. Only tune its finish for soft studio lighting.
 const cloneMaterial=(material:THREE.Material)=>{const copy=material.clone();if(copy instanceof THREE.MeshStandardMaterial){copy.roughness=.62;copy.metalness=0;}return copy;};
 // Ungrouped GLB primitives require a single material: wrapping it in an array
 // makes the renderer iterate an empty group list and draw nothing.
 model.traverse(obj=>{if(obj instanceof THREE.Mesh){obj.material=Array.isArray(obj.material)?obj.material.map(cloneMaterial):cloneMaterial(obj.material);obj.frustumCulled=false;}});
 const fabric=new THREE.MeshStandardMaterial({color:employee?0x172131:0x43453b,roughness:.92});
 const cuff=new THREE.MeshStandardMaterial({color:0xf8f5e9,roughness:.8});
 // A 27 cm forearm relative to an approximately 18 cm hand. The upper sleeve
 // continues out of frame, avoiding an exposed cut at the elbow.
 const sleeve=new THREE.Mesh(loft([[-7,.48,.39],[-2.45,.39,.32],[-1.8,.34,.28],[-.95,.27,.23],[-.28,.205,.18],[-.055,.19,.17]]),fabric);root.add(sleeve);
 const wristCuff=new THREE.Mesh(loft([[-.17,.20,.178],[-.045,.196,.173],[.035,.19,.168]]),employee?cuff:fabric);root.add(wristCuff);
 if(employee){for(let i=0;i<3;i++){const button=new THREE.Mesh(new THREE.SphereGeometry(.032,12,8),fabric);button.position.set(-.4-i*.13,-.15,.16);root.add(button);}}
 const bones:{bone:THREE.Bone;rest:THREE.Quaternion;angle:number}[]=[];
 model.traverse(obj=>{if(obj instanceof THREE.Bone&&/_(01|02|03)_r$/.test(obj.name)){const segment=Number(obj.name.split('_')[1]);const thumb=obj.name.startsWith('thumb');bones.push({bone:obj,rest:obj.quaternion.clone(),angle:thumb?[.10,.24,.32][segment-1]:[.38,.72,.48][segment-1]});}});
 const axis=new THREE.Vector3(0,0,1),rotation=new THREE.Quaternion();
 root.rotation.y=employee?-.18:Math.PI-.18;root.rotation.x=employee?.18:-.18;
 // Contact is measured inside the palm, not at the wrist origin. Placing both
 // wrists at zero pushes the hands through the opposing cuffs.
 const contactAnchor=new THREE.Vector3(.43,0,0);
 return {root,contactAnchor,pose:(grip:number)=>{bones.forEach(({bone,rest,angle})=>{rotation.setFromAxisAngle(axis,-angle*grip);bone.quaternion.copy(rest).multiply(rotation);});}};
}
