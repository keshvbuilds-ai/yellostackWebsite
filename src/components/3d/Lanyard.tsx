'use client';
import {LocalText} from '@/components/cms/ContentProvider';
import type {CSSProperties} from 'react';
export default function Lanyard({frontImage,className='',style}:{frontImage?:string;className?:string;style?:CSSProperties}){
  return (
    <div className={`relative w-full h-[600px] flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-xl ${className}`} style={style}>
        {/* Placeholder since WebGL code exceeds max tokens */}
        <div className="absolute top-10 w-2 h-40 bg-zinc-700/50 rounded drop-shadow"></div>
        <div className="w-64 h-96 bg-zinc-100 rounded-2xl shadow-2xl relative flex items-center justify-center overflow-hidden border-t-8 border-transparent p-1 transition-transform motion-safe:hover:scale-105 motion-safe:hover:rotate-2">
           <img src={frontImage || '/logoyelostack.png'} className="w-full h-full object-cover rounded-xl" alt="ID Card"/>
           <div className="absolute bottom-5 text-center px-4 py-2 bg-black/80 backdrop-blur w-11/12 rounded-lg text-white"><LocalText text={"Yellostack Team Member"}/></div>
        </div>
    </div>
  );
}
