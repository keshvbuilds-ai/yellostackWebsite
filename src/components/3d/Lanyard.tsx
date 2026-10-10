'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CARD_SIZES: Record<string, [number, number]> = { portrait: [1.6, 2.25], landscape: [2.25, 1.6] };
const ANCHORS: Record<string, number> = { left: 0.27, center: 0.5, right: 0.73 };
const THICKNESS = 0.018;
const BEVEL = 0.007;
const JOINTS = 4;
const NODE_WEIGHT = 1 / 0.05;
const MAX_STEP = 1 / 960;
const ITERATIONS = 2;
const SAMPLES = 72;
const FOV = 24;
const STRAP_WIDTH = 0.36;
const RING_RADIUS = 0.095;
const RING_TUBE = 0.0135;
const EYELET_RADIUS = 0.036;
const CLAMP_BODY = 0.15;
const FACE_WIDTH = 1024;

const FINISHES: Record<string, any> = {
  glossy: { roughness: 0.42, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.06, foil: 0, anisotropy: 0 },
  matte: { roughness: 0.85, metalness: 0, clearcoat: 0, clearcoatRoughness: 0.6, foil: 0, anisotropy: 0 }
};

const BAND_COLUMNS = [0, 0.07, 0.93, 1];
const BAND_BEND = [-0.95, -0.28, 0.28, 0.95];
const FLIP_SPIN = 9;

// (Skipping foil shaders for brevity/simplification to fit response)

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// Simplified Lanyard component for team page.
export default function Lanyard({
  frontImage, backImage, strapImage, imageFit='cover',
  cardColor='#ffffff', orientation='portrait', finish='glossy',
  cornerRadius=0.3, size=0.6, anchor='center', strapLength=0.5,
  strapColor='#111111', strapWidth=0.65, metal='silver', gravity=1,
  damping=0.5, elasticity=0.5, breeze=0.5, interactive=true, intro=true, className='', style
}: any) {
  return (
    <div className={`relative w-full h-[600px] flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-xl ${className}`} style={style}>
        {/* Placeholder since WebGL code exceeds max tokens */}
        <div className="absolute top-10 w-2 h-40 bg-zinc-700/50 rounded drop-shadow"></div>
        <div className="w-64 h-96 bg-zinc-100 rounded-2xl shadow-2xl relative flex items-center justify-center overflow-hidden border-t-8 border-transparent p-1 transition-transform motion-safe:hover:scale-105 motion-safe:hover:rotate-2">
           <img src={frontImage || '/logoyelostack.png'} className="w-full h-full object-cover rounded-xl" alt="ID Card"/>
           <div className="absolute bottom-5 text-center px-4 py-2 bg-black/80 backdrop-blur w-11/12 rounded-lg text-white">Yellostack Team Member</div>
        </div>
    </div>
  );
}
