"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Journey } from "./WebGLTunnelExperience";

/** Light packets travel along three curved paths, echoing the three logo layers. */
export default function EnergyTrails({ journey }: { journey: MutableRefObject<Journey> }) {
  const time = useRef(0);
  const paths = useMemo(() => [0, 1, 2].map(layer => {
    const points = Array.from({ length: 100 }, (_, index) => {
      const t = index / 99;
      const angle = t * Math.PI * 1.85 + layer * .55;
      const radius = 3.65 + Math.sin(t * Math.PI) * 1.7;
      return new THREE.Vector3(Math.cos(angle) * radius, (layer - 1) * 1.05 + Math.sin(t * Math.PI * 2) * .7, Math.sin(angle) * radius);
    });
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 160, .012, 5, false);
  }), []);
  const materials = useMemo(() => [0, 1, 2].map(layer => new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uEnergy: { value: 0 }, uOffset: { value: layer * .31 } },
    vertexShader: `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader: `
      varying vec2 vUv;
      uniform float uTime, uEnergy, uOffset;
      void main(){
        float phase=fract(vUv.x-uTime+uOffset);
        float head=exp(-pow((phase-.8)*45.,2.));
        float trail=smoothstep(.22,.8,phase)*(1.-smoothstep(.8,.84,phase));
        float ends=smoothstep(0.,.08,vUv.x)*(1.-smoothstep(.92,1.,vUv.x));
        vec3 gold=vec3(.85,.48,.06)*trail;
        vec3 white=vec3(3.8,3.65,3.1)*head;
        gl_FragColor=vec4(gold+white,(trail*.48+head)*ends*uEnergy);
      }`,
  })), []);
  useEffect(() => () => { paths.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); }, [paths, materials]);
  useFrame((_, delta) => {
    const { progress, reduced } = journey.current;
    const energy = reduced ? 0 : Math.sin(THREE.MathUtils.smoothstep(progress, .03, .88) * Math.PI);
    time.current += Math.min(delta, .05) * (.1 + energy * .45);
    materials.forEach(material => { material.uniforms.uTime.value = time.current; material.uniforms.uEnergy.value = energy; });
  });
  return <group>{paths.map((geometry, i) => <mesh key={i} geometry={geometry} material={materials[i]} />)}</group>;
}
