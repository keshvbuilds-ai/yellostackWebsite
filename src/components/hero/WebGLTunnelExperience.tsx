"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";
import { YellostackLogo3D } from "../3d/YellostackLogo3D";
import EnergyTrails from "./EnergyTrails";

export type Journey = { progress: number; active: boolean; reduced: boolean; scroll: number; pointerX: number; pointerY: number };
const smooth = THREE.MathUtils.smoothstep;

/** A continuous, reversible camera move around the very same brand sculpture. */
export function WebGLTunnelExperience({ journey }: { journey: MutableRefObject<Journey> }) {
  const path = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(6.8, 3.4, 8),
    new THREE.Vector3(5.4, 1.8, 5.3),
    new THREE.Vector3(4.6, .45, .8),
    new THREE.Vector3(1, .65, -4.7),
    new THREE.Vector3(-4.8, 2.8, -4.5),
    new THREE.Vector3(-6.8, 5.7, 4.8),
    new THREE.Vector3(1.5, 7.4, 13),
    new THREE.Vector3(9, 8, 12),
  ], false, "centripetal"), []);
  const streaks = useRef<THREE.InstancedMesh>(null);
  const time = useRef(0);
  const target = useMemo(() => new THREE.Vector3(-2.8, .15, 0), []);
  const position = useMemo(() => new THREE.Vector3(), []);
  const local = useMemo(() => new THREE.Vector3(), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const steering = useRef(0);
  const dust = useMemo(() => {
    const positions = new Float32Array(100 * 3);
    for (let i = 0; i < 100; i++) {
      positions[i * 3] = Math.sin(i * 127.1) * 22;
      positions[i * 3 + 1] = Math.cos(i * 311.7) * 12;
      positions[i * 3 + 2] = Math.sin(i * 74.7) * 20;
    }
    return positions;
  }, []);

  useFrame(({ camera, size }, frameDelta) => {
    const { progress: p, reduced, scroll } = journey.current;
    const dt = reduced ? 10 : Math.min(frameDelta, .05);
    // Gentle departure, fast middle orbit, long deceleration into the lockup.
    const travel = p * p * (3 - 2 * p);
    const final = smooth(p, .7, 1);
    const entry = 1 - smooth(p, 0, .16);
    path.getPoint(travel, position);
    const aspect = size.width / size.height;
    const fit = THREE.MathUtils.lerp(1, Math.max(1, .93 / aspect), final);
    position.multiplyScalar(fit);
    steering.current = THREE.MathUtils.damp(steering.current, reduced ? 0 : journey.current.pointerX * .14 * (1 - final * .8), 3.5, dt);
    position.applyAxisAngle(up, steering.current);
    position.x += reduced ? 0 : journey.current.pointerX * .12;
    position.y += reduced ? 0 : journey.current.pointerY * .08;
    camera.position.lerp(position, reduced ? 1 : 1 - Math.exp(-5 * dt));
    const targetY = THREE.MathUtils.lerp(.05, -2.1 * fit, final);
    target.lerp(local.set(-2.8 * entry, targetY + scroll * 1.5, 0), reduced ? 1 : 1 - Math.exp(-5 * dt));
    camera.lookAt(target);
    camera.rotateZ(Math.sin(p * Math.PI * 2) * .045 * (1 - final));
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = 34 + Math.sin(p * Math.PI) * 12;
    cam.updateProjectionMatrix();
    time.current += reduced ? 0 : dt * (1 + Math.sin(p * Math.PI) * 5);
    if (streaks.current) {
      const energy = Math.sin(smooth(p, .08, .91) * Math.PI);
      streaks.current.visible = energy > .02 && !reduced;
      for (let i = 0; i < 24; i++) {
        const angle = i * 2.39996, radius = 3.5 + i % 5;
        const depth = ((i * 2.73 - time.current * 5) % 28 + 28) % 28;
        local.set(Math.cos(angle) * radius, Math.sin(angle) * radius, -depth - 2).applyQuaternion(camera.quaternion).add(camera.position);
        dummy.position.copy(local); dummy.quaternion.copy(camera.quaternion);
        dummy.scale.set(.008, .008, (.1 + energy * 1.4) * (i % 3 === 0 ? 1 : .35));
        dummy.updateMatrix(); streaks.current.setMatrixAt(i, dummy.matrix);
      }
      streaks.current.instanceMatrix.needsUpdate = true;
    }
  });
  return <>
    <ambientLight intensity={.18} />
    <hemisphereLight args={["#f8f3db", "#17150d", .35]} />
    <directionalLight position={[-3, 9, 5]} intensity={2.1} color="#fff5df" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-7} shadow-camera-right={7} shadow-camera-top={7} shadow-camera-bottom={-7} shadow-camera-near={.5} shadow-camera-far={30} shadow-bias={-.0002} shadow-normalBias={.018} shadow-radius={3} />
    <directionalLight position={[6, 2, -6]} intensity={1.4} color="#fff4ca" />
    <Environment resolution={256} environmentIntensity={.55}>
      <Lightformer intensity={2} position={[-4, 7, 3]} target={[0, 0, 0]} scale={[4, 9, 1]} />
      <Lightformer intensity={1.4} position={[6, 3, -4]} target={[0, 0, 0]} scale={[1, 8, 1]} />
      <Lightformer intensity={.5} position={[0, -4, 6]} target={[0, 0, 0]} scale={[8, 2, 1]} />
    </Environment>
    <YellostackLogo3D journey={journey} />
    <EnergyTrails journey={journey} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow><planeGeometry args={[40, 40]} /><shadowMaterial transparent opacity={.22} /></mesh>
    <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[dust, 3]} /></bufferGeometry><pointsMaterial size={.018} color="#d5c697" transparent opacity={.26} depthWrite={false} /></points>
    <instancedMesh ref={streaks} args={[undefined, undefined, 24]} frustumCulled={false}><boxGeometry /><meshBasicMaterial color={[2.5, 2.4, 2.1]} toneMapped={false} /></instancedMesh>
    <EffectComposer multisampling={2}><Bloom intensity={.2} luminanceThreshold={1.8} luminanceSmoothing={.3} mipmapBlur /></EffectComposer>
  </>;
}

export default function JourneyCanvas({ journey, visible, onReady, onFailure }: { journey: MutableRefObject<Journey>; visible: boolean; onReady: () => void; onFailure: () => void }) {
  return <Canvas shadows dpr={[1, 1.5]} frameloop={visible ? "always" : "never"} camera={{ position: [6.8, 3.4, 8], fov: 34, near: .08, far: 100 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: .9 }} onCreated={({ gl }) => {
    gl.setClearColor("#080907", 0);
    gl.domElement.addEventListener("webglcontextlost", onFailure, { once: true }); onReady();
  }}><WebGLTunnelExperience journey={journey} /></Canvas>;
}
