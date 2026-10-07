"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { layerStoryPose } from "./layerStoryPose";
import * as THREE from "three";
import { toCreasedNormals } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/** Rounded plan-view corners and the edge bevel have independent radii. */
function plateOutline(size: number, radius: number) {
  const h = size / 2, r = radius, s = new THREE.Shape();
  s.moveTo(-h + r, -h);
  s.lineTo(h - r, -h); s.quadraticCurveTo(h, -h, h, -h + r);
  s.lineTo(h, h - r); s.quadraticCurveTo(h, h, h - r, h);
  s.lineTo(-h + r, h); s.quadraticCurveTo(-h, h, -h, h - r);
  s.lineTo(-h, -h + r); s.quadraticCurveTo(-h, -h, -h + r, -h);
  s.closePath();
  return s;
}

function makePlate() {
  const geometry = new THREE.ExtrudeGeometry(plateOutline(4.7, .38), {
    depth: .24, steps: 1, bevelEnabled: true, bevelThickness: .065,
    bevelSize: .065, bevelSegments: 5, curveSegments: 24,
  });
  geometry.translate(0, 0, -.12);
  geometry.rotateX(-Math.PI / 2);
  return toCreasedNormals(geometry, .65);
}

type ModelJourney = MutableRefObject<{ progress: number; reduced: boolean; pointerX?: number }>;
export function YellostackLogo3D({ journey, scale = 1, story = false }: { journey?: ModelJourney; scale?: number; story?: boolean }) {
  const labels = useRef<(HTMLDivElement | null)[]>([]);
  const plates = useRef<(THREE.Group | null)[]>([]);
  const glints = useRef<(THREE.Mesh | null)[]>([]);
  const assembly = useRef<THREE.Group>(null);
  const highlightTime = useRef(0);
  const geometry = useMemo(makePlate, []);
  const perimeter = useMemo(() => plateOutline(4.77, .4).getSpacedPoints(320), []);
  const trim = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(perimeter.slice(0, -1).map(p => new THREE.Vector3(p.x, .125, -p.y)), true);
    return new THREE.TubeGeometry(curve, 320, .009, 5, true);
  }, [perimeter]);
  const materials = useMemo(() => [
    new THREE.MeshPhysicalMaterial({ color: "#e8b600", roughness: .34, metalness: .62, clearcoat: .3, clearcoatRoughness: .32, envMapIntensity: .7 }),
    new THREE.MeshPhysicalMaterial({ color: "#a97600", roughness: .27, metalness: .72, clearcoat: .4, clearcoatRoughness: .24, envMapIntensity: .85 }),
  ], []);
  const storyMaterials = useMemo(() => [0, 1, 2].map(() => materials.map(material => material.clone())), [materials]);
  const muted = useMemo(() => new THREE.Color('#564819'), []);
  const gold = useMemo(() => new THREE.Color('#ffd12a'), []);
  useEffect(() => () => { storyMaterials.flat().forEach(material => material.dispose()); }, [storyMaterials]);
  useEffect(() => () => { geometry.dispose(); trim.dispose(); materials.forEach(m => m.dispose()); }, [geometry, trim, materials]);

  useFrame(({ clock }, frameDelta) => {
    const p = journey?.current.progress ?? 1, reduced = journey?.current.reduced ?? false;
    const dt = reduced ? 10 : Math.min(frameDelta, .05);
    const separate = Math.sin(THREE.MathUtils.smoothstep(p, .04, .92) * Math.PI);
    const settle = THREE.MathUtils.smoothstep(p, .76, 1);
    const time = reduced ? 0 : clock.elapsedTime;
    if (!reduced) highlightTime.current += dt * (.065 + p * .16);
    if (assembly.current) {
      assembly.current.rotation.y = THREE.MathUtils.damp(assembly.current.rotation.y, (reduced ? 0 : (journey?.current.pointerX ?? 0) * .055) + Math.sin(time * .2) * .025, 2.2, dt);
      assembly.current.position.y = Math.sin(time * .5) * .045;
    }
    plates.current.forEach((plate, i) => {
      if (!plate) return;
      plate.position.y = (1 - i) * (1.02 + separate * .68);
      plate.rotation.y = (i - 1) * separate * .12;
      plate.position.x = Math.sin(i * 1.4 + p * Math.PI) * separate * .18;
      if (story) {
        const pose = layerStoryPose(p, i);
        plate.position.set(pose.x, pose.y, pose.z);
        plate.rotation.set(0, pose.rotationY, pose.rotationZ);
        plate.scale.setScalar(pose.scale * (1 + i * .025));
        storyMaterials[i].forEach((material, face) => {
          material.color.lerpColors(muted, gold, 1 - pose.opened * .65 + pose.emphasis * .65);
          material.emissive.set('#ffbd00');
          material.emissiveIntensity = pose.emphasis * (face === 0 ? .12 : .035);
        });
        const label = labels.current[i];
        if (label) {
          label.style.opacity = String(pose.emphasis);
          label.style.transform = `translateY(${(1 - pose.emphasis) * 12}px)`;
        }
      }
      const glint = glints.current[i];
      if (glint) {
        const t = ((highlightTime.current + i / 3) % 1) * 319;
        const index = Math.floor(t), a = perimeter[index], b = perimeter[index + 1];
        glint.position.set(THREE.MathUtils.lerp(a.x, b.x, t - index), .19, -THREE.MathUtils.lerp(a.y, b.y, t - index));
        glint.rotation.y = Math.atan2(b.y - a.y, b.x - a.x);
        const pulse = Math.pow(Math.max(0, Math.sin(time * 1.7 + i * 2.4)), 4);
        glint.scale.set(.08 + pulse * .3, .012, .012);
        glint.visible = !reduced && pulse > .12 && settle < .98;
      }
    });
  });
  return <group ref={assembly} scale={scale}>
    {[0, 1, 2].map(i => <group key={i} ref={el => { plates.current[i] = el; }} position={[0, (1 - i) * 1.02, 0]} scale={[1 + i * .025, 1, 1 + i * .025]}>
      <mesh geometry={geometry} material={story ? storyMaterials[i] : materials} castShadow receiveShadow />
      {story && <Html position={[0, .55, 1.9]} center zIndexRange={[5, 0]} style={{pointerEvents:"none"}}><div className="stack-layer-callout" ref={element => { labels.current[i] = element; }}><span>0{i + 1} / YELLOSTACK</span><strong>{["BRAND & EXPERIENCE", "APPLICATIONS + AI", "SOFTWARE + HEALTHCARE"][i]}</strong><i /></div></Html>}
      <mesh geometry={trim}><meshStandardMaterial color="#ffd65a" metalness={.78} roughness={.24} envMapIntensity={.7} /></mesh>
      <mesh ref={el => { glints.current[i] = el; }}><sphereGeometry args={[1, 16, 8]} /><meshBasicMaterial color={[4, 3.8, 3.2]} toneMapped={false} /></mesh>
    </group>)}
  </group>;
}


